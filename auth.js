// ไฟล์: auth.js
import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ส่วน Login Form (คงเดิม)
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

// ส่วน Register Form (ถ้ามี)
const regForm = document.getElementById('register-form');
if (regForm) {
    regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('reg-email').value;
        const pass = document.getElementById('reg-password').value;
        const confirm = document.getElementById('reg-confirm').value;
        const errorDiv = document.getElementById('reg-error');

        if (pass !== confirm) {
            errorDiv.textContent = "Passwords do not match";
            errorDiv.classList.remove('hidden');
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            // สร้าง User Doc เก็บ Role (default: user)
            await setDoc(doc(db, "users", userCredential.user.uid), {
                email: email,
                role: 'user',
                createdAt: new Date()
            });
            alert("Registration Successful!");
            window.location.href = 'index.html';
        } catch (error) {
            console.error(error);
            errorDiv.textContent = error.message;
            errorDiv.classList.remove('hidden');
        }
    });
}

onAuthStateChanged(auth, async (user) => {
    const currentPage = window.location.pathname.split("/").pop();
    // [แก้ไข] กำหนดหน้า Auth ให้ชัดเจน (รวม login.html และ register.html)
    const isAuthPage = ['login.html', 'register.html'].includes(currentPage);

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

        // ✅ เรียกใช้ฟังก์ชันแสดงปุ่ม Logout
        setupLogout();

        // ส่วนเช็คสิทธิ์เฉพาะหน้า table.html (คงเดิม)
        if (currentPage === 'table.html') {
            document.body.style.display = 'none'; 
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (!userDoc.exists() || userDoc.data().role !== 'admin') {
                    alert("Access Denied: Admin Only (สำหรับผู้ดูแลระบบเท่านั้น)");
                    window.location.href = 'index.html';
                } else {
                    document.body.style.display = 'block'; 
                }
            } catch (error) {
                console.error("Permission check error:", error);
                window.location.href = 'index.html';
            }
        }
    }
});

// [ปรับปรุง] ฟังก์ชันจัดการปุ่ม Logout
function setupLogout() {
    const logoutLi = document.getElementById('nav-logout'); // หา <li> ที่เราเพิ่มใน HTML
    const logoutBtn = document.getElementById('btn-logout');

    // กรณี 1: มีปุ่มใน HTML (ที่เราเพิ่งเพิ่ม) -> ให้แสดงปุ่มนั้น
    if (logoutLi) {
        logoutLi.classList.remove('hidden');
    } 
    // กรณี 2: ไม่มีปุ่มใน HTML (Fallback) -> สร้างใหม่ด้วย JS เหมือนเดิม
    else if (!logoutBtn) {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            const li = document.createElement('li');
            li.innerHTML = `<a href="#" id="btn-logout" style="color: #ef4444; font-weight: bold;">Logout</a>`;
            navMenu.appendChild(li);
        }
    }

    // ผูก Event Click ให้ทำงาน
    const finalBtn = document.getElementById('btn-logout');
    if (finalBtn) {
        finalBtn.onclick = (e) => {
            e.preventDefault(); // ป้องกันการดีดขึ้นบนสุดของหน้า
            signOut(auth).then(() => {
                window.location.href = 'login.html'; // Logout เสร็จให้ไปหน้า Login
            });
        };
    }
}