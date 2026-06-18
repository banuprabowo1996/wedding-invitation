document.addEventListener("DOMContentLoaded", () => {
  AOS.init({
    once: true,
    duration: 1500,
  });

  const tag = "banu-rini";

  // ==================== QUERY PARAMS ====================
  const urlParams = new URLSearchParams(window.location.search);
  const nama = urlParams.get("to") || "Bapak/Ibu/Saudara/i";

  const greetingEl = document.querySelector(".cover-greeting");
  if (greetingEl) greetingEl.textContent = `Kepada ${nama}`;

  const namaInput = document.querySelector("#nama");
  if (namaInput) namaInput.value = nama;

  // ==================== COPY BUTTON ====================
  const copyBtns = document.querySelectorAll(".copyBtn");
  copyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const rekeningEl = btn.parentElement.querySelector(".bank-number");
      const rekening = rekeningEl ? rekeningEl.textContent.trim() : "";
      const originalText = btn.textContent;

      navigator.clipboard.writeText(rekening).then(() => {
        btn.textContent = "Tersalin!";
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      }).catch((err) => {
        console.error("Gagal menyalin:", err);
      });
    });
  });

  // ==================== INTERSECTION OBSERVER ====================
  const autoShowEls = document.querySelectorAll(".autoShow");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const delay = entry.target.dataset.delay || 800;
      setTimeout(() => {
        entry.target.classList.add("animate");
      }, delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  autoShowEls.forEach((el) => observer.observe(el));

  // ==================== OPEN INVITATION ====================
  const openBtn = document.getElementById("openInvitation");
  if (openBtn) {
    openBtn.addEventListener("click", enableScroll);
  }

  // ==================== MODAL ====================
  const modal = document.getElementById("giftModal");
  const modalOpen = document.getElementById("openModalBtn");
  const modalClose = document.querySelector(".modal-close");

  if (modalOpen) {
    modalOpen.onclick = () => { modal.style.display = "flex"; };
  }
  if (modalClose) {
    modalClose.onclick = () => { modal.style.display = "none"; };
  }
  window.onclick = (event) => {
    if (event.target === modal) modal.style.display = "none";
  };

  // ==================== AUDIO & SCROLL ====================
  const rootElement = document.querySelector(":root");
  const audioIconWrapper = document.querySelector(".audio-icon-wrapper");
  const song = document.querySelector("#song");
  const audioIcon = document.querySelector(".audio-icon-wrapper i");
  let isPlaying = false;

  if (audioIconWrapper) {
    audioIconWrapper.onclick = () => {
      if (isPlaying) {
        song.pause();
        if (audioIcon) {
          audioIcon.classList.remove("bi-disc");
          audioIcon.classList.add("bi-pause-circle");
        }
      } else {
        song.play();
        if (audioIcon) {
          audioIcon.classList.add("bi-disc");
          audioIcon.classList.remove("bi-pause-circle");
        }
      }
      isPlaying = !isPlaying;
    };
  }

  function disableScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    window.onscroll = () => {
      window.scrollTo(scrollLeft, scrollTop);
    };
    rootElement.style.scrollBehavior = "auto";
  }

  function playAudio() {
    if (!song || !audioIconWrapper) return;
    song.volume = 0.1;
    audioIconWrapper.style.display = "flex";
    song.play();
    isPlaying = true;
  }

  function enableScroll() {
    const sections = document.querySelectorAll(".section-2");
    sections.forEach((section) => {
      section.querySelectorAll("[data-aos]").forEach((el) => {
        el.classList.remove("aos-animate");
      });
      section.style.display = "flex";
    });

    if (sections[0]) sections[0].getBoundingClientRect();

    setTimeout(() => {
      AOS.refreshHard();
    }, 100);

    const cover = document.querySelector(".cover-section");
    if (cover) {
      setTimeout(() => {
        cover.style.display = "none";
      }, 1000);
    }

    window.onscroll = null;
    rootElement.style.scrollBehavior = "smooth";

    playAudio();
  }

  // ==================== COUNTDOWN ====================
  const targetTime = new Date(2026, 10, 29, 9, 0, 0).getTime();

  function formatTime(value) {
    return String(value).padStart(2, "0");
  }

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetTime - now;

    if (distance <= 0) {
      const cd = document.getElementById("countdown");
      if (cd) cd.innerHTML = "Waktu sudah tiba!";
      clearInterval(interval);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = formatTime(val);
    };

    setVal("days", days);
    setVal("hours", hours);
    setVal("minutes", minutes);
    setVal("seconds", seconds);
  }

  const interval = setInterval(updateCountdown, 1000);
  updateCountdown();

  // ==================== COMMENTS API ====================
  function timeAgo(dateString) {
    const now = new Date();
    const created = new Date(dateString);
    const diffMs = now - created;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 0) return `${diffDay} Day${diffDay > 1 ? "s" : ""} ago`;
    if (diffHour > 0) return `${diffHour} Hour${diffHour > 1 ? "s" : ""} ago`;
    if (diffMin > 0) return `${diffMin} Minute${diffMin > 1 ? "s" : ""} ago`;
    return "Just now";
  }

  function fetchComments() {
    fetch(`https://be-wedding-inv.onrender.com/comments?tag=${tag}`)
      .then((response) => response.json())
      .then((data) => {
        const commentList = document.getElementById("commentList");
        if (!commentList) return;
        commentList.innerHTML = "";

        data.reverse().forEach((comment) => {
          const div = document.createElement("div");
          div.classList.add("message-buble");
          div.innerHTML = `
            <p class="message-by">${comment.name}</p>
            <p class="message-content">${comment.comment}</p>
            <div class="message-time">
              <img src="img/clock.svg" alt="" />
              <span>${timeAgo(comment.created_at)}</span>
            </div>
          `;
          commentList.appendChild(div);
        });
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  }

  fetchComments();

  // ==================== SUBMIT COMMENT ====================
  const submitBtn = document.getElementById("submitButton");
  if (submitBtn) {
    submitBtn.addEventListener("click", function () {
      const name = document.getElementById("nama").value.trim();
      const comment = document.getElementById("message").value.trim();

      if (!name || !comment) {
        alert("Silakan isi nama dan ucapan terlebih dahulu");
        return;
      }

      fetch("https://be-wedding-inv.onrender.com/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, comment, tag }),
      })
        .then((response) => response.text())
        .then((data) => {
          console.log("Success:", data);
          fetchComments();
          document.getElementById("nama").value = "";
          document.getElementById("message").value = "";
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Gagal mengirim ucapan. Silakan coba lagi.");
        });
    });
  }

  // ==================== FORM SUBMIT (local fallback) ====================
  const form = document.getElementById("wishes-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
    });
  }

  // ==================== INITIAL SCROLL LOCK ====================
  disableScroll();
});
