/**
 * Script to convert a list of contacts exported from Telegram (Settings -> Advanced -> 
 * Export Telegram data) into a file that could be imported by Google Contacts.
 * Written for deno (see https://deno.land)
 */
import { readJson, writeFileStr } from "https://deno.land/std@v0.34.0/fs/mod.ts";

type Contact = {
  user_id: number,
  first_name: string,
  last_name: string,
  phone_number: string,
  date: string,
};


/**
 * Turn a contact object to a line of CSV file.
 * If called without an argument, returns the string for CSV header line.
 */
function contactToCSV(contact? : Contact) : string {
  if (contact) {
    const c = {
      fn: escapeToCSV(contact.first_name + ' ' + contact.last_name),
      gn: escapeToCSV(contact.first_name),
      ln: escapeToCSV(contact.last_name),
      p: escapeToCSV(contact.phone_number)
    };
    return `${c.fn},${c.gn},${c.ln},* myContacts,Mobile,${c.p}`;
  } else {
    return "Name,Given Name,Family Name,Group Membership,Phone 1 - Type,Phone 1 - Value";
  }
};

function escapeToCSV(raw: string) : string {
  if (raw.includes(',') || raw.includes('"')) {
    return '"' + raw.split('"').join('""') + '"';
  } else {
    return raw;
  }
};

function usage() : string {
  return "A script to convert Telegram Messenger contacts list export file\n" +
    "to a CSV file for importing into Google Contacts. \n\n" +
    ">  deno -A convert.ts [inputfile [outputfile]]\n";
};

/**
 * Read input data from file or stdin, if no command line args
 */
async function getInputJson() : Promise<unknown> {
  if (Deno.args.length > 0) {
    return readJson(Deno.args[0]);
  } else {
    return JSON.parse(
      new TextDecoder().decode(await Deno.readAll(Deno.stdin))
    );
  }
};

/**
 * Write resulting CSV to a file, if command line arg provided, or stdout
 */
async function writeOutputCSV(results: string) : Promise<void> {
  if (Deno.args.length > 1) {
    return writeFileStr(Deno.args[1], results);
  } else {
    console.log(results);
  }
};

// I don't know how to configure neovim coc-tsserver to not complain about 
// unbound `await`s.
(async () => {
  if (Deno.args.length > 0 && (Deno.args[0] == '-h' || Deno.args[0] == '--help')) {
    console.log(usage());
    Deno.exit(0);
  }
  const contacts : Contact[] = (await getInputJson() as any).contacts.list;
  const csvLines: string[] = [contactToCSV(), ... contacts.map(contactToCSV)];
  await writeOutputCSV(csvLines.join('\n') + '\n');
})();
