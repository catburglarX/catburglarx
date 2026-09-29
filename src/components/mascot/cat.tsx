import type { SVGProps } from "react";

// One cat, drawn once. Every mascot on the site is built from <Head> so the
// face, line weight and palette always match the avatar.
export const CAT = {
  fur: "#fff8ee",
  outline: "#ecc0cf",
  ear: "#f7b3c8",
  eye: "#43303d",
  cheek: "#f7a8c0",
  nose: "#f06a9f",
  whisker: "#8a7380",
  brace: "#5fb5a8",
  pink: "#ffc2d4",
  heart: "#f48fb1",
} as const;

const LINE = { stroke: CAT.outline, strokeWidth: 1.6, strokeLinejoin: "round" } as const;

type SvgProps = Omit<SVGProps<SVGSVGElement>, "children">;

/** The head in a 100 by 90 box. `eyes="closed"` draws sleepy arcs. */
export function Head({
  eyes = "open",
  blink = false,
  whiskers = true,
}: {
  eyes?: "open" | "closed";
  blink?: boolean;
  whiskers?: boolean;
}) {
  return (
    <g>
      <path d="M16 48 23.6 12.4Q25 7.6 29.6 10.6L50 26Z" fill={CAT.fur} {...LINE} />
      <path d="M84 48 76.4 12.4Q75 7.6 70.4 10.6L50 26Z" fill={CAT.fur} {...LINE} />
      <path d="M24.6 37 27.4 17.6 41.4 27.6Z" fill={CAT.ear} />
      <path d="M75.4 37 72.6 17.6 58.6 27.6Z" fill={CAT.ear} />
      <ellipse cx="50" cy="55" rx="38" ry="32" fill={CAT.fur} {...LINE} />
      {whiskers && (
        <g stroke={CAT.whisker} strokeWidth="1.5" strokeLinecap="round" opacity="0.8">
          <path d="M19 59 6 56.5M19 63.5H5M19 68 6 71" />
          <path d="M81 59 94 56.5M81 63.5H95M81 68 94 71" />
        </g>
      )}
      <ellipse cx="28" cy="67" rx="6.4" ry="3.8" fill={CAT.cheek} opacity="0.9" />
      <ellipse cx="72" cy="67" rx="6.4" ry="3.8" fill={CAT.cheek} opacity="0.9" />
      {eyes === "open" ? (
        <g className={blink ? "animate-blink-eye" : undefined}>
          <ellipse cx="36" cy="56" rx="6.4" ry="7.4" fill={CAT.eye} />
          <circle cx="38.2" cy="53" r="2.3" fill="#fff" />
          <circle cx="34.4" cy="59.6" r="1" fill="#fff" />
          <ellipse cx="64" cy="56" rx="6.4" ry="7.4" fill={CAT.eye} />
          <circle cx="66.2" cy="53" r="2.3" fill="#fff" />
          <circle cx="62.4" cy="59.6" r="1" fill="#fff" />
        </g>
      ) : (
        <path
          d="M30 57Q36 61.5 42 57M58 57Q64 61.5 70 57"
          fill="none"
          stroke={CAT.eye}
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
      <path d="M50 67.4C46.6 64.9 47.5 61.6 50 63.3 52.5 61.6 53.4 64.9 50 67.4Z" fill={CAT.nose} />
      <path
        d="M44.6 68.8Q47.3 71.8 50 69 52.7 71.8 55.4 68.8"
        fill="none"
        stroke={CAT.eye}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </g>
  );
}

function Heart({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0 3.4C-5 -.4-3.6-5.8 0-3 3.6-5.8 5-.4 0 3.4Z"
      fill={CAT.heart}
    />
  );
}

function Sparkle({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0-6 1.5-1.5 6 0 1.5 1.5 0 6-1.5 1.5-6 0-1.5-1.5Z"
      fill="#fff"
      opacity="0.9"
    />
  );
}

const DIGITS: Array<[number, number, string]> = [
  [44, 34, "1"],
  [74, 26, "1 0"],
  [124, 30, "1"],
  [150, 42, "0 1"],
  [30, 64, "0"],
  [160, 76, "0"],
  [26, 150, "1"],
  [168, 138, "0"],
  [58, 172, "0"],
  [96, 178, "1 0"],
  [138, 166, "1"],
];

/** The full brand avatar: the cat between teal braces on a pink circle. */
export function CatAvatar({ blink = false, ...props }: SvgProps & { blink?: boolean }) {
  return (
    <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false" {...props}>
      <circle cx="100" cy="100" r="100" fill={CAT.pink} />
      <g
        fill="#fff"
        opacity="0.55"
        fontFamily="ui-monospace, monospace"
        fontSize="11"
        fontWeight="700"
      >
        {DIGITS.map(([x, y, t]) => (
          <text key={`${x}-${y}`} x={x} y={y}>
            {t}
          </text>
        ))}
      </g>
      <Heart x={44} y={50} s={1.3} />
      <Heart x={154} y={54} s={1.6} />
      <Heart x={160} y={138} s={1.1} />
      <Sparkle x={144} y={40} s={0.9} />
      <Sparkle x={58} y={148} s={1.1} />
      <g
        fill="none"
        stroke={CAT.brace}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M40 62C31 62 30 67 30 76V90C30 96 27 100 21 100 27 100 30 104 30 110V124C30 133 31 138 40 138" />
        <path d="M160 62C169 62 170 67 170 76V90C170 96 173 100 179 100 173 100 170 104 170 110V124C170 133 169 138 160 138" />
      </g>
      <g transform="translate(47 50) scale(1.06)">
        <Head blink={blink} />
      </g>
    </svg>
  );
}

/** Head only, for the logo. */
export function CatMark(props: SvgProps) {
  return (
    <svg viewBox="2 4 96 86" aria-hidden="true" focusable="false" {...props}>
      <Head whiskers={false} />
    </svg>
  );
}

/** Sitting cat that perches on the contact card. */
export function CatSitting({ blink = false, ...props }: SvgProps & { blink?: boolean }) {
  return (
    <svg viewBox="0 0 110 118" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M78 106C98 108 104 94 97 84"
        fill="none"
        stroke={CAT.outline}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M78 106C98 108 104 94 97 84"
        fill="none"
        stroke={CAT.fur}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path d="M30 78C24 96 26 112 42 112H68C84 112 86 96 80 78Z" fill={CAT.fur} {...LINE} />
      <ellipse cx="44" cy="112" rx="8" ry="4.6" fill={CAT.fur} {...LINE} />
      <ellipse cx="66" cy="112" rx="8" ry="4.6" fill={CAT.fur} {...LINE} />
      <g transform="translate(5 0)">
        <Head blink={blink} />
      </g>
    </svg>
  );
}

/** Walking cat for the cursor. Two frames swap which legs are forward. */
export function CatWalking({ frame, ...props }: SvgProps & { frame: 0 | 1 }) {
  const legs = frame === 0 ? [-4, 4, 4, -4] : [4, -4, -4, 4];
  return (
    <svg viewBox="0 0 120 96" aria-hidden="true" focusable="false" {...props}>
      <path
        d="M96 62C110 60 112 44 104 38"
        fill="none"
        stroke={CAT.outline}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M96 62C110 60 112 44 104 38"
        fill="none"
        stroke={CAT.fur}
        strokeWidth="5"
        strokeLinecap="round"
      />
      {[40, 52, 80, 92].map((x, i) => (
        <rect
          key={x}
          x={x - 4 + (legs[i] ?? 0)}
          y="70"
          width="9"
          height="20"
          rx="4.5"
          fill={CAT.fur}
          {...LINE}
        />
      ))}
      <ellipse cx="68" cy="66" rx="32" ry="17" fill={CAT.fur} {...LINE} />
      <g transform={`translate(4 ${frame === 0 ? 4 : 6}) scale(0.62)`}>
        <Head />
      </g>
    </svg>
  );
}

/** Curled-up sleeping cat, for the 404 page and the idle cursor cat. */
export function CatSleeping(props: SvgProps) {
  return (
    <svg viewBox="0 0 150 96" aria-hidden="true" focusable="false" {...props}>
      <ellipse cx="84" cy="66" rx="52" ry="24" fill={CAT.fur} {...LINE} />
      <path
        d="M132 70C140 86 110 94 70 90"
        fill="none"
        stroke={CAT.outline}
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d="M132 70C140 86 110 94 70 90"
        fill="none"
        stroke={CAT.fur}
        strokeWidth="8"
        strokeLinecap="round"
      />
      <g transform="translate(6 30) scale(0.6)">
        <Head eyes="closed" />
      </g>
    </svg>
  );
}
