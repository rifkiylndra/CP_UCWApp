// public/sw.js
// Service Worker for UCW App background notifications

self.addEventListener('install', (event) => {
    // Force the waiting service worker to become the active service worker
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Claim control of all open clients immediately
    event.waitUntil(self.clients.claim());
});

// Handle notification click event
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    // Focus on the client window if open, otherwise open a new window
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) {
                let client = clientList[0];
                for (let i = 0; i < clientList.length; i++) {
                    if (clientList[i].focused) {
                        client = clientList[i];
                    }
                }
                return client.focus();
            }
            // If no window is open, open a default route
            return clients.openWindow('/');
        })
    );
});
