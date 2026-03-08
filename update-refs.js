import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public', 'brand');
const appDirs = [
  path.join(__dirname, 'app', 'components'),
  path.join(__dirname, 'app', 'routes'),
];

// 1. Find all webp files in public/brand
const webpFiles = fs.readdirSync(publicDir).filter((f) => f.endsWith('.webp'));
// Map from ancient PNG name to new WEBP name
const replacements = webpFiles.map((webp) => ({
  from: `/brand/${webp.replace('.webp', '.png')}`,
  to: `/brand/${webp}`,
}));

console.log('Will replace:', replacements);

// 2. Scan and replace in all TSX files
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;

      for (const rule of replacements) {
        if (content.includes(rule.from)) {
          // Replace all occurrences
          content = content.split(rule.from).join(rule.to);
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(
          `Updated references in ${path.relative(__dirname, fullPath)}`,
        );
      }
    }
  }
}

appDirs.forEach((dir) => processDirectory(dir));
console.log('Finished updating references.');
