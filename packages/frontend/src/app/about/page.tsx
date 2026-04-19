"use client";
import React from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Wallet, Link, TrendingUp, Activity, Zap, Cpu, GitBranch } from "lucide-react";
import LinkNext from "next/link";
import { Navbar } from "@/components/evotree/Navbar";
import { Footer } from "@/components/evotree/Footer";

const steps = [
  {
    icon: Wallet,
    title: "Step 1: Connect Your Wallet",
    desc: "Link MetaMask in one click. Your on-chain identity becomes the root. This is where your reputation lives.",
    color: "var(--bio-1)",
  },
  {
    icon: Link,
    title: "Step 2: Sync Your Handles",
    desc: "Pull your GitHub, Codeforces, LeetCode, and Kaggle profiles. Real data. Your tree feeds on what you've actually built.",
    color: "var(--bio-2)",
  },
  {
    icon: TrendingUp,
    title: "Step 3: Watch Your EvoTree Grow",
    desc: "Every commit, every solved problem—your tree evolves in real-time. Visual proof that you're leveling up.",
    color: "var(--bio-4)",
  },
];

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

const TiltCard = ({ step, index }: { step: any; index: number }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 300, damping: 30 });

  const glareX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), { stiffness: 300, damping: 30 });
  const glareY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), { stiffness: 300, damping: 30 });

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      viewport={{ once: true }}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
      className="panel relative p-8 bg-white/[0.03] border-white/5 overflow-hidden group cursor-pointer transition-colors hover:border-white/10"
    >
      {/* Dynamic Glare Overlay */}
      <motion.div 
        style={{
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.08) 0%, transparent 60%)`,
        }}
        className="absolute inset-0 pointer-events-none z-20"
      />

      <div 
        className="absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-10 blur-3xl transition-opacity group-hover:opacity-20"
        style={{ background: step.color }}
      />
      
      <div className="relative z-10" style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
         <div 
          className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-emerald-400"
          style={{ transform: "translateZ(40px)" }}
         >
            <step.icon className="w-6 h-6" style={{ color: step.color }} />
         </div>
         <h3 className="text-xl font-bold mb-3" style={{ transform: "translateZ(30px)" }}>{step.title}</h3>
         <p className="text-slate-400 leading-relaxed text-sm" style={{ transform: "translateZ(20px)" }}>{step.desc}</p>
      </div>
    </motion.div>
  );
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground selection:bg-emerald-500/30">
      <Navbar />
      
      {/* Background Neural Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px]" />
      </div>

      <div className="container mx-auto px-6 py-20 max-w-6xl">
        {/* Hero Section */}
        <section className="mb-32 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-5xl md:text-8xl font-bold tracking-tight mb-6">
              Stop Proving.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                Start Growing.
              </span>
            </h1>
            <p className="font-display text-xl md:text-2xl text-slate-400 max-w-3xl leading-relaxed">
              Your code is proof. Your wallet is real. Your tree never lies.
              EvoTree turns your actual coding achievements and on-chain reputation into a living, breathing digital identity.{" "}
              <span className="text-white font-semibold">No fluff. No BS. Just pure skill made visible.</span>
            </p>
            
            <div className="mt-12 flex flex-wrap gap-4 justify-center md:justify-start">
               <LinkNext href="/dashboard">
                  <motion.button
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: [
                        "0 0 20px rgba(16,185,129,0.4)",
                        "0 0 40px rgba(16,185,129,0.7)",
                        "0 0 20px rgba(16,185,129,0.4)"
                      ]
                    }}
                    transition={{
                      boxShadow: {
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-full bg-emerald-500 text-black font-bold text-lg transition-colors"
                  >
                    Plant your seed
                  </motion.button>
               </LinkNext>
            </div>
          </motion.div>
        </section>

        {/* How it Works */}
        <section id="synthesis" className="mb-32">
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-16 gap-4">
            <h2 className="font-display text-4xl font-bold tracking-tight">The Neural Synthesis</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent mx-8 hidden md:block" />
            <p className="text-slate-500 font-mono text-sm tracking-widest uppercase">3 Stages of Evolution</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <TiltCard key={i} step={step} index={i} />
            ))}
          </div>
        </section>

        {/* Supporting Copy - Why EvoTree? */}
        <section id="benefits">
          <div className="mb-16 text-center">
             <h2 className="font-display text-5xl font-bold mb-4 tracking-tight">Why EvoTree?</h2>
             <p className="text-slate-500 font-mono text-sm tracking-[0.3em] uppercase">Forging the ultimate developer reputation</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col gap-6 group"
              >
                <motion.div 
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.08)", borderColor: feature.color }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 transition-colors duration-300"
                >
                   <div 
                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 shadow-inner transition-transform group-hover:scale-110"
                    style={{ color: feature.color }}
                   >
                      <feature.icon className="w-5 h-5" />
                   </div>
                   <h4 className="text-lg font-bold tracking-tight">{feature.title}</h4>
                </motion.div>

                <ul className="flex flex-col gap-4">
                  {feature.items.map((item, j) => (
                    <li key={j} className="flex gap-4 group/item">
                      <span 
                        className="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5 transition-all group-hover/item:scale-150 group-hover/item:shadow-[0_0_12px_currentColor]" 
                        style={{ background: feature.color, color: feature.color, boxShadow: `0 0 6px ${feature.color}44` }} 
                      />
                      <p className="text-sm text-slate-400 group-hover/item:text-slate-200 transition-colors leading-relaxed">
                        {item}
                      </p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-40 p-12 md:p-20 rounded-[3rem] bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.1)_0%,transparent_50%)]" />
          
          <h2 className="relative z-10 font-display text-5xl md:text-7xl font-bold mb-8 tracking-tighter">
            Ready to evolve?
          </h2>
          <p className="relative z-10 text-slate-400 mb-12 max-w-xl mx-auto text-lg leading-relaxed">
            Stop collecting static certificates. Join the forest that grows with your true potential.
          </p>

          <div className="relative z-10">
            <LinkNext href="/dashboard">
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  boxShadow: [
                    "0 0 20px rgba(16,185,129,0.4)",
                    "0 0 40px rgba(16,185,129,0.7)",
                    "0 0 20px rgba(16,185,129,0.4)"
                  ]
                }}
                transition={{
                  boxShadow: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 rounded-full bg-emerald-500 text-black font-black text-xl transition-all"
              >
                Plant your seed now
              </motion.button>
            </LinkNext>
            <p className="mt-6 text-slate-600 font-mono text-[10px] uppercase tracking-[0.5em]">Neural Link Established</p>
          </div>
        </motion.section>
      </div>
      <Footer />
    </div>
  );
}
