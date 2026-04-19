"use client";
import { motion } from "framer-motion";
import { Camera, MessageSquare, Video, Mail, Phone, Globe, Shield, Scale } from "lucide-react";

const legalLinks = [
  { label: "Terms & Conditions", href: "#", icon: Scale },
  { label: "Privacy Policy", href: "#", icon: Shield },
  { label: "Copyright Act", href: "#", icon: Globe },
];

const socialLinks = [
  { icon: Camera, label: "Instagram", href: "#" },
  { icon: MessageSquare, label: "X (Twitter)", href: "#" },
  { icon: Video, label: "YouTube", href: "#" },
  { icon: Mail, label: "Email", href: "mailto:hello@evotree.gg" },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-emerald-500/20 bg-[#0a0a0a] p-12 overflow-hidden">
      <div className="mx-auto w-full max-w-[1600px] flex flex-col gap-12">
        
        {/* Unified Main Section */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10">
          
          {/* Brand & Identity */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div
              className="relative h-11 w-11 overflow-hidden rounded-full ring-1 ring-primary/40 flex items-center justify-center bg-transparent"
              style={{ boxShadow: "0 0 16px oklch(0.85 0.19 165 / 0.45)" }}
            >
              <img
                src="/evotree-logo.png"
                alt="EvoTree logo"
                className="h-full w-full object-cover scale-[1.15]"
                style={{ mixBlendMode: 'lighten' }}
                draggable={false}
              />
            </div>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text font-display text-3xl font-bold tracking-tight text-transparent block">
              EvoTree
            </span>
          </div>

          {/* Legal Links - Center Row */}
          <div className="flex flex-wrap items-center gap-x-12 gap-y-4">
            {legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-2.5 font-mono text-[13px] uppercase tracking-[0.12em] text-slate-400 transition-all hover:text-emerald-400"
              >
                <link.icon className="h-4 w-4 opacity-50 shrink-0" />
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Cluster: Socials & Contact */}
          <div className="flex flex-col items-start xl:items-end gap-4 shrink-0">
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ y: -2, scale: 1.1 }}
                  className="group grid h-10 w-10 place-items-center rounded-xl bg-white/5 border border-white/5 transition-all hover:border-emerald-500/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                </motion.a>
              ))}
            </div>
            <div className="flex items-center gap-2.5 font-mono text-[11px] text-slate-500 transition-colors hover:text-emerald-400 cursor-pointer">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span>+91 98765 43210</span>
            </div>
          </div>
        </div>

        {/* Root Metadata */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-mono text-slate-600 uppercase tracking-[0.2em] border-t border-white/5 pt-8">
          <p>© 2026 EVOTREE PROTOCOL // BRANCH.GG ECOSYSTEM</p>
          <div className="flex items-center gap-4">
             <span className="h-1 w-1 rounded-full bg-emerald-500/40" />
             <p>Built for Hackofiesta 7.0</p>
             <span className="h-1 w-1 rounded-full bg-emerald-500/40" />
             <p>v3.2.0-stable</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

