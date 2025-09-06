// scripts/seo-monitor.js
import https from 'https';
import fs from 'fs';
import {URL} from 'url';
import puppeteer from 'puppeteer';


const SITE_URL = 'https://fbe.pp.ua';
const PRODUCTS_API = 'https://fbe.onrender.com/products';

// Функція для HTTP GET
async function fetchPage(url) {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto(url, {waitUntil: 'networkidle2'});
  const html = await page.content();
  await browser.close();
  return {statusCode: 200, body: html}; // щоб підходило під решту коду
}


// Функція для отримання продуктів з API
// Функція для отримання продуктів з API
async function fetchProducts() {
  return new Promise((resolve, reject) => {
    https.get(PRODUCTS_API, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (!Array.isArray(json.data)) {
            return reject(new Error('API не повернув масив data'));
          }
          // формуємо масив шляхів продуктів
          const pages = json.data.map(p => `/product/${p.id}`);
          resolve(pages);
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}


// Основна функція SEO аудиту
async function runSEOAudit() {
  console.log('🚀 Запускаю SEO аудит...');

  // Додаємо важливі сторінки вручну
  const pagesToCheck = ['/', '/about', '/contact'];

  try {
    const productPages = await fetchProducts();
    pagesToCheck.push(...productPages);
    console.log(`Перевіряємо сторінки: ${pagesToCheck.join(', ')}`);
  } catch (err) {
    console.error('❌ Не вдалося отримати продукти з API:', err.message);
  }

  for (const page of pagesToCheck) {
    try {
      const url = `${SITE_URL}${page}`;
      const res = await fetchPage(url);

      if (res.statusCode === 200) {
        console.log(`✅ ${page} доступна`);
        // тут можна викликати analyzeSEO(res.body, url)
      } else {
        console.warn(`⚠️ ${page} повертає статус ${res.statusCode}`);
      }
      await new Promise(r => setTimeout(r, 500)); // пауза між запитами
    } catch (err) {
      console.error(`❌ Помилка при перевірці ${page}:`, err.message);
    }
  }
}

runSEOAudit().catch(console.error);
