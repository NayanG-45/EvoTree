"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Wallet, Copy, Check } from "lucide-react";

const navLinks = [
  { label: "Dashboard", href: "#" },
  { label: "The Crucible (Test)", href: "#" },
  { label: "Profile", href: "#" },
  { label: "About", href: "#" },
];

export function Navbar() {
  const [connected, setConnected] = useState(false);
  const [copied, setCopied] = useState(false);
  const address = "0x7a2f4d8b9c1e3f5a6b8d0c2e4f6a8b4e9";
  const shortAddress = "0x7a2f…b4e9";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background-deep/70 backdrop-blur-md">
      <div className="mx-auto flex h-[clamp(56px,7vh,72px)] w-full max-w-[1600px] items-center justify-between gap-4 px-[clamp(1rem,3vw,2rem)]">
        {/* Left: Logo */}
        <motion.a
          href="#"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2.5"
        >
          <div
            className="relative h-9 w-9 overflow-hidden rounded-full ring-1 ring-primary/40 flex items-center justify-center bg-transparent"
            style={{ boxShadow: "0 0 14px oklch(0.85 0.19 165 / 0.4)" }}
          >
            <img
              src="/evotree-logo.png"
              alt="EvoTree logo"
              className="h-full w-full object-cover scale-[1.15]"
              style={{ mixBlendMode: 'lighten' }}
              draggable={false}
            />
          </div>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text font-display text-lg font-bold tracking-tight text-transparent">
            EvoTree
          </span>
        </motion.a>

        {/* Center: Nav links */}
        <nav className="hidden items-center gap-1 md:flex">
          <motion.a
            href="https://evotree.gg"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative rounded-md px-3 py-2 font-mono text-[12px] uppercase tracking-[0.14em] text-emerald-400 transition-colors duration-300 hover:text-emerald-300"
          >
             <span className="relative z-10" style={{ textShadow: "0 0 8px rgba(52,211,153,0.5)" }}>Website</span>
          </motion.a>
          {navLinks.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.05 }}
              className="group relative rounded-md px-3 py-2 font-mono text-[12px] uppercase tracking-[0.14em] text-slate-400 transition-colors duration-300 hover:text-emerald-300"
            >
              <span
                className="relative z-10"
                style={{ textShadow: "0 0 0 transparent" }}
              >
                {link.label}
              </span>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-md opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "radial-gradient(circle at center, oklch(0.85 0.19 165 / 0.35), transparent 70%)" }}
              />
            </motion.a>
          ))}
        </nav>

        {/* Right: Connect Wallet */}
        <div className="flex items-center gap-2">
          {connected ? (
            <button
              onClick={handleCopy}
              className="group flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-2 font-mono text-[11px] text-primary transition-all duration-300 hover:bg-primary/20"
              style={{ boxShadow: "0 0 14px oklch(0.85 0.19 165 / 0.25)" }}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 8px var(--bio-2)" }} />
              <span>{shortAddress}</span>
              {copied ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100" />
              )}
            </button>
          ) : (
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setConnected(true)}
              className="flex items-center gap-2 rounded-full px-4 py-2 font-display text-xs font-semibold text-primary-foreground"
              style={{
                background: "linear-gradient(135deg, var(--primary), var(--primary-glow))",
                boxShadow: "var(--glow-primary)",
              }}
            >
              <Wallet className="h-3.5 w-3.5" />
              Connect Wallet
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
}
