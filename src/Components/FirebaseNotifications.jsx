import { messaging } from "../firebase";
import { getToken, onMessage } from "firebase/messaging";
import { store } from "../redux/store";
import { addNotification } from "../redux/slices/notificationSlice";

const API_URL = "https://fornix-medical.vercel.app/api/v1/user/device-token";

// Ask notification permission
export const requestNotificationPermission = async (userId) => {

  try {

    const permission = await Notification.requestPermission();

    if (permission === "granted") {

      const token = await getToken(messaging, {
        vapidKey: "BOYYUuvr0DOt-c5eQ39ZLoI5y8-K6YWLfbmCFzjd3kbwb5I5xG1-G48YdB32OnaRkPf3hWDgTnVOXQa8WwHvXEY"
      });

      

      // 🔵 SEND TOKEN TO BACKEND
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: userId,
          fcm_token: token
        })
      });

      

      return token;

    } 
    else {
      
    }

  } catch (error) {
    
  }

};


// Listen for notifications when app is open
export const listenForMessages = () => {

  onMessage(messaging, (payload) => {

    

    // Update Redux state in real-time
    store.dispatch(addNotification({
      id: payload.messageId || Date.now(),
      title: payload.notification.title,
      message: payload.notification.body,
      is_read: false,
      created_at: new Date().toISOString()
    }));

    // Show browser notification
    new Notification(payload.notification.title, {
      body: payload.notification.body
    });

  });

};