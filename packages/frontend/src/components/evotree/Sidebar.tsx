"use client";
import React, { useState } from "react";
import { Activity, Brain, GitBranch, Cpu, Sparkles, TrendingUp, TrendingDown } from "lucide-react";
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
    id: "leetcode",
    icon: Brain, 
    label: "LeetCode Vine", 
    value: "0", 
    unit: "solved", 
    trend: "2.1%", 
    isUp: true, 
    color: "var(--bio-2)",
    glowColor: "6, 182, 212",
    history: [100, 105, 110, 115, 120, 125, 130],
    desc: "Algorithmic proficiency is scaling. Neural pathways for dynamic programming and graph theory are strengthening."
  },
  { 
    id: "codeforces",
    icon: Activity, 
    label: "Competitive Pulsar", 
    value: "0", 
    unit: "rating", 
    trend: "0.0%", 
    isUp: true, 
    color: "var(--bio-4)",
    glowColor: "168, 85, 247",
    history: [1400, 1450, 1500, 1520, 1550, 1600, 1650],
    desc: "High-pressure logical synthesis detected. System stability during competitive epochs is within optimal parameters."
  },
  { 
    id: "kaggle",
    icon: Sparkles, 
    label: "Data Spores", 
    value: "0", 
    unit: "pts", 
    trend: "5.6%", 
    isUp: true, 
    color: "var(--bio-5)",
    glowColor: "234, 179, 8",
    history: [500, 520, 540, 560, 580, 600, 620],
    desc: "Model convergence reaching stable threshold. Knowledge distillation from data clusters is proceeding."
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

export const Sidebar = React.memo(function Sidebar({ stats: userStats = null }: { stats?: any }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const activeStats = React.useMemo(() => {
    if (!userStats) return stats.filter(s => s.id === "github");

    return stats.map(s => {
      if (s.id === "github") {
        return { ...s, value: userStats.github?.commits?.toLocaleString() || "0" };
      }
      if (s.id === "leetcode") {
        if (!userStats.leetcode) return null;
        return { ...s, value: userStats.leetcode?.totalSolved?.toString() || "0" };
      }
      if (s.id === "codeforces") {
        if (!userStats.codeforces) return null;
        return { ...s, value: userStats.codeforces?.currentRating?.toString() || "0" };
      }
      if (s.id === "kaggle") {
        if (!userStats.kaggle) return null;
        return { ...s, value: userStats.kaggle?.totalNotebooks?.toString() || "0", unit: "notebooks" };
      }
      return null;
    }).filter(Boolean) as typeof stats;
  }, [userStats]);

  return (
    <aside 
      className="md:sticky md:top-[76px] flex w-full shrink-0 flex-col gap-3 border-b border-white/5 p-5 md:h-[calc(100vh-76px)] md:w-[clamp(280px,24vw,360px)] md:border-b-0 md:border-r overflow-y-auto scrollbar-none"
      style={{ background: "var(--gradient-canvas)" }}
    >
      {/* Balance card */}
      <MagicCard 
        glowColor="16, 185, 129"
        enableMagnetism={false}
        className="backdrop-blur-xl"
      >
        <div className="relative p-6 flex flex-col gap-4">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-2xl"
            style={{ background: "var(--gradient-bio)" }}
          />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold">
              Neural Liquidity
            </p>
          </div>
          <div className="flex flex-col gap-1">
             <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-black text-white">
                  12.847
                </span>
                <span className="font-mono text-xs font-bold text-slate-400 uppercase">
                  ETH
                </span>
             </div>
             <div className="flex items-center gap-1.5 w-fit rounded-lg bg-emerald-500/10 px-2 py-1 font-mono text-[9px] font-bold text-emerald-400 border border-emerald-500/20">
               <TrendingUp className="h-2.5 w-2.5" />
               <span>+2.3% ROOT SYNC</span>
             </div>
          </div>
        </div>
      </MagicCard>

      {/* Stats */}
      <div className="flex flex-col gap-2.5">
        {activeStats.map((s) => {
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
});

export default Sidebar;
