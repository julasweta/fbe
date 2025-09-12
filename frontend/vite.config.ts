// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import * as pathLib from "path";
import * as fs from "fs";

import type { IProduct } from './src/interfaces/IProduct';
import type { ICategory } from './src/interfaces/ICategory';
import type { ICollection } from './src/interfaces/IColection';

const API_URL = "https://fbe.onrender.com";

// Тип для маршрутів з необов’язковим полем image
interface IRoute {
  path: string;
  title: string;
  description: string;
  image?: string;
}

// Функція для отримання всіх маршрутів
async function getRoutes(): Promise<IRoute[]> {
  const staticRoutes: IRoute[] = [
    { path: "/", title: "FULL BODY ERA - Головна", description: "Ласкаво просимо до FULL BODY ERA", image: "https://fbe.pp.ua/assets/home-og.jpg" },
    { path: "/about", title: "FULL BODY ERA - Про нас", description: "Дізнайтеся більше про FULL BODY ERA - місія та цінності.", image: "https://fbe.pp.ua/assets/about-og.jpg" },
    { path: "/contact", title: "FULL BODY ERA - Контакти", description: "Зв’яжіться з нами.", image: "https://fbe.pp.ua/assets/default-og.jpg" },
  ];

  try {
    const [productsRes, categoriesRes, collectionsRes] = await Promise.all([
      fetch(`${API_URL}/products`),
      fetch(`${API_URL}/categories`),
      fetch(`${API_URL}/collections`),
    ]);

    const productsData = await productsRes.json() as { data: IProduct[] };
    const products: IProduct[] = productsData.data;

    const categories = await (await categoriesRes.json()) as ICategory[];
    const collections = await (await collectionsRes.json()) as ICollection[];

    const productRoutes: IRoute[] = products.map((p: IProduct) => ({
      path: `/product/${p.id}`,
      title: `${p.translations[0].name} - FULL BODY ERA`,
      description: p.translations[0].description?.slice(0, 150) || `Переглянути ${p.translations[0].name} у FULL BODY ERA.`,
      image: p.variants?.[0]?.images?.[0]?.url || 'https://fbe.pp.ua/assets/default-og.jpg'
    }));

    const categoryRoutes: IRoute[] = categories.map((c: ICategory) => ({
      path: `/category/${c.slug}`,
      title: `Категорія ${c.name} - FULL BODY ERA`,
      description: `Перегляньте товари у категорії ${c.name}.`,
      image: 'https://fbe.pp.ua/assets/default-og.jpg'
    }));

    const collectionRoutes: IRoute[] = collections.map((col: ICollection) => ({
      path: `/group/${col.slug}`,
      title: `Колекція ${col.name} - FULL BODY ERA`,
      description: `Досліджуйте товари з колекції ${col.name}.`,
      image: 'https://fbe.pp.ua/assets/default-og.jpg'
    }));

    return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...collectionRoutes];
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("❌ Помилка завантаження API:", message);
    return staticRoutes;
  }
}

// Конфігурація Vite
export default defineConfig({
  plugins: [
    react(),
    {
      name: "generate-static-pages",
      async writeBundle(options) {
        if (!options.dir) return;
        const distDir = options.dir;
        const indexPath = pathLib.join(distDir, "index.html");
        if (!fs.existsSync(indexPath)) {
          console.error("❌ index.html не знайдено в dist/");
          return;
        }

        const indexContent = fs.readFileSync(indexPath, "utf-8");
        const routes = await getRoutes();

        for (const route of routes) {
          const cleanPath = route.path.replace(/^\//, "");
          const routeDir = pathLib.join(distDir, cleanPath);
          if (!fs.existsSync(routeDir)) fs.mkdirSync(routeDir, { recursive: true });

          let modifiedContent = indexContent
            .replace(/<title>.*?<\/title>/i, `<title>${route.title}</title>`)
            .replace(/(<meta name="description" content=")[^"]*(")/i, `$1${route.description}$2`)
            .replace(/(<link rel="canonical" href=")[^"]*(")/i, `$1https://fbe.pp.ua${route.path}$2`);

          const socialMeta = `
    <meta property="og:title" content="${route.title}" />
    <meta property="og:description" content="${route.description}" />
    <meta property="og:url" content="https://fbe.pp.ua${route.path}" />
    <meta property="og:image" content="${route.image}" />
    <meta name="twitter:title" content="${route.title}" />
    <meta name="twitter:description" content="${route.description}" />
    <meta name="twitter:image" content="${route.image}" />
  </head>`;

          modifiedContent = modifiedContent.replace("</head>", socialMeta);

          fs.writeFileSync(pathLib.join(routeDir, "index.html"), modifiedContent);
          fs.writeFileSync(pathLib.join(distDir, `${cleanPath}.html`), modifiedContent);

          console.log(`✅ Створено: ${route.path}`);
        }
      },
    },
  ],
  build: {
    rollupOptions: {
      input: { main: resolve(__dirname, "index.html") },
    },
  },
});
