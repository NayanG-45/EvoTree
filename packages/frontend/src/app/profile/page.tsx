"use client";
import { useState } from "react";
import { createClient } from '@/utils/supabase/client';

export default function ProfilePage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const supabase = createClient();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    setStatus("loading");
    setMessage("");

    try {
      const { error } = await supabase.from('users').insert([
        { 
          wallet_address: "0xTestUser", 
          name: fullName.trim(), 
          email: email.trim() 
        }
      ]);

      if (error) {
        throw error;
      }

      setStatus("success");
      setMessage("Identity securely saved to Supabase!");
      console.log("Supabase Save Success: Saved identity", { fullName, email });
      
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error: any) {
      console.error("Supabase Save Error:", error);
      setStatus("error");
      setMessage(error.message || "Failed to save to Supabase. Check console.");
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground items-center justify-center p-4">
      {/* Glassmorphism Card */}
      <div className="w-full max-w-md panel p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-display font-bold tracking-tight text-glow">
            Developer Identity
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Register your core details for EvoTree
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium text-foreground/80">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Satoshi Nakamoto"
              className="flex h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-colors"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-foreground/80">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. satoshi@evotree.gg"
              className="flex h-10 w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading" || !fullName.trim() || !email.trim()}
            className="inline-flex w-full items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 mt-4 text-primary-foreground font-semibold"
            style={{
              background: "linear-gradient(135deg, var(--primary), var(--primary-glow))",
              boxShadow: "var(--glow-primary)",
            }}
          >
            {status === "loading" ? "Saving..." : "Save Identity"}
          </button>

          {/* Status Message / Toast equivalent */}
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
