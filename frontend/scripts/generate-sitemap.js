import {writeFileSync, mkdirSync, existsSync, statSync, readFileSync} from 'fs';
import {join} from 'path';

// Функція для екранування XML символів
function escapeXML(str) {
  if (!str) return '';
  return str.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Функція для валідації та форматування дати
function formatDate(dateStr) {
  if (!dateStr) return new Date().toISOString();

  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return new Date().toISOString();
    }
    return date.toISOString();
  } catch (error) {
    return new Date().toISOString();
  }
}

// Функція перевірки доступності sitemap
async function checkSitemapAvailability(sitemapUrl) {
  try {
    console.log(`🔍 Перевіряю доступність: ${sitemapUrl}`);
    const response = await fetch(sitemapUrl);

    if (response.ok) {
      console.log('✅ Sitemap доступний онлайн');
      return true;
    } else {
      console.warn(`⚠️ Sitemap недоступний: ${response.status} ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Помилка перевірки доступності:', error.message);
    return false;
  }
}

async function generateSitemap() {
  try {
    const API_URL = 'https://fbe.onrender.com/products';
    const SITEMAP_URL = 'https://fbe.pp.ua/sitemap.xml';

    console.log('🔄 Завантаження продуктів з API...');

    const response = await fetch(API_URL, {
      headers: {'User-Agent': 'Mozilla/5.0'}
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const products = data.data || [];

    console.log(`📦 Знайдено ${products.length} продуктів`);

    // Створюємо XML з правильним форматуванням
    const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>';
    const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    const urlsetClose = '</urlset>';

    // Головна сторінка
    const homeUrl = `  <url>
    <loc>https://fbe.pp.ua/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;

    // Сторінки продуктів
    const productUrls = products
      .filter(product => product && product.id)
      .map(product => {
        const productId = escapeXML(product.id);
        const lastMod = formatDate(product.updatedAt);

        return `  <url>
    <loc>https://fbe.pp.ua/product/${productId}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      })
      .join('\n');

    // Збираємо весь sitemap
    const sitemap = [
      xmlDeclaration,
      urlsetOpen,
      homeUrl,
      productUrls,
      urlsetClose
    ].join('\n');

    // Записуємо файл у кілька місць (для надійності)
    const locations = [
      join('public', 'sitemap.xml'),
      join('dist', 'sitemap.xml'), // для production build
      'sitemap.xml' // в корені проекту
    ];

    locations.forEach(sitemapPath => {
      try {
        const dir = sitemapPath.includes('/') ? sitemapPath.split('/')[0] : '';
        if (dir && !existsSync(dir)) {
          mkdirSync(dir, {recursive: true});
        }

        writeFileSync(sitemapPath, sitemap, 'utf8');
        console.log(`✅ Sitemap створено: ${sitemapPath}`);
      } catch (error) {
        console.warn(`⚠️ Не вдалось створити sitemap у ${sitemapPath}:`, error.message);
      }
    });

    console.log(`📊 Всього URL в sitemap: ${products.length + 1}`);

    // Перевірка розміру файлу
    const mainSitemapPath = join('public', 'sitemap.xml');
    if (existsSync(mainSitemapPath)) {
      const stats = statSync(mainSitemapPath);
      const fileSizeInMB = stats.size / (1024 * 1024);

      if (fileSizeInMB > 50) {
        console.warn('⚠️ Розмір sitemap більше 50MB');
      }

      if (products.length > 50000) {
        console.warn('⚠️ Більше 50,000 URL');
      }
    }

    // Чекаємо 2 секунди для завантаження файлу на сервер
    console.log('⏳ Чекаю 3 секунди перед перевіркою доступності...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Перевіряємо доступність онлайн
    await checkSitemapAvailability(SITEMAP_URL);

  } catch (error) {
    console.error('❌ Помилка генерації sitemap:', error.message);
    console.error('🔍 Деталі помилки:', error);
  }
}

// Функція валідації sitemap
function validateSitemap(sitemapPath) {
  try {
    const sitemapContent = readFileSync(sitemapPath, 'utf8');

    if (!sitemapContent.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
      throw new Error('Відсутня XML декларація');
    }

    if (!sitemapContent.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) {
      throw new Error('Неправильний namespace');
    }

    const urlCount = (sitemapContent.match(/<url>/g) || []).length;
    console.log(`✅ Sitemap валідний: ${urlCount} URL знайдено`);

    return true;
  } catch (error) {
    console.error('❌ Помилка валідації sitemap:', error.message);
    return false;
  }
}

// Запускаємо генерацію
generateSitemap().then(() => {
  const sitemapPath = join('public', 'sitemap.xml');
  if (existsSync(sitemapPath)) {
    validateSitemap(sitemapPath);
  }
});