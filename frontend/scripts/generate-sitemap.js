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
    if (isNaN(date.getTime())) {
      return new Date().toISOString().split('T')[0];
    }
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

async function generateSitemap() {
  try {
    const API_URL = 'https://fbe.onrender.com/products';
    const SITEMAP_URL = 'https://fbe.pp.ua/sitemap.xml';

    console.log('🔄 Завантаження продуктів з API...');

    const response = await fetch(API_URL, {
      headers: {'User-Agent': 'Mozilla/5.0'},
      timeout: 10000
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const products = data.data || [];

    console.log(`📦 Знайдено ${products.length} продуктів`);

    // Статичні сторінки
    const staticPages = [
      {
        url: 'https://fbe.pp.ua/',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'daily',
        priority: '1.0'
      },
      {
        url: 'https://fbe.pp.ua/products',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'daily',
        priority: '0.9'
      },
      {
        url: 'https://fbe.pp.ua/about',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: '0.7'
      },
      {
        url: 'https://fbe.pp.ua/contact',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: '0.6'
      }
    ];

    // Створюємо XML
    const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>';
    const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    const urlsetClose = '</urlset>';

    // Статичні сторінки URLs
    const staticUrls = staticPages.map(page => `  <url>
    <loc>${escapeXML(page.url)}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n');

    // Сторінки продуктів
    const productUrls = products
      .filter(product => product && (product.id || product._id))
      .slice(0, 50000) // Обмежуємо кількість для sitemap
      .map(product => {
        const productId = escapeXML(product.id || product._id);
        const lastMod = formatDate(product.updatedAt || product.updated_at);

        return `  <url>
    <loc>https://fbe.pp.ua/product/${productId}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      })
      .join('\n');

    // Збираємо весь sitemap
    const sitemapParts = [
      xmlDeclaration,
      urlsetOpen,
      staticUrls
    ];

    if (productUrls) {
      sitemapParts.push(productUrls);
    }

    sitemapParts.push(urlsetClose);
    const sitemap = sitemapParts.join('\n');

    // Записуємо файл для Vite
    const publicDir = join(__dirname, '..', 'public');
    const sitemapPath = join(publicDir, 'sitemap.xml');

    // Створюємо public директорію якщо не існує
    if (!existsSync(publicDir)) {
      mkdirSync(publicDir, {recursive: true});
    }

    writeFileSync(sitemapPath, sitemap, 'utf8');
    console.log(`✅ Sitemap створено: ${sitemapPath}`);

    // Також створюємо для dist (після build)
    const distDir = join(__dirname, '..', 'dist');
    if (existsSync(distDir)) {
      const distSitemapPath = join(distDir, 'sitemap.xml');
      writeFileSync(distSitemapPath, sitemap, 'utf8');
      console.log(`✅ Sitemap створено для production: ${distSitemapPath}`);
    }

    console.log(`📊 Всього URL в sitemap: ${staticPages.length + products.length}`);

    // Перевірка розміру файлу
    if (existsSync(sitemapPath)) {
      const stats = statSync(sitemapPath);
      const fileSizeInBytes = stats.size;
      const fileSizeInKB = Math.round(fileSizeInBytes / 1024);

      console.log(`📏 Розмір sitemap: ${fileSizeInKB} KB`);

      if (fileSizeInBytes > 50 * 1024 * 1024) { // 50MB
        console.warn('⚠️ Розмір sitemap більше 50MB');
      }

      if (staticPages.length + products.length > 50000) {
        console.warn('⚠️ Більше 50,000 URL в sitemap');
      }
    }

    // Валідація створеного sitemap
    validateSitemap(sitemapPath);

    console.log('⏳ Чекаю 3 секунди перед перевіркою доступності...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Перевіряємо доступність онлайн
    await checkSitemapAvailability(SITEMAP_URL);

    console.log('🎉 Генерація sitemap завершена успішно!');

  } catch (error) {
    console.error('❌ Помилка генерації sitemap:', error.message);

    // Створюємо базовий sitemap якщо API недоступний
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://fbe.pp.ua/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    const publicDir = join(__dirname, '..', 'public');
    const sitemapPath = join(publicDir, 'sitemap.xml');

    if (!existsSync(publicDir)) {
      mkdirSync(publicDir, {recursive: true});
    }

    writeFileSync(sitemapPath, fallbackSitemap, 'utf8');
    console.log('✅ Створено базовий sitemap через fallback');
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
generateSitemap();