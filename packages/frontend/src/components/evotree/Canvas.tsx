"use client";
import { useRef, useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Particles } from "./Particles";
import { Tree, NODES } from "./Tree";

export function Canvas() {
  const ref = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5, px: 0, py: 0, inside: false });
  const [hovered, setHovered] = useState<string | null>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    setMouse({ x: px / r.width, y: py / r.height, px, py, inside: true });
  };

  const hoveredNode = hovered ? NODES.find((n) => n.id === hovered) ?? null : null;

  // Tooltip in pixel coords (clamped)
  const tooltipPos = (() => {
    if (!hoveredNode || !ref.current) return null;
    const r = ref.current.getBoundingClientRect();
    // SVG viewBox is 1000 x 720, preserveAspectRatio xMidYMax meet
    const scale = Math.min(r.width / 1000, r.height / 720);
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

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setMouse((m) => ({ ...m, inside: false }))}
      className="relative h-full w-full overflow-hidden"
      style={{ background: "var(--gradient-canvas)" }}
    >
      {/* Top header bar */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-start justify-between p-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Skill Topology
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-glow">
            Bioluminescent Codex
          </h2>
        </div>
        <div className="pointer-events-auto flex items-center gap-2">
          <button className="panel rounded-full px-4 py-2 text-xs font-medium text-foreground transition hover:text-primary">
            Filter
          </button>
          <button
            className="rounded-full px-4 py-2 text-xs font-semibold text-primary-foreground transition"
            style={{
              background: "linear-gradient(135deg, var(--primary), var(--primary-glow))",
              boxShadow: "var(--glow-primary)",
            }}
          >
            Mint Snapshot
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
        }}
        transition={{ type: "spring", stiffness: 50, damping: 18 }}
      >
        <Particles count={42} />
        <Tree hovered={hovered} setHovered={setHovered} />
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredNode && tooltipPos && (
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

      {/* Bottom legend */}
      <div className="pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2">
        <div className="panel flex items-center gap-4 px-5 py-2.5">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Hover a node
          </span>
          <span className="h-3 w-px bg-border" />
          <div className="flex items-center gap-3">
            {["var(--bio-1)", "var(--bio-2)", "var(--bio-3)", "var(--bio-4)", "var(--bio-5)"].map(
              (c) => (
                <span
                  key={c}
                  className="h-2 w-2 rounded-full"
                  style={{ background: c, boxShadow: `0 0 8px ${c}` }}
                />
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
