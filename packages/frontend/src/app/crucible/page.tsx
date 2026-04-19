"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Zap, RefreshCw, Sparkles, Activity, Cpu, GitBranch, CheckCircle, Shield, Share2, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/evotree/Navbar";
import { useAccount } from 'wagmi';

type Step = "gateway" | "loading" | "trial" | "victory";
type Subject = "React" | "Solidity" | "Python" | "JavaScript" | "TypeScript" | "Go" | "Rust" | "Bash";
type Difficulty = "Beginner" | "Intermediate" | "Master";

interface Question {
  id: number;
  question: string;
  options: string[];
  answerIndex: number;
}

export default function CruciblePage() {
  const [step, setStep] = useState<Step>("gateway");
  const [subject, setSubject] = useState<Subject | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  
  // Quiz State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  // Minting State
  const { address, isConnected } = useAccount();
  const [isMinting, setIsMinting] = useState(false);
  const [mintTxHash, setMintTxHash] = useState<string | null>(null);
  const [mintError, setMintError] = useState<string | null>(null);

  const getTokenId = (sub: Subject | null) => {
    switch (sub) {
      case "React": return 10;
      case "Solidity": return 11;
      case "Python": return 12;
      default: return 10;
    }
  };

  const handleMint = async () => {
    if (!address || !isConnected) {
      alert("Please connect your wallet first.");
      return;
    }

    setIsMinting(true);
    setMintError(null);
    try {
      const tokenId = getTokenId(subject);
      const response = await fetch('/api/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userWalletAddress: address,
          tokenId: tokenId
        })
      });

      const data = await response.json();
      if (data.success) {
        setMintTxHash(data.txHash);
      } else {
        throw new Error(data.error || "Minting failed");
      }
    } catch (err: any) {
      console.error("Minting Error:", err);
      setMintError(err.message);
    } finally {
      setIsMinting(false);
    }
  };

  const getQuestionCount = (diff: Difficulty) => {
    return diff === "Master" ? 10 : 5;
  };

  const startCrucible = async () => {
    if (!subject || !difficulty) return;
    setStep("loading");
    
    const count = getQuestionCount(difficulty);
    
    try {
      const apiKey = "AIzaSyBZoDzMejloRXqGUy6jw0SmUWb9njg0OpQ";
      const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent";
      
      const prompt = `Generate exactly ${count} multiple-choice questions about ${subject} programming at a ${difficulty} difficulty level. 
      Respond ONLY with a valid JSON array of objects. 
      Each object must have the following exact schema:
      {
        "id": number,
        "question": "The question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "answerIndex": number // (0-3 representing the correct option index)
      }
      Do not include any formatting like markdown codeblocks. Just output the pure JSON array.`;

      const response = await fetch(`${apiUrl}?key=${apiKey}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.2 }
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!textResponse) {
          throw new Error("Invalid response format from Gemini API");
      }

      const cleanedJson = textResponse.replace(/^```(json)?\n?/i, '').replace(/\n?```$/i, '').trim();
      const generatedQuestions = JSON.parse(cleanedJson);
      
      setQuestions(generatedQuestions);
      setCurrentQIndex(0);
      setScore(0);
      setSelectedOption(null);
      setStep("trial");

    } catch (error) {
       console.error("Failed to generate questions:", error);
       alert("Failed to generate test. Please try again. " + (error as Error).message);
       setStep("gateway");
    }
  };

  const submitAnswer = () => {
    if (selectedOption !== null && questions.length > 0) {
      if (selectedOption === questions[currentQIndex].answerIndex) {
        setScore(s => s + 1);
      }
      
      if (currentQIndex < questions.length - 1) {
        setCurrentQIndex(currentQIndex + 1);
        setSelectedOption(null);
      } else {
        setStep("victory");
      }
    }
  };

  const resetCrucible = () => {
    setStep("gateway");
    setSubject(null);
    setDifficulty(null);
    setQuestions([]);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setScore(0);
    setMintTxHash(null);
    setMintError(null);
  };

  return (
    <div className="min-h-screen bg-[#0f1419] text-white flex flex-col font-sans selection:bg-[#00d4ff]/30 pt-[120px] overflow-hidden relative">
      <Navbar />

      {/* Subtle background grid & glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#00d4ff]/10 rounded-full blur-[120px]"></div>
      </div>

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 lg:py-20 flex flex-col items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: THE GATEWAY */}
          {step === "gateway" && (
            <motion.div
              key="gateway"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col items-center max-w-3xl"
            >
              <div className="text-center mb-12 space-y-4">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00d4ff]/20 to-[#9d4edd]/20 flex items-center justify-center border border-[#00d4ff]/30 shadow-[0_0_30px_rgba(0,212,255,0.15)] mb-6"
                >
                  <Shield className="w-8 h-8 text-[#00d4ff]" />
                </motion.div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight font-display text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e0e0e0] to-[#a0a0a0]">
                  ENTER THE CRUCIBLE
                </h1>
                <p className="text-[#a0a0a0] text-lg font-mono uppercase tracking-[0.2em]">
                  Prove your mastery. <span className="text-[#00d4ff]">Earn Relics.</span>
                </p>
              </div>

              <div className="w-full space-y-10">
                {/* Subject Selection */}
                <div className="space-y-4">
                  <h3 className="text-sm font-mono text-[#a0a0a0] uppercase tracking-widest pl-2">Select Subject</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(["React", "Solidity", "Python", "JavaScript", "TypeScript", "Go", "Rust", "Bash"] as Subject[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSubject(s)}
                        className={`relative p-5 rounded-xl border bg-white/[0.02] backdrop-blur-md transition-all duration-300 flex items-center justify-center font-bold tracking-wide
                          ${subject === s 
                            ? 'border-[#00ff88] text-[#00ff88] shadow-[0_0_20px_rgba(0,255,136,0.15)] bg-[#00ff88]/5 scale-[1.02]' 
                            : 'border-white/10 text-white/70 hover:border-[#00d4ff]/50 hover:text-white'
                          }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Selection */}
                <div className="space-y-4">
                  <h3 className="text-sm font-mono text-[#a0a0a0] uppercase tracking-widest pl-2">Select Difficulty</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { level: "Beginner", desc: "(easy)" }, 
                      { level: "Intermediate", desc: "(hard)" }, 
                      { level: "Master", desc: "(extreme)" }
                    ].map((d) => (
                      <button
                        key={d.level}
                        onClick={() => setDifficulty(d.level as Difficulty)}
                        className={`relative p-5 rounded-xl border bg-white/[0.02] backdrop-blur-md transition-all duration-300 flex flex-col items-center justify-center gap-1
                          ${difficulty === d.level 
                            ? 'border-[#00d4ff] text-[#00d4ff] shadow-[0_0_20px_rgba(0,212,255,0.15)] bg-[#00d4ff]/5 scale-[1.02]' 
                            : 'border-white/10 text-white/70 hover:border-[#00d4ff]/50 hover:text-white'
                          }`}
                      >
                        <span className="font-bold tracking-wide">{d.level}</span>
                        <span className={`text-[10px] font-mono ${difficulty === d.level ? 'text-[#00d4ff]/70' : 'text-white/40'}`}>{d.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-8 flex justify-center">
                  <button
                    onClick={startCrucible}
                    disabled={!subject || !difficulty}
                    className={`relative overflow-hidden group px-12 py-5 rounded-full font-bold uppercase tracking-[0.2em] transition-all duration-300
                      ${subject && difficulty 
                        ? 'bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/50 hover:bg-[#00d4ff]/20 hover:shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:scale-105' 
                        : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                      }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                       Enter Crucible <ArrowRight className="w-5 h-5" />
                    </span>
                    {(subject && difficulty) && (
                       <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-[#00d4ff]/30 to-transparent" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 1.5: LOADING STATE */}
          {step === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center space-y-6"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-[#00d4ff] blur-[30px] opacity-20 rounded-full animate-pulse"></div>
                <Loader2 className="w-16 h-16 text-[#00d4ff] animate-spin relative z-10" />
              </div>
              <p className="font-mono text-[#00d4ff] uppercase tracking-widest animate-pulse">
                Generating Neural Trial...
              </p>
            </motion.div>
          )}

          {/* STEP 2: THE TRIAL (Quiz) */}
          {step === "trial" && (
            <motion.div
              key="trial"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full max-w-4xl flex flex-col"
            >
              {/* Header Bar */}
              <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-4 border-b border-white/10 gap-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded bg-[#00ff88]/10 text-[#00ff88] text-xs font-mono font-bold uppercase border border-[#00ff88]/20">{subject}</span>
                  <span className="px-3 py-1 rounded bg-[#00d4ff]/10 text-[#00d4ff] text-xs font-mono font-bold uppercase border border-[#00d4ff]/20">{difficulty}</span>
                </div>
                <div className="font-mono text-sm tracking-widest text-[#a0a0a0]">
                  Q <span className="text-white font-bold">{currentQIndex + 1}</span> / {questions.length}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-white/10 rounded-full mb-12 overflow-hidden flex">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQIndex) / Math.max(1, questions.length)) * 100}%` }}
                  className="h-full bg-gradient-to-r from-[#00d4ff] to-[#00ff88]"
                />
              </div>

              <div className="flex-1 flex flex-col justify-center">
                {/* Question Card */}
                <AnimatePresence mode="wait">
                  {questions.length > 0 && (
                  <motion.div
                    key={currentQIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <div className="bg-white/[0.02] border border-[#00d4ff]/30 rounded-2xl p-8 md:p-12 shadow-[inset_0_0_40px_rgba(0,212,255,0.05)] mb-8">
                      <h2 className="text-2xl md:text-3xl font-display font-bold leading-relaxed text-white">
                        {questions[currentQIndex].question}
                      </h2>
                    </div>

                    {/* Answers Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {questions[currentQIndex].options.map((option, idx) => {
                         const isSelected = selectedOption === idx;
                         return (
                          <button
                            key={idx}
                            onClick={() => setSelectedOption(idx)}
                            className={`p-6 text-left rounded-xl border bg-black/40 backdrop-blur-md transition-all duration-200
                              ${isSelected
                                ? 'border-[#00d4ff] shadow-[0_0_15px_rgba(0,212,255,0.2)] bg-[#00d4ff]/10 transform scale-[1.01]'
                                : 'border-white/10 hover:border-white/30 hover:bg-white/5'
                              }`}
                          >
                             <span className={`font-mono text-xs mb-2 block ${isSelected ? 'text-[#00d4ff]' : 'text-[#a0a0a0]'}`}>
                               OPTION {idx + 1}
                             </span>
                             <span className="font-medium text-lg text-white/90">
                               {option.replace(/^[A-D]\)\s*/, '')}
                             </span>
                          </button>
                         )
                      })}
                    </div>
                  </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit Button */}
              <div className="mt-12 flex justify-end">
                <button
                  disabled={selectedOption === null}
                  onClick={submitAnswer}
                  className={`px-8 py-4 rounded-xl font-bold uppercase tracking-widest transition-all duration-300 shadow-lg
                    ${selectedOption !== null
                      ? 'bg-[#00d4ff] text-[#0f1419] hover:bg-[#00d4ff] hover:shadow-[0_0_25px_rgba(0,212,255,0.4)] hover:scale-105'
                      : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
                    }`}
                >
                  {currentQIndex === questions.length - 1 ? 'Finish Trial' : 'Submit Answer'}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: VICTORY STATE */}
          {step === "victory" && (
            <motion.div
              key="victory"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col items-center text-center relative z-10 py-10"
            >
              {/* Fake Confetti particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center">
                 {[...Array(20)].map((_, i) => (
                   <motion.div
                     key={i}
                     initial={{ y: -100, x: 0, opacity: 1 }}
                     animate={{ 
                       y: 800, 
                       x: Math.random() * 400 - 200, 
                       rotate: Math.random() * 360 
                     }}
                     transition={{ 
                       duration: Math.random() * 2 + 2, 
                       repeat: Infinity, 
                       ease: "linear",
                       delay: Math.random() * 2
                     }}
                     className="absolute top-0 w-2 h-2 rounded-sm"
                     style={{ 
                       backgroundColor: i % 3 === 0 ? '#00d4ff' : i % 3 === 1 ? '#00ff88' : '#9d4edd' 
                     }}
                   />
                 ))}
              </div>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/20 text-[#00ff88] font-mono tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(0,255,136,0.2)]"
              >
                <Zap className="w-4 h-4" /> Crucible Conquered
              </motion.div>

              {/* The Relic NFT Display */}
              <motion.div 
                initial={{ rotateY: 90 }}
                animate={{ rotateY: 0 }}
                transition={{ duration: 1, type: "spring", bounce: 0.4, delay: 0.3 }}
                className="relative w-full max-w-sm aspect-[3/4] rounded-2xl bg-gradient-to-b from-[#1a1f2e] to-[#0f1419] border border-[#9d4edd]/50 shadow-[0_0_50px_rgba(157,78,221,0.2)] p-1 flex flex-col items-center justify-center group"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute inset-0 bg-[#9d4edd] blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 rounded-full" />
                
                <div className="w-full h-full rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl relative z-10 flex flex-col p-6 items-center overflow-hidden">
                  {/* Subtle pulsing core */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#9d4edd]/30 rounded-full blur-2xl animate-pulse" />
                  
                  <div className="font-mono text-xs text-[#a0a0a0] uppercase tracking-[0.3em] mb-auto self-start border-b border-white/10 pb-2 w-full text-center">
                    Crucible Relic — 01
                  </div>

                  <div className="relative my-8">
                     <Shield className="w-24 h-24 text-[#9d4edd] opacity-90 drop-shadow-[0_0_15px_rgba(157,78,221,0.5)]" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-black text-2xl text-white">{score}/{questions.length}</span>
                     </div>
                  </div>

                  <div className="mt-auto w-full text-center space-y-2">
                    <h3 className="font-display text-2xl font-bold tracking-tight text-white">{subject}</h3>
                    <p className="text-[#00d4ff] font-mono text-xs uppercase tracking-widest">{difficulty} Mastery</p>
                    <p className="text-[#a0a0a0] text-[10px] uppercase font-mono mt-4 pt-4 border-t border-white/10">Earned: Just Now</p>
                  </div>
                </div>
              </motion.div>

              <p className="text-[#a0a0a0] italic mt-10 mb-8 max-w-md">
                &quot;Your knowledge has crystallized into a verifiable on-chain asset. Your EvoTree grows stronger.&quot;
              </p>

              <div className="flex flex-col items-center gap-4 w-full justify-center max-w-md mt-6">
                <button 
                  onClick={handleMint}
                  disabled={isMinting || !!mintTxHash}
                  className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-[#9d4edd] to-[#00d4ff] text-white font-bold uppercase tracking-widest hover:shadow-[0_0_30px_rgba(157,78,221,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className={`w-5 h-5 ${isMinting ? 'animate-spin' : ''}`} />
                  {isMinting ? "FORGING..." : mintTxHash ? "RELIC FORGED" : "Mint Relic To Tree"}
                </button>
                <button onClick={resetCrucible} className="w-full px-8 py-4 rounded-xl border border-white/20 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                  <RefreshCw className="w-5 h-5" /> Try Another Trial
                </button>
              </div>

              {mintTxHash && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center w-full max-w-md"
                >
                  <p className="text-emerald-400 font-mono text-[10px] uppercase tracking-widest mb-2">Relic Anchored to Blockchain</p>
                  <a 
                    href={`https://sepolia.etherscan.io/tx/${mintTxHash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[9px] text-emerald-500/60 hover:text-emerald-400 break-all font-mono underline"
                  >
                    View: {mintTxHash}
                  </a>
                </motion.div>
              )}

              {mintError && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center w-full max-w-md"
                >
                  <p className="text-red-400 font-mono text-[10px] uppercase tracking-widest mb-1">Neural Sync Failed</p>
                  <p className="text-[9px] text-red-400/60 font-mono">{mintError}</p>
                </motion.div>
              )}

              <div className="flex items-center gap-6 mt-6">
                <button className="text-[#00d4ff]/70 hover:text-[#00d4ff] font-mono text-xs uppercase tracking-widest transition-colors flex items-center gap-2 hover:bg-[#00d4ff]/10 px-4 py-2 rounded-lg">
                  <Share2 className="w-4 h-4" /> Share Victory
                </button>
              </div>
              
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      
    </div>
  );
}
