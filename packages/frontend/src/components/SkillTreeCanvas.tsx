"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export interface TreeNode {
  id: string;
  name: string;
  x: number;
  y: number;
  status: "locked" | "unlocked";
  delay: number;
  xp: string;
}

export interface TreeEdge {
  id: string;
  source: string;
  target: string;
  status: "locked" | "unlocked";
  path: string;
  strokeWidth: number;
  delay: number;
}

export interface TreeConfig {
  nodes: TreeNode[];
  edges: TreeEdge[];
}

const RunicDiamond = ({ x, y, isUnlocked }: { x: number; y: number; isUnlocked: boolean }) => (
  <g transform={`translate(${x}, ${y})`}>
    <motion.path
      d="M 0 -16 L 16 0 L 0 16 L -16 0 Z"
      fill={isUnlocked ? "rgba(177, 0, 232, 0.15)" : "rgba(255,255,255,0.02)"}
      stroke={isUnlocked ? "#00F0FF" : "rgba(255,255,255,0.1)"}
      strokeWidth={isUnlocked ? 2 : 1}
      style={{
        filter: isUnlocked ? "drop-shadow(0px 0px 8px #00F0FF) drop-shadow(0px 0px 15px rgba(177, 0, 232, 0.5))" : "none"
      }}
    />
    {isUnlocked && (
      <motion.path
        d="M 0 -6 L 6 0 L 0 6 L -6 0 Z"
        fill="#00F0FF"
      />
    )}
  </g>
);

const FloatingParticles = () => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      x: 50 + Math.random() * 700,
      y: 50 + Math.random() * 700,
      size: 1 + Math.random() * 2.5,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <g>
      {particles.map((p) => (
        <motion.circle
          key={p.id}
          cx={p.x}
          cy={p.y}
          r={p.size}
          fill="#00F0FF"
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            y: [-10, -40],
            x: p.x + (Math.random() * 20 - 10),
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </g>
  );
};

export default function SkillTreeCanvas({ treeState }: { treeState: TreeConfig }) {
  const [hoveredNode, setHoveredNode] = useState<TreeNode | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const idleVariants: any = {
    animate: {
      opacity: [0.8, 1, 0.8],
      transition: {
        repeat: Infinity,
        duration: 3,
        ease: "easeInOut",
      },
    },
    hover: {
      scale: 1.15,
      opacity: 1,
      filter: "drop-shadow(0px 0px 20px #00F0FF) drop-shadow(0px 0px 40px #B100E8)",
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  return (
    <div className="relative w-full h-[800px] rounded-2xl overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
      
      {/* Tooltip Render Overlay */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 pointer-events-none px-4 py-3 bg-black/60 backdrop-blur-xl border border-white/20 rounded-lg shadow-[0_0_30px_rgba(0,240,255,0.15)] flex flex-col items-center justify-center gap-1"
            style={{
              left: `calc(${(hoveredNode.x / 800) * 100}% - 70px)`, 
              top: `calc(${(hoveredNode.y / 800) * 100}% - 100px)`
            }}
          >
            <div className="text-[#00F0FF] font-mono font-bold text-sm tracking-wider drop-shadow-[0_0_5px_#00F0FF]">{hoveredNode.name}</div>
            <div className="text-white/70 font-mono text-xs tracking-widest uppercase">{hoveredNode.xp}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <svg
        viewBox="0 0 800 800"
        className="w-full h-full relative z-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="cyber-organic" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#B100E8" />
            <stop offset="50%" stopColor="#00F0FF" />
            <stop offset="100%" stopColor="#B100E8" />
          </linearGradient>
        </defs>

        <FloatingParticles />

        {/* Render Edges (Branches) */}
        {treeState.edges.map((edge) => (
          <g key={edge.id}>
            {/* Base locked path inside glass context */}
            <path
              d={edge.path}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={edge.strokeWidth}
              strokeLinecap="round"
            />
            {/* Animated Path if unlocked */}
            {edge.status === "unlocked" && (
              <motion.path
                d={edge.path}
                fill="none"
                stroke="url(#cyber-organic)"
                strokeWidth={edge.strokeWidth}
                strokeLinecap="round"
                style={{
                  filter: "drop-shadow(0px 0px 10px rgba(0, 240, 255, 0.4))"
                }}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: 2.5,
                  ease: "easeInOut",
                  delay: edge.delay,
                }}
              />
            )}
          </g>
        ))}

        {/* Render Nodes */}
        {treeState.nodes.map((node) => {
          const isUnlocked = node.status === "unlocked";
          return (
            <motion.g
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: node.delay,
              }}
            >
              <motion.g 
                variants={isUnlocked ? idleVariants : undefined} 
                animate="animate" 
                whileHover={isUnlocked ? "hover" : undefined}
                onHoverStart={() => isUnlocked && setHoveredNode(node)}
                onHoverEnd={() => isUnlocked && setHoveredNode(null)}
                className={isUnlocked ? "cursor-pointer" : ""}
                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              >
                {/* Hit Box for easier hover area */}
                <circle cx={node.x} cy={node.y} r="30" fill="transparent" />

                <RunicDiamond x={node.x} y={node.y} isUnlocked={isUnlocked} />

                <text
                  x={node.x}
                  y={node.y + 35}
                  textAnchor="middle"
                  fill={isUnlocked ? "#ffffff" : "rgba(255,255,255,0.3)"}
                  className="text-[10px] font-mono uppercase tracking-[0.2em] font-medium pointer-events-none"
                  style={{
                    filter: isUnlocked ? "drop-shadow(0px 0px 4px rgba(0,240,255,0.8))" : "none",
                  }}
                >
                  {node.name}
                </text>
              </motion.g>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
