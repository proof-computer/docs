import {readFile} from 'node:fs/promises';
import {Script} from 'node:vm';

const bundle = await readFile(new URL('../dist/bundle.js', import.meta.url), 'utf8');
// Acurast loads the artifact with require(), without the repository package.json.
// Parse it as a script; do not execute production bootstrap during a build.
new Script(bundle, {filename: 'bundle.js'});
if (/require\(["']@proof-computer\/liskov-runtime["']\)/.test(bundle)) {
  throw new Error('The runtime SDK must be bundled into the artifact.');
}
console.log('Acurast CommonJS artifact smoke passed.');
