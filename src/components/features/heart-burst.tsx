"use client";

import { useEffect } from "react";
import { HEART_COLOURS, HEART_SVG } from "./hearts";

const COUNT = 6;

/** A small, quiet puff of hearts where the mouse clicks. Mouse only. */
export default function HeartBurst() {
  useEffect(() => {
    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const target = event.target as Element | null;
      if (target?.closest("[role=dialog], input, textarea")) return;

      for (let i = 0; i < COUNT; i += 1) {
        const heart = document.createElement("span");
        const angle = (Math.PI * 2 * i) / COUNT + Math.random() * 0.5;
        const distance = 18 + Math.random() * 16;
        heart.setAttribute("aria-hidden", "true");
        heart.innerHTML = HEART_SVG;
        Object.assign(heart.style, {
          position: "fixed",
          left: `${event.clientX}px`,
          top: `${event.clientY}px`,
          width: "10px",
          height: "10px",
          zIndex: "95",
          pointerEvents: "none",
          color: HEART_COLOURS[i % HEART_COLOURS.length],
          animation: "burst 650ms cubic-bezier(0.2, 0.7, 0.3, 1) forwards",
        });
        heart.style.setProperty("--dx", `${(Math.cos(angle) * distance).toFixed(1)}px`);
        heart.style.setProperty("--dy", `${(Math.sin(angle) * distance).toFixed(1)}px`);
        heart.addEventListener("animationend", () => heart.remove(), { once: true });
        document.body.appendChild(heart);
      }
    };
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  return null;
}
