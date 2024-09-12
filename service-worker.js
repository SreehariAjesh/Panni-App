const cacheName = 'pwa-cache-v1';
const filesToCache = [
  '/',
  'index.html',
  'styles.css',
  'images/6262d795-9c1a-4c99-9423-cd1499fce84c.png',
  'images/6262d795-9c1a-4c99-9423-cd1499fce84c (1).png'
];

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('panni-cache').then(cache => {
      return cache.addAll([
        'index.html',
        'styles.css',
        'app.js',
        'manifest.json',
        'images/6262d795-9c1a-4c99-9423-cd1499fce84c.png',
        'images/6262d795-9c1a-4c99-9423-cd1499fce84c (1).png'
      ]);
    })
  );
});
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const addBtn = document.getElementById('add-to-home');
  addBtn.style.display = 'block';

  addBtn.addEventListener('click', () => {
    addBtn.style.display = 'none';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
  });
});
window.addEventListener('DOMContentLoaded', (event) => {
  // Check if the app is running in standalone mode (i.e., as a PWA)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

  if (isStandalone) {
    // Display PWA content and hide website content
    document.getElementById('app-content').style.display = 'block';
    document.getElementById('web-content').style.display = 'none';
  } else {
    // Display website content and hide PWA content
    document.getElementById('web-content').style.display = 'block';
    document.getElementById('app-content').style.display = 'none';
  }
});

