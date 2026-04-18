import { Navbar } from "@/components/evotree/Navbar";
import { Sidebar } from "@/components/evotree/Sidebar";
import { Canvas } from "@/components/evotree/Canvas";
import { Footer } from "@/components/evotree/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EvoTree — Bioluminescent Web3 Developer Dashboard",
  description: "EvoTree is a mystical Web3 developer dashboard that grows your skills as a living bioluminescent tree.",
};

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Navbar />
      <div className="flex w-full flex-1 flex-col md:flex-row">
        <Sidebar />
        <main className="relative min-h-screen w-full flex flex-col">
          <div className="flex-1 min-h-[800px]">
            <Canvas />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
