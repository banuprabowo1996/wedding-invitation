document.addEventListener("DOMContentLoaded", () => {
  // copy button
  const copyBtns = document.querySelectorAll(".copyBtn");

  copyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const rekeningEl = btn.parentElement.querySelector(".bank-account");
      const rekening = rekeningEl.textContent.trim();

      navigator.clipboard
        .writeText(rekening)
        .then(() => {
          btn.textContent = "Copied!";
          setTimeout(() => {
            btn.textContent = "Copy Rekening";
          }, 2000);
        })
        .catch((err) => {
          console.error("Gagal menyalin teks:", err);
        });
    });
  });

  // delay animation
  const autoShowEls = document.querySelectorAll(".autoShow");
  const fadeUpEls = document.querySelectorAll(".timeline-item.fadeUp");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        if (entry.target.classList.contains("autoShow")) {
          // Delay fixed 1.5s untuk autoShow
          setTimeout(() => {
            entry.target.classList.add("animate");
          }, 1500);
        }

        if (entry.target.classList.contains("fadeUp")) {
          // Delay berdasarkan urutan untuk fadeUp
          const index = [...fadeUpEls].indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add("animate");
          }, index * 500); // 0.5s antar item
        }

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.2 }
  );

  autoShowEls.forEach((el) => observer.observe(el));
  fadeUpEls.forEach((el) => observer.observe(el));

  // === Open invitation button ===
  const openInvitationBtn = document.getElementById("openInvitation");

  if (openInvitationBtn) {
    openInvitationBtn.addEventListener("click", (e) => {
      enableScroll();
    });
  }

  // === Modal popup ===
  const modal = document.getElementById("myModal");
  const openBtn = document.getElementById("openModalBtn");
  const closeBtn = document.querySelector(".close");

  openBtn.onclick = function () {
    modal.style.display = "block";
  };

  closeBtn.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // === Audio & Scroll ===
  const rootElement = document.querySelector(":root");
  const audioIconWrapper = document.querySelector(".audio-icon-wrapper");
  const song = document.querySelector("#song");
  const audioIcon = document.querySelector(".audio-icon-wrapper i");

  function disableScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;

    window.onscroll = function () {
      window.scrollTo(scrollLeft, scrollTop);
    };

    rootElement.style.scrollBehavior = "auto";
  }

  function playAudio() {
    song.volume = 0.1;
    audioIconWrapper.style.display = "flex";
    song.play();
    isPlaying = true;
  }

  function enableScroll() {
    window.onscroll = function () {};
    rootElement.style.scrollBehavior = "smooth";

    const sections = document.querySelectorAll(".section-2");
    sections.forEach((section) => {
      section.style.display = "block";
    });

    // Pastikan AOS refresh setelah display:block
    setTimeout(() => {
      AOS.refresh();
    }, 50); // jeda biar DOM sempat update

    playAudio();
  }

  // === Countdown ===
  const targetTime = new Date(2025, 9, 6, 0, 0, 0).getTime(); // 6 Okt 2025

  function formatTime(value) {
    return String(value).padStart(2, "0");
  }

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetTime - now;

    if (distance <= 0) {
      document.getElementById("countdown").innerHTML = "Waktu sudah lewat!";
      clearInterval(interval);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = formatTime(days);
    document.getElementById("hours").textContent = formatTime(hours);
    document.getElementById("minutes").textContent = formatTime(minutes);
    document.getElementById("seconds").textContent = formatTime(seconds);
  }

  const interval = setInterval(updateCountdown, 1000);
  updateCountdown();
});
