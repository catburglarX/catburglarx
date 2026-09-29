import type { CSSProperties } from "react";

// Soft colour blobs and slowly rising 0s and 1s. Plain CSS, 17 moving pieces
// in total, animating transform and opacity only. Hidden for reduced motion
// and in print. Positions are fixed numbers so server and client agree.
const BITS: Array<{
  left: number;
  size: number;
  dur: number;
  delay: number;
  o: number;
  sway: number;
  glyph: string;
}> = [
  { left: 4, size: 13, dur: 26, delay: -3, o: 0.5, sway: 20, glyph: "1" },
  { left: 12, size: 17, dur: 31, delay: -18, o: 0.35, sway: -24, glyph: "0" },
  { left: 21, size: 12, dur: 24, delay: -9, o: 0.45, sway: 16, glyph: "1" },
  { left: 33, size: 15, dur: 29, delay: -22, o: 0.3, sway: -18, glyph: "0" },
  { left: 45, size: 11, dur: 27, delay: -5, o: 0.4, sway: 26, glyph: "1" },
  { left: 57, size: 16, dur: 33, delay: -14, o: 0.3, sway: -20, glyph: "0" },
  { left: 66, size: 12, dur: 25, delay: -20, o: 0.45, sway: 14, glyph: "0" },
  { left: 75, size: 18, dur: 30, delay: -7, o: 0.3, sway: -26, glyph: "1" },
  { left: 84, size: 13, dur: 28, delay: -25, o: 0.45, sway: 18, glyph: "0" },
  { left: 92, size: 15, dur: 32, delay: -11, o: 0.35, sway: -16, glyph: "1" },
  { left: 28, size: 10, dur: 35, delay: -30, o: 0.4, sway: 12, glyph: "1" },
  { left: 71, size: 10, dur: 36, delay: -2, o: 0.4, sway: -12, glyph: "0" },
  { left: 50, size: 14, dur: 34, delay: -27, o: 0.3, sway: 22, glyph: "1" },
  { left: 97, size: 11, dur: 29, delay: -16, o: 0.35, sway: -14, glyph: "0" },
];

export function Background() {
  return (
    <div
      aria-hidden="true"
      className="no-print pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="motion-decor">
        <div className="blob -top-[14vmax] -left-[14vmax] bg-[radial-gradient(circle,var(--blob-1)_0%,transparent_65%)]" />
        <div className="blob top-[20vh] -right-[18vmax] bg-[radial-gradient(circle,var(--blob-2)_0%,transparent_65%)] [animation-delay:-8s] [animation-duration:32s]" />
        <div className="blob -bottom-[20vmax] left-[10vw] bg-[radial-gradient(circle,var(--blob-3)_0%,transparent_65%)] [animation-delay:-14s] [animation-duration:38s]" />
        {BITS.map((bit) => (
          <span
            key={`${bit.left}-${bit.delay}`}
            className="bit"
            style={
              {
                left: `${bit.left}%`,
                fontSize: `${bit.size}px`,
                "--dur": `${bit.dur}s`,
                "--delay": `${bit.delay}s`,
                "--o": bit.o,
                "--sway": `${bit.sway}px`,
              } as CSSProperties
            }
          >
            {bit.glyph}
          </span>
        ))}
      </div>
    </div>
  );
}
