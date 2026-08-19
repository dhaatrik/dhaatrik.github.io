import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const assetsDir = './src/assets';

const files = fs.readdirSync(assetsDir);
const pngFiles = files.filter((f) => f.endsWith('.png'));

console.log(`Found ${pngFiles.length} PNG files in ${assetsDir}. Starting optimization...\n`);

for (const file of pngFiles) {
    const filePath = path.join(assetsDir, file);
    const tempPath = path.join(assetsDir, `temp_${file}`);
    const statsBefore = fs.statSync(filePath);
    const sizeBeforeKB = (statsBefore.size / 1024).toFixed(2);

    try {
        // Resize logos to max 512px (fit inside), convert to 8-bit palette PNG for optimal compression
        await sharp(filePath)
            .resize({
                width: 512,
                height: 512,
                fit: 'inside',
                withoutEnlargement: true,
            })
            .png({
                quality: 85,
                palette: true,
                compressionLevel: 9,
            })
            .toFile(tempPath);

        const statsAfter = fs.statSync(tempPath);
        const sizeAfterKB = (statsAfter.size / 1024).toFixed(2);

        if (statsAfter.size < statsBefore.size) {
            // Overwrite original file
            fs.unlinkSync(filePath);
            fs.renameSync(tempPath, filePath);
            console.log(
                `✓ Optimized ${file}: ${sizeBeforeKB} KB -> ${sizeAfterKB} KB (Reduced by ${((1 - statsAfter.size / statsBefore.size) * 100).toFixed(1)}%)`
            );
        } else {
            // Keep original if somehow temp is larger
            fs.unlinkSync(tempPath);
            console.log(`- Skipped ${file} (already fully optimized): ${sizeBeforeKB} KB`);
        }
    } catch (err) {
        console.error(`✗ Error optimizing ${file}:`, err);
        if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
        }
    }
}
console.log('\nOptimization complete.');
