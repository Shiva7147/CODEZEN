"use client";

import React, { useRef, useEffect } from "react";
import { ArrowRight, ArrowUpRight, Presentation, CheckCircle2 } from "lucide-react";

interface AsciiHeroProps {
  onScrollToStudio: () => void;
  onScrollToMethod: () => void;
  onOpenPresentation?: () => void;
}

export function AsciiHero({
  onScrollToStudio,
  onScrollToMethod,
  onOpenPresentation,
}: AsciiHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Soft interactive ASCII / Glyphic grid canvas that parts beneath a fluid cursor
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 1200);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 700);

    const chars = "·:;=+*#%@01VERITY";
    const fontSize = 14;
    let cols = Math.floor(width / fontSize);
    let rows = Math.floor(height / fontSize);

    let mouseX = width * 0.65;
    let mouseY = height * 0.45;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * fontSize;
          const y = r * fontSize;

          const dx = x - mouseX;
          const dy = y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const proximity = Math.max(0, 1 - dist / 220);
          if (proximity > 0.85) continue;

          const baseIndex = Math.floor(
            (Math.sin(c * 0.15 + r * 0.15 + time * 0.0008) + 1) * 3
          );
          const charIdx = Math.min(chars.length - 1, baseIndex);

          const opacity = Math.max(
            0.02,
            (0.22 - proximity * 0.2) * (1 - r / (rows * 1.3))
          );
          ctx.fillStyle = `rgba(240, 242, 245, ${opacity})`;
          ctx.font = `${fontSize - 2}px monospace`;
          ctx.fillText(chars[charIdx], x, y);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      cols = Math.floor(width / fontSize);
      rows = Math.floor(height / fontSize);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <section id="top" className="relative w-full pt-16">
      {/* Editorial Hero Container with Rounded Bottom */}
      <div className="relative isolate min-h-[580px] lg:min-h-[640px] overflow-hidden rounded-b-3xl bg-[#0e0e0e] text-white flex flex-col justify-end">
        {/* Editorial Studio Photograph */}
        <div className="absolute inset-0 select-none overflow-hidden">
          <img
            src="/hero.jpg"
            alt="Verity Editorial Studio"
            className="size-full object-cover object-center filter grayscale contrast-[1.1] brightness-[0.38] transition-all duration-700"
          />
        </div>

        {/* Ambient Warm Charcoal Tint */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0e0e0e] via-[#0e0e0e]/75 to-[#cf4f27]/15 mix-blend-multiply" />

        {/* Interactive ASCII Canvas Overlay */}
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 size-full opacity-85 transition-opacity duration-300"
          aria-hidden="true"
        />

        {/* Shadow overlays for maximum typography legibility */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e]/90 via-[#0e0e0e]/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-12 sm:py-16 w-full">
          {/* Plain Language Sub-badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs text-white/90 backdrop-blur-md font-mono">
            <span className="size-2 rounded-full bg-[#f27d55]" />
            <span>Pre-Publication Script Governance</span>
          </div>

          {/* Main Headline */}
          <h1
            id="hero-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white max-w-3xl leading-[1.15]"
          >
            Check your video scripts before you post.
            <span className="block text-white/60 font-normal mt-1">
              Never get an ad rejected or account strike again.
            </span>
          </h1>

          {/* Subtitle written in 100% human, plain English */}
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 font-normal">
            Instant rule scanner for creator captions, reels, and sponsorship scripts. Catches unapproved claims and gives you 1-click compliant fixes.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <button
              onClick={onScrollToStudio}
              className="inline-flex h-12 items-center gap-2.5 rounded-lg bg-white px-6 text-sm font-semibold text-black hover:bg-white/90 transition-colors shadow-sm"
            >
              <span>Paste Your Script in Studio</span>
              <ArrowRight className="size-4" />
            </button>

            {onOpenPresentation && (
              <button
                onClick={onOpenPresentation}
                className="inline-flex h-12 items-center gap-2 rounded-lg border border-white/25 bg-white/10 px-5 text-sm font-medium text-white backdrop-blur-md hover:bg-white/20 transition-colors"
              >
                <Presentation className="size-4 text-[#f27d55]" />
                <span>See 5-Slide Walkthrough</span>
              </button>
            )}

            <button
              onClick={onScrollToMethod}
              className="inline-flex h-12 items-center rounded-lg border border-white/15 px-4 text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              How It Works
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
