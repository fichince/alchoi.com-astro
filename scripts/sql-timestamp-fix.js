import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DateTime } from 'luxon';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sqlFile = path.resolve(__dirname, '../directus_files_202503191438.sql');
const contents = await readFile(sqlFile, { encoding: 'utf-8' });

console.log('cointents', contents);

const fixed = contents.replaceAll(/'(\d{13})'/g, (match, group) => {
  const ts = DateTime.fromMillis(parseInt(group));
  console.log('replace', group, ts.toSQL());
  return `'${ts.toSQL()}'`;
});

await writeFile('sql-fixed.sql', fixed);
