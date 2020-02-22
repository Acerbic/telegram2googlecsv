# Telegram 2 Google CSV

Script to transform contacts list export from Telegram Messenger (json)
to CSV file accepted by Google Contacts.

Written in deno / TypeScript

## Usage

Doesn't require npm installation or `node_modules`, those are only for dev.

```bash
deno --allow-read --allow-write convert.ts telegram.json google.csv
```

where `telegram.json` is your existing file from Telegram and `google.csv` is 
a file you want your results in (WILL BE OVERWRITTEN).


## Test

```bash
deno tests/basic_suite.ts
```
