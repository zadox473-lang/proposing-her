"use strict";

/* ================================
   BASIC ELEMENTS
================================ */

const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const letterModal = document.getElementById("letterModal");
const celebration = document.getElementById("celebration");
const finalNo = document.getElementById("finalNo");
const heartsContainer = document.getElementById("floatingHearts");

let musicStarted = false;
let currentScreen = 1;


/* ================================
   INITIAL WEBSITE SETUP
================================ */

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".screen").forEach((screen, index) => {
    screen.classList.toggle("active", index === 0);
  });

  letterModal.classList.remove("show");
  celebration.classList.remove("show");

  tryStartMusic();
  createHearts(5);
});


/* ================================
   SCREEN CHANGE
================================ */

function showScreen(screenNumber) {
  const current = document.querySelector(".screen.active");
  const next = document.getElementById(`screen${screenNumber}`);

  if (!next || current === next) return;

  startMusic();

  if (current) {
    current.classList.remove("active");
  }

  setTimeout(() => {
    next.classList.add("active");
     if (screenNumber === 4) {
    document.querySelectorAll("#screen4 .option-btn").forEach(btn => {
        btn.style.animation = "none";
        btn.offsetHeight; // Force reflow
        btn.style.animation = "";
    });
     }
    currentScreen = screenNumber;

    createHearts(8);
  }, 180);
}

window.showScreen = showScreen;


/* ================================
   MUSIC SYSTEM
================================ */

async function tryStartMusic() {
  if (!music) return;

  music.volume = 0.65;

  try {
    await music.play();

    musicStarted = true;
    musicBtn.classList.add("playing");
  } catch (error) {
    musicStarted = false;
  }
}

async function startMusic() {
  if (!music || musicStarted) return;

  try {
    await music.play();

    musicStarted = true;
    musicBtn.classList.add("playing");
  } catch (error) {
    console.log("Music will start after user interaction.");
  }
}

document.addEventListener(
  "click",
  () => {
    startMusic();
  },
  { once: true }
);

document.addEventListener(
  "touchstart",
  () => {
    startMusic();
  },
  { once: true }
);

musicBtn.addEventListener("click", async (event) => {
  event.stopPropagation();

  if (music.paused) {
    try {
      await music.play();

      musicStarted = true;
      musicBtn.classList.add("playing");
      musicBtn.textContent = "♫";
    } catch (error) {
      console.log("Unable to start music.");
    }
  } else {
    music.pause();

    musicStarted = false;
    musicBtn.classList.remove("playing");
    musicBtn.textContent = "♪";
  }
});


/* ================================
   LETTER MODAL
================================ */

function openLetter() {
  startMusic();

  letterModal.classList.add("show");
  document.body.style.overflow = "hidden";

  createHearts(18);
}

function closeLetter() {
  letterModal.classList.remove("show");
  document.body.style.overflow = "";
}

window.openLetter = openLetter;
window.closeLetter = closeLetter;

letterModal.addEventListener("click", (event) => {
  if (event.target === letterModal) {
    closeLetter();
  }
});


/* ================================
   MOVING NO BUTTON
================================ */

function moveNoButton() {
  if (!finalNo) return;

  const letterBox = document.querySelector(".letter-box");
  const boxRect = letterBox.getBoundingClientRect();
  const buttonRect = finalNo.getBoundingClientRect();

  const maxX = Math.max(
    40,
    boxRect.width - buttonRect.width - 50
  );

  const maxY = 130;

  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY - maxY / 2;

  finalNo.style.position = "absolute";
  finalNo.style.left = `${randomX}px`;
  finalNo.style.top = "0";
  finalNo.style.transform = `translateY(${randomY}px)`;
}

if (finalNo) {
  finalNo.addEventListener("mouseenter", moveNoButton);

  finalNo.addEventListener(
    "touchstart",
    (event) => {
      event.preventDefault();
      moveNoButton();
    },
    { passive: false }
  );

  finalNo.addEventListener("click", (event) => {
    event.preventDefault();
    moveNoButton();
  });
}


/* ================================
   ACCEPT PROPOSAL
================================ */

function acceptProposal() {
  startMusic();

  letterModal.classList.remove("show");
  celebration.classList.add("show");

  document.body.style.overflow = "hidden";

  createHearts(40);

  let burstCount = 0;

  const celebrationInterval = setInterval(() => {
    createHearts(18);
    burstCount++;

    if (burstCount >= 8) {
      clearInterval(celebrationInterval);
    }
  }, 350);
}

window.acceptProposal = acceptProposal;


/* ================================
   FLOATING HEARTS
================================ */

function createHeart() {
  if (!heartsContainer) return;

  const heart = document.createElement("span");

  const symbols = [
    "💗",
    "💖",
    "💕",
    "💞",
    "❤️",
    "🌸",
    "✨"
  ];

  heart.className = "floating-heart";
  heart.textContent =
    symbols[Math.floor(Math.random() * symbols.length)];

  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${16 + Math.random() * 24}px`;
  heart.style.animationDuration = `${3.5 + Math.random() * 3}s`;
  heart.style.animationDelay = `${Math.random() * 0.5}s`;
  heart.style.opacity = `${0.65 + Math.random() * 0.35}`;

  heartsContainer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 7500);
}

function createHearts(amount = 10) {
  for (let index = 0; index < amount; index++) {
    setTimeout(() => {
      createHeart();
    }, index * 90);
  }
}

setInterval(() => {
  if (!document.hidden) {
    createHeart();
  }
}, 1600);


/* ================================
   ESCAPE KEY SUPPORT
================================ */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (letterModal.classList.contains("show")) {
      closeLetter();
    }
  }
});
