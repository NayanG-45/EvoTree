"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LinkNext from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, X, MoreVertical, Terminal, CheckCircle, AlertCircle } from "lucide-react";
import { useAccount } from "wagmi";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "The Crucible (Test)", href: "/crucible" },
  { label: "Profile", href: "/profile" },
];

export const Navbar = React.memo(function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const [displayText, setDisplayText] = useState("");
  const [mintStatus, setMintStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");
  const targetText = "ESTABLISHING NEURAL LINK...";
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayText(targetText.slice(0, i));
      i++;
      if (i > targetText.length) {
        setTimeout(() => { i = 0; }, 3000);
      }
    }, 70);
    return () => clearInterval(interval);
  }, []);

  const handleSyncRoot = async () => {
    if (!isConnected || !address) {
      setMintStatus("error");
      alert("Wallet not connected. Please connect your wallet to sync root.");
      setTimeout(() => setMintStatus("idle"), 3000);
      return;
    }

    try {
      setMintStatus("syncing");
      const response = await fetch("/api/mint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userWalletAddress: address, tokenId: 1 }),
      });

      if (!response.ok) {
        throw new Error("Failed to sync root");
      }

      setMintStatus("success");
      setTimeout(() => setMintStatus("idle"), 3000);
    } catch (error) {
      console.error("Sync root error:", error);
      setMintStatus("error");
      setTimeout(() => setMintStatus("idle"), 3000);
    }
  };

  const shortAddress = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";

  return (
    <header className="fixed top-0 z-[100] w-full border-b border-white/10 bg-black/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] w-full max-w-[1700px] items-center justify-between gap-4 px-8">
        
        {/* Left: Logo */}
        <LinkNext href="/">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div
              className="relative h-12 w-12 overflow-hidden rounded-full ring-1 ring-primary/40 flex items-center justify-center bg-transparent transition-transform group-hover:scale-110"
              style={{ boxShadow: "0 0 20px oklch(0.85 0.19 165 / 0.5)" }}
            >
              <img
                src="/evotree-logo.png"
                alt="EvoTree logo"
                className="h-full w-full object-cover scale-[1.15]"
                style={{ mixBlendMode: 'lighten' }}
                draggable={false}
              />
            </div>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text font-display text-3xl font-black tracking-tighter text-transparent">
              EvoTree
            </span>
          </motion.div>
        </LinkNext>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <LinkNext key={link.label} href={link.href}>
                <motion.div 
                  className="group relative px-5 py-2.5 font-mono text-[13px] font-bold uppercase tracking-[0.25em] transition-all duration-300"
                  initial={false}
                  whileHover="hover"
                >
                  <span className={`relative z-10 transition-colors duration-300 ${
                    isActive ? "text-emerald-400" : "text-slate-300 group-hover:text-white"
                  }`}>
                    {link.label}
                  </span>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="nav-line"
                      className="absolute bottom-0 left-5 right-5 h-0.5 bg-emerald-500 shadow-[0_0_10px_#10b981]"
                    />
                  )}

                  <motion.div
                    className="absolute bottom-0 left-5 right-5 h-0.5 bg-emerald-400"
                    variants={{
                      initial: { scaleX: 0, opacity: 0 },
                      hover: { scaleX: 1, opacity: 1 }
                    }}
                    transition={{ duration: 0.2 }}
                    initial="initial"
                  />
                </motion.div>
              </LinkNext>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Desktop Wallet */}
          <div className="hidden lg:flex items-center gap-3">
             <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/40 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)] min-w-[220px]">
                <Terminal className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="font-mono text-[10px] text-emerald-400/80 uppercase tracking-[0.1em] inline-block w-full">
                  {displayText}
                  <span className="inline-block w-1.5 h-3 bg-emerald-400 ml-1 animate-caret" />
                </span>
             </div>
             
             <button 
               onClick={handleSyncRoot}
               disabled={mintStatus === "syncing"}
               className="group relative flex items-center gap-3 px-7 py-3 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all duration-300 active:scale-95 disabled:opacity-50"
             >
                {/* Advanced Gradient & Pulse */}
                <div className={`absolute inset-0 bg-gradient-to-r ${mintStatus === 'error' ? 'from-red-600 to-orange-600' : 'from-emerald-600 via-cyan-600 to-blue-600'} group-hover:scale-110 transition-transform duration-500`} />
                <motion.div 
                   animate={{ opacity: [0, 0.2, 0] }}
                   transition={{ duration: 2, repeat: Infinity }}
                   className="absolute inset-0 bg-white" 
                />
                
                {/* Content */}
                <div className="relative z-10 flex items-center gap-2">
                  {mintStatus === "syncing" ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : mintStatus === "success" ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : mintStatus === "error" ? (
                    <AlertCircle className="w-4 h-4 text-white" />
                  ) : (
                    <Wallet className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
                  )}
                  <span className="font-display font-black text-[11px] uppercase tracking-[0.2em] text-white">
                     {mintStatus === "syncing" ? "Syncing..." : 
                      mintStatus === "success" ? "Success!" : 
                      isConnected ? (mintStatus === "error" ? "Retry Sync" : shortAddress) : 
                      "Plant Neural Seed"}
                  </span>
                </div>
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
                      handleSyncRoot();
                      if (isConnected && mintStatus === 'success') setMobileMenuOpen(false);
                    }}
                    disabled={mintStatus === "syncing"}
                    className="group relative w-full flex items-center justify-center gap-4 px-8 py-6 rounded-2xl overflow-hidden transition-all duration-300 active:scale-95 shadow-[0_15px_40px_rgba(16,185,129,0.3)] disabled:opacity-50"
                  >
                     <div className={`absolute inset-0 bg-gradient-to-r ${mintStatus === 'error' ? 'from-red-600 to-orange-600' : 'from-emerald-600 via-cyan-600 to-blue-600'}`} />
                     
                     <div className="relative z-10 flex items-center gap-3">
                        {mintStatus === "syncing" ? (
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : mintStatus === "success" ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : mintStatus === "error" ? (
                          <AlertCircle className="w-5 h-5 text-white" />
                        ) : (
                          <Wallet className="w-5 h-5 text-white" />
                        )}
                        <span className="font-display font-black text-sm uppercase tracking-[0.2em] text-white">
                           {mintStatus === "syncing" ? "Syncing..." : 
                            mintStatus === "success" ? "Success!" : 
                            isConnected ? (mintStatus === "error" ? "Retry Sync" : "Sync Neural Root") : 
                            "Plant Neural Seed"}
                        </span>
                     </div>
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
});
