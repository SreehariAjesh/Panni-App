const cacheName = 'pwa-cache-v1';
const filesToCache = [
  '/',
  'index.html',
  'styles.css',
  'app.js',
  'manifest.json',
  'images/6262d795-9c1a-4c99-9423-cd1499fce84c.png',
  'images/6262d795-9c1a-4c99-9423-cd1499fce84c (1).png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
importScripts("https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/11.1.0/firebase-messaging.js");

// Firebase Configuration in Service Worker
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
});

const messaging = firebase.messaging();

// Handle Background Push Notifications
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message", payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/Images/32x32.png"
  });
});

// Cache Resources for Offline Support
const CACHE_NAME = "panni-academy-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/app.js",
  "/sw.js",
  "/Images/32x32.png",
  "/manifest.json"
];

self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).then(() => {
        console.log("Assets cached successfully.");
        self.skipWaiting();
      });
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});
