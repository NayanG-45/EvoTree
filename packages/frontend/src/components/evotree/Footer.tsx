"use client";
import { motion } from "framer-motion";
import { Camera, MessageSquare, Video, Mail, Phone } from "lucide-react";

const legalLinks = [
  { label: "Terms & Conditions", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Copyright Act", href: "#" },
];

const socialLinks = [
  { icon: Camera, label: "Instagram", href: "#" },
  { icon: MessageSquare, label: "X (Twitter)", href: "#" },
  { icon: Video, label: "YouTube", href: "#" },
  { icon: Mail, label: "Email", href: "mailto:hello@evotree.gg" },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-background-deep/80 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-[1600px] px-[clamp(1rem,3vw,2rem)] py-[clamp(1rem,2vh,1.5rem)]">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-4">
          {/* Column 1: Brand */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-start gap-2"
          >
            <div
              className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-primary/30 flex items-center justify-center bg-transparent"
              style={{ boxShadow: "0 0 12px oklch(0.85 0.19 165 / 0.3)" }}
            >
              <img
                src="/evotree-logo.png"
                alt="EvoTree logo"
                className="h-full w-full object-cover scale-[1.15]"
                style={{ mixBlendMode: 'lighten' }}
                draggable={false}
              />
            </div>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text font-display text-base font-bold text-transparent">
              EvoTree
            </span>
            <p className="font-mono text-[11px] text-slate-400">
              Powered by Branch.gg
            </p>
          </motion.div>

          {/* Column 2: Legal */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="flex flex-col items-start gap-1.5"
          >
            <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
              Legal
            </p>
            {legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-mono text-[12px] text-slate-400 transition-all duration-300 hover:-translate-y-[1px] hover:text-emerald-400"
              >
                {link.label}
              </a>
            ))}
          </motion.div>

          {/* Column 3: Contact & Socials */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col items-start gap-2 sm:items-end"
          >
            <p className="mb-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
              Connect
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ y: -2, scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="group grid h-8 w-8 place-items-center rounded-lg bg-white/5 transition-all duration-300 hover:bg-emerald-400/10 hover:shadow-[0_0_14px_rgba(52,211,153,0.3)]"
                  aria-label={social.label}
                >
                  <social.icon className="h-3.5 w-3.5 text-slate-400 transition-colors duration-300 group-hover:text-emerald-400" />
                </motion.a>
              ))}
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400 transition-colors duration-300 hover:text-emerald-400">
              <Phone className="h-3 w-3" />
              <span>+91 98765 43210</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-4 border-t border-white/5 pt-3 text-center">
          <p className="font-mono text-[10px] tracking-wide text-slate-500">
            Built for Hackofiesta 7.0 | Live On-Chain Data
          </p>
        </div>
      </div>
    </footer>
  );
}
