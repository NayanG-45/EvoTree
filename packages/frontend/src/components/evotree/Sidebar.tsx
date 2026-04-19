"use client";
import { useState } from "react";
import { Activity, Brain, GitBranch, Cpu, Sparkles, TrendingUp, TrendingDown, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { MagicCard } from "@/components/animations/MagicCard";

const stats = [
  { 
    id: "github",
    icon: GitBranch, 
    label: "GitHub Engine", 
    value: "1,284", 
    unit: "commits", 
    trend: "12.4%", 
    isUp: true, 
    color: "var(--bio-1)",
    glowColor: "16, 185, 129",
    history: [30, 45, 35, 60, 50, 85, 75],
    desc: "Neural commit frequency is currently optimized. High affinity for Rust and Solidity patterns detected in recent epochs."
  },
  { 
    id: "logic",
    icon: Brain, 
    label: "Algorithmic Logic", 
    value: "94", 
    unit: "score", 
    trend: "3.1%", 
    isUp: true, 
    color: "var(--bio-2)",
    glowColor: "6, 182, 212",
    history: [88, 90, 89, 92, 91, 94, 94],
    desc: "Logical synthesis reaching stable threshold. Complex pattern recognition in ZK circuits has increased by 14%."
  },
  { 
    id: "compute",
    icon: Cpu, 
    label: "Compute Cycles", 
    value: "8.2k", 
    unit: "ops/s", 
    trend: "0.8%", 
    isUp: false, 
    color: "var(--bio-3)",
    glowColor: "71, 85, 105",
    history: [85, 84, 86, 83, 84, 82, 82],
    desc: "Computational overhead is stabilizing. Parallel thread execution is being redistributed to maximize spore yield."
  },
  { 
    id: "network",
    icon: Activity, 
    label: "Network Pulse", 
    value: "312", 
    unit: "peers", 
    trend: "22%", 
    isUp: true, 
    color: "var(--bio-4)",
    glowColor: "168, 85, 247",
    history: [120, 150, 180, 240, 280, 290, 312],
    desc: "P2P mesh density is expanding. Global sync status is currently at 99.8% across 14 geolocated neural clusters."
  },
  { 
    id: "yield",
    icon: Sparkles, 
    label: "Spore Yield", 
    value: "47.9", 
    unit: "ETH eq.", 
    trend: "5.6%", 
    isUp: true, 
    color: "var(--bio-5)",
    glowColor: "234, 179, 8",
    history: [38, 40, 42, 41, 44, 46, 47.9],
    desc: "Estimated passive yield for the current cycle. Spore propagation is accelerating due to optimized smart contract logic."
  },
];

function Sparkline({ data, color }: { data: number[], color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * 60,
    y: 20 - ((v - min) / range) * 16
  }));
  
  const path = `M ${points.map(p => `${p.x},${p.y}`).join(" L ")}`;

  return (
    <svg width="60" height="20" className="opacity-60">
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </svg>
  );
}

export function Sidebar() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <aside 
      className="flex w-full shrink-0 flex-col gap-3 border-b border-white/5 p-5 md:w-[clamp(280px,24vw,360px)] md:border-b-0 md:border-r"
      style={{ background: "var(--gradient-canvas)" }}
    >
      {/* Balance card */}
      <MagicCard 
        glowColor="16, 185, 129"
        enableMagnetism={false}
        className="backdrop-blur-2xl"
      >
        <div className="relative p-5">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-2xl"
            style={{ background: "var(--gradient-bio)" }}
          />
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">
            Neural Liquidity
          </p>
          <div className="mt-3 flex items-end justify-between gap-2">
            <p className="flex items-baseline gap-1.5 font-display text-3xl font-bold leading-tight text-white">
              <span>12.847</span>
              <span className="text-xs font-normal text-slate-400">ETH</span>
            </p>
            <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 font-mono text-[10px] text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              <span>2.3%</span>
            </div>
          </div>
        </div>
      </MagicCard>

      {/* Stats */}
      <div className="flex flex-col gap-2.5">
        {stats.map((s, i) => {
          const isExpanded = expanded === s.id;
          return (
            <MagicCard
              key={s.id}
              glowColor={s.glowColor}
              enableMagnetism={false}
              className={`flex flex-col cursor-pointer transition-all duration-300 backdrop-blur-xl ${
                isExpanded ? "ring-1 ring-white/20" : ""
              }`}
            >
              <div 
                onClick={() => setExpanded(isExpanded ? null : s.id)}
                className={`flex flex-col ${isExpanded ? "p-5" : "p-3.5"}`}
              >
              <div className="flex items-center gap-3">
                <div
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                  style={{
                    background: `color-mix(in oklab, ${s.color} 10%, transparent)`,
                    border: `1px solid color-mix(in oklab, ${s.color} 20%, transparent)`,
                  }}
                >
                  <s.icon className="h-4.5 w-4.5" style={{ color: s.color }} />
                </div>
                
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold">
                    {s.label}
                  </p>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="font-display text-lg font-bold leading-none text-white">
                      {s.value}
                    </span>
                    <span className="truncate font-mono text-[10px] text-slate-500">
                      {s.unit}
                    </span>
                  </div>
                </div>

                {!isExpanded && (
                  <div className="flex flex-col items-end gap-1.5">
                    <Sparkline data={s.history} color={s.color} />
                    <div 
                      className="flex items-center gap-0.5 font-mono text-[9px] font-bold"
                      style={{ color: s.isUp ? "var(--bio-1)" : "var(--bio-4)" }}
                    >
                      {s.isUp ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                      <span>{s.trend}</span>
                    </div>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-white/5">
                       <p className="text-[12px] leading-relaxed text-slate-400 mb-4">
                         {s.desc}
                       </p>
                       <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white/5 rounded-lg p-3">
                             <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-1">Weekly Avg</p>
                             <p className="text-sm font-bold text-white">
                                {Math.round(s.history.reduce((a, b) => a + b, 0) / s.history.length)} {s.unit}
                             </p>
                          </div>
                          <div className="bg-white/5 rounded-lg p-3">
                             <p className="text-[9px] uppercase tracking-widest text-slate-500 mb-1">Volatility</p>
                             <p className="text-sm font-bold text-white">Low</p>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
            </MagicCard>
          );
        })}
      </div>
    </aside>
  );
}
