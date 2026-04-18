"use client";
import { useMemo } from "react";

const COLORS = ["var(--bio-1)", "var(--bio-2)", "var(--bio-3)", "var(--bio-4)", "var(--bio-5)"];

export function Particles({ count = 38 }: { count?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const size = 1 + Math.random() * 2.6;
        return {
          id: i,
          left: Math.random() * 100,
          top: 30 + Math.random() * 70,
          size,
          dx: (Math.random() - 0.5) * 120,
          dy: -(60 + Math.random() * 220),
          duration: 9 + Math.random() * 14,
          delay: -Math.random() * 20,
          color: COLORS[i % COLORS.length],
        };
      }),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 8px ${p.color}, 0 0 18px ${p.color}`,
            // @ts-expect-error css var
            "--dx": `${p.dx}px`,
            "--dy": `${p.dy}px`,
            animation: `drift ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
