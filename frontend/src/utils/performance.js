// utils/performance.js

// Функція для відстеження Core Web Vitals
export function measureWebVitals({name, value, id}) {
  // Відправляємо дані в Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', name, {
      event_category: 'Web Vitals',
      event_label: id,
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      non_interaction: true,
    });
  }

  // Також можемо логувати в консоль для розробки
  if (process.env.NODE_ENV === 'development') {
    console.log(`${name}: ${value} (id: ${id})`);
  }
}

// Функція для вимірювання часу завантаження сторінки
export function measurePageLoad() {
  if (typeof window !== 'undefined' && 'performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;

        if (typeof gtag !== 'undefined') {
          gtag('event', 'page_load_time', {
            event_category: 'Performance',
            event_label: window.location.pathname,
            value: loadTime,
            non_interaction: true
          });
        }

        console.log(`Page load time: ${loadTime}ms`);
      }, 0);
    });
  }
}

// Функція для відстеження взаємодій користувача
export function trackUserInteraction(action, element) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'user_interaction', {
      event_category: 'Engagement',
      event_label: `${action}_${element}`,
      non_interaction: false
    });
  }
}

// Функція для відстеження помилок JavaScript
export function trackJSError(error, errorInfo) {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'javascript_error', {
      event_category: 'Error',
      event_label: error.toString(),
      value: 1,
      non_interaction: true
    });
  }

  console.error('JS Error tracked:', error, errorInfo);
}