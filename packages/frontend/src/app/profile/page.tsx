"use client";

import { useState, useEffect, useCallback } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { createClient } from "@/utils/supabase/client";
import Spline from '@splinetool/react-spline';
import { Loader2 } from "lucide-react";

import TextType from "@/components/ui/TextType";
import TiltedCard from "@/components/ui/TiltedCard";
import { Navbar } from "@/components/evotree/Navbar";
import { Footer } from "@/components/evotree/Footer";
import dynamic from 'next/dynamic';

const SplashCursor = dynamic(() => import('@/components/ui/SplashCursor'), { ssr: false });

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  
  // Form State
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    college_org: "",
    primary_skill: "",
    github: "",
    codeforces: "",
    leetcode: "",
    kaggle: ""
  });
  
  const [status, setStatus] = useState<"idle" | "loading" | "fetching" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  
  // Track if profile exists to determine state (Onboarding vs Dashboard)
  const [hasProfile, setHasProfile] = useState<boolean | null>(null); 
  const [showDashboard, setShowDashboard] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch Existing Profile Data
  const fetchProfile = useCallback(async () => {
    if (!address) return;
    
    setStatus("fetching");
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('wallet_address', address)
        .single();
        
      if (error && error.code !== 'PGRST116') { // PGRST116 is 'not found'
        throw error;
      }
      
      if (data) {
        setFormData({
          username: data.username || "",
          email: data.email || "",
          college_org: data.college_org || "",
          primary_skill: data.primary_skill || "",
          github: data.github || "",
          codeforces: data.codeforces || "",
          leetcode: data.leetcode || "",
          kaggle: data.kaggle || ""
        });
        setHasProfile(true);
        setShowDashboard(true);
      } else {
        setHasProfile(false);
        setShowDashboard(false);
      }
      setStatus("idle");
    } catch (error) {
      console.error("Error fetching profile:", error);
      setStatus("idle");
      setHasProfile(false);
    }
  }, [address, supabase]);

  useEffect(() => {
    if (isConnected && address) {
      fetchProfile();
    } else {
      // Reset state if disconnected
      setFormData({
        username: "", email: "", college_org: "", primary_skill: "",
        github: "", codeforces: "", leetcode: "", kaggle: ""
      });
      setHasProfile(null);
      setShowDashboard(false);
    }
  }, [isConnected, address, fetchProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !address) {
      setMessage("Please connect your wallet first.");
      setStatus("error");
      return;
    }
    
    if (!formData.username.trim() || !formData.email.trim()) {
      setMessage("Username and Email are required.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const { error } = await supabase
        .from('users')
        .upsert(
          { 
            wallet_address: address, 
            ...formData
          },
          { onConflict: 'wallet_address' }
        );

      if (error) throw error;

      setStatus("success");
      
      // Delay showing dashboard to allow reading the success message
      setTimeout(() => {
        setStatus("idle");
        setHasProfile(true);
        setShowDashboard(true);
      }, 3000);
    } catch (error: unknown) {
      console.error("Supabase Upsert Error:", error);
      setStatus("error");
      setMessage((error as Error).message || "Failed to save profile.");
    }
  };

  if (!isMounted) return null;

  // --- DASHBOARD LAYOUT (Layout B) ---
  if (showDashboard) {
    return (
      <div className="min-h-screen w-full bg-[#050505] text-white overflow-x-hidden relative flex flex-col">
        {/* Navigation */}
        <Navbar />

        {/* WebGL Fluid Background */}
        <SplashCursor />
        
        <main className="flex-grow relative z-10 max-w-7xl mx-auto w-full py-24 px-4 md:px-12 lg:px-24 pointer-events-auto">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <TextType 
                text={`Welcome back, ${formData.username || 'Runner'}_`} 
                typingSpeed={50} 
                className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent"
                pauseDuration={5000}
                loop={false}
              />
              <p className="text-gray-400 mt-2 font-mono">{address}</p>
            </div>
             <div className="mt-4 md:mt-0 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-60 transition duration-1000"></div>
                <div className="relative pointer-events-auto">
                  <ConnectButton />
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personal Info Card */}
            <div className="col-span-1 bg-black/60 backdrop-blur-md shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] border border-white/10 rounded-2xl p-6 z-10 relative">
              <h2 className="text-xl font-bold mb-6 text-emerald-400 border-b border-emerald-500/20 pb-2">User Identity</h2>
              <div className="space-y-4 font-mono text-sm">
                <div>
                  <span className="text-gray-500">Email:</span>
                  <div className="text-gray-200 mt-1">{formData.email || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-gray-500">College / Org:</span>
                  <div className="text-emerald-300 mt-1">{formData.college_org || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-gray-500">Primary Skill:</span>
                  <div className="text-cyan-300 mt-1">{formData.primary_skill || 'N/A'}</div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                 <button 
                  onClick={() => setShowDashboard(false)} 
                  className="w-full py-2 border border-emerald-500/30 text-emerald-400 rounded hover:bg-emerald-500/10 transition-colors font-mono text-xs cursor-pointer"
                 >
                   [ EDIT PROFILE ]
                 </button>
              </div>
            </div>

            {/* Sub-Profiles Grid */}
            <div className="col-span-1 lg:col-span-2 bg-black/60 backdrop-blur-md shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] border border-white/10 rounded-2xl p-6 z-10 relative grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* GitHub Card */}
              <div className="h-full flex flex-col items-center">
                 <TiltedCard 
                   imageSrc="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                   altText="GitHub"
                   captionText={formData.github ? `github.com/${formData.github}` : "Not Connected"}
                   containerHeight="220px"
                   imageHeight="100px"
                   imageWidth="100px"
                   rotateAmplitude={20}
                   scaleOnHover={1.05}
                   showTooltip={true}
                 />
                 {!formData.github && <p className="text-red-400 text-xs font-mono mt-2 animate-pulse cursor-pointer hover:text-red-300" onClick={() => setShowDashboard(false)}>Connect your handle now!</p>}
              </div>

               {/* LeetCode Card */}
               <div className="h-full flex flex-col items-center">
                 <TiltedCard 
                   imageSrc="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png"
                   altText="LeetCode"
                   captionText={formData.leetcode ? `leetcode.com/${formData.leetcode}` : "Not Connected"}
                   containerHeight="220px"
                   imageHeight="100px"
                   imageWidth="100px"
                   rotateAmplitude={20}
                   scaleOnHover={1.05}
                   showTooltip={true}
                 />
                 {!formData.leetcode && <p className="text-red-400 text-xs font-mono mt-2 animate-pulse cursor-pointer hover:text-red-300" onClick={() => setShowDashboard(false)}>Connect your handle now!</p>}
              </div>

              {/* Codeforces Card */}
              <div className="h-full flex flex-col items-center">
                 <TiltedCard 
                   imageSrc="https://cdn.icon-icons.com/icons2/2699/PNG/512/codeforces_logo_icon_169450.png"
                   altText="Codeforces"
                   captionText={formData.codeforces ? `codeforces.com/profile/${formData.codeforces}` : "Not Connected"}
                   containerHeight="220px"
                   imageHeight="100px"
                   imageWidth="100px"
                   rotateAmplitude={20}
                   scaleOnHover={1.05}
                   showTooltip={true}
                 />
                 {!formData.codeforces && <p className="text-red-400 text-xs font-mono mt-2 animate-pulse cursor-pointer hover:text-red-300" onClick={() => setShowDashboard(false)}>Connect your handle now!</p>}
              </div>

               {/* Kaggle Card */}
               <div className="h-full flex flex-col items-center">
                 <TiltedCard 
                   imageSrc="https://cdn.icon-icons.com/icons2/2699/PNG/512/kaggle_logo_icon_168474.png"
                   altText="Kaggle"
                   captionText={formData.kaggle ? `kaggle.com/${formData.kaggle}` : "Not Connected"}
                   containerHeight="220px"
                   imageHeight="100px"
                   imageWidth="100px"
                   rotateAmplitude={20}
                   scaleOnHover={1.05}
                   showTooltip={true}
                 />
                 {!formData.kaggle && <p className="text-red-400 text-xs font-mono mt-2 animate-pulse cursor-pointer hover:text-red-300" onClick={() => setShowDashboard(false)}>Connect your handle now!</p>}
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    );
  }


  // --- ONBOARDING LAYOUT (Layout A) ---
  return (
    <div className="h-screen overflow-hidden w-full bg-background -mt-16 pt-16"> {/* Adjust for global navbar if any */}
      <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full">
        
        {/* LEFT COLUMN: Auth & Form */}
        <div className="flex flex-col items-center justify-center p-6 lg:p-12 z-10 w-full h-full overflow-y-auto pb-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          <div className="w-full max-w-xl mx-auto space-y-8 mt-12 md:mt-24">
            
            {/* Header / Connect Button with Outer Glow */}
            <div className="flex flex-col items-center sm:items-start space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-emerald-400 to-cyan-500 bg-clip-text text-transparent">
                Terminal Access
              </h1>
              
              <div className="relative group rounded-xl">
                {/* Glowing Aura Effect behind ConnectButton */}
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative">
                  <ConnectButton />
                </div>
              </div>
            </div>

            {/* Main Form Container */}
            <div 
              className={`p-6 sm:p-8 rounded-2xl bg-[#0a0a0a] border ${
                isConnected ? 'border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.15)] opacity-100' : 'border-white/10 shadow-none opacity-50 blur-[2px] pointer-events-none'
              } transition-all duration-500 relative overflow-hidden`}
            >
              
              {!isConnected && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                  <span className="text-emerald-400 font-mono text-sm border border-emerald-500/50 bg-black/50 px-4 py-2 rounded shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                    [ AWAITING WALLET UPLINK ]
                  </span>
                </div>
              )}

              {status === "fetching" && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-md">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Basic Info */}
                  <div className="space-y-1.5 group">
                    <label className="cyber-label">Username *</label>
                    <input name="username" value={formData.username} onChange={handleChange} placeholder="CyberPunk2077" className="cyber-input" required />
                  </div>
                  <div className="space-y-1.5 group">
                    <label className="cyber-label">Email *</label>
                    <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="edge@runner.net" className="cyber-input" required />
                  </div>

                  {/* Organization & Skills */}
                  <div className="space-y-1.5 group">
                    <label className="cyber-label">College / Org</label>
                    <input name="college_org" value={formData.college_org} onChange={handleChange} placeholder="Night City Univ" className="cyber-input" />
                  </div>
                  <div className="space-y-1.5 group">
                    <label className="cyber-label">Primary Skill</label>
                    <input name="primary_skill" value={formData.primary_skill} onChange={handleChange} placeholder="Solidity / Rust" className="cyber-input" />
                  </div>

                  {/* Dev Links */}
                  <div className="space-y-1.5 group">
                    <label className="cyber-label">GitHub Handle</label>
                    <input name="github" value={formData.github} onChange={handleChange} placeholder="username" className="cyber-input" />
                  </div>
                  <div className="space-y-1.5 group">
                    <label className="cyber-label">LeetCode Profile</label>
                    <input name="leetcode" value={formData.leetcode} onChange={handleChange} placeholder="username" className="cyber-input" />
                  </div>
                  <div className="space-y-1.5 group">
                    <label className="cyber-label">Codeforces</label>
                    <input name="codeforces" value={formData.codeforces} onChange={handleChange} placeholder="username" className="cyber-input" />
                  </div>
                  <div className="space-y-1.5 group">
                    <label className="cyber-label">Kaggle</label>
                    <input name="kaggle" value={formData.kaggle} onChange={handleChange} placeholder="username" className="cyber-input" />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full relative group overflow-hidden rounded-md p-[1px] transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 opacity-60 group-hover:opacity-100 transition-opacity duration-500"></span>
                    <div className="relative bg-black px-6 py-3 rounded-md flex items-center justify-center space-x-2">
                       <span className="font-bold tracking-wider text-white text-sm uppercase">
                         {status === "loading" ? "Uplinking..." : "Save Identity"}
                       </span>
                    </div>
                  </button>
                </div>

                {hasProfile && status !== "success" && (
                    <div className="mt-4 flex justify-center">
                        <button 
                          type="button"
                          onClick={() => setShowDashboard(true)} 
                          className="text-gray-400 hover:text-emerald-400 text-xs font-mono transition-colors"
                        >
                          [ BACK TO DASHBOARD ]
                        </button>
                    </div>
                )}

                {/* Status Messaging */}
                {status === "success" && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded flex items-center justify-center min-h-[3rem]">
                     <TextType 
                        text="Identity initialization successful... Establishing secure connection..." 
                        typingSpeed={30}
                        className="text-emerald-400 text-xs font-mono text-center"
                        loop={false}
                     />
                  </div>
                )}
                {status === "error" && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono text-center rounded animate-in fade-in slide-in-from-bottom-2">
                    [ ERROR: {message} ]
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D Spline Canvas */}
        <div className="relative hidden md:block min-h-[500px] h-full w-full bg-[#050505] overflow-hidden border-l border-white/5 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
           <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none"></div>
           <Spline
              scene="https://prod.spline.design/CUDNgt3WsxDikGmn/scene.splinecode" 
              className="w-full h-full object-cover opacity-90 transition-opacity duration-1000 ease-in-out"
            />
        </div>
        
      </div>
      
      {/* Global Style overrides for this specific form to improve input affordance and UI/UX */}
      <style dangerouslySetInnerHTML={{__html: `
        .cyber-input {
          display: flex;
          height: 2.75rem;
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background-color: rgba(0, 0, 0, 0.6);
          padding: 0 1rem;
          font-size: 0.875rem;
          color: #e2e8f0;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .cyber-input::placeholder {
          color: rgba(255, 255, 255, 0.3);
          font-style: italic;
        }

        .cyber-input:hover {
          border-color: rgba(16, 185, 129, 0.3);
          background-color: rgba(10, 10, 10, 0.8);
        }

        .cyber-input:focus {
          outline: none;
          border-color: #06b6d4; /* cyan-500 */
          background-color: #000;
          box-shadow: 
            inset 0 2px 4px rgba(0, 0, 0, 0.8),
            0 0 15px rgba(6, 182, 212, 0.2);
          color: #fff;
        }

        /* Label styling for better context */
        .cyber-label {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(16, 185, 129, 0.7); /* emerald-500 with opacity */
          margin-bottom: 0.4rem;
          display: block;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        }
      `}} />
    </div>
  );
}

