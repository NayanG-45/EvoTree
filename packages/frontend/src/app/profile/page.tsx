"use client";

import { useState, useEffect } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { createClient } from "@/utils/supabase/client";

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Prevent generic hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const supabase = createClient();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) {
      setMessage("Please connect your wallet first.");
      setStatus("error");
      return;
    }
    if (!fullName.trim() || !email.trim()) return;

    setStatus("loading");
    setMessage("");

    try {
      const { error } = await supabase
        .from('users')
        .upsert(
          { 
            wallet_address: address, 
            name: fullName.trim(), 
            email: email.trim() 
          },
          { onConflict: 'wallet_address' }
        );

      if (error) {
        throw error;
      }

      setStatus("success");
      setMessage("Identity successfully saved to Supabase!");
      
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error: any) {
      console.error("Supabase Upsert Error:", error);
      setStatus("error");
      setMessage(error.message || "Failed to save to Supabase.");
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground items-center justify-center p-4">
      {/* Wallet Connection Top UI - RainbowKit ConnectButton */}
      <div className="mb-8">
        <ConnectButton />
      </div>

      {/* Glassmorphism Card */}
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-emerald-400">
            Developer Identity
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            {isConnected 
              ? "Register your core details for EvoTree" 
              : "Connect your wallet above to begin registration"}
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="fullName" className={`text-sm font-medium ${!isConnected ? 'text-neutral-500' : 'text-neutral-200'}`}>
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={!isConnected || status === "loading"}
              placeholder="e.g. Satoshi Nakamoto"
              className="flex h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className={`text-sm font-medium ${!isConnected ? 'text-neutral-500' : 'text-neutral-200'}`}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isConnected || status === "loading"}
              placeholder="e.g. satoshi@evotree.gg"
              className="flex h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!isConnected || status === "loading" || !fullName.trim() || !email.trim()}
            className={`w-full h-10 rounded-md text-sm font-semibold transition-all ${
              isConnected && fullName && email && status !== "loading"
                ? "bg-emerald-500 hover:bg-emerald-600 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
            }`}
          >
            {status === "loading" ? "Saving..." : "Save Identity"}
          </button>

          {/* Status Message */}
          {status === "success" && (
            <div className="mt-4 p-3 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center">
              {message}
            </div>
          )}
          {status === "error" && (
            <div className="mt-4 p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
