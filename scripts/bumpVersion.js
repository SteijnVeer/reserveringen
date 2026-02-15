import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { createInterface } from 'readline';
import { fileURLToPath } from 'url';
import metadata from '../commons/metadata.json' with { type: 'json' };

function exitWithError(message) {
  console.error(message);
  process.exit(1);
}

const currentVersion = metadata.version;

const newVersion = await (() => {
  const args = process.argv.slice(2);
  if (args.length > 0)
    return args[0];
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => {
    rl.question(`Current version: ${currentVersion}\nEnter new version: `, answer => {
      rl.close();
      resolve(answer);
    });
  });
})();

if (!/^\d+\.\d+\.\d+$/.test(newVersion))
  exitWithError(`Invalid version format. Expected format: x.y.z`);

function splitVersionToNumberParts(version) {
  return version.split('.').map(Number);
}

const currentVersionParts = splitVersionToNumberParts(currentVersion);
const newVersionParts = splitVersionToNumberParts(newVersion);
if (!(() => {
  for (const i in currentVersionParts) {
    const currentPart = currentVersionParts[i];
    const nextPart = newVersionParts[i];
    if (nextPart > currentPart)
      return true;
    if (nextPart < currentPart)
      return false;
  }
})())
  exitWithError(`New version must be greater than current version (${currentVersion}).`);

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

[
  join(root, 'package.json'),
  join(root, 'commons/metadata.json'),
  ...Object.keys(metadata.paths).map(page => join(root, `pages/${page}/package.json`))
].forEach(filePath =>
  writeFileSync(filePath, JSON.stringify({
    ...JSON.parse(readFileSync(filePath, 'utf8')),
    version: newVersion,
  }, null, 2))
);

console.log(`Version updated to ${newVersion} successfully.`);
