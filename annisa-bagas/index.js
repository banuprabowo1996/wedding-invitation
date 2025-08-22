document.addEventListener("DOMContentLoaded", () => {
  // AOS
  AOS.init({
    once: true, // biar animasi jalan sekali
    duration: 5000,
  });

  // query params
  const urlParams = new URLSearchParams(window.location.search);
  const nama = urlParams.get("to") || "Bapak/Ibu/Saudara/i";

  const namaContainer = document.querySelector(".cover h5");
  namaContainer.innerText = `${nama}`;

  document.querySelector("#nama").value = nama;

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
          // Delay fixed 1s untuk autoShow
          setTimeout(() => {
            entry.target.classList.add("animate");
          }, 1000);
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
    const sections = document.querySelectorAll(".section-2");

    sections.forEach((section) => {
      // Reset atribut AOS agar dianggap fresh
      section.querySelectorAll("[data-aos]").forEach((el) => {
        el.classList.remove("aos-animate");
      });

      section.style.display = "block"; // munculkan
    });

    // Paksa browser render dulu
    sections[0].getBoundingClientRect();

    // Baru refresh AOS
    setTimeout(() => {
      AOS.refreshHard();
    }, 100);

    // Hilangkan cover
    const cover = document.querySelector(".section:not(.section-2)");
    if (cover) {
      setTimeout(() => {
        cover.style.display = "none";
      }, 1000);
    }

    playAudio();
  }

  // === Countdown ===
  const targetTime = new Date(2025, 8, 6, 9, 0, 0).getTime(); // 6 sept 2025

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

  // fetch comments when the page loads
  const tag = "annisa-bagas";

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
        commentList.innerHTML = ""; // Clear existing comments

        data.reverse().forEach((comment) => {
          const div = document.createElement("div");
          div.classList.add("message-buble");
          div.innerHTML = `
            <p class="message-by">${comment.name}</p>
            <p class="message-content crimson-pro mt-2">
              ${comment.comment}
            </p>
            <div class="message-time mt-4">
              <img src="img/clock.svg" alt="" />
              <p>${timeAgo(comment.created_at)}</p>
            </div>
          `;
          commentList.appendChild(div);
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  fetchComments();

  const submitBtn = document.getElementById("submitButton");
  if (submitBtn) {
    submitBtn.addEventListener("click", function () {
      const name = document.getElementById("nama").value.trim();
      const comment = document.getElementById("message").value.trim();

      if (!name || !comment) {
        alert("Silahkan isi name dan comment terlebih dahulu");
        return;
      }

      fetch("https://be-wedding-inv.onrender.com/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, comment, tag }),
      })
        .then((response) => response.text())
        .then((data) => {
          console.log("Success:", data);
          alert("Comment submitted successfully!");
          fetchComments(); // refresh list
          // Clear form inputs
          document.getElementById("nama").value = "";
          document.getElementById("message").value = "";
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("There was an error submitting your comment.");
        });
    });
  }

  const form = document.getElementById("my-form");
  const input = document.getElementById("nama");
  const comments = document.getElementById("comments");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // ⛔ hentikan reload default

    const text = input.value.trim();
    if (!text) return;

    // bikin elemen comment baru
    const div = document.createElement("div");
    div.classList.add("message-buble");
    div.innerHTML = `
      <p class="message-by">You</p>
      <p class="message-content crimson-pro mt-2">${text}</p>
      <div class="message-time">
        <img src="img/clock.svg" alt="" />
        <p>Just now</p>
      </div>
    `;

    comments.appendChild(div);
    input.value = ""; // reset input
  });
});
