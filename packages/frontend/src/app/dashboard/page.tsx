import { Navbar } from "@/components/evotree/Navbar";
import { Sidebar } from "@/components/evotree/Sidebar";
import { Canvas } from "@/components/evotree/Canvas";
import { Footer } from "@/components/evotree/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | EvoTree",
  description: "View your neural growth and bioluminescent stats.",
};

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground pt-[76px]">
      <Navbar />
      <div className="flex w-full flex-1 flex-col md:flex-row">
        <Sidebar />
        <main className="relative min-h-[calc(100vh-76px)] w-full flex flex-col">
          <div className="flex-1">
            <Canvas />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
