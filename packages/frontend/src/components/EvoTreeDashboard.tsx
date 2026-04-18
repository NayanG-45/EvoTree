"use client";

import React, { useState } from "react";
import { Terminal, Database, Cpu, Activity, LayoutTemplate } from "lucide-react";
import { motion } from "framer-motion";
import SkillTreeCanvas, { TreeConfig } from "./SkillTreeCanvas";

const mockTreeState: TreeConfig = {
  nodes: [
    { id: "root", name: "ROOT_ACCESS", x: 400, y: 720, status: "unlocked", delay: 0, xp: "10,200 XP" },
    { id: "dom", name: "DOM_PARSER", x: 220, y: 550, status: "unlocked", delay: 2.2, xp: "4,600 XP" },
    { id: "css", name: "STYLE_SHEET", x: 600, y: 520, status: "unlocked", delay: 2.2, xp: "3,100 XP" },
    { id: "react", name: "V_DOM_ENGINE", x: 420, y: 350, status: "unlocked", delay: 4.8, xp: "8,900 XP" },
    { id: "nextjs", name: "EDGE_RUNTIME", x: 280, y: 150, status: "locked", delay: 7.2, xp: "0 XP" },
    { id: "web3", name: "CONSENSUS_NET", x: 550, y: 220, status: "locked", delay: 7.2, xp: "0 XP" },
  ],
  edges: [
    { id: "e1", source: "root", target: "dom", status: "unlocked", strokeWidth: 12, delay: 0, path: "M 400 720 C 390 650, 280 620, 220 550" },
    { id: "e2", source: "root", target: "css", status: "unlocked", strokeWidth: 9, delay: 0, path: "M 400 720 C 450 680, 580 600, 600 520" },
    { id: "e3", source: "dom", target: "react", status: "unlocked", strokeWidth: 7, delay: 2.5, path: "M 220 550 C 180 430, 350 420, 420 350" },
    { id: "e4", source: "css", target: "react", status: "unlocked", strokeWidth: 6, delay: 2.5, path: "M 600 520 C 620 400, 480 380, 420 350" },
    { id: "e5", source: "react", target: "nextjs", status: "locked", strokeWidth: 3, delay: 5.0, path: "M 420 350 C 380 250, 300 250, 280 150" },
    { id: "e6", source: "react", target: "web3", status: "locked", strokeWidth: 4, delay: 5.0, path: "M 420 350 C 470 280, 500 280, 550 220" },
  ],
};

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 }
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const slideInItem: any = {
  hidden: { opacity: 0, x: -30 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export default function EvoTreeDashboard() {
  const [treeConfig] = useState<TreeConfig>(mockTreeState);

  return (
    <div className="min-h-screen text-[#E0E0E0] font-sans p-8 overflow-x-hidden bg-slate-950 relative">
      
      {/* Ambient Moving Blob Lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#B100E8]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00F0FF]/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center mb-10 pb-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
            <LayoutTemplate color="#00F0FF" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-[0.1em] text-white font-mono drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
              EVO_TREE <span className="text-[#00F0FF]">v3.0</span>
            </h1>
            <p className="text-slate-400 text-xs tracking-[0.2em] uppercase font-semibold mt-1">
              Neural Skill Architecture
            </p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-3 px-5 py-2 bg-white/5 backdrop-blur-md rounded-md border border-white/10">
            <span className="w-2 h-2 rounded-full animate-pulse bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]" />
            <span className="text-xs uppercase font-mono tracking-widest text-[#B100E8]">Link Established</span>
          </div>
        </div>
      </header>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Staggered Glassmorphism Panels */}
        <motion.div 
          className="lg:col-span-1 space-y-6"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {/* Main Architect Card */}
          <motion.div 
            variants={slideInItem}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 relative overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] hover:border-white/20"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-xs text-slate-400 uppercase tracking-[0.2em] mb-2 font-mono">Designation</h2>
                <div className="text-lg font-bold text-white flex items-center gap-3 font-mono tracking-wide">
                  <Terminal size={20} color="#00F0FF" />
                  ARCHITECT
                </div>
              </div>
              <div className="w-14 h-14 rounded-md border border-white/10 flex flex-col items-center justify-center bg-black/40">
                <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">LVL</span>
                <span className="text-xl font-bold font-mono text-[#00F0FF] drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">42</span>
              </div>
            </div>

            <div className="space-y-6 flex flex-col mt-4">
              {[
                { label: "Processing (LOGIC)", val: "84%", col: "#00F0FF", icon: <Cpu size={14} color="#00F0FF" /> },
                { label: "Bandwidth (SPEED)", val: "62%", col: "#B100E8", icon: <Activity size={14} color="#B100E8" /> },
                { label: "Storage (MEMORY)", val: "95%", col: "#00F0FF", icon: <Database size={14} color="#00F0FF" /> },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-mono tracking-wider">
                    <span className="flex items-center gap-2 text-slate-400">{stat.icon} {stat.label}</span>
                    <span style={{ color: stat.col }}>{stat.val}</span>
                  </div>
                  <div className="h-1 w-full bg-black/40 border border-white/10 overflow-hidden">
                    <div className="h-full shadow-[0_0_10px_currentColor]" style={{ width: stat.val, background: stat.col, color: stat.col }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Protocol Card */}
          <motion.div 
            variants={slideInItem}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(177,0,232,0.2)] hover:border-white/20"
          >
            <h3 className="text-xs font-mono text-slate-400 mb-5 tracking-[0.2em] uppercase">System Protocols</h3>
            <div className="flex flex-col gap-4">
              <div className="p-3 border border-white/10 bg-black/20 hover:border-[#00F0FF]/50 transition-colors cursor-pointer group">
                 <p className="text-xs font-mono text-[#00F0FF] group-hover:drop-shadow-[0_0_5px_#00F0FF]">DEPLOYMENT_SUCCESS</p>
                 <p className="text-[10px] text-slate-400 font-mono mt-1">10 nodes instantiated</p>
              </div>
              <div className="p-3 border border-white/10 bg-black/20 hover:border-[#B100E8]/50 transition-colors cursor-pointer group">
                 <p className="text-xs font-mono text-[#B100E8] group-hover:drop-shadow-[0_0_5px_#B100E8]">MEMORY_ALLOC_OK</p>
                 <p className="text-[10px] text-slate-400 font-mono mt-1">GitHub integration 100%</p>
              </div>
            </div>
          </motion.div>
          
        </motion.div>

        {/* Right Side: Engineered SVG Architecture */}
        <div className="lg:col-span-3 pb-8 relative">
            <SkillTreeCanvas treeState={treeConfig} />
        </div>

      </div>
    </div>
  );
}
