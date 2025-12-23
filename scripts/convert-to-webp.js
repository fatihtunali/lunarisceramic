const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const dbConfig = {
  host: '127.0.0.1',
  port: 3307,
  user: 'lunaris',
  password: 'Dlr235672.-Yt',
  database: 'lunarisceramic'
};

const IMAGES_ORIGINAL = path.join(__dirname, '../public/images_original');
const IMAGES_OUTPUT = path.join(__dirname, '../public/images');

async function convertFolder(inputFolder, outputFolder, categorySlug) {
  if (!fs.existsSync(inputFolder)) {
    console.log(`  Folder not found: ${inputFolder}`);
    return [];
  }

  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  const files = fs.readdirSync(inputFolder);
  const conversions = [];

  for (const file of files) {
    if (!file.match(/\.(jpeg|jpg|png)$/i)) continue;

    const inputPath = path.join(inputFolder, file);
    const outputName = file.replace(/\.(jpeg|jpg|png)$/i, '.webp');
    const outputPath = path.join(outputFolder, outputName);

    try {
      await sharp(inputPath)
        .webp({ quality: 85 })
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .toFile(outputPath);

      conversions.push({
        original: `/images_original/${categorySlug}/${file}`,
        webp: `/images/${categorySlug}/${outputName}`
      });

      console.log(`  Converted: ${file} -> ${outputName}`);
    } catch (error) {
      console.error(`  Error converting ${file}:`, error.message);
    }
  }

  return conversions;
}

async function main() {
  console.log('=== Converting Images to WebP ===\n');

  // Ensure output directory exists
  if (!fs.existsSync(IMAGES_OUTPUT)) {
    fs.mkdirSync(IMAGES_OUTPUT, { recursive: true });
  }

  const allConversions = [];

  // Convert cups
  console.log('Converting Cups...');
  const cupsConversions = await convertFolder(
    path.join(IMAGES_ORIGINAL, 'cups'),
    path.join(IMAGES_OUTPUT, 'cups'),
    'cups'
  );
  allConversions.push(...cupsConversions);

  // Convert wine glass
  console.log('\nConverting Wine Glass...');
  const wineGlassConversions = await convertFolder(
    path.join(IMAGES_ORIGINAL, 'wine glass'),
    path.join(IMAGES_OUTPUT, 'wine-glass'),
    'wine glass'
  );
  allConversions.push(...wineGlassConversions);

  // Convert wine server
  console.log('\nConverting Wine Server...');
  const wineServerConversions = await convertFolder(
    path.join(IMAGES_ORIGINAL, 'wine server'),
    path.join(IMAGES_OUTPUT, 'wine-server'),
    'wine server'
  );
  allConversions.push(...wineServerConversions);

  // Convert gramophone
  console.log('\nConverting Gramophone...');
  const gramophoneConversions = await convertFolder(
    path.join(IMAGES_ORIGINAL, 'Gramophone'),
    path.join(IMAGES_OUTPUT, 'gramophone'),
    'Gramophone'
  );
  allConversions.push(...gramophoneConversions);

  console.log(`\n=== Converted ${allConversions.length} images ===`);

  // Update database paths
  console.log('\nUpdating database paths...');
  const connection = await mysql.createConnection(dbConfig);

  try {
    for (const conv of allConversions) {
      await connection.execute(
        'UPDATE product_images SET image_url = ? WHERE image_url = ?',
        [conv.webp, conv.original]
      );
    }
    console.log('Database updated successfully!');
  } catch (error) {
    console.error('Database error:', error.message);
  } finally {
    await connection.end();
  }
}

main();
