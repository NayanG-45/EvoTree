"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LinkNext from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, X, MoreVertical } from "lucide-react";

const navLinks = [
  { label: "Dashboard", href: "/" },
  { label: "The Crucible (Test)", href: "#" },
  { label: "Profile", href: "#" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const shortAddress = "0x7a2f…b4e9";

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-white/10 bg-background-deep/70 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] w-full max-w-[1600px] items-center justify-between gap-4 px-6">
        
        {/* Left: Logo */}
        <LinkNext href="/">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5 cursor-pointer"
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
          </motion.div>
        </LinkNext>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <LinkNext key={link.label} href={link.href}>
                <div className={`relative px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 ${
                  isActive ? "text-emerald-400" : "text-slate-400 hover:text-white"
                }`}>
                  {isActive && (
                    <motion.span 
                      layoutId="nav-glow"
                      className="absolute inset-0 bg-emerald-500/5 blur-md px-4 rounded-lg"
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </div>
              </LinkNext>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Desktop Wallet */}
          <div className="hidden lg:flex items-center gap-3">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                <span className="font-mono text-[9px] text-slate-500 uppercase">Neural Sync Active</span>
             </div>
             
             <button 
               onClick={() => setConnected(!connected)}
               className="flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px] font-bold tracking-widest uppercase hover:bg-emerald-500/20 transition-all active:scale-95"
             >
                <Wallet className="w-3.5 h-3.5" />
                {connected ? shortAddress : "Sync Root"}
             </button>
          </div>

          {/* Mobile: 3-dot menu */}
          <div className="flex md:hidden">
             <button 
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-full bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-90"
             >
                <MoreVertical className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar/Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-[160] w-[300px] bg-background-deep border-l border-white/10 p-8 flex flex-col gap-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="font-display font-bold text-xl">Menu</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-white/5 transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <LinkNext 
                      key={link.label} 
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <motion.div 
                        whileHover={{ x: 5 }}
                        className={`flex items-center justify-between p-4 rounded-xl font-mono text-xs uppercase tracking-[0.2em] transition-all ${
                          isActive 
                           ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                           : "text-slate-400 hover:bg-white/5"
                        }`}
                      >
                        {link.label}
                        {isActive && <div className="h-1 w-1 rounded-full bg-emerald-400" />}
                      </motion.div>
                    </LinkNext>
                  );
                })}
              </nav>

              <div className="mt-auto">
                 <button 
                  onClick={() => {
                    setConnected(!connected);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-3 bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl text-emerald-400 font-mono text-xs font-bold tracking-widest uppercase hover:bg-emerald-500/20 transition-all"
                 >
                    <Wallet className="w-4 h-4" />
                    {connected ? "Disconnect" : "Sync Root"}
                 </button>
                 <p className="mt-6 text-center text-[10px] uppercase tracking-[0.3em] text-slate-600 font-mono">
                   EvoTree Protocol v1.0
                 </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
