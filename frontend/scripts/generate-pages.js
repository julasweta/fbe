// scripts/generate-pages.js
const fs = require("fs");
const pathLib = require("path");
const fetch = require("node-fetch"); // npm i node-fetch@2

const API_URL = "https://fbe.onrender.com";

const staticRoutes = [
  {path: "/", title: "FULL BODY ERA - Головна", description: "Ласкаво просимо до FULL BODY ERA"},
  {path: "/about", title: "Про нас - FULL BODY ERA", description: "Дізнайтеся більше про FULL BODY ERA - місія та цінності."},
  {path: "/contact", title: "Контакти - FULL BODY ERA", description: "Зв’яжіться з нами."},
  {path: "/privacy", title: "Політика конфіденційності - FULL BODY ERA", description: "Політика конфіденційності FULL BODY ERA."},
  {path: "/cart", title: "Кошик - FULL BODY ERA", description: "Перегляньте ваш кошик перед оформленням замовлення."},
  {path: "/checkout", title: "Оформлення замовлення - FULL BODY ERA", description: "Оформіть замовлення у магазині FULL BODY ERA."},
  {path: "/delivery-terms", title: "Доставка - FULL BODY ERA", description: "Умови доставки FULL BODY ERA."},
];

async function fetchDynamicRoutes() {
  try {
    const [products, categories, collections] = await Promise.all([
      fetch(`${API_URL}/products`).then(r => r.json()).catch(() => []),
      fetch(`${API_URL}/categories`).then(r => r.json()).catch(() => []),
      fetch(`${API_URL}/collections`).then(r => r.json()).catch(() => []),
    ]);

    const productRoutes = products.map(p => ({
      path: `/product/${p.id}`,
      title: `${p.name} - FULL BODY ERA`,
      description: p.description?.slice(0, 150) || `Переглянути ${p.name} у FULL BODY ERA.`,
    }));

    const categoryRoutes = categories.map(c => ({
      path: `/category/${c.slug}`,
      title: `Категорія ${c.name} - FULL BODY ERA`,
      description: `Перегляньте товари у категорії ${c.name}.`,
    }));

    const collectionRoutes = collections.map(col => ({
      path: `/group/${col.slug}`,
      title: `Колекція ${col.name} - FULL BODY ERA`,
      description: `Досліджуйте товари з колекції ${col.name}.`,
    }));

    return [...productRoutes, ...categoryRoutes, ...collectionRoutes];
  } catch (err) {
    console.error("❌ Помилка завантаження API:", err.message);
    return [];
  }
}

async function generateStaticPages() {
  const distDir = pathLib.join(__dirname, "../dist");
  const indexPath = pathLib.join(distDir, "index.html");

  if (!fs.existsSync(indexPath)) {
    console.error("❌ index.html не знайдено в dist/");
    return;
  }

  const indexContent = fs.readFileSync(indexPath, "utf-8");

  const dynamicRoutes = await fetchDynamicRoutes();
  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  for (const route of allRoutes) {
    const cleanPath = route.path.replace(/^\//, "");
    const routeDir = pathLib.join(distDir, cleanPath);

    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, {recursive: true});
    }

    let modifiedContent = indexContent
      .replace(/<title>.*?<\/title>/i, `<title>${route.title}</title>`)
      .replace(/(<meta name="description" content=")[^"]*(")/i, `$1${route.description}$2`)
      .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1https://fbe.pp.ua${route.path}$2`);

    const socialMeta = `
    <meta property="og:title" content="${route.title}" />
    <meta property="og:description" content="${route.description}" />
    <meta property="og:url" content="https://fbe.pp.ua${route.path}" />
    <meta name="twitter:title" content="${route.title}" />
    <meta name="twitter:description" content="${route.description}" />
  </head>`;

    modifiedContent = modifiedContent.replace("</head>", socialMeta);

    fs.writeFileSync(pathLib.join(routeDir, "index.html"), modifiedContent);
    console.log(`✅ Створено: ${route.path}`);
  }

  console.log(`\n🎉 Згенеровано ${allRoutes.length} сторінок!`);
}

generateStaticPages();
