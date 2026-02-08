import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD8_Pkw3r4QqwlhzpOYKb457D7jpsLHrUQ",
  authDomain: "quick-mart-73d21.firebaseapp.com",
  projectId: "quick-mart-73d21",
  storageBucket: "quick-mart-73d21.firebasestorage.app",
  messagingSenderId: "244448660542",
  appId: "1:244448660542:web:b7347f449a8ed052d8956f",
  measurementId: "G-KHCM8WM3RL"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };