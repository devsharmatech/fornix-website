importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAWEHad0OcD-Pr9nEwe_RdQhgkqWIj_Gwo",
  authDomain: "fornix-1dad5.firebaseapp.com",
  projectId: "fornix-1dad5",
  storageBucket: "fornix-1dad5.firebasestorage.app",
  messagingSenderId: "197827513183",
  appId: "1:197827513183:web:c249385db56fe2d6ca44ea"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {

  console.log("Background notification:", payload);

  const notificationTitle = payload.notification.title;

  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo192.png"
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );

});