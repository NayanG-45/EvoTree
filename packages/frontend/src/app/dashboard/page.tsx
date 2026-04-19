import { Navbar } from "@/components/evotree/Navbar";
import { Sidebar } from "@/components/evotree/Sidebar";
import { Footer } from "@/components/evotree/Footer";
import type { Metadata } from "next";
import dynamic from 'next/dynamic';
import { Suspense } from "react";

const Canvas = dynamic(() => import('@/components/evotree/Canvas').then(mod => mod.Canvas), {
  ssr: false,
  loading: () => <div className="w-full h-full min-h-[500px] flex items-center justify-center text-emerald-500 animate-pulse font-mono text-sm border border-emerald-500/20 rounded-xl bg-black/40">[INITIALIZING NEURAL CANVAS...]</div>
});

export const metadata: Metadata = {
  title: "Dashboard | EvoTree",
  description: "View your neural growth and bioluminescent stats.",
};

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground pt-[120px] snap-y snap-mandatory overflow-y-auto scroll-smooth">
      <Navbar />
      <div className="flex w-full flex-1 flex-col md:flex-row snap-start snap-always">
        <Sidebar />
        <main className="relative min-h-[calc(100vh-76px)] w-full flex flex-col overflow-hidden">
          <div className="flex-1 relative">
            <Suspense fallback={null}>
              <Canvas />
            </Suspense>
            
            {/* Neural Ground / Digital Soil Base */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-32 pointer-events-none z-10">
              {/* Primary Glow */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-full bg-emerald-500/10 blur-[60px] rounded-full" />
              
              {/* The Glass Mound */}
              <div className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 w-[150%] h-[160px] bg-black/40 backdrop-blur-2xl border-t border-white/10 rounded-[100%] shell-glow shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
                {/* Secondary inner glow */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
              </div>

              {/* Data Particles / Root Indicators */}
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
