# Telegram 2 Google CSV

Script to transform contacts list export from Telegram Messenger (json)
to CSV file accepted by Google Contacts.

Written in deno / TypeScript

## Usage

Doesn't require npm installation or `node_modules`, those are only for dev.

```bash
deno -A convert.ts [inputfile [outputfile]]
```

If outputfile is omitted, STDOUT is used, if input file is omitted too, STDIN
is used.


1. Example: from a JSON text file to a CSV file (overwrites)

```bash
deno --allow-read --allow-write convert.ts telegram.json google.csv
```

2. Example: From a JSON text file to STDOUT

```bash
deno --allow-read convert.ts telegram.json
```

3. Example: Using STDIN and STDOUT with pipes and redirections

```bash
cat telegram.json | deno convert.ts > google.csv
```


where `telegram.json` is your existing file from Telegram and `google.csv` is 
a file you want your results in (WILL BE OVERWRITTEN).


## Test

```bash
deno test --allow-write --allow-read=./tests --allow-run
```

## "Other" files

Only `convert.ts` is the relevant project file, the rest (`package.json`, etc.) aren't 
needed to run this script and are only needed to make my dev environment be cool with
deno's novel TypeScript.

