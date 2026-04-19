"use client";
import { motion } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const navLinks = [
  { label: "Dashboard", href: "/profile" },
  { label: "The Crucible (Test)", href: "#" },
  { label: "Profile", href: "/profile" },
  { label: "About", href: "#" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background-deep/70 backdrop-blur-md">
      <div className="mx-auto flex h-[clamp(56px,7vh,72px)] w-full max-w-[1600px] items-center justify-between gap-4 px-[clamp(1rem,3vw,2rem)]">
        {/* Left: Logo */}
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5"
        >
          <div
            className="relative h-11 w-11 overflow-hidden rounded-full ring-1 ring-primary/40 flex items-center justify-center bg-transparent"
            style={{ boxShadow: "0 0 16px oklch(0.85 0.19 165 / 0.45)" }}
          >
            <img
              src="/evotree-logo.png"
              alt="EvoTree logo"
              className="h-full w-full object-cover scale-[1.15]"
              style={{ mixBlendMode: 'lighten' }}
              draggable={false}
            />
          </div>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text font-display text-3xl font-bold tracking-tight text-transparent">
            EvoTree
          </span>
        </motion.a>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.05 }}
              className={`group relative rounded-md px-3 py-2 font-mono text-[12px] uppercase tracking-[0.14em] transition-colors duration-300 ${
                i === 0 ? "text-emerald-400" : "text-slate-400 hover:text-emerald-300"
              }`}
            >
              <span
                className="relative z-10"
                style={{ textShadow: i === 0 ? "0 0 8px rgba(52,211,153,0.5)" : "0 0 0 transparent" }}
              >
                {link.label}
              </span>
              <span
                aria-hidden
                className={`pointer-events-none absolute inset-0 rounded-md blur-md transition-opacity duration-300 ${
                  i === 0 ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
                style={{ background: "radial-gradient(circle at center, oklch(0.85 0.19 165 / 0.35), transparent 70%)" }}
              />
            </motion.a>
          ))}
        </nav>

        {/* Right: Connect Wallet */}
        <div className="flex items-center gap-2">
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
