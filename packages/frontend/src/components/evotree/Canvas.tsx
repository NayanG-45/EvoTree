"use client";
import { useRef, useState, useMemo, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Layers, Zap, Maximize2, Filter, Eye, EyeOff, Minus, Plus, RotateCcw, X } from "lucide-react";
import { Particles } from "./Particles";
import { Tree, NODES } from "./Tree";

export function Canvas() {
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5, px: 0, py: 0, inside: false });
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  // Control Panel State
  const [showLabels, setShowLabels] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [activeFilter, setActiveFilter] = useState("all");
  const [evolutionKey, setEvolutionKey] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    setMouse({ x: px / r.width, y: py / r.height, px, py, inside: true });
  };

  const hoveredNode = hovered ? NODES.find((n) => n.id === hovered) ?? null : null;
  const selectedNode = selected ? NODES.find((n) => n.id === selected) ?? null : null;

  // Tooltip in pixel coords (clamped)
  const tooltipPos = (() => {
    if (!hoveredNode || !ref.current) return null;
    const r = ref.current.getBoundingClientRect();
    const scale = Math.min(r.width / 1000, r.height / 720) * zoom; // Adjust for zoom
    const renderedW = 1000 * scale;
    const renderedH = 720 * scale;
    const offsetX = (r.width - renderedW) / 2;
    const offsetY = r.height - renderedH;
    const px = offsetX + hoveredNode.x * scale;
    const py = offsetY + hoveredNode.y * scale;
    const w = 220;
    const h = 110;
    let left = px + 18;
    let top = py - h - 14;
    if (left + w > r.width - 12) left = px - w - 18;
    if (top < 12) top = py + 22;
    return { left, top };
  })();

  const categories = useMemo(() => {
    return ["all", ...new Set(NODES.map((n) => n.category.split(" ")[0]))];
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        setMouse((m) => ({ ...m, inside: false }));
        setShowFilters(false);
      }}
      className="relative h-full w-full overflow-hidden"
      style={{ background: "var(--gradient-canvas)" }}
    >
      {/* Neural Pulse Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.1, 0.9, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full blur-[140px] bg-emerald-500/10"
        />
        <motion.div
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 40, -20, 0],
            scale: [1, 0.9, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] bg-cyan-500/10"
        />
      </div>

      {/* Control Panel (Top-Right) */}
      <div className="absolute right-6 top-6 z-40 flex flex-col gap-3">
        <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-black/40 p-2 backdrop-blur-xl">
           <button 
             onClick={() => setShowLabels(!showLabels)}
             className={`p-2.5 rounded-xl transition-all ${showLabels ? "bg-emerald-500/20 text-emerald-400" : "text-slate-500 hover:text-slate-300"}`}
             title="Toggle Labels"
           >
             {showLabels ? <Eye className="h-4.5 w-4.5" /> : <EyeOff className="h-4.5 w-4.5" />}
           </button>
           <button 
             onClick={() => setShowActivity(!showActivity)}
             className={`p-2.5 rounded-xl transition-all ${showActivity ? "bg-cyan-500/20 text-cyan-400" : "text-slate-500 hover:text-slate-300"}`}
             title="Toggle Activity Particles"
           >
             <Zap className="h-4.5 w-4.5" />
           </button>
           <button 
             onClick={() => setEvolutionKey(k => k + 1)}
             className="p-2.5 rounded-xl text-slate-500 hover:text-emerald-400 transition-all hover:bg-emerald-500/10"
             title="Replay Time-lapse Evolution"
           >
             <RotateCcw className="h-4.5 w-4.5" />
           </button>
           <div className="relative" onMouseEnter={() => setShowFilters(true)} onMouseLeave={() => setShowFilters(false)}>
              <button 
                className={`p-2.5 h-10 w-10 flex items-center justify-center rounded-xl transition-all ${showFilters || activeFilter !== "all" ? "bg-amber-500/20 text-amber-400" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"}`}
                title="Neural Domains Filter"
              >
                <Filter className={`h-4.5 w-4.5 transition-transform duration-500 ${showFilters ? "rotate-90" : ""}`} />
              </button>
              <AnimatePresence>
                {showFilters && (
                  <motion.div 
                    initial={{ opacity: 0, x: 10, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute right-full top-[-80px] mr-3 w-48 overflow-hidden rounded-2xl border border-white/10 bg-black/90 p-2 shadow-2xl backdrop-blur-2xl"
                  >
                     <div className="mb-2 px-3 py-1.5 border-b border-white/5">
                       <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-slate-500">Neural Domains</p>
                     </div>
                     <div className="flex flex-col gap-1 text-left">
                       {categories.map((cat, i) => (
                         <button
                           key={cat}
                           onClick={() => { setActiveFilter(cat); setShowFilters(false); }}
                           className={`flex items-center justify-between rounded-xl px-4 py-2 text-[10px] uppercase tracking-[0.15em] transition-all ${activeFilter === cat ? "bg-white/10 text-white" : "text-slate-500 hover:bg-white/5 hover:text-slate-300"}`}
                         >
                           {cat}
                           <div className={`h-1 w-1 rounded-full ${activeFilter === cat ? "bg-amber-400" : "bg-white/10"}`} />
                         </button>
                       ))}
                     </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </div>
           <div className="h-px bg-white/5 mx-2" />
           <button 
             onClick={() => setZoom(z => Math.min(z + 0.1, 1.5))}
             className="p-2.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/5"
           >
             <Plus className="h-4.5 w-4.5" />
           </button>
           <button 
             onClick={() => setZoom(z => Math.max(z - 0.1, 0.8))}
             className="p-2.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/5"
           >
             <Minus className="h-4.5 w-4.5" />
           </button>
        </div>
      </div>

      {/* Cursor aura */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute z-10 h-[460px] w-[460px] rounded-full"
        animate={{
          x: mouse.px - 230,
          y: mouse.py - 230,
          opacity: mouse.inside ? 0.55 : 0,
        }}
        transition={{ type: "spring", stiffness: 80, damping: 20, mass: 0.6 }}
        style={{
          background:
            "radial-gradient(circle, oklch(0.85 0.19 165 / 0.18) 0%, transparent 60%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Parallax tree wrapper */}
      <motion.div
        className="absolute inset-0"
        animate={{
          x: (mouse.x - 0.5) * -22,
          y: (mouse.y - 0.5) * -14,
          scale: zoom,
          filter: selected ? "blur(12px) brightness(0.4)" : "blur(0px) brightness(1)",
        }}
        transition={{ 
          x: { type: "spring", stiffness: 50, damping: 18 },
          y: { type: "spring", stiffness: 50, damping: 18 },
          scale: { type: "spring", stiffness: 100, damping: 20 }
        }}
        style={{ transformOrigin: "center center" }}
      >
        <Particles count={64} />
        <Tree 
          key={evolutionKey}
          hovered={hovered} 
          setHovered={setHovered} 
          onNodeClick={setSelected} 
          settings={{ showLabels, showActivity, filter: activeFilter }}
          mouse={mouse}
        />
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredNode && tooltipPos && !selected && showLabels && (
          <motion.div
            key={hoveredNode.id}
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="pointer-events-none absolute z-30 w-[220px] panel p-4"
            style={{
              left: tooltipPos.left,
              top: tooltipPos.top,
              borderColor: hoveredNode.color,
              boxShadow: `0 0 0 1px ${hoveredNode.color}, 0 12px 40px color-mix(in oklab, ${hoveredNode.color} 35%, transparent)`,
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="font-mono text-[10px] uppercase tracking-[0.18em]"
                style={{ color: hoveredNode.color }}
              >
                {hoveredNode.category}
              </span>
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  background: hoveredNode.color,
                  boxShadow: `0 0 8px ${hoveredNode.color}`,
                }}
              />
            </div>
            <h3 className="mt-1 font-display text-lg font-semibold text-foreground">
              {hoveredNode.label}
            </h3>
            <div className="mt-3">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="uppercase tracking-wider">Mastery</span>
                <span className="font-mono" style={{ color: hoveredNode.color }}>
                  {hoveredNode.level}/100
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted/60">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${hoveredNode.level}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${hoveredNode.color}, white)`,
                    boxShadow: `0 0 10px ${hoveredNode.color}`,
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Node Deep Dive Overlay */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 p-8 backdrop-blur-[2px]"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-background-deep/80 p-10 shadow-2xl backdrop-blur-2xl"
              style={{
                boxShadow: `0 0 100px -20px color-mix(in oklab, ${selectedNode.color} 30%, transparent)`,
              }}
            >
              {/* Background Glow */}
              <div
                className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full opacity-20 blur-[100px]"
                style={{ background: selectedNode.color }}
              />

              <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center">
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span
                      className="rounded-full bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-widest"
                      style={{ color: selectedNode.color, border: `1px solid color-mix(in oklab, ${selectedNode.color} 30%, transparent)` }}
                    >
                      {selectedNode.category}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-white/20" />
                    <span className="font-mono text-[10px] text-slate-500">NEURAL_NODE_{selectedNode.id.toUpperCase()}</span>
                  </div>
                  <h2 className="font-display text-5xl font-bold tracking-tight text-white md:text-6xl">
                    {selectedNode.label}
                  </h2>
                  <p className="max-w-xl text-lg leading-relaxed text-slate-400">
                    Advanced synthesis of {selectedNode.label} protocols detected. Neural patterns show a high affinity for performance-critical architectures and distributed consensus mechanisms.
                  </p>
                </div>

                <div className="flex flex-col items-center gap-4 rounded-2xl bg-white/5 p-8 text-center md:min-w-[240px]">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-500">Sync Level</p>
                  <div className="relative grid place-items-center">
                     <svg className="h-32 w-32 -rotate-90">
                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                        <motion.circle
                          cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: selectedNode.level / 100 }}
                          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                          strokeLinecap="round"
                          className="text-emerald-500"
                          style={{ color: selectedNode.color }}
                        />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-white">{selectedNode.level}</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">/ 100</span>
                     </div>
                  </div>
                  <p className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest">Optimized</p>
                </div>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
                 {[
                   { label: "Commit Frequency", val: "High", trend: "+12%" },
                   { label: "Gas Efficiency", val: "94.2%", trend: "Optimum" },
                   { label: "Neural Entropy", val: "0.12", trend: "Stable" },
                 ].map((stat, i) => (
                   <div key={i} className="rounded-xl border border-white/5 bg-white/5 p-5">
                      <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xl font-bold text-white">{stat.val}</span>
                        <span className="text-[10px] text-emerald-500 font-mono">{stat.trend}</span>
                      </div>
                   </div>
                 ))}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(null);
                }}
                className="absolute right-6 top-6 z-50 grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-slate-400 transition-all hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
