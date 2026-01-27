// ไฟล์: auth.js
// 1. เปลี่ยนการ import ด้านบนเป็นแบบนี้
import { auth, db } from "./firebase-config.js"; // เรียกใช้ตัวแปรจากไฟล์กลาง
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 2. ส่วน Logic คงเดิม (แต่เพิ่ม try-catch กัน Error เรื่อง Permission)
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const pass = document.getElementById('login-password').value;
        const errorDiv = document.getElementById('login-error');

        try {
            await signInWithEmailAndPassword(auth, email, pass);
            window.location.href = 'index.html';
        } catch (error) {
            console.error(error);
            errorDiv.textContent = "Invalid email or password";
            errorDiv.classList.remove('hidden');
        }
    });
}

// ระบบ Register
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const confirmPass = document.getElementById('reg-confirm').value;
        const errorDiv = document.getElementById('reg-error');

        // เช็คว่ารหัสผ่านตรงกันไหม
        if (password !== confirmPass) {
            errorDiv.textContent = "Passwords do not match!";
            errorDiv.classList.remove('hidden');
            return;
        }

        try {
            // 2.1 สร้าง User ใน Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2.2 สร้างข้อมูลใน Firestore ทันที (กำหนดสิทธิ์เป็น 'user' เสมอ)
            await setDoc(doc(db, "users", user.uid), {
                email: email,
                role: "user", // <--- จุดสำคัญ! ทุกคนที่สมัครเองจะเป็นแค่ user
                createdAt: new Date()
            });

            alert("Account created! Please login.");
            window.location.href = 'login.html';

        } catch (error) {
            console.error(error);
            let msg = "Error creating account";
            if (error.code === 'auth/email-already-in-use') msg = "Email already in use";
            else if (error.code === 'auth/weak-password') msg = "Password should be at least 6 characters";

            errorDiv.textContent = msg;
            errorDiv.classList.remove('hidden');
        }
    });
}

onAuthStateChanged(auth, async (user) => {
    const currentPage = window.location.pathname.split("/").pop();
    const isAuthPage = currentPage === 'login.html' || currentPage === 'register.html';

    // 1. ถ้ายังไม่ Login
    if (!user) {
        if (!isAuthPage) {
            window.location.href = 'login.html';
        }
        return;
    }

    // 2. ถ้า Login แล้ว (มี User)
    if (user) {
        // ถ้าเข้าหน้า Login/Register ให้ดีดไปหน้าหลัก
        if (isAuthPage) {
            window.location.href = 'index.html';
            return;
        }

        // ✅ เรียกใช้ปุ่ม Logout เสมอเมื่อ Login แล้ว (วางไว้ตรงนี้เพื่อให้ทำงานทุกหน้า)
        setupLogout();

        // ส่วนเช็คสิทธิ์เฉพาะหน้า table.html
        if (currentPage === 'table.html') {
            document.body.style.display = 'none'; // ซ่อนหน้าเว็บก่อน

            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));

                // ถ้าไม่ใช่ Admin ให้ดีดออก
                if (!userDoc.exists() || userDoc.data().role !== 'admin') {
                    alert("Access Denied: Admin Only (สำหรับผู้ดูแลระบบเท่านั้น)");
                    window.location.href = 'index.html';
                } else {
                    document.body.style.display = 'block'; // เป็น Admin จริง -> แสดงหน้าเว็บ
                }
            } catch (error) {
                console.error("Permission check error:", error);
                window.location.href = 'index.html';
            }
        }
    }
});

// ฟังก์ชันช่วยเพิ่มปุ่ม Logout ในเมนู
function setupLogout() {
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu && !document.getElementById('btn-logout')) {
        const li = document.createElement('li');
        li.innerHTML = `<a href="#" id="btn-logout" style="color: #ef4444;">Logout</a>`;
        navMenu.appendChild(li);
        document.getElementById('btn-logout').onclick = () => signOut(auth);
    }
}