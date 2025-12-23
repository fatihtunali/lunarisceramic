const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const dbConfig = {
  host: '127.0.0.1',
  port: 3307,
  user: 'lunaris',
  password: 'Dlr235672.-Yt',
  database: 'lunarisceramic'
};

const IMAGES_ORIGINAL = path.join(__dirname, '../public/images_original');
const IMAGES_PUBLIC = '/images_original'; // URL path

// Product names and prices (you can adjust these)
const productInfo = {
  // Cups - numbered
  '1': { name: 'Handcrafted Cup #1', price: 450 },
  '2': { name: 'Handcrafted Cup #2', price: 380 },
  '3': { name: 'Handcrafted Cup #3', price: 420 },
  '4': { name: 'Handcrafted Cup #4', price: 400 },
  '5': { name: 'Handcrafted Cup #5', price: 450 },
  '6': { name: 'Handcrafted Cup #6', price: 480 },
  '7': { name: 'Handcrafted Cup #7', price: 520 },
  '8': { name: 'Handcrafted Cup #8', price: 490 },
  '9': { name: 'Handcrafted Cup #9', price: 510 },
  '10': { name: 'Handcrafted Cup #10', price: 550 },
  '11': { name: 'Handcrafted Cup #11', price: 480 },
  // Cups - named designs
  'CAT': { name: 'Cat Design Cup', price: 420 },
  'CICEK': { name: 'Flower Pattern Cup', price: 380 },
  'CIZIM': { name: 'Artistic Drawing Cup', price: 400 },
  'CIZIM2': { name: 'Artistic Drawing Cup II', price: 420 },
  'D': { name: 'Classic Design Cup Set', price: 650 },
  'DEER': { name: 'Deer Motif Cup', price: 450 },
  'DENIZATI': { name: 'Seahorse Cup', price: 480 },
  'DORTLU': { name: 'Quartet Cup Set', price: 750 },
  'FISH': { name: 'Fish Design Cup', price: 390 },
  'FISH2': { name: 'Fish Design Cup II', price: 410 },
  'GEYIK': { name: 'Stag Cup', price: 430 },
  'KULE': { name: 'Tower Design Cup', price: 460 },
  'KUS': { name: 'Bird Motif Cup', price: 400 },
  'LOVE1': { name: 'Love Heart Cup', price: 380 },
  'ORUMCEK': { name: 'Spider Web Cup', price: 420 },
  'SEASHELL': { name: 'Seashell Cup', price: 440 },
  'SIRIN': { name: 'Charming Cup', price: 360 },
  'TAS1': { name: 'Stone Pattern Cup', price: 450 },
  'TAS2': { name: 'Stone Pattern Cup II', price: 470 },
  'TORTO': { name: 'Tortoise Cup', price: 430 },
  // Wine Glass
  'w1': { name: 'Ceramic Wine Glass #1', price: 680 },
  'w2': { name: 'Ceramic Wine Glass #2', price: 720 },
  'w3': { name: 'Ceramic Wine Glass #3', price: 680 },
  'w4': { name: 'Ceramic Wine Glass #4', price: 720 },
  'w5': { name: 'Ceramic Wine Glass #5', price: 750 },
  'w6': { name: 'Ceramic Wine Glass #6', price: 780 },
  // Wine Server
  'ws1': { name: 'Wine Server Carafe #1', price: 1200 },
  'ws2': { name: 'Wine Server Carafe #2', price: 980 },
  'ws3': { name: 'Wine Server Carafe #3', price: 1050 },
  'ws4': { name: 'Wine Server Carafe #4', price: 1150 },
  'ws5': { name: 'Wine Server Carafe #5', price: 1100 },
  'ws6': { name: 'Wine Server Carafe #6', price: 1100 },
  'ws7': { name: 'Wine Server Carafe #7', price: 1250 },
  'ws8': { name: 'Wine Server Carafe #8', price: 1080 },
  'ws9': { name: 'Wine Server Carafe #9', price: 1120 },
  'ws10': { name: 'Wine Server Carafe #10', price: 1300 },
  'ws11': { name: 'Wine Server Carafe #11', price: 1000 },
  'ws12': { name: 'Wine Server Carafe #12', price: 1180 },
  'ws13': { name: 'Wine Server Carafe #13', price: 1180 },
  // Gramophone
  'Gramophone': { name: 'Ceramic Gramophone', price: 2500 }
};

// Category mapping
const categories = {
  'cups': 1,       // Adjust these IDs based on your database
  'wine-glass': 2,
  'wine-server': 3,
  'gramophone': 4
};

async function parseImagesFolder(folderPath, categorySlug) {
  const files = fs.readdirSync(folderPath);
  const products = {};

  for (const file of files) {
    if (!file.match(/\.(jpeg|jpg|png|webp)$/i)) continue;

    // Extract product name and image number
    // Pattern: "NAME.ext" or "NAME (N).ext"
    const match = file.match(/^(.+?)(?:\s*\((\d+)\))?\.(\w+)$/);
    if (!match) continue;

    let productKey = match[1].trim();
    const imageNum = match[2] ? parseInt(match[2]) : 1;

    if (!products[productKey]) {
      products[productKey] = [];
    }

    products[productKey].push({
      file: file,
      order: imageNum,
      path: `${IMAGES_PUBLIC}/${categorySlug}/${file}`
    });
  }

  // Sort images by order
  for (const key in products) {
    products[key].sort((a, b) => a.order - b.order);
  }

  return products;
}

async function main() {
  const connection = await mysql.createConnection(dbConfig);
  console.log('Connected to database');

  try {
    // Get category IDs
    const [cats] = await connection.execute('SELECT id, slug FROM categories');
    const categoryMap = {};
    for (const cat of cats) {
      categoryMap[cat.slug] = cat.id;
    }
    console.log('Categories:', categoryMap);

    // Parse all folders
    const cupsProducts = await parseImagesFolder(path.join(IMAGES_ORIGINAL, 'cups'), 'cups');
    const wineGlassProducts = await parseImagesFolder(path.join(IMAGES_ORIGINAL, 'wine glass'), 'wine glass');
    const wineServerProducts = await parseImagesFolder(path.join(IMAGES_ORIGINAL, 'wine server'), 'wine server');
    const gramophoneProducts = await parseImagesFolder(path.join(IMAGES_ORIGINAL, 'Gramophone'), 'Gramophone');

    console.log('\n=== PRODUCTS FOUND ===');
    console.log('Cups:', Object.keys(cupsProducts).length, 'products');
    console.log('Wine Glass:', Object.keys(wineGlassProducts).length, 'products');
    console.log('Wine Server:', Object.keys(wineServerProducts).length, 'products');
    console.log('Gramophone:', Object.keys(gramophoneProducts).length, 'products');

    // Show sample
    console.log('\n=== SAMPLE: Cups ===');
    for (const [name, images] of Object.entries(cupsProducts).slice(0, 5)) {
      console.log(`  ${name}: ${images.length} images`);
      images.forEach(img => console.log(`    - ${img.file}`));
    }

    // Clear existing products
    await connection.execute('DELETE FROM product_images');
    await connection.execute('DELETE FROM products');
    console.log('\nCleared existing products');

    // Insert products
    let insertedCount = 0;

    // Helper function to insert product
    async function insertProduct(name, images, categoryId, infoKey) {
      const info = productInfo[infoKey] || { name: `${name} Ceramic`, price: 500 };

      const [result] = await connection.execute(
        `INSERT INTO products (category_id, name, name_en, name_tr, description_en, description_tr, price_try, in_stock, featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, 1, 0)`,
        [categoryId, info.name, info.name, info.name, 'Handcrafted ceramic piece', 'El yapımı seramik parça', info.price]
      );

      const productId = result.insertId;

      // Insert images
      for (let i = 0; i < images.length; i++) {
        await connection.execute(
          'INSERT INTO product_images (product_id, image_url, is_primary, sort_order) VALUES (?, ?, ?, ?)',
          [productId, images[i].path, i === 0 ? 1 : 0, i]
        );
      }

      insertedCount++;
      console.log(`  Created: ${info.name} (${images.length} images)`);
    }

    console.log('\n=== INSERTING PRODUCTS ===');

    // Insert cups
    console.log('\nCups:');
    for (const [name, images] of Object.entries(cupsProducts)) {
      await insertProduct(name, images, categoryMap['cups'], name);
    }

    // Insert wine glass
    console.log('\nWine Glass:');
    for (const [name, images] of Object.entries(wineGlassProducts)) {
      await insertProduct(name, images, categoryMap['wine-glasses'], name);
    }

    // Insert wine server
    console.log('\nWine Server:');
    for (const [name, images] of Object.entries(wineServerProducts)) {
      await insertProduct(name, images, categoryMap['wine-servers'], 'ws' + name);
    }

    // Insert gramophone
    console.log('\nGramophone:');
    for (const [name, images] of Object.entries(gramophoneProducts)) {
      await insertProduct(name, images, categoryMap['decorative'], name);
    }

    console.log(`\n=== DONE: ${insertedCount} products created ===`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

main();
