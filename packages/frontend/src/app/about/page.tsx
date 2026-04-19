"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Cpu, GitBranch, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { Navbar } from "@/components/evotree/Navbar";
import { Footer } from "@/components/evotree/Footer";


const features = [
  {
    title: "For Developers",
    items: [
      "Your achievements aren't locked in a resume vault—they're living proof",
      "Show recruiters exactly what you're capable of in a single glance",
      "Your tree travels with you, evolving across every platform you code on",
    ],
    icon: GitBranch,
    color: "var(--bio-3)",
  },
  {
    title: "For Web3",
    items: [
      "True on-chain identity tied to real skill data",
      "Tokenizable reputation (future roadmap for verifiable SBTs)",
      "Community-driven leaderboards and ecosystem rewards",
    ],
    icon: Cpu,
    color: "var(--bio-5)",
  },
  {
    title: "For Ecosystem Growth",
    items: [
      "Gamification that actually matters for your career",
      "Bridge Web2 talent with the deep Web3 opportunity ocean",
      "A platform that grows as fast as the developer community",
    ],
    icon: Zap,
    color: "var(--bio-1)",
  },
];


import CircularGallery from "@/components/ui/CircularGallery";

const galleryItems = [
  { 
    image: "/connect_root_step1_1776587742583.png",
    text: "1: CONNECT ROOT" 
  },
  { 
    image: "/sync_handles_step2_1776587758980.png",
    text: "2: SYNC NEURAL HANDLES" 
  },
  { 
    image: "/watch_grow_step3_1776587776616.png",
    text: "3: WATCH EVOTREE GROW" 
  },
  { 
    image: "/prove_skills_step4_1776587794035.png",
    text: "4: PROVE YOUR SKILLS" 
  },
  { 
    image: "/evolve_identity_step5_1776587811971.png",
    text: "5: EVOLVE IDENTITY" 
  }
];

import MagicRings from "@/components/ui/MagicRings";

export default function AboutPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [isPlanting, setIsPlanting] = useState(false);

  const handlePlantSeed = async () => {
    if (!isConnected || !address) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      setIsPlanting(true);
      const response = await fetch("/api/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userWalletAddress: address, tokenId: 0 }),
      });

      if (!response.ok) {
        throw new Error("Minting failed");
      }

      // Success - redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Planting error:", error);
      alert("Failed to plant seed. Please try again.");
    } finally {
      setIsPlanting(false);
    }
  };

  return (
    <div className="h-screen overflow-y-auto scroll-smooth snap-y snap-mandatory bg-background text-foreground selection:bg-emerald-500/30">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      
      {/* Background Neural Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px]" />
      </div>

      {/* PART 1: Hero Section */}
      <section className="snap-start h-screen pt-[120px] flex items-center justify-center relative px-6 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col lg:flex-row items-center gap-10 relative">
            {/* Left Column: Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex-1 z-10 space-y-6"
            >
              <div>
                <h1 className="font-display text-5xl lg:text-7xl font-bold tracking-tighter mb-4 leading-[0.9]">
                  Stop Proving.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                    Start Growing.
                  </span>
                </h1>
                <div className="border-l-2 border-emerald-500/30 pl-6 py-2 space-y-2">
                  <p className="font-display text-xl md:text-2xl text-slate-200 leading-tight tracking-tight">
                    Your code is <span className="text-emerald-400 font-mono font-bold glow-sm">PROOF</span>.<br />
                    Your wallet is <span className="text-cyan-400 font-mono font-bold glow-sm">REAL</span>.<br />
                    Your tree <span className="text-purple-400 font-mono font-bold glow-sm">NEVER LIES</span>.
                  </p>
                  <p className="text-slate-500 text-sm max-w-sm leading-relaxed mt-4">
                    EvoTree turns your technical achievements into a living, verifiable digital organism.
                  </p>
                </div>
              </div>
              
              <motion.button
                onClick={handlePlantSeed}
                disabled={isPlanting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-emerald-500 text-black font-black text-lg transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPlanting && <Loader2 className="w-5 h-5 animate-spin" />}
                {isPlanting ? "Planting..." : "Plant your seed"}
              </motion.button>

              {/* Quick Project Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                {[
                  { label: "Neural Identity", title: "Reputation", color: "text-emerald-400", border: "hover:border-emerald-500/50", shadow: "hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]" },
                  { label: "Dynamic Growth", title: "Evolution", color: "text-cyan-400", border: "hover:border-cyan-500/50", shadow: "hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]" },
                  { label: "Unified Hub", title: "Talent", color: "text-purple-400", border: "hover:border-purple-500/50", shadow: "hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]" }
                ].map((pillar, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ y: -5, scale: 1.05, backgroundColor: "rgba(255,255,255,0.06)" }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className={`p-3.5 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-sm transition-all duration-300 cursor-default ${pillar.border} ${pillar.shadow}`}
                  >
                    <div className={`${pillar.color} font-mono text-[9px] tracking-widest uppercase mb-1`}>{pillar.label}</div>
                    <h4 className="text-white font-bold text-sm tracking-tight">{pillar.title}</h4>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Column: EvoTree Portal - The Living Digital Organism */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="flex-1 w-full max-w-lg aspect-square relative flex items-center justify-center p-4"
            >
              {/* The core EvoTree with Pulsing Growth Animation */}
              <motion.div
                animate={{ 
                  scale: [1, 1.02, 1],
                  filter: ["brightness(1)", "brightness(1.15)", "brightness(1)"]
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute w-[80%] h-[80%] z-20 pointer-events-none rounded-full overflow-hidden shadow-[0_0_100px_rgba(0,212,255,0.2)] border border-white/10"
              >
                <img 
                  src="/evotree_portal_hero_1776591401107.png" 
                  alt="EvoTree Core" 
                  className="w-full h-full object-cover"
                />
                
                {/* Neural Atmospheric Glow Layer */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.1)_0%,transparent_70%)] z-10 animate-pulse" />
              </motion.div>

              {/* Blockchain Portal Atmosphere (MagicRings) */}
              <div className="absolute inset-x-4 inset-y-4 rounded-full border border-white/5 backdrop-blur-[1px] overflow-hidden">
                <MagicRings 
                  color="#00d4ff" 
                  colorTwo="#9d4edd" 
                  ringCount={12} 
                  speed={0.25} 
                  baseRadius={0.38} 
                  radiusStep={0.05}
                  followMouse={true}
                  mouseInfluence={0.06}
                  parallax={0.04}
                  opacity={0.4}
                />
              </div>

              {/* Counter-Clockwise Orbital Rings */}
              <div className="absolute inset-[-10px] rounded-full border border-dashed border-cyan-500/20 animate-[spin_25s_linear_infinite_reverse] pointer-events-none" />
              <div className="absolute inset-[-30px] rounded-full border border-dotted border-emerald-500/10 animate-[spin_40s_linear_infinite_reverse] pointer-events-none" />
              {/* <div className="absolute inset-[-50px] rounded-full border border-[0.5px] border-purple-500/5 animate-[spin_60s_linear_infinite] pointer-events-none" /> */}
            </motion.div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[9px] font-mono tracking-[0.3em] text-slate-500 uppercase">Evolution Pending</span>
          <div className="w-px h-8 bg-gradient-to-b from-emerald-500 to-transparent" />
        </div>
      </section>

      {/* PART 2: How it Works */}
      <section id="synthesis" className="snap-start h-screen pt-[120px] flex items-center justify-center relative px-6 overflow-hidden">
        <div className="container mx-auto max-w-6xl w-full">
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-12 gap-4">
            <h2 className="font-display text-4xl lg:text-6xl font-bold tracking-tight">The Neural Synthesis</h2>
          </div>

          <div className="h-[450px] w-full relative">
            <CircularGallery items={galleryItems} bend={3} borderRadius={0.08} scrollEase={0.05} />
          </div>
        </div>
      </section>

      {/* PART 3: Benefits */}
      <section id="benefits" className="snap-start h-screen pt-[120px] flex items-center justify-center relative px-6 overflow-hidden">
        <div className="container mx-auto max-w-6xl w-full">
          <div className="mb-12 text-center">
             <h2 className="font-display text-5xl lg:text-7xl font-bold mb-4 tracking-tight">Why EvoTree?</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: i * 0.1,
                  duration: 0.2, 
                  ease: "circOut" 
                }}
                className="group relative p-8 rounded-[2rem] bg-white/[0.02] border border-white/10 transition-all duration-200 hover:border-emerald-500/40 flex flex-col items-start min-h-[380px] overflow-hidden"
              >
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" style={{ color: feature.color }}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h4 className="text-2xl font-bold mb-6 tracking-tighter uppercase">{feature.title}</h4>
                <ul className="flex flex-col gap-4 relative z-10 w-full">
                  {feature.items.map((item, j) => (
                    <li key={j} className="flex gap-4 items-start">
                      <span className="flex-shrink-0 w-2 h-2 rounded-full mt-2" style={{ background: feature.color, boxShadow: `0 0 10px ${feature.color}` }} />
                      <p className="text-base text-slate-400 leading-snug font-medium line-clamp-2">{item}</p>
                    </li>
                  ))}
                </ul>
                <div className="absolute bottom-0 inset-x-0 h-1.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" style={{ background: feature.color }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PART 4: CTA & Footer */}
      <section className="snap-start h-screen pt-[76px] flex flex-col items-center justify-center relative px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[150px] -z-10" />
        
        <div className="flex-1 flex items-center justify-center w-full">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-10 md:p-20 rounded-[3rem] bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 backdrop-blur-xl text-center max-w-4xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <h2 className="font-display text-5xl lg:text-7xl font-bold mb-6 tracking-tighter leading-none">
              Ready to <span className="text-emerald-400">evolve?</span>
            </h2>
            <p className="text-xl lg:text-2xl text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed">
              Stop collecting static certificates. Join the forest that grows with your true potential.
            </p>
            <motion.button
              onClick={handlePlantSeed}
              disabled={isPlanting}
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(16,185,129,0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-12 py-5 rounded-full bg-emerald-500 text-black font-black text-xl lg:text-2xl transition-all shadow-[0_0_30px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed mx-auto"
            >
              {isPlanting && <Loader2 className="w-6 h-6 animate-spin" />}
              {isPlanting ? "Planting..." : "Plant your seed now"}
            </motion.button>
            
            <div className="mt-10 font-mono text-xs tracking-[0.6em] text-emerald-500/40 uppercase">
              Neural Link Established
            </div>
          </motion.div>
        </div>

      </section>
      <Footer />
    </div>
  );
}
