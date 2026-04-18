"use client";
import { motion } from "framer-motion";
import { Activity, Brain, GitBranch, Cpu, Sparkles } from "lucide-react";

const stats = [
  { icon: GitBranch, label: "GitHub Engine", value: "1,284", unit: "commits", trend: "+12.4%", color: "var(--bio-1)" },
  { icon: Brain, label: "Algorithmic Logic", value: "94", unit: "score", trend: "+3.1%", color: "var(--bio-2)" },
  { icon: Cpu, label: "Compute Cycles", value: "8.2k", unit: "ops/s", trend: "+0.8%", color: "var(--bio-3)" },
  { icon: Activity, label: "Network Pulse", value: "312", unit: "peers", trend: "+22%", color: "var(--bio-4)" },
  { icon: Sparkles, label: "Spore Yield", value: "47.9", unit: "ETH eq.", trend: "+5.6%", color: "var(--bio-5)" },
];

export function Sidebar() {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-[clamp(0.75rem,1.2vh,1rem)] border-b border-border bg-sidebar/80 p-[clamp(1rem,1.5vw,1.5rem)] backdrop-blur-sm md:w-[clamp(260px,22vw,340px)] md:border-b-0 md:border-r">
      {/* Balance card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel relative overflow-hidden p-4"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-30 blur-2xl"
          style={{ background: "var(--gradient-bio)" }}
        />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Balance
        </p>
        <div className="mt-2 flex items-end justify-between gap-2">
          <p className="flex items-baseline gap-1.5 font-display text-2xl font-semibold leading-tight text-glow">
            <span>12.847</span>
            <span className="text-xs font-normal text-muted-foreground">ETH</span>
          </p>
          <span className="shrink-0 rounded-full bg-primary/15 px-2 py-1 font-mono text-[10px] text-primary">
            +2.3%
          </span>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="flex flex-col gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.1, type: "spring", stiffness: 100 }}
            className="panel group flex items-center gap-3 p-3 transition-all duration-300 ease-out hover:-translate-y-[2px] hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)]"
          >
            <div
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg"
              style={{
                background: `color-mix(in oklab, ${s.color} 14%, transparent)`,
                boxShadow: `0 0 18px color-mix(in oklab, ${s.color} 30%, transparent)`,
              }}
            >
              <s.icon className="h-4 w-4" style={{ color: s.color }} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] uppercase tracking-wider text-muted-foreground">
                {s.label}
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-lg font-semibold leading-none text-foreground">
                  {s.value}
                </span>
                <span className="truncate font-mono text-[10px] text-muted-foreground">
                  {s.unit}
                </span>
              </div>
            </div>
            <span
              className="shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px]"
              style={{
                color: s.color,
                background: `color-mix(in oklab, ${s.color} 12%, transparent)`,
              }}
            >
              {s.trend}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="mt-auto border-t border-border/60 pt-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Synced · block 19,284,773
        </p>
      </div>
    </aside>
  );
}
