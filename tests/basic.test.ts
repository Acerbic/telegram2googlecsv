import { readFileStr } from "https://deno.land/std@v0.34.0/fs/mod.ts"
import { assertEquals } from "https://deno.land/std@v0.34.0/testing/asserts.ts"

Deno.test(async function convert_file_to_file() {
  // prepare
  const outputFilename = await Deno.makeTempFile({dir: Deno.cwd() + "/tests", prefix:"testout-"});

  // run the script on a sample
  let process = Deno.run({args: [
    "deno",
    "--allow-read=./tests/sample.json",
    "--allow-write=" + outputFilename,
    "convert.ts",
    "tests/sample.json",
    outputFilename
  ]});
  await process.status();
  
  // test output matches the expectations
  const file_str = (await readFileStr(outputFilename)).trim();
  const expected_str = `
Name,Given Name,Family Name,Group Membership,Phone 1 - Type,Phone 1 - Value
Name0 Name1,Name0,Name1,* myContacts,Mobile,+78001234567
"Sp""ecia,,"" Цыриллик","Sp""ecia,,""",Цыриллик,* myContacts,Mobile,+88001111111
  `.trim();
  assertEquals(file_str, expected_str);

  // clean up
  await Deno.remove(outputFilename);
});

