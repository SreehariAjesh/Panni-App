let deferredPrompt;

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Request Notification Permission
function requestNotificationPermission() {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      console.log("✅ Notification permission granted.");
      getFCMToken();
    } else {
      console.log("❌ Notification permission denied.");
    }
  });
}

// Get the FCM Token and Display It
function getFCMToken() {
  messaging.getToken({ vapidKey: "BEvNfAHngb0nSlIPh3QDD7ScJ9YIM1u97FhdLAQmoWj6LHpVRNuYAgE1YOaia5M-mrpQ_PJkncGfsaWNwRTXng0" })
    .then((token) => {
      if (token) {
        console.log("✅ FCM Token:", token);
        alert("FCM Token:\n" + token); // Show in alert
        document.getElementById("fcmToken").innerText = token; // Display on page
      } else {
        alert("❌ No FCM Token available.");
      }
    }).catch((error) => {
      alert("❌ Error getting FCM Token:", error);
    });
}

// Handle Incoming Messages (Foreground)
messaging.onMessage((payload) => {
  console.log("📩 Message received:", payload);
  new Notification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/Images/32x32.png"
  });
});

// Register Service Worker for Notifications
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js')
    .then(registration => {
      console.log("✅ Service Worker Registered:", registration);
    })
    .catch(error => {
      console.log("❌ Service Worker registration failed:", error);
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
    }).catch(err => console.error("❌ Service Worker not ready:", err));
  }
}

// Request Notification Permission on Page Load
requestNotificationPermission();
