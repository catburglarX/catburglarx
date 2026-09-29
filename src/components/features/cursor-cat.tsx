"use client";

import { useEffect, useRef, useState } from "react";
import { CatSitting, CatSleeping, CatWalking } from "@/components/mascot/cat";

type Pose = "walk" | "sit" | "sleep";

const SIZE = 48;
const EASE = 0.09;
const STOP_DISTANCE = 10;
const SLEEP_AFTER_MS = 5000;
const FRAME_MS = 160;

// Follows the mouse with easing. Never takes pointer events, stops its loop
// while the tab is hidden, and is only mounted for fine pointers without
// reduced motion (see AppProvider).
export default function CursorCat() {
  const el = useRef<HTMLDivElement>(null);
  const [pose, setPose] = useState<Pose>("sleep");
  const [frame, setFrame] = useState<0 | 1>(0);
  const [facingRight, setFacingRight] = useState(false);

  useEffect(() => {
    const node = el.current;
    if (!node) return;

    let x = window.innerWidth - 80;
    let y = window.innerHeight - 140;
    let targetX = x;
    let targetY = y;
    let lastMove = performance.now() - SLEEP_AFTER_MS;
    let lastFrame = 0;
    let raf = 0;
    let currentPose: Pose = "sleep";
    let currentRight = false;

    const setPoseOnce = (next: Pose) => {
      if (next !== currentPose) {
        currentPose = next;
        setPose(next);
      }
    };

    const tick = (now: number) => {
      const dx = targetX - x;
      const dy = targetY - y;
      const distance = Math.hypot(dx, dy);
      if (distance > STOP_DISTANCE) {
        x += dx * EASE;
        y += dy * EASE;
        setPoseOnce("walk");
        const right = dx > 0;
        if (right !== currentRight && Math.abs(dx) > 4) {
          currentRight = right;
          setFacingRight(right);
        }
        if (now - lastFrame > FRAME_MS) {
          lastFrame = now;
          setFrame((f) => (f === 0 ? 1 : 0));
        }
      } else {
        setPoseOnce(now - lastMove > SLEEP_AFTER_MS ? "sleep" : "sit");
      }
      node.style.transform = `translate3d(${(x - SIZE / 2).toFixed(1)}px, ${(y - SIZE).toFixed(1)}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      // Sit a little behind and below the pointer so it never covers what you point at.
      targetX = event.clientX + 26;
      targetY = event.clientY + 34;
      lastMove = performance.now();
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      ref={el}
      aria-hidden="true"
      className="motion-decor no-print pointer-events-none fixed top-0 left-0 z-[90] will-change-transform"
      style={{ width: SIZE, height: SIZE }}
    >
      <div
        className="relative size-full"
        style={{ transform: facingRight ? "scaleX(-1)" : undefined }}
      >
        {pose === "walk" && <CatWalking frame={frame} className="size-full drop-shadow-sm" />}
        {pose === "sit" && <CatSitting className="size-full drop-shadow-sm" />}
        {pose === "sleep" && <CatSleeping className="size-full drop-shadow-sm" />}
      </div>
      {pose === "sleep" && (
        <span className="absolute -top-3 right-0 [animation:zzz_1.8s_ease-in-out_infinite] font-heading text-xs font-semibold text-primary">
          z z
        </span>
      )}
    </div>
  );
}
