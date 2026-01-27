// ไฟล์: firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// การตั้งค่า Firebase ของคุณ
const firebaseConfig = {
    apiKey: "AIzaSyCSvGReWCatohjigRGVX3feyNB1d-zO8lg",
    authDomain: "shipping-calculator-e37ad.firebaseapp.com",
    projectId: "shipping-calculator-e37ad",
    storageBucket: "shipping-calculator-e37ad.firebasestorage.app",
    messagingSenderId: "408065703055",
    appId: "1:408065703055:web:d1a524be0dcdd91849c4fa"
};

// เริ่มระบบแค่ครั้งเดียวที่นี่
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ส่งออกตัวแปรไปให้ไฟล์อื่นใช้
export { auth, db };