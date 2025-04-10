import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase 설정
const firebaseConfig = {
  apiKey: "AIzaSyAU3GGQzu-ONHAarQb57TK5E-sfMg7sxOU",
  authDomain: "spartaprac.firebaseapp.com",
  projectId: "spartaprac",
  storageBucket: "spartaprac.firebasestorage.app",
  messagingSenderId: "478652131986",
  appId: "1:478652131986:web:50c2b33ea95e575eaa544b",
  measurementId: "G-4L2EGT7S6C",
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  // 타이핑 효과
  const $txt = document.querySelector(".txt-title");
  const content = "안녕하세요 :)\n 반갑습니다.";
  let contentIndex = 0;

  const typing = () => {
    $txt.innerHTML += content[contentIndex];
    contentIndex++;
    if (content[contentIndex] === "\n") {
      $txt.innerHTML += "<br />";
      contentIndex++;
    }
    if (contentIndex >= content.length) {
      setTimeout(() => {
        $txt.textContent = "";
        contentIndex = 0;
      }, 2000);
    }
  };
  setInterval(typing, 200);

  // 버튼 클릭 처리
  document.querySelectorAll(".icon-none").forEach(async (btn, index) => {
    const countSpan = btn.querySelector(".heart-count");
    const burstContainer = btn.querySelector(".burst-container");
    const type = index === 0 ? "thumbs" : "hearts";

    const countRef = doc(db, "counts", type);
    const snapshot = await getDoc(countRef);
    const val = snapshot.exists() ? snapshot.data().value : 0;
    countSpan.textContent = val;

    btn.addEventListener("click", async (e) => {
      let current = parseInt(countSpan.textContent);
      let updated = current + 1;
      countSpan.textContent = updated;
      await setDoc(countRef, { value: updated });

      const rect = btn.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      for (let i = 0; i < 10; i++) {
        const burst = document.createElement("div");
        burst.className = "burst";

        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * 60 + 20;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        const colors = ["#ff6b81", "#feca57", "#48dbfb", "#1dd1a1", "#a29bfe"];
        burst.style.setProperty(
          "--color",
          colors[Math.floor(Math.random() * colors.length)]
        );
        burst.style.left = `${offsetX}px`;
        burst.style.top = `${offsetY}px`;
        burst.style.setProperty("--x", `${x}px`);
        burst.style.setProperty("--y", `${y}px`);

        burstContainer.appendChild(burst);
        setTimeout(() => burst.remove(), 700);
      }
    });
  });
});
