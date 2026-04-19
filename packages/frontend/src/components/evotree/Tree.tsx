"use client";
import { useMemo } from "react";
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
  { id: "genesis", label: "Neural Core", level: 100, category: "Origin", x: 500, y: 380, color: "var(--bio-1)", path: TRUNK_PATH },
  { id: "github", label: "Github Branch", level: 0, category: "Open Source", x: 160, y: 130, color: "var(--bio-2)", path: PATH_L2A + " Q200,180 160,130" },
  { id: "leetcode", label: "LeetCode Vine", level: 0, category: "Algorithms", x: 280, y: 70, color: "var(--bio-3)", path: PATH_L2B + " Q320,100 280,70" },
  { id: "codeforces", label: "Competitive Root", level: 0, category: "Competitive", x: 430, y: 40, color: "var(--bio-4)", path: PATH_L2B + " Q400,90 430,40" },
  { id: "kaggle", label: "Data Node", level: 0, category: "AI/ML", x: 580, y: 50, color: "var(--bio-5)", path: PATH_R2A + " Q610,100 580,50" },
  { id: "relic", label: "Relic #01", level: 100, category: "Milestone", x: 850, y: 200, color: "var(--bio-2)", path: PATH_R2B + " Q820,210 850,200" },
];

export const TOKEN_MAP: Record<number, string> = {
  0: "genesis",
  1: "github",
  2: "codeforces",
  3: "leetcode",
  4: "kaggle",
  99: "relic"
};

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
  onNodeClick?: (id: string | null) => void;
  settings?: {
    showLabels: boolean;
    showActivity: boolean;
    filter: string;
  };
  mouse?: { x: number; y: number };
  growthLevel?: number;
  nodes?: SkillNode[];
};

function NodeParticles({ x, y, level, color, mouse }: { x: number; y: number; level: number; color: string, mouse?: { x: number, y: number } }) {
  // Density based on mastery: more particles for stronger skills
  const count = Math.max(2, Math.floor(level / 8));
  
  // Create static positions and movement offsets
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      tx: (i % 2 === 0 ? 1 : -1) * (10 + Math.random() * 20),
      ty: (i % 3 === 0 ? 1 : -1) * (10 + Math.random() * 20),
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
      size: 1.5 + Math.random() * 2
    }));
  }, [count]);

  return (
    <g>
      {particles.map((p, i) => {
        // Simple attraction logic
        let shiftX = 0;
        let shiftY = 0;
        if (mouse) {
          const dx = (mouse.x * 1000) - x;
          const dy = (mouse.y * 720) - y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const pull = (150 - dist) / 150;
            shiftX = dx * pull * 0.4;
            shiftY = dy * pull * 0.4;
          }
        }

        return (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={p.size}
            fill={color}
            initial={{ opacity: 0 }}
            animate={{
              x: [0, p.tx, 0].map(v => v + shiftX),
              y: [0, p.ty, 0].map(v => v + shiftY),
              opacity: [0.2, 0.7, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut"
            }}
            style={{ filter: `drop-shadow(0 0 5px ${color})` }}
          />
        );
      })}
    </g>
  );
}

export function TreeCore() {
  return (
    <g>
      {/* Outer Glow Core */}
      <motion.rect
        x="494"
        y="460"
        width="12"
        height="260"
        rx="6"
        fill="oklch(0.85 0.19 165)"
        animate={{
          scaleY: [1, 1.05, 1],
          opacity: [0.3, 0.6, 0.3],
          filter: [
            "blur(12px) drop-shadow(0 0 20px rgba(0,255,200,0.4))",
            "blur(16px) drop-shadow(0 0 40px rgba(0,255,200,0.8))",
            "blur(12px) drop-shadow(0 0 20px rgba(0,255,200,0.4))"
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transformOrigin: "bottom center" }}
      />
      {/* Inner Solid Core */}
      <motion.rect
        x="497"
        y="460"
        width="6"
        height="260"
        rx="3"
        fill="oklch(0.85 0.19 165)"
        animate={{
          scaleY: [1, 1.02, 1],
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ transformOrigin: "bottom center" }}
      />
    </g>
  );
}

// Growth mapping: which elements appear at each stage
const GROWTH_STAGES = {
  1: { nodeCount: 2, twigs: false, leaves: false },
  2: { nodeCount: 5, twigs: true, leaves: false },
  3: { nodeCount: 8, twigs: true, leaves: true }
};

export function Tree({ hovered, setHovered, onNodeClick, settings, mouse, growthLevel = 1, nodes = NODES }: Props) {
  const showActivity = settings?.showActivity ?? true;
  const activeFilter = settings?.filter ?? "all";

  const stage = (GROWTH_STAGES as any)[growthLevel] || GROWTH_STAGES[1];

  const isVisible = (n: SkillNode, index: number) => {
    // Check growth stage
    if (index >= stage.nodeCount) return false;

    if (activeFilter === "all") return true;
    return n.category.toLowerCase().includes(activeFilter.toLowerCase());
  };

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

      {/* Breathing Neural Core */}
      <TreeCore />

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
      {nodes.map((n, i) => {
        if (!isVisible(n, i)) return null;
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
      {stage.twigs && TWIGS.map((t, i) => (
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
      {stage.leaves && LEAVES.map((l, i) => (
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
      {nodes.map((n, i) => {
        if (!isVisible(n, i)) return null;
        const isHovered = hovered === n.id;

        // Proximity Bloom Logic
        let bloomScale = 1;
        let bloomGlow = 8;
        if (mouse) {
          const dx = (mouse.x * 1000) - n.x;
          const dy = (mouse.y * 720) - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const factor = (120 - dist) / 120;
            bloomScale = 1 + (factor * 0.3);
            bloomGlow = 8 + (factor * 20);
          }
        }

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
            onClick={() => onNodeClick?.(n.id)}
            style={{ cursor: "pointer" }}
          >
            {/* Ambient Particle Cluster */}
            {showActivity && <NodeParticles x={n.x} y={n.y} level={n.level} color={n.color} mouse={mouse} />}

            {/* outer halo */}
            <motion.circle
              cx={n.x}
              cy={n.y}
              r={18}
              fill={n.color}
              opacity={isHovered ? 0.35 : 0.15}
              filter="url(#soft)"
              animate={{ 
                scale: isHovered ? 1.8 : bloomScale,
                opacity: isHovered ? 0.4 : 0.2
              }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            />

            {/* occluder */}
            <circle
              cx={n.x}
              cy={n.y}
              r={isHovered ? 13 : 10}
              fill="oklch(0.09 0.025 190)"
            />

            {/* core */}
            <motion.circle
              cx={n.x}
              cy={n.y}
              r={7}
              fill={n.color}
              animate={{ 
                scale: isHovered ? 1.5 : bloomScale,
              }}
              transition={{ type: "spring", stiffness: 260, damping: 14 }}
              style={{
                filter: `drop-shadow(0 0 ${isHovered ? 25 : bloomGlow}px ${n.color}) drop-shadow(0 0 ${isHovered ? 12 : 5}px ${n.color})`,
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
