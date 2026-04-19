"use client";
import { useEffect, useRef } from "react";

export default function SplashCursor({
  BACK_COLOR = { r: 5, g: 5, b: 5 }, // Cyber background base
  TRANSPARENT = true,
  COLORFUL = false, // Set colorful to true for multi-color or false to use defined color
  PRIMARY_COLOR = { r: 0.0, g: 1.0, b: 0.8 }, // Cyberpunk Cyan/Emerald
}: {
  BACK_COLOR?: { r: number; g: number; b: number };
  TRANSPARENT?: boolean;
  COLORFUL?: boolean;
  PRIMARY_COLOR?: { r: number; g: number; b: number };
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function scaleByPixelRatio(input: number) {
      const pixelRatio = window.devicePixelRatio || 1;
      return Math.floor(input * pixelRatio);
    }

    function resizeCanvas() {
      if (!canvas) return false;
      const width = scaleByPixelRatio(canvas.clientWidth);
      const height = scaleByPixelRatio(canvas.clientHeight);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
      }
      return false;
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      hue: number;
    }[] = [];
    let raf: number;
    let hue = 180; // Cyan initially

    const updateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();

        const colorBase = COLORFUL
          ? `hsla(${p.hue}, 100%, 50%, ${p.alpha})`
          : `rgba(${PRIMARY_COLOR.r * 255}, ${PRIMARY_COLOR.g * 255}, ${PRIMARY_COLOR.b * 255}, ${p.alpha})`;
        
        ctx.fillStyle = colorBase;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.015;
        p.size *= 0.98;
      }

      particles = particles.filter((p) => p.alpha > 0);
      raf = requestAnimationFrame(updateParticles);
    };

    const addParticle = (x: number, y: number, dx: number, dy: number) => {
      const rect = canvas.getBoundingClientRect();
      const canvasX = (x - rect.left) * (canvas.width / rect.width);
      const canvasY = (y - rect.top) * (canvas.height / rect.height);

      for (let i = 0; i < 2; i++) {
        particles.push({
          x: canvasX,
          y: canvasY,
          vx: dx * 0.15 + (Math.random() - 0.5) * 2,
          vy: dy * 0.15 + (Math.random() - 0.5) * 2,
          size: Math.random() * 15 + 5,
          alpha: 0.7,
          hue: COLORFUL ? (hue = (hue + 1) % 360) : hue,
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      addParticle(e.clientX, e.clientY, e.movementX, e.movementY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        const touch = e.touches[0];
        // We don't have movementX/Y for touch easily without state, 
        // using 0 as default or calculating from last
        addParticle(touch.clientX, touch.clientY, 0, 0);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    updateParticles();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(raf);
    };
  }, [COLORFUL, PRIMARY_COLOR]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 0,
        background: TRANSPARENT ? "transparent" : `rgb(${BACK_COLOR.r}, ${BACK_COLOR.g}, ${BACK_COLOR.b})`,
      }}
    />
  );
}




