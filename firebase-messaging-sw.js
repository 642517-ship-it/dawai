/* دوائي — Service Worker خاص بإشعارات Firebase (FCM)
   يعمل في الخلفية والتطبيق مغلق */

importScripts('https://www.gstatic.com/firebasejs/12.18.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.18.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDUTgwasraPrSCBj_nvWHfszf0VluS35co",
  authDomain: "dawai-50755.firebaseapp.com",
  projectId: "dawai-50755",
  storageBucket: "dawai-50755.firebasestorage.app",
  messagingSenderId: "966139269899",
  appId: "1:966139269899:web:52cdc18bfb0ba8d83d480e"
});

const messaging = firebase.messaging();

// استقبال الإشعار والتطبيق مغلق أو في الخلفية
messaging.onBackgroundMessage(function (payload) {
  const n = (payload && payload.notification) || {};
  const d = (payload && payload.data) || {};
  const title = n.title || d.title || 'دوائي';
  const options = {
    body: n.body || d.body || 'حان موعد الدواء',
    icon: '/dawai/icons/icon-192.png',
    badge: '/dawai/icons/icon-192.png',
    dir: 'rtl',
    lang: 'ar',
    tag: d.tag || 'dawai-reminder',
    renotify: true,
    data: { url: '/dawai/' }
  };
  return self.registration.showNotification(title, options);
});

// الضغط على الإشعار يفتح التطبيق
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || '/dawai/';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (cs) {
      for (const c of cs) {
        if (c.url.indexOf('/dawai/') !== -1 && 'focus' in c) return c.focus();
      }
      return clients.openWindow(url);
    })
  );
});

self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
