// Service Worker для "Я в деле"
const CACHE_NAME = 'ya-v-dele-v1';

// Файлы для кэширования
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/data.js',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg'
];

// Установка — кэшируем статику
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: установка');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Кэширование статических файлов');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting()) // Активируем сразу
  );
});

// Активация — удаляем старые кэши
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: активация');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => {
            console.log('🗑️ Удаляем старый кэш:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim()) // Берём контроль сразу
  );
});

// Fetch — стратегия кэширования
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Для API запросов — Network First
  if (url.href.includes('script.google.com')) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // Для статики — Cache First
  event.respondWith(cacheFirst(request));
});

// Cache First — сначала кэш, потом сеть
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    
    // Кэшируем успешные GET запросы
    if (response.ok && request.method === 'GET') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Офлайн — возвращаем fallback
    console.log('📴 Офлайн, ресурс не найден:', request.url);
    return new Response('Офлайн', { status: 503 });
  }
}

// Network First — сначала сеть, потом кэш
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    
    // Кэшируем успешные GET запросы
    if (response.ok && request.method === 'GET') {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Сеть недоступна — пробуем кэш
    console.log('📴 Сеть недоступна, ищем в кэше');
    const cached = await caches.match(request);
    
    if (cached) {
      return cached;
    }
    
    // Нет кэша — возвращаем ошибку
    return new Response(
      JSON.stringify({ error: 'Офлайн', offline: true }),
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
