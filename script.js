// 01blue.org interactions, animated with anime.js v4 (https://animejs.com), the same version as the portfolio.
// If the library can't load, or the visitor prefers reduced motion, the page still shows, just without motion.
// When you change this file, bump ?v= on its link in index.html (Cloudflare caches it).
import { animate, stagger, utils } from "https://cdn.jsdelivr.net/npm/animejs@4.5.0/dist/bundles/anime.esm.min.js";

const root = document.documentElement;
const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
const $$ = (s) => [...document.querySelectorAll(s)];

// ---------- equaliser bars under the wordmark ----------
const eq = document.getElementById("eq");
const BARS = window.innerWidth < 500 ? 22 : 36;
for (let i = 0; i < BARS; i++) eq.append(document.createElement("i"));
const bars = $$(".eq i");

// ---------- theme: Miku (dark) and Teto (light) ----------
const button = document.getElementById("theme-toggle");
const label = document.getElementById("theme-label");
const current = () => root.dataset.theme || (systemDark.matches ? "dark" : "light");

function updateButton() {
  const next = current() === "dark" ? "light" : "dark";
  label.textContent = next === "light" ? "Teto mode" : "Miku mode";
  button.setAttribute("aria-label", `Switch to ${next === "light" ? "Teto (light)" : "Miku (dark)"} mode`);
}

function setTheme(theme) {
  root.dataset.theme = theme;
  try { localStorage.setItem("theme", theme); } catch (e) {}
  updateButton();
}

// The blinds drop in the other singer's colour, the theme swaps behind them, and they roll back up.
let switching = false;
button.addEventListener("click", () => {
  const next = current() === "dark" ? "light" : "dark";
  if (calm) { setTheme(next); return; }
  if (switching) return;
  switching = true;
  utils.set(".blinds i", { transformOrigin: "50% 0%" });
  animate(".blinds i", {
    scaleY: [0, 1],
    duration: 550,
    delay: stagger(80),
    ease: "inOutCirc",
    onComplete: () => {
      setTheme(next);
      utils.set(".blinds i", { transformOrigin: "50% 100%" });
      animate(".blinds i", {
        scaleY: [1, 0],
        duration: 550,
        delay: stagger(80, { from: "last", start: 120 }),
        ease: "inOutCirc",
        onComplete: () => { switching = false; },
      });
    },
  });
  animate("#theme-toggle svg", { rotate: "+=180", duration: 900, ease: "outElastic(1, .6)" });
});

systemDark.addEventListener("change", updateButton);
updateButton();

// ---------- a little tune when the wordmark is clicked ----------
// Five soft square-wave notes (the Vocaloid-ish synth), built with Web Audio. Only plays on a click.
let audio;
function playTune() {
  try {
    audio ||= new (window.AudioContext || window.webkitAudioContext)();
    const notes = [659.25, 783.99, 987.77, 880.0, 1318.51]; // E5 G5 B5 A5 E6
    const t0 = audio.currentTime + 0.02;
    notes.forEach((f, i) => {
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = "square";
      osc.frequency.value = f;
      const t = t0 + i * 0.11;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.05, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + (i === notes.length - 1 ? 0.5 : 0.16));
      osc.connect(gain).connect(audio.destination);
      osc.start(t);
      osc.stop(t + 0.6);
    });
  } catch (e) {}
}

const mark = document.getElementById("mark");
const letters = $$(".mark span span");
mark.addEventListener("click", () => {
  playTune();
  if (calm) return;
  animate(letters, {
    translateY: [{ to: "-0.14em", duration: 160, ease: "outQuad" }, { to: 0, duration: 700, ease: "outElastic(1, .45)" }],
    delay: stagger(55),
  });
  animate(bars, {
    scaleY: [{ to: 1, duration: 120 }, { to: 0.3, duration: 600, ease: "outQuad" }],
    delay: stagger(18, { from: "first" }),
  });
});

if (!calm) {
  // ---------- page load: one sequence, top to bottom ----------
  const cards = $$(".card");
  utils.set(letters, { opacity: 0, translateY: "0.45em" });
  utils.set(bars, { scaleY: 0.02 });
  utils.set(".intro, .likes li, .group h2, .foot", { opacity: 0, translateY: 14 });
  utils.set(cards, { opacity: 0, translateY: 30, rotateX: 8 });
  utils.set(".new", { scale: 0 });

  animate(letters, { opacity: 1, translateY: 0, duration: 900, delay: stagger(60, { start: 100 }), ease: "outElastic(1, .7)" });
  animate(bars, {
    scaleY: () => utils.random(0.2, 0.9, 2),
    duration: 600,
    delay: stagger(15, { start: 400, from: "center" }),
    ease: "outExpo",
    onComplete: () => bars.forEach(dance),
  });
  animate(".intro", { opacity: 1, translateY: 0, duration: 700, delay: 500, ease: "outExpo" });
  animate(".likes li", { opacity: 1, translateY: 0, duration: 600, delay: stagger(50, { start: 600 }), ease: "outBack(1.6)" });
  animate(".group h2", { opacity: 1, translateY: 0, duration: 600, delay: stagger(200, { start: 750 }), ease: "outExpo" });
  animate(cards, { opacity: 1, translateY: 0, rotateX: 0, duration: 900, delay: stagger(80, { start: 820 }), ease: "outExpo" });
  animate(".foot", { opacity: 1, translateY: 0, duration: 600, delay: 1400, ease: "outExpo" });
  animate(".new", { scale: 1, duration: 800, delay: 1500, ease: "outElastic(1, .5)" });

  // Each bar keeps bouncing to its own random level, like a quiet music visualiser.
  function dance(bar) {
    animate(bar, {
      scaleY: utils.random(0.12, 0.95, 2),
      duration: utils.random(260, 620),
      ease: "inOutSine",
      onComplete: () => dance(bar),
    });
  }

  // ---------- wordmark letters stretch wide under the pointer, then spring back ----------
  letters.forEach((letter) => {
    const shape = { wdth: 75 };
    const draw = () => { letter.style.fontVariationSettings = `"wdth" ${shape.wdth}`; };
    letter.addEventListener("pointerenter", () => {
      animate(shape, {
        wdth: 100,
        duration: 220,
        ease: "outQuad",
        onUpdate: draw,
        onComplete: () => animate(shape, { wdth: 75, duration: 1100, ease: "outElastic(1, .35)", onUpdate: draw }),
      });
    });
  });

  // ---------- glass cards: spotlight follows the pointer, card tilts toward it ----------
  cards.forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
      animate(card, {
        rotateX: ((r.height / 2 - y) / r.height) * 8,
        rotateY: ((x - r.width / 2) / r.width) * 8,
        scale: 1.02,
        duration: 400,
        ease: "outQuad",
      });
    });
    card.addEventListener("pointerleave", () => {
      animate(card, { rotateX: 0, rotateY: 0, scale: 1, duration: 900, ease: "outElastic(1, .5)" });
    });
  });

  // ---------- living background: drifting motes and the odd music note ----------
  const field = document.querySelector(".motes");
  const COUNT = window.innerWidth < 600 ? 14 : 26;
  const NOTES = ["♪", "♫", "♩"];
  for (let i = 0; i < COUNT; i++) {
    const m = document.createElement("span");
    m.className = "mote";
    if (i % 5 === 0) { m.classList.add("note"); m.textContent = NOTES[i % 3]; }
    field.append(m);
    drift(m, true);
  }

  function drift(m, first) {
    const w = window.innerWidth, h = window.innerHeight;
    const x = utils.random(0, w), y = utils.random(0, h);
    const layer = utils.random(1, 3);
    utils.set(m, { translateX: x, translateY: y, scale: layer * 0.6, opacity: 0 });
    animate(m, {
      translateX: x + utils.random(-120, 120),
      translateY: y - utils.random(80, 260),
      opacity: [{ to: 0.15 + layer * 0.12 }, { to: 0 }],
      rotate: m.classList.contains("note") ? utils.random(-25, 25) : 0,
      duration: utils.random(6000, 11000),
      delay: first ? utils.random(0, 4000) : 0,
      ease: "linear",
      onComplete: () => drift(m, false),
    });
  }

  // The floor grid leans gently with the mouse.
  const grid = document.querySelector(".grid");
  window.addEventListener("pointermove", (e) => {
    grid.style.setProperty("--gx", `${(e.clientX - innerWidth / 2) * -0.03}px`);
    grid.style.setProperty("--gy", `${(e.clientY - innerHeight / 2) * -0.02}px`);
  }, { passive: true });
}
