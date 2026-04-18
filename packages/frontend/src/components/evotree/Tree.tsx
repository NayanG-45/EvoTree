"use client";
import { motion } from "framer-motion";
export type SkillNode = {
  id: string;
  label: string;
  level: number;
  category: string;
  x: number; // 0-1000
  y: number; // 0-700 (svg viewbox)
  color: string;
  // path from trunk top to node
  path: string;
};

// Trunk path (bottom-center growing up)
const TRUNK_PATH =
  "M500,700 C500,640 498,600 500,560 C502,520 496,490 500,460 C504,430 498,410 500,380";

const PATH_L1 = "M500,380 Q450,260 340,250";
const PATH_L2A = PATH_L1 + " Q280,240 220,230";
const PATH_L2B = PATH_L1 + " Q340,190 350,150";

const PATH_R1 = "M500,380 Q550,260 660,250";
const PATH_R2A = PATH_R1 + " Q660,190 650,150";
const PATH_R2B = PATH_R1 + " Q720,240 780,230";

export const NODES: SkillNode[] = [
  { id: "solidity", label: "Solidity", level: 92, category: "Smart Contracts", x: 160, y: 130, color: "var(--bio-2)", path: PATH_L2A + " Q200,180 160,130" },
  { id: "rust", label: "Rust", level: 86, category: "Systems", x: 280, y: 70, color: "var(--bio-1)", path: PATH_L2B + " Q320,100 280,70" },
  { id: "zk", label: "ZK Proofs", level: 74, category: "Cryptography", x: 430, y: 40, color: "var(--bio-3)", path: PATH_L2B + " Q400,90 430,40" },
  { id: "react", label: "React", level: 95, category: "Frontend", x: 580, y: 50, color: "var(--bio-5)", path: PATH_R2A + " Q610,100 580,50" },
  { id: "graphql", label: "GraphQL", level: 81, category: "API", x: 720, y: 100, color: "var(--bio-4)", path: PATH_R2A + " Q690,120 720,100" },
  { id: "ipfs", label: "IPFS", level: 68, category: "Storage", x: 850, y: 200, color: "var(--bio-2)", path: PATH_R2B + " Q820,210 850,200" },
  { id: "evm", label: "EVM Internals", level: 78, category: "Runtime", x: 880, y: 360, color: "var(--bio-3)", path: PATH_R2B + " Q820,280 880,360" },
  { id: "ml", label: "ML Ops", level: 64, category: "AI", x: 130, y: 320, color: "var(--bio-4)", path: PATH_L2A + " Q180,280 130,320" },
];

// Smaller twigs branching off main lines for an organic fractal feel
const TWIGS: { d: string; c: string; w?: number }[] = [
  // L1 offshoots
  { d: "M430,310 Q410,290 400,300", c: "var(--bio-2)" },
  { d: "M380,265 Q360,250 350,240", c: "var(--bio-1)" },
  // L2A offshoots
  { d: "M280,245 Q260,230 250,220", c: "var(--bio-4)" },
  { d: "M240,235 Q220,250 210,260", c: "var(--bio-2)" },
  // L2B offshoots
  { d: "M345,190 Q320,180 310,170", c: "var(--bio-1)" },
  { d: "M355,170 Q370,150 380,140", c: "var(--bio-3)" },
  // R1 offshoots
  { d: "M570,310 Q590,290 600,300", c: "var(--bio-5)" },
  { d: "M620,265 Q640,250 650,240", c: "var(--bio-4)" },
  // R2A offshoots
  { d: "M655,190 Q680,180 690,170", c: "var(--bio-4)" },
  { d: "M645,170 Q630,150 620,140", c: "var(--bio-5)" },
  // R2B offshoots
  { d: "M720,245 Q740,230 750,220", c: "var(--bio-2)" },
  { d: "M760,235 Q780,250 790,260", c: "var(--bio-3)" },
];

const LEAVES = [
  { x: 395, y: 295, c: "var(--bio-2)" },
  { x: 345, y: 235, c: "var(--bio-1)" },
  { x: 245, y: 215, c: "var(--bio-4)" },
  { x: 305, y: 165, c: "var(--bio-1)" },
  { x: 385, y: 135, c: "var(--bio-3)" },
  { x: 605, y: 295, c: "var(--bio-5)" },
  { x: 655, y: 235, c: "var(--bio-4)" },
  { x: 695, y: 165, c: "var(--bio-4)" },
  { x: 615, y: 135, c: "var(--bio-5)" },
  { x: 755, y: 215, c: "var(--bio-2)" },
];

type Props = {
  hovered: string | null;
  setHovered: (id: string | null) => void;
};

export function Tree({ hovered, setHovered }: Props) {
  return (
    <svg
      viewBox="0 0 1000 720"
      preserveAspectRatio="xMidYMax meet"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <radialGradient id="ground" cx="50%" cy="100%" r="60%">
          <stop offset="0%" stopColor="oklch(0.85 0.19 165 / 0.35)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="trunkGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="oklch(0.55 0.12 175)" />
          <stop offset="100%" stopColor="oklch(0.85 0.19 165)" />
        </linearGradient>
        <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>

      {/* ground glow */}
      <ellipse cx="500" cy="700" rx="380" ry="40" fill="url(#ground)" />

      {/* Trunk base — extra thick grounded foot */}
      <motion.path
        d="M500,720 C500,690 498,670 500,640"
        stroke="url(#trunkGrad)"
        strokeWidth={48}
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.9 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ filter: "drop-shadow(0 0 14px oklch(0.85 0.19 165 / 0.45))" }}
      />
      {/* Trunk — thick base, animated draw */}
      <motion.path
        d={TRUNK_PATH}
        stroke="url(#trunkGrad)"
        strokeWidth={32}
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ filter: "drop-shadow(0 0 8px oklch(0.85 0.19 165 / 0.35))" }}
      />
      {/* trunk inner highlight */}
      <motion.path
        d={TRUNK_PATH}
        stroke="oklch(0.95 0.1 165 / 0.6)"
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Branches */}
      {NODES.map((n, i) => {
        const isHover = hovered === n.id;
        return (
          <g key={n.id}>
            {/* halo branch when hovered — 3x brighter */}
            <motion.path
              d={n.path}
              stroke={n.color}
              strokeWidth={isHover ? 14 : 5}
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: 1,
                opacity: isHover ? 0.85 : 0.18,
              }}
              transition={{
                pathLength: { duration: 1.6, delay: 1.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.3 },
              }}
              style={{ filter: "blur(4px)" }}
            />
            {/* main branch — thick at base, taper toward tip */}
            <motion.path
              d={n.path}
              stroke={n.color}
              strokeWidth={isHover ? 3.4 : 2.2}
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: isHover ? 1 : 0.78 }}
              transition={{
                pathLength: { duration: 1.6, delay: 1.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.3 },
              }}
              style={{
                filter: isHover
                  ? `drop-shadow(0 0 12px ${n.color}) drop-shadow(0 0 28px ${n.color}) drop-shadow(0 0 44px ${n.color})`
                  : `drop-shadow(0 0 3px ${n.color})`,
              }}
            />
          </g>
        );
      })}

      {/* Twigs (small organic offshoots) */}
      {TWIGS.map((t, i) => (
        <motion.path
          key={`twig-${i}`}
          d={t.d}
          stroke={t.c}
          strokeWidth={t.w ?? 1.1}
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.55 }}
          transition={{ duration: 1.0, delay: 2.2 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: `drop-shadow(0 0 3px ${t.c})` }}
        />
      ))}

      {/* Leaves */}
      {LEAVES.map((l, i) => (
        <motion.circle
          key={i}
          cx={l.x}
          cy={l.y}
          r={2.4}
          fill={l.c}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.9, scale: 1 }}
          transition={{ delay: 2.6 + i * 0.08, duration: 0.5 }}
          style={{ filter: `drop-shadow(0 0 6px ${l.c})` }}
        />
      ))}

      {/* Nodes */}
      {NODES.map((n, i) => {
        const isHover = hovered === n.id;
        return (
          <motion.g
            key={n.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 2.4 + i * 0.1,
              type: "spring",
              stiffness: 220,
              damping: 14,
            }}
            onMouseEnter={() => setHovered(n.id)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: "pointer" }}
          >
            {/* outer halo */}
            <motion.circle
              cx={n.x}
              cy={n.y}
              r={isHover ? 32 : 18}
              fill={n.color}
              opacity={isHover ? 0.32 : 0.18}
              filter="url(#soft)"
              animate={{ r: isHover ? 34 : 18 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            />
            {/* occluder — solid bg disc so branch lines don't visibly pierce the node */}
            <circle
              cx={n.x}
              cy={n.y}
              r={isHover ? 13 : 10}
              fill="oklch(0.09 0.025 190)"
            />
            {/* core */}
            <motion.circle
              cx={n.x}
              cy={n.y}
              r={isHover ? 10 : 7}
              fill={n.color}
              animate={{ r: isHover ? 11 : 7 }}
              transition={{ type: "spring", stiffness: 260, damping: 14 }}
              style={{
                filter: `drop-shadow(0 0 6px ${n.color}) drop-shadow(0 0 14px ${n.color})`,
              }}
            />
            {/* inner sparkle */}
            <circle cx={n.x} cy={n.y} r={2.2} fill="white" opacity={0.9} />
          </motion.g>
        );
      })}
    </svg>
  );
}
