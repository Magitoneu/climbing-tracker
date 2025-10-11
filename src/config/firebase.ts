import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
// import { getAnalytics } from "firebase/analytics"; // Optional for web analytics

const firebaseConfig = {
  apiKey: 'AIzaSyBJNuQB5zTw_zCpmYzQNr65ZU8qSskCEIQ',
  authDomain: 'climb-tracker-5af76.firebaseapp.com',
  projectId: 'climb-tracker-5af76',
  storageBucket: 'climb-tracker-5af76.firebasestorage.app',
  messagingSenderId: '478924932982',
  appId: '1:478924932982:web:d19a78614290bf7f799c57',
  measurementId: 'G-5MSV9Z8DRX',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Use initializeFirestore to tweak settings for React Native environment (avoid unstable WebChannel on some networks)
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
});
// export const analytics = getAnalytics(app); // Optional for web
