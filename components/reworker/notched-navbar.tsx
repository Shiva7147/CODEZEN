"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Persona, DEMO_PERSONAS } from "../navigation/top-nav";
import {
  ChevronDown,
  Check,
  ArrowUpRight,
  Presentation,
  Shield,
  UserCheck
} from "lucide-react";

interface NotchedNavbarProps {
  currentPersona: Persona;
  onSelectPersona: (persona: Persona) => void;
  onOpenPresentation?: () => void;
}

export function NotchedNavbar({
  currentPersona,
  onSelectPersona,
  onOpenPresentation,
}: NotchedNavbarProps) {
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);

  const quickLinks = [
    { label: "Studio", href: "/#studio" },
    { label: "Examples", href: "/#scenarios" },
    { label: "How It Works", href: "/#method" },
    { label: "FAQ", href: "/#faq" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-[#fafafa]/90 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6">
          <Link href="/#top" className="flex items-center gap-2.5 group">
            <span className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background">
              <Shield className="size-4" />
            </span>
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tight text-foreground group-hover:text-accent transition-colors">
                Verity
              </span>
              <span className="text-[11px] text-muted-foreground -mt-0.5 font-mono">
                Script Governance
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-border">
            {quickLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/guidelines"
              className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-medium"
            >
              Brand Rules
            </Link>
            <Link
              href="/insights"
              className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors font-medium"
            >
              Clarity Heatmap
            </Link>
          </nav>
        </div>

        {/* Right: Role Switcher, Presentation Pill, and Studio Button */}
        <div className="flex items-center gap-2.5">
          {/* 5-Slide Presentation Deck Pill */}
          {onOpenPresentation && (
            <button
              onClick={onOpenPresentation}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-1.5 text-xs text-foreground hover:bg-muted transition-colors shadow-2xs font-medium"
              title="Open 5-Slide Walkthrough Presentation"
            >
              <Presentation className="size-3.5 text-accent" />
              <span>5-Slide Walkthrough</span>
            </button>
          )}

          {/* User Persona Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsPersonaOpen(!isPersonaOpen)}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground hover:bg-muted transition-colors shadow-2xs"
            >
              <UserCheck className="size-3.5 text-muted-foreground" />
              <div className="flex items-center gap-1.5">
                <span className="font-semibold">{currentPersona.name.split(" ")[0]}</span>
                <span className="text-muted-foreground font-mono">
                  ({currentPersona.role})
                </span>
              </div>
              <ChevronDown className="size-3 text-muted-foreground" />
            </button>

            {isPersonaOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-border bg-card p-2 shadow-lg z-50">
                <div className="px-3 py-2 text-[11px] uppercase tracking-wider text-muted-foreground font-semibold border-b border-border">
                  Switch Active Role
                </div>
                <div className="py-1 space-y-1">
                  {DEMO_PERSONAS.map((p) => {
                    const isSelected = p.id === currentPersona.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          onSelectPersona(p);
                          setIsPersonaOpen(false);
                        }}
                        className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                          isSelected
                            ? "bg-muted text-foreground font-semibold"
                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                        }`}
                      >
                        <div>
                          <div className="font-medium text-foreground">{p.name}</div>
                          <div className="text-[11px] text-muted-foreground">{p.title}</div>
                        </div>
                        {isSelected && <Check className="size-3.5 text-foreground" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Main Action: Test Studio */}
          <a
            href="#studio"
            className="inline-flex items-center gap-1.5 rounded-lg bg-foreground text-background hover:opacity-90 px-4 py-2 text-xs font-semibold transition-opacity shadow-2xs"
          >
            <span>Open Studio</span>
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
