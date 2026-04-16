import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, '../public/brand');
const BACKUP_DIR = path.resolve(__dirname, '../public/.originals-backup');
const MAX_WIDTH = 2560; // 4K/Retina friendly
const QUALITY = 95; // Extreme high quality for luxury brand

const isDryRun = process.argv.includes('--dry-run');

async function ensureDir(dir) {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, {recursive: true});
  }
}

async function optimizeImages() {
  console.log(
    `\n🚀 ${isDryRun ? 'DRY RUN: ' : ''}Starting Image Optimization...`,
  );
  console.log(`📁 Source: ${PUBLIC_DIR}\n`);

  if (!isDryRun) {
    await ensureDir(BACKUP_DIR);
  }

  const files = await fs.readdir(PUBLIC_DIR);
  const imageFiles = files.filter((f) => /\.(png|jpg|jpeg)$/i.test(f));

  let count = 0;
  let savedTotal = 0;

  for (const file of imageFiles) {
    const filePath = path.join(PUBLIC_DIR, file);
    const stats = await fs.stat(filePath);
    const sizeKB = stats.size / 1024;

    if (sizeKB > 500) {
      console.log(
        `🔹 [${file}] - Current size: ${(sizeKB / 1024).toFixed(2)} MB`,
      );

      if (isDryRun) {
        count++;
        continue;
      }

      // Backup original
      await fs.copyFile(filePath, path.join(BACKUP_DIR, file));

      const image = sharp(filePath);
      const metadata = await image.metadata();

      let pipeline = image;
      if (metadata.width > MAX_WIDTH) {
        console.log(
          `   📏 Resizing from ${metadata.width}px to ${MAX_WIDTH}px`,
        );
        pipeline = pipeline.resize(MAX_WIDTH);
      }

      // Create WebP version
      const webpName = `${path.parse(file).name}.webp`;
      const webpPath = path.join(PUBLIC_DIR, webpName);
      await pipeline.clone().webp({quality: QUALITY}).toFile(webpPath);

      // Overwrite original with compressed version (maintaining format)
      if (file.toLowerCase().endsWith('.png')) {
        await pipeline
          .png({quality: QUALITY, compressionLevel: 9})
          .toFile(`${filePath}.opt`);
      } else {
        await pipeline
          .jpeg({quality: QUALITY, progressive: true})
          .toFile(`${filePath}.opt`);
      }

      // Swap files
      await fs.rename(`${filePath}.opt`, filePath);

      const newStats = await fs.stat(filePath);
      const saved = (stats.size - newStats.size) / 1024 / 1024;
      savedTotal += saved;
      console.log(`   ✅ Optimized! Saved ${saved.toFixed(2)} MB\n`);
      count++;
    }
  }

  console.log(`\n✨ Done! Processed ${count} large images.`);
  if (!isDryRun) {
    console.log(`💰 Total saved: ${savedTotal.toFixed(2)} MB`);
    console.log(`📂 Originals backed up to ${BACKUP_DIR}`);
  }
}

optimizeImages().catch(console.error);
