import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import * as pathLib from 'path';
import * as fs from 'fs';
import type { IProduct } from './src/interfaces/IProduct';
import type { ICategory } from './src/interfaces/ICategory';
import type { ICollection } from './src/interfaces/IColection';

interface IRoute {
  path: string;
  title: string;
  description: string;
  image?: string;
  price?: string;
}

const API_URL = 'https://fbe.onrender.com';
const excludedPaths = ['/404', '/index'];

// Нормалізація шляхів
const normalizePath = (path: string) => '/' + path.replace(/^\/+|\/+$/g, '') + '/';

// Екранування HTML символів
const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

// Безпечна оптимізація Cloudinary URL
const safeOptimizeCloudinaryUrl = (url: string): string => {
  if (!url || !url.includes('cloudinary.com/divhalkcr/image/upload/')) return url;

  try {
    // Простіша оптимізація без зміни розмірів
    return url.replace('/image/upload/', '/image/upload/w_600,c_limit,f_auto,q_60/');
  } catch  {
    console.warn('Помилка оптимізації зображення:', url);
    return url; // Повертаємо оригінал у разі помилки
  }
};

// Отримання головного зображення продукту
const getMainProductImage = (product: IProduct): string => {
  // Спочатку шукаємо варіант з stock = 1
  const stockOneVariant = product.variants.find(variant => variant.stock === 1);

  if (stockOneVariant?.images?.length) {
    // Шукаємо зображення з order = 1, інакше перше за order
    const sortedImages = stockOneVariant.images.sort((a, b) => (a.order || 0) - (b.order || 0));
    const mainImage = sortedImages.find(img => img.order === 1) || sortedImages[0];
    if (mainImage?.url) return mainImage.url;
  }

  // Fallback: перший варіант, перше зображення за order
  const firstVariant = product.variants?.[0];
  if (firstVariant?.images?.length) {
    const sortedImages = firstVariant.images.sort((a, b) => (a.order || 0) - (b.order || 0));
    const mainImage = sortedImages[0];
    if (mainImage?.url) return mainImage.url;
  }

  // Final fallback
  return 'https://res.cloudinary.com/divhalkcr/image/upload/v1757010788/3_r61yy0.jpg';
};

// Завантаження всіх маршрутів
async function getRoutes(): Promise<IRoute[]> {
  const staticRoutes: IRoute[] = [
    {
      path: '/',
      title: 'FBE - FULL BODY ERA - Український Одяг',
      description: 'Ласкаво просимо до FULL BODY ERA',
      image: 'https://res.cloudinary.com/divhalkcr/image/upload/v1757010788/3_r61yy0.jpg'
    },
    {
      path: '/about/',
      title: 'FULL BODY ERA - Про нас',
      description: 'Дізнайтеся більше про FULL BODY ERA - місія та цінності.',
      image: 'https://fbe.pp.ua/assets/about-og.jpg'
    },
    {
      path: '/contact/',
      title: 'FULL BODY ERA - Контакти',
      description: "Зв'яжіться з нами.",
      image: 'https://fbe.pp.ua/assets/default-og.jpg'
    },
    {
      path: '/return-policy/',
      title: 'FULL BODY ERA - Політика повернення',
      description: 'Умови повернення товарів.',
      image: 'https://fbe.pp.ua/assets/default-og.jpg'
    },
  ];

  const routesMap = new Map<string, IRoute>();
  staticRoutes.forEach(route => routesMap.set(normalizePath(route.path), route));

  const fetchWithErrorHandling = async (url: string, name: string) => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`⚠️ ${name}: HTTP ${res.status}`);
        return null;
      }
      return res;
    } catch (err) {
      console.warn(`⚠️ Помилка завантаження ${name}:`, (err as Error).message);
      return null;
    }
  };

  try {
    const [productsRes, categoriesRes, collectionsRes] = await Promise.all([
      fetchWithErrorHandling(`${API_URL}/products`, 'продуктів'),
      fetchWithErrorHandling(`${API_URL}/categories`, 'категорій'),
      fetchWithErrorHandling(`${API_URL}/collections`, 'колекцій'),
    ]);

    if (productsRes) {
      const productsData = await productsRes.json() as { data: IProduct[] };
      const products: IProduct[] = productsData.data || [];

      products.forEach(product => {
        if (!product.id || !product.translations?.[0]?.name) return;

        const rawImageUrl = getMainProductImage(product);
        const optimizedImageUrl = safeOptimizeCloudinaryUrl(rawImageUrl);

      
        routesMap.set(normalizePath(`/product/${product.id}`), {
          path: `/product/${product.id}/`,
          title: `${product.translations[0].name} - FULL BODY ERA`,
          description: product.translations[0].description?.slice(0, 150) || `Переглянути ${product.translations[0].name} у FULL BODY ERA.`,
          image: optimizedImageUrl,
          price: product.price ? String(product.price) : undefined,
        });
      });
    }

    if (categoriesRes) {
      const categoriesData = await categoriesRes.json() as { data: ICategory[] };
      const categories: ICategory[] = categoriesData.data || [];
      categories.forEach(category => {
        if (!category.slug || !category.name) return;
        routesMap.set(normalizePath(`/category/${category.slug}`), {
          path: `/category/${category.slug}/`,
          title: `Категорія ${category.name} - FULL BODY ERA`,
          description: `Перегляньте товари у категорії ${category.name}.`,
          image: category.imageUrl || 'https://fbe.pp.ua/assets/default-og.jpg',
        });
      });
    }

    if (collectionsRes) {
      const collectionsData = await collectionsRes.json() as { data: ICollection[] };
      const collections: ICollection[] = collectionsData.data || [];
      collections.forEach(collection => {
        if (!collection.slug || !collection.name) return;
        routesMap.set(normalizePath(`/group/${collection.slug}`), {
          path: `/group/${collection.slug}/`,
          title: `Колекція ${collection.name} - FULL BODY ERA`,
          description: `Досліджуйте товари з колекції ${collection.name}.`,
          image: collection.imageUrl || 'https://fbe.pp.ua/assets/default-og.jpg',
        });
      });
    }
  } catch (error) {
    console.error('❌ Критична помилка при завантаженні API:', error);
  }

  return Array.from(routesMap.values());
}

// Генерація статичних сторінок
async function generateStaticPages(distDir: string, routes: IRoute[]) {
  const indexPath = pathLib.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) return;

  const indexContent = fs.readFileSync(indexPath, 'utf-8');

  for (const route of routes) {
    const cleanPath = route.path === '/' ? '' : route.path.replace(/^\//, '');
    const routeDir = pathLib.join(distDir, cleanPath);
    if (!fs.existsSync(routeDir)) fs.mkdirSync(routeDir, { recursive: true });

    const canonicalHref = route.path === '/' ? 'https://fbe.pp.ua/' : `https://fbe.pp.ua${route.path}`;

    let modifiedContent = indexContent
      .replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(route.title)}</title>`)
      .replace(/(<meta name="description" content=")[^"]*(")/i, `$1${escapeHtml(route.description)}$2`)
      .replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${canonicalHref}" />`);

    const socialMeta = `
    <meta name="robots" content="index,follow">
<meta property="og:type" content="${route.price ? 'product' : 'website'}" />
<meta property="og:title" content="${escapeHtml(route.title)}" />
<meta property="og:description" content="${escapeHtml(route.description)}" />
<meta property="og:url" content="${canonicalHref}" />
<meta property="og:image" content="${route.image || 'https://res.cloudinary.com/divhalkcr/image/upload/v1757010788/3_r61yy0.jpg'}" />
<meta property="og:image:secure_url" content="${route.image || 'https://res.cloudinary.com/divhalkcr/image/upload/v1757010788/3_r61yy0.jpg'}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:site_name" content="FULL BODY ERA" />
<meta property="og:locale" content="uk_UA" />
${route.price ? `<meta property="product:price:amount" content="${route.price}" /><meta property="product:price:currency" content="UAH" />` : ''}
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${escapeHtml(route.title)}" />
<meta name="twitter:description" content="${escapeHtml(route.description)}" />
<meta name="twitter:image" content="${route.image || 'https://res.cloudinary.com/divhalkcr/image/upload/v1757010788/3_r61yy0.jpg'}" />
<meta name="twitter:domain" content="fbe.pp.ua" />
<meta name="twitter:url" content="${canonicalHref}" />
</head>`;

    modifiedContent = modifiedContent.replace('</head>', socialMeta);
    fs.writeFileSync(pathLib.join(routeDir, 'index.html'), modifiedContent);

    // Логування для діагностики проблемних продуктів
    if (route.path.includes('/product/40/') || route.path.includes('/product/38/') || route.path.includes('/product/36/')) {
      console.log(`📄 HTML згенеровано для ${route.path}, image: ${route.image}`);
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
  {
      name: 'generate-sitemap-and-static',
      async writeBundle(options) {
        if (!options.dir) return;

        const routes = await getRoutes();

        // Sitemap
        const sitemapRoutes = routes
          .map(route => route.path === '/' ? '/' : normalizePath(route.path))
          .filter((path, index, self) =>
            !excludedPaths.includes(path) &&
            path !== '/' &&
            self.indexOf(path) === index
          );

        const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes.map(path => `<url><loc>https://fbe.pp.ua${path}</loc></url>`).join('\n')}
</urlset>`;

        fs.writeFileSync(pathLib.join(options.dir, 'sitemap.xml'), sitemapContent);

        // Генерація статичних сторінок
        await generateStaticPages(options.dir, routes);

        // Створення .nojekyll
        fs.writeFileSync(pathLib.join(options.dir, '.nojekyll'), '');
      },
    }, 
  ],

  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },

  publicDir: 'public',

  build: {
    rollupOptions: {
      input: { main: resolve(__dirname, 'index.html') },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'react-vendor';
            return 'vendor';
          }
        },
      },
    },
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  },

  define: { __API_URL__: JSON.stringify(API_URL) },
});
