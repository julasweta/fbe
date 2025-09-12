import {writeFileSync, mkdirSync, existsSync, statSync, readFileSync} from 'fs';
import {join} from 'path';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

// Для ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
  if (!dateStr) return new Date().toISOString().split('T')[0];
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return new Date().toISOString().split('T')[0];
    return date.toISOString().split('T')[0];
  } catch (error) {
    return new Date().toISOString().split('T')[0];
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

// Функція для генерації окремого sitemap файлу
function generateSitemapFile(urls, fileName, publicDir, distDir) {
  const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetClose = '</urlset>';

  const urlEntries = urls.map(url => `  <url>
    <loc>${escapeXML(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n');

  const sitemap = [xmlDeclaration, urlsetOpen, urlEntries, urlsetClose].join('\n');
  const sitemapPath = join(publicDir, fileName);

  if (!existsSync(publicDir)) mkdirSync(publicDir, {recursive: true});
  writeFileSync(sitemapPath, sitemap, 'utf8');
  console.log(`✅ ${fileName} створено: ${sitemapPath}`);

  if (existsSync(distDir)) {
    const distSitemapPath = join(distDir, fileName);
    writeFileSync(distSitemapPath, sitemap, 'utf8');
    console.log(`✅ ${fileName} створено для production: ${distSitemapPath}`);
  }

  return `https://fbe.pp.ua/${fileName}`;
}

async function generateSitemap() {
  try {
    const API_URL = 'https://fbe.onrender.com/products';
    const SITEMAP_BASE_URL = 'https://fbe.pp.ua';
    const publicDir = join(__dirname, '..', 'public');
    const distDir = join(__dirname, '..', 'dist');

    console.log('🔄 Завантаження продуктів з API...');
    const response = await fetch(API_URL, {
      headers: {'User-Agent': 'Mozilla/5.0'},
      timeout: 10000,
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    const products = data.data || [];

    console.log(`📦 Знайдено ${products.length} продуктів`);

    // Статичні сторінки
    const staticPages = [
      {loc: `${SITEMAP_BASE_URL}/`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: '1.0'},
      {loc: `${SITEMAP_BASE_URL}/products`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: '0.9'},
      {loc: `${SITEMAP_BASE_URL}/about`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.7'},
      {loc: `${SITEMAP_BASE_URL}/contact`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.6'},
    ];

    // Продуктові URL
    const productUrls = products
      .filter(product => product && (product.id || product._id))
      .slice(0, 50000)
      .map(product => ({
        loc: `${SITEMAP_BASE_URL}/product/${escapeXML(product.id || product._id)}`,
        lastmod: formatDate(product.updatedAt || product.updated_at),
        changefreq: 'weekly',
        priority: '0.8',
      }));

    // Колекції (поки що порожні, додайте логіку, якщо є дані)
    const collectionUrls = []; // Приклад: [{ loc: `${SITEMAP_BASE_URL}/collection/1`, ... }]

    // Генерація окремих sitemap файлів
    const pagesSitemapUrl = generateSitemapFile(staticPages, 'sitemap_pages_1.xml', publicDir, distDir);
    const productsSitemapUrl = generateSitemapFile(productUrls, 'sitemap_products_1.xml', publicDir, distDir);
    const collectionsSitemapUrl = generateSitemapFile(collectionUrls, 'sitemap_collections_1.xml', publicDir, distDir);
    const blogsSitemapUrl = generateSitemapFile([], 'sitemap_blogs_1.xml', publicDir, distDir); // Поки що порожній

    // Генерація sitemapindex
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${productsSitemapUrl}</loc></sitemap>
  <sitemap><loc>${pagesSitemapUrl}</loc></sitemap>
  <sitemap><loc>${collectionsSitemapUrl}</loc></sitemap>
  <sitemap><loc>${blogsSitemapUrl}</loc></sitemap>
</sitemapindex>`;

    const sitemapIndexPath = join(publicDir, 'sitemap.xml');
    if (!existsSync(publicDir)) mkdirSync(publicDir, {recursive: true});
    writeFileSync(sitemapIndexPath, sitemapIndex, 'utf8');
    console.log(`✅ sitemap.xml (index) створено: ${sitemapIndexPath}`);

    if (existsSync(distDir)) {
      const distSitemapIndexPath = join(distDir, 'sitemap.xml');
      writeFileSync(distSitemapIndexPath, sitemapIndex, 'utf8');
      console.log(`✅ sitemap.xml (index) створено для production: ${distSitemapIndexPath}`);
    }

    console.log(`📊 Всього URL: ${staticPages.length + productUrls.length + collectionUrls.length}`);
    if (existsSync(sitemapIndexPath)) {
      const stats = statSync(sitemapIndexPath);
      console.log(`📏 Розмір sitemapindex: ${Math.round(stats.size / 1024)} KB`);
    }

    validateSitemap(sitemapIndexPath);

    console.log('⏳ Чекаю 3 секунди перед перевіркою доступності...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await checkSitemapAvailability(`${SITEMAP_BASE_URL}/sitemap.xml`);

    console.log('🎉 Генерація sitemap завершена успішно!');
  } catch (error) {
    console.error('❌ Помилка генерації sitemap:', error.message);

    const fallbackSitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>https://fbe.pp.ua/sitemap_pages_1.xml</loc></sitemap>
</sitemapindex>`;

    const publicDir = join(__dirname, '..', 'public');
    const sitemapIndexPath = join(publicDir, 'sitemap.xml');
    if (!existsSync(publicDir)) mkdirSync(publicDir, {recursive: true});
    writeFileSync(sitemapIndexPath, fallbackSitemapIndex, 'utf8');
    console.log('✅ Створено базовий sitemapindex через fallback');
  }
}

// Функція валідації sitemap
function validateSitemap(sitemapPath) {
  try {
    const sitemapContent = readFileSync(sitemapPath, 'utf8');
    if (!sitemapContent.includes('<?xml version="1.0" encoding="UTF-8"?>')) throw new Error('Відсутня XML декларація');
    if (!sitemapContent.includes('<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) throw new Error('Неправильний namespace');
    console.log('✅ Sitemap валідний');
    return true;
  } catch (error) {
    console.error('❌ Помилка валідації sitemap:', error.message);
    return false;
  }
}

generateSitemap();