// utils/errorTracking.js

// Основна функція для відстеження помилок
export function trackError(error, errorInfo = {}) {
  const errorData = {
    message: error.message || error.toString(),
    stack: error.stack,
    url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    timestamp: new Date().toISOString(),
    ...errorInfo
  };

  // Відправляємо в Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'exception', {
      description: errorData.message,
      fatal: false,
      error_url: errorData.url
    });
  }

  // Логуємо в консоль для розробки
  if (process.env.NODE_ENV === 'development') {
    console.error('Error tracked:', errorData);
  }

  // Можна також відправити на ваш сервер для логування
  sendErrorToServer(errorData);
}

// Функція для відстеження API помилок
export function trackAPIError(endpoint, status, message) {
  const errorData = {
    type: 'API_ERROR',
    endpoint,
    status,
    message,
    timestamp: new Date().toISOString()
  };

  if (typeof gtag !== 'undefined') {
    gtag('event', 'api_error', {
      event_category: 'API',
      event_label: `${endpoint} - ${status}`,
      value: status,
      non_interaction: true
    });
  }

  console.error('API Error:', errorData);
  sendErrorToServer(errorData);
}

// Функція для відстеження помилок React компонентів
export function trackComponentError(componentName, error, errorInfo) {
  const errorData = {
    type: 'COMPONENT_ERROR',
    component: componentName,
    error: error.toString(),
    componentStack: errorInfo.componentStack,
    errorBoundary: true
  };

  trackError(error, errorData);
}

// Відправка помилок на сервер (опційно)
async function sendErrorToServer(errorData) {
  try {
    // Замініть на ваш endpoint для логування помилок
    await fetch('/api/log-error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(errorData),
    });
  } catch (err) {
    console.error('Failed to send error to server:', err);
  }
}

// Глобальний обробник для неперехоплених помилок
export function setupGlobalErrorHandling() {
  if (typeof window !== 'undefined') {
    // Перехоплюємо JavaScript помилки
    window.addEventListener('error', (event) => {
      trackError(event.error || new Error(event.message), {
        type: 'GLOBAL_ERROR',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Перехоплюємо необроблені Promise помилки
    window.addEventListener('unhandledrejection', (event) => {
      trackError(new Error(event.reason), {
        type: 'UNHANDLED_PROMISE_REJECTION'
      });
    });
  }
}