const https = require('https');
const mysql = require('mysql2/promise');

// TCMB XML URL for daily exchange rates
const TCMB_URL = 'https://www.tcmb.gov.tr/kurlar/today.xml';

const dbConfig = {
  host: '127.0.0.1',
  port: 3306,
  user: 'lunaris',
  password: 'Dlr235672.-Yt',
  database: 'lunarisceramic'
};

function fetchTCMBRates() {
  return new Promise((resolve, reject) => {
    https.get(TCMB_URL, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          // Parse XML to extract USD and EUR rates
          const usdMatch = data.match(/<Currency[^>]*CurrencyCode="USD"[^>]*>[\s\S]*?<ForexSelling>([\d.]+)<\/ForexSelling>/);
          const eurMatch = data.match(/<Currency[^>]*CurrencyCode="EUR"[^>]*>[\s\S]*?<ForexSelling>([\d.]+)<\/ForexSelling>/);

          if (!usdMatch || !eurMatch) {
            reject(new Error('Could not parse exchange rates from TCMB'));
            return;
          }

          resolve({
            USD: parseFloat(usdMatch[1]),
            EUR: parseFloat(eurMatch[1])
          });
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

async function updateDatabase(rates) {
  const connection = await mysql.createConnection(dbConfig);

  try {
    // Update USD rate (rate = how many USD per 1 TRY)
    await connection.execute(
      'UPDATE exchange_rates SET rate = ? WHERE currency = ?',
      [(1 / rates.USD).toFixed(4), 'USD']
    );

    // Update EUR rate (rate = how many EUR per 1 TRY)
    await connection.execute(
      'UPDATE exchange_rates SET rate = ? WHERE currency = ?',
      [(1 / rates.EUR).toFixed(4), 'EUR']
    );

    console.log(`[${new Date().toISOString()}] Exchange rates updated successfully:`);
    console.log(`  1 USD = ${rates.USD.toFixed(4)} TRY`);
    console.log(`  1 EUR = ${rates.EUR.toFixed(4)} TRY`);
    console.log(`  1 TRY = ${(1/rates.USD).toFixed(6)} USD`);
    console.log(`  1 TRY = ${(1/rates.EUR).toFixed(6)} EUR`);

  } finally {
    await connection.end();
  }
}

async function main() {
  try {
    console.log('Fetching exchange rates from TCMB...');
    const rates = await fetchTCMBRates();
    await updateDatabase(rates);
  } catch (error) {
    console.error('Error updating exchange rates:', error.message);
    process.exit(1);
  }
}

main();
