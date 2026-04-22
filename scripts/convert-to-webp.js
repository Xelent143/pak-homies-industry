
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '..', 'client', 'public');

async function convertToWebp() {
    const files = fs.readdirSync(PUBLIC_DIR);
    const imageFiles = files.filter(file => /\.(png|jpe?g)$/i.test(file));

    console.log(`Found ${imageFiles.length} images to convert.`);

    for (const file of imageFiles) {
        const inputPath = path.join(PUBLIC_DIR, file);
        const outputPath = path.join(PUBLIC_DIR, file.replace(/\.(png|jpe?g)$/i, '.webp'));

        try {
            if (fs.existsSync(outputPath)) {
                console.log(`Skipping ${file}, WebP version already exists.`);
                continue;
            }

            await sharp(inputPath)
                .webp({ quality: 85 })
                .toFile(outputPath);

            console.log(`Converted ${file} to WebP.`);
        } catch (err) {
            console.error(`Error converting ${file}:`, err);
        }
    }

    console.log('Conversion complete.');
}

convertToWebp().catch(console.error);
