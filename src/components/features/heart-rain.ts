import { HEART_COLOURS, HEART_SVG } from "./hearts";

const COUNT = 28;

/** The command menu easter egg. Hearts fall once and remove themselves. */
export function rainHearts() {
  for (let i = 0; i < COUNT; i += 1) {
    const heart = document.createElement("span");
    const size = 12 + Math.round(Math.random() * 14);
    heart.setAttribute("aria-hidden", "true");
    heart.innerHTML = HEART_SVG;
    Object.assign(heart.style, {
      position: "fixed",
      top: "-40px",
      left: `${(Math.random() * 100).toFixed(2)}vw`,
      width: `${size}px`,
      height: `${size}px`,
      zIndex: "96",
      pointerEvents: "none",
      color: HEART_COLOURS[i % HEART_COLOURS.length],
      animation: `fall ${(2.4 + Math.random() * 1.8).toFixed(2)}s linear ${(Math.random() * 1.2).toFixed(2)}s forwards`,
    });
    heart.style.setProperty("--sway", `${Math.round(Math.random() * 80 - 40)}px`);
    heart.style.setProperty("--rot", `${Math.round(Math.random() * 200 - 100)}deg`);
    heart.addEventListener("animationend", () => heart.remove(), { once: true });
    document.body.appendChild(heart);
  }
}
