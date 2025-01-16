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
const messaging = firebase.messaging();

// Request Notification Permission
function requestNotificationPermission() {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      console.log("Notification permission granted.");
      getFCMToken();
    } else {
      console.log("Notification permission denied.");
    }
  });
}

// Get the FCM Token
function getFCMToken() {
  messaging.getToken({ vapidKey: "BEvNfAHngb0nSlIPh3QDD7ScJ9YIM1u97FhdLAQmoWj6LHpVRNuYAgE1YOaia5M-mrpQ_PJkncGfsaWNwRTXng0" })
    .then((token) => {
      if (token) {
        console.log("FCM Token:", token);
        // Store or send this token to your server for notifications
      } else {
        console.log("No FCM Token available.");
      }
    }).catch((error) => {
      console.log("Error getting FCM Token:", error);
    });
}

// Handle Incoming Messages (Foreground)
messaging.onMessage((payload) => {
  console.log("Message received:", payload);
  new Notification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/Images/32x32.png"
  });
});

// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('Service Worker Registered!', registration);
    })
    .catch(error => {
      console.log('Service Worker registration failed:', error);
    });
}

// Event Listeners for Buttons
document.getElementById("requestNotificationBtn").addEventListener("click", requestNotificationPermission);
document.getElementById("notifyButton").addEventListener("click", () => {
  triggerNotification("Test Notification", { body: "This is a test notification from Panni Academy." });
});

// Function to Manually Trigger Notifications
function triggerNotification(title, options) {
  if ('Notification' in window && 'serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification(title, options);
    }).catch(err => console.error('Service Worker not ready:', err));
  }
}

// Request permission on load
requestNotificationPermission();
