import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public', 'brand');

async function processImages() {
  const files = fs.readdirSync(publicDir);
  const imageFiles = files.filter(f => /\.(png|jpg|jpeg)$/i.test(f));

  console.log(`Found ${imageFiles.length} images to process in ${publicDir}`);

  for (const file of imageFiles) {
    const inputPath = path.join(publicDir, file);
    const stat = fs.statSync(inputPath);
    const sizeMB = stat.size / (1024 * 1024);

    // Process images larger than ~1.5MB
    if (sizeMB > 1.5) {
      console.log(`Processing large image: ${file} (${sizeMB.toFixed(2)} MB)`);
      const { name } = path.parse(file);
      const outputPath = path.join(publicDir, `${name}.webp`);

      try {
        await sharp(inputPath)
          .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 80, effort: 6 })
          .toFile(outputPath);
        
        console.log(`✅ Success: output ${name}.webp`);
        // Remove the original massive PNG to save space
        fs.unlinkSync(inputPath);
        console.log(`🗑️ Removed original: ${file}`);
      } catch (err) {
        console.error(`❌ Error processing ${file}:`, err);
      }
    }
  }
}

processImages().then(() => console.log('Compression complete!'));
