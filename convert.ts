/**
 * Script to convert a list of contacts exported from Telegram (Settings -> Advanced -> 
 * Export Telegram data) into a file that could be imported by Google Contacts.
 * Written for deno (see https://deno.land)
 *
 * Usage:
 * > deno --allow-read --allow-write convert.ts telegram.json google.csv
 *
 * where `telegram.json` is your existing file from Telegram and `google.csv` is 
 * a file you want your results in (WILL BE OVERWRITTEN).
 */
import { readJson, writeFileStr } from "https://deno.land/std@v0.33.0/fs/mod.ts";

const inputFileName = Deno.args[0];
const outputFileName = Deno.args[1];

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
      fn: escapeToCSV(contact.first_name),
      ln: escapeToCSV(contact.last_name),
      p: escapeToCSV(contact.phone_number)
    };
    const fullName = `${c.fn} ${c.ln}`;
    return `${fullName},${c.fn},${c.ln},* myContacts,Mobile,${c.p}`;
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


// I don't know how to configure neovim coc-tsserver to not complain about 
// unbound `await`s.
(async () => {
  const contacts : Contact[] = (await readJson(inputFileName) as any).contacts.list;
  const csvLines: string[] = [contactToCSV(), ... contacts.map(contactToCSV)];
  await writeFileStr(outputFileName, csvLines.join('\n') + '\n');
})();
