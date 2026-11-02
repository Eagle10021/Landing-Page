// 01blue.org interactions. Animations use anime.js v4 (https://animejs.com), the same version as the portfolio.
// If the library can't load, or the visitor prefers reduced motion, the page simply shows without animation.
import { animate, stagger, utils } from "https://cdn.jsdelivr.net/npm/animejs@4.5.0/dist/bundles/anime.esm.min.js";

const root = document.documentElement;
const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
const BG = { dark: "#0b2e6f", light: "#eef3fb" };

// ---------- theme toggle ----------
const button = document.getElementById("theme-toggle");
const label = document.getElementById("theme-label");
const current = () => root.dataset.theme || (systemDark.matches ? "dark" : "light");

function updateButton() {
  const next = current() === "dark" ? "light" : "dark";
  label.textContent = next === "light" ? "Light mode" : "Dark mode";
  button.setAttribute("aria-label", `Switch to ${next} mode`);
}

function setTheme(theme) {
  root.dataset.theme = theme;
  try { localStorage.setItem("theme", theme); } catch (e) {}
  updateButton();
}

// A circle of the new background grows out of the button, the theme swaps under it, then it fades away.
let switching = false;
button.addEventListener("click", () => {
  const next = current() === "dark" ? "light" : "dark";
  if (calm) { setTheme(next); return; }
  if (switching) return;
  switching = true;

  const r = button.getBoundingClientRect();
  const x = r.left + r.width / 2, y = r.top + r.height / 2;
  const reach = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const wipe = document.createElement("div");
  wipe.className = "wipe";
  Object.assign(wipe.style, {
    width: reach * 2 + "px", height: reach * 2 + "px",
    left: x - reach + "px", top: y - reach + "px",
    background: BG[next],
  });
  document.body.append(wipe);

  animate(wipe, {
    scale: [0, 1],
    duration: 650,
    ease: "inOutQuart",
    onComplete: () => {
      setTheme(next);
      animate(wipe, {
        opacity: [1, 0],
        duration: 350,
        ease: "outQuad",
        onComplete: () => { wipe.remove(); switching = false; },
      });
    },
  });
  animate("#theme-toggle svg", { rotate: "+=180", duration: 900, ease: "outElastic(1, .6)" });
});

systemDark.addEventListener("change", updateButton);
updateButton();

if (!calm) {
  // ---------- page load: one sequence, top to bottom ----------
  const letters = document.querySelectorAll(".mark span");
  const rows = document.querySelectorAll(".row");
  utils.set(letters, { opacity: 0, translateY: "0.45em" });
  utils.set(".intro, .group h2, .foot", { opacity: 0, translateY: 14 });
  utils.set(rows, { opacity: 0, translateX: -18 });
  utils.set(".new", { scale: 0 });

  animate(letters, {
    opacity: 1,
    translateY: 0,
    duration: 900,
    delay: stagger(60, { start: 100 }),
    ease: "outElastic(1, .7)",
  });
  animate(".intro", { opacity: 1, translateY: 0, duration: 700, delay: 450, ease: "outExpo" });
  animate(".group h2", { opacity: 1, translateY: 0, duration: 600, delay: stagger(180, { start: 650 }), ease: "outExpo" });
  animate(rows, { opacity: 1, translateX: 0, duration: 700, delay: stagger(70, { start: 720 }), ease: "outExpo" });
  animate(".foot", { opacity: 1, translateY: 0, duration: 600, delay: 1200, ease: "outExpo" });
  animate(".new", { scale: 1, duration: 800, delay: 1300, ease: "outElastic(1, .5)" });

  // ---------- the wordmark stretches wide under the pointer, then springs back ----------
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
      animate(letter, { translateY: ["-0.06em", 0], duration: 900, ease: "outElastic(1, .4)" });
    });
  });

  // ---------- project names nudge toward the pointer ----------
  rows.forEach((row) => {
    const name = row.querySelector(".name");
    row.addEventListener("pointerenter", () => animate(name, { translateX: 8, duration: 500, ease: "outElastic(1, .6)" }));
    row.addEventListener("pointerleave", () => animate(name, { translateX: 0, duration: 400, ease: "outExpo" }));
  });
}
