// src/prerender.js
export async function prerender(context) {
  console.log('🔥 PRERENDER STARTED for URL:', context.url);

  const urlsToRender = ['/', '/about', '/product/36'];

  // Нормалізуємо URL
  const normalizedUrl = context.url.endsWith('/') && context.url !== '/'
    ? context.url.slice(0, -1)
    : context.url;

  const shouldRender = urlsToRender.includes(normalizedUrl) || urlsToRender.includes(context.url);

  console.log('📋 URL matching check:', {
    originalUrl: context.url,
    normalizedUrl,
    shouldRender,
    urlsToRender
  });

  if (!shouldRender) {
    console.log('⏭️ URL not in prerender list:', context.url);
    return null;
  }

  // Перевіряємо наявність функції render
  if (!context.render || typeof context.render !== 'function') {
    console.error('❌ Render function is not available for URL:', context.url);
    console.error('Available context keys:', Object.keys(context));
    return null;
  }

  try {
    console.log('⏳ Starting render for URL:', context.url);

    // Зменшуємо затримку до розумних меж
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('⏰ Timeout completed, calling render function...');

    const html = await context.render();
    console.log('📄 Render completed, HTML length:', html?.length || 0);

    if (!html || typeof html !== 'string') {
      console.warn('⚠️ Render function returned invalid HTML for URL:', context.url);
      return null;
    }

    if (html.length < 100) {
      console.warn('⚠️ HTML seems too short for URL:', context.url, 'Length:', html.length);
      console.warn('HTML preview:', html.substring(0, 200));
    }

    // Аналіз HTML контенту
    const hasRootDiv = html.includes('id="root"');
    const hasReactContent = html.includes('data-reactroot') || html.includes('react');

    console.log('🔍 HTML content analysis:', {
      url: context.url,
      htmlLength: html.length,
      hasRootDiv,
      hasReactContent,
      preview: html.substring(0, 200) + '...'
    });

    console.log('✅ Successfully rendered', context.url);

    // Повертаємо результат у правильному форматі
    const result = {
      html,
      head: {
        lang: 'uk', // змінено з 'ua' на 'uk'
        title: getPageTitle(context.url),
        elements: new Set([
          {
            type: 'link',
            props: {
              rel: 'canonical',
              href: `https://fbe.pp.ua${context.url}`
            }
          },
          {
            type: 'meta',
            props: {
              name: 'description',
              content: getPageDescription(context.url)
            }
          },
          {
            type: 'meta',
            props: {
              property: 'og:title',
              content: getPageTitle(context.url)
            }
          },
          {
            type: 'meta',
            props: {
              property: 'og:image',
              content: getPageImage(context.url) // тут буде URL картинки
            }
          },
        ]),
        
      },
    };

    console.log('📦 Returning result for URL:', context.url);
    return result;

  } catch (error) {
    console.error('💥 Error during rendering URL:', context.url);
    console.error('Error details:', error.message);
    console.error('Stack trace:', error.stack);
    return null;
  }
}

async function getPageTitle(url) {
  const match = url.match(/^\/product\/(\d+)$/);
  if (match) {
    const productId = match[1];
    try {
      const res = await fetch(`https://fbe.onrender.com/products/${productId}`);
      if (!res.ok) return `FULL BODY ERA - Товар ${productId}`;
      const data = await res.json();
      const name = data.translations?.[0]?.name;
      return name ? `${name} - FULL BODY ERA` : `FULL BODY ERA - Товар ${productId}`;
    } catch (err) {
      console.error('Error fetching product title:', err);
      return `FULL BODY ERA - Товар ${productId}`;
    }
  }

  const titles = {
    '/': 'FULL BODY ERA - Головна сторінка',
    '/about': 'FULL BODY ERA - Про нас'
  };
  return titles[url] || `FULL BODY ERA - ${url}`;
}


// Мапимо URL продукту на картинку
async function getPageImage(url) {
  // перевіряємо чи це сторінка продукту
  const match = url.match(/^\/product\/(\d+)$/);
  if (match) {
    const productId = match[1];
    try {
      const res = await fetch(`https://fbe.onrender.com/products/${productId}`);
      if (!res.ok) return 'https://fbe.pp.ua/assets/default-og.jpg';
      const data = await res.json();
      // беремо першу картинку з варіантів продукту
      const imageUrl = data.variants?.[0]?.images?.[0]?.url;
      return imageUrl ? `https://fbe.pp.ua${imageUrl}` : 'https://fbe.pp.ua/assets/default-og.jpg';
    } catch (err) {
      console.error('Error fetching product image:', err);
      return 'https://fbe.pp.ua/assets/default-og.jpg';
    }
  }
  // Для інших сторінок можна залишити статичні зображення
  const images = {
    '/': 'https://fbe.pp.ua/assets/home-og.jpg',
    '/about': 'https://fbe.pp.ua/assets/about-og.jpg'
  };
  return images[url] || 'https://fbe.pp.ua/assets/default-og.jpg';
}



async function getPageDescription(url) {
  // перевіряємо чи це сторінка продукту
  const match = url.match(/^\/product\/(\d+)$/);
  if (match) {
    const productId = match[1];
    try {
      const res = await fetch(`https://fbe.onrender.com/products/${productId}`);
      if (!res.ok) return 'FULL BODY ERA - магазин спортивного одягу та аксесуарів.';
      const data = await res.json();
      const description = data.translations?.[0]?.description;
      return description?.slice(0, 150) || `Переглянути ${data.translations?.[0]?.name} у FULL BODY ERA.`;
    } catch (err) {
      console.error('Error fetching product description:', err);
      return 'FULL BODY ERA - магазин спортивного одягу та аксесуарів.';
    }
  }

  // Для інших сторінок можна залишити статичні опис
  const descriptions = {
    '/': 'FULL BODY ERA - магазин для тих, хто грає красиво. Спортивний одяг та аксесуари.',
    '/about': 'Дізнайтеся більше про FULL BODY ERA - наша історія та цінності.'
  };
  return descriptions[url] || 'FULL BODY ERA - магазин спортивного одягу та аксесуарів.';
}
