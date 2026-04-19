"use client";

import { Navbar } from "@/components/evotree/Navbar";
import { Sidebar } from "@/components/evotree/Sidebar";
import { Footer } from "@/components/evotree/Footer";
import dynamic from 'next/dynamic';
import { Suspense, useState, useEffect, useCallback } from "react";
import { useAccount } from 'wagmi';
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, GitBranch, Cpu, Sparkles, Activity } from "lucide-react";

const Canvas = dynamic(() => import('@/components/evotree/Canvas'), {
  ssr: false,
  loading: () => <div className="w-full h-full min-h-[500px] flex items-center justify-center text-emerald-500 animate-pulse font-mono text-sm border border-emerald-500/20 rounded-xl bg-black/40">[INITIALIZING NEURAL CANVAS...]</div>
});

const supabase = createClient();

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [stats, setStats] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [growthLevel, setGrowthLevel] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchStats = useCallback(async (handles: any) => {
    setIsFetching(true);
    try {
      const response = await fetch('/api/user-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(handles),
      });
      const data = await response.json();
      setStats(data);
      
      // Calculate growth level
      const commits = data.github?.commits || 0;
      const solved = data.leetcode?.totalSolved || 0;
      
      if (commits > 300 || solved > 150) setGrowthLevel(3);
      else if (commits > 100 || solved > 50) setGrowthLevel(2);
      else setGrowthLevel(1);

    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    if (!isMounted || !isConnected || !address) return;

    const getHandlesAndFetch = async () => {
      const { data } = await supabase
        .from('users')
        .select('github, leetcode, codeforces, kaggle')
        .eq('wallet_address', address)
        .single();
      
      if (data) {
        fetchStats(data);
      } else {
        // Fallback for demo if no profile exists
        fetchStats({ github: "demo", leetcode: "demo", codeforces: "demo" });
      }
    };

    getHandlesAndFetch();
  }, [isMounted, isConnected, address, fetchStats]);

  if (!isMounted) return null;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground pt-[120px] snap-y snap-mandatory overflow-y-auto scroll-smooth">
      <Navbar />
      <div className="flex w-full flex-1 flex-col md:flex-row snap-start snap-always">
        <Sidebar stats={stats} />
        <main className="relative min-h-[calc(100vh-76px)] w-full flex flex-col overflow-hidden">
          <div className="flex-1 relative">
            <Suspense fallback={null}>
              <Canvas growthLevel={growthLevel} stats={stats} />
            </Suspense>

            {/* Neural Uplink Loading Overlay */}
            <AnimatePresence>
              {isFetching && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 animate-pulse"></div>
                      <Loader2 className="w-12 h-12 text-emerald-500 animate-spin relative z-10" />
                    </div>
                    <p className="font-mono text-emerald-500 text-xs tracking-[0.3em] uppercase animate-pulse">
                      Establishing Neural Uplink...
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Floating Stats Panel */}
            <AnimatePresence>
              {stats && !isFetching && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute right-6 bottom-32 z-40 w-72 pointer-events-auto"
                >
                  <div className="panel p-5 space-y-4 border-emerald-500/20 bg-black/60 backdrop-blur-xl shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">Neural Stats</span>
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-ping"></div>
                        <span className="text-[10px] font-mono text-emerald-500/60 uppercase group-hover:text-emerald-400 transition-colors">LIVE SYNC</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <StatItem 
                        icon={<Activity className="w-3 h-3" />} 
                        label="Commits" 
                        value={stats.github?.commits || 0} 
                        color="text-emerald-400" 
                      />
                      <StatItem 
                        icon={<Sparkles className="w-3 h-3" />} 
                        label="Status" 
                        value={stats.codeforces?.rating || "N/A"} 
                        color="text-cyan-400" 
                      />
                      <StatItem 
                        icon={<Cpu className="w-3 h-3" />} 
                        label="Solved" 
                        value={stats.leetcode?.totalSolved || 0} 
                        color="text-amber-400" 
                      />
                      <StatItem 
                        icon={<GitBranch className="w-3 h-3" />} 
                        label="Stars" 
                        value={stats.github?.stars || 0} 
                        color="text-purple-400" 
                      />
                    </div>

                    <div className="pt-2 border-t border-white/5">
                      <div className="flex justify-between items-center text-[10px] font-mono mb-1.5">
                        <span className="text-gray-500 uppercase">Growth Stage</span>
                        <span className="text-emerald-400">{growthLevel === 3 ? "BLOSSOMING" : growthLevel === 2 ? "SPROUTING" : "SEEDLING"}</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(growthLevel / 3) * 100}%` }}
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Neural Ground / Digital Soil Base */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 pointer-events-none z-10">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-full bg-emerald-500/10 blur-[60px] rounded-full" />
              <div className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 w-[150%] h-[160px] bg-black/40 backdrop-blur-2xl border-t border-white/10 rounded-[100%] shell-glow shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
              </div>

              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-12 text-[10px] font-mono text-emerald-500/40 uppercase tracking-[0.4em]">
                 <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Neural Base</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse" />
                    <span>Root Sync</span>
                 </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <div className="snap-start">
        <Footer />
      </div>
    </div>
  );
}

function StatItem({ icon, label, value, color }: { icon: any, label: string, value: any, color: string }) {
  return (
    <div className="bg-white/5 rounded-lg p-2.5 border border-white/5 flex flex-col gap-1">
      <div className={`flex items-center gap-1.5 ${color} opacity-80`}>
        {icon}
        <span className="text-[9px] font-mono uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-sm font-bold tracking-tight text-white">{value}</div>
    </div>
  );
}
