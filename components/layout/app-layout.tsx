"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  HelpCircle,
  ChevronDown,
  Check,
  Sliders,
  ShieldAlert,
  History,
  BookOpen,
  BarChart3,
  Menu,
  X,
  RotateCcw
} from "lucide-react";
import { DEMO_PERSONAS, Persona } from "@/components/navigation/top-nav";
import { PersonaStore } from "@/lib/workflow/persona-store";
import { DemoStepperStore } from "@/lib/workflow/demo-stepper-store";
import { SubmissionsStore } from "@/lib/workflow/submissions-store";
import { WelcomeModal } from "./welcome-modal";

interface AppLayoutProps {
  children: React.ReactNode;
  activePersona?: Persona;
  onSelectPersona?: (persona: Persona) => void;
}

export function AppLayout({ children, activePersona, onSelectPersona }: AppLayoutProps) {
  const pathname = usePathname();
  const [persona, setPersona] = useState<Persona>(() => activePersona || PersonaStore.getActivePersona());
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [queueCount, setQueueCount] = useState(0);

  // Sync persona updates
  useEffect(() => {
    if (activePersona) {
      setPersona(activePersona);
    }
  }, [activePersona]);

  useEffect(() => {
    const handlePersonaChange = (e: Event) => {
      const custom = e as CustomEvent<Persona>;
      if (custom.detail) {
        setPersona(custom.detail);
      } else {
        setPersona(PersonaStore.getActivePersona());
      }
    };
    window.addEventListener("verity-persona-changed", handlePersonaChange);
    return () => window.removeEventListener("verity-persona-changed", handlePersonaChange);
  }, []);

  // Update queue count
  useEffect(() => {
    const updateQueue = () => {
      const subs = SubmissionsStore.getSubmissions();
      const count = subs.filter(
        (s) => s.status === "Sensitive Hold" || s.status === "Legal Review"
      ).length;
      setQueueCount(count);
    };
    updateQueue();
    window.addEventListener("verity-state-updated", updateQueue);
    return () => window.removeEventListener("verity-state-updated", updateQueue);
  }, []);

  // Check first visit to show welcome modal
  useEffect(() => {
    try {
      const seen = localStorage.getItem("verity_welcome_seen");
      if (!seen) {
        setIsGuideOpen(true);
      }
    } catch {
      // fallback
    }
  }, []);

  const handleCloseGuide = () => {
    setIsGuideOpen(false);
    try {
      localStorage.setItem("verity_welcome_seen", "true");
    } catch {
      // fallback
    }
  };

  const handleSelectRole = (newPersona: Persona) => {
    setPersona(newPersona);
    PersonaStore.setActivePersona(newPersona);
    if (onSelectPersona) onSelectPersona(newPersona);
    setIsRoleDropdownOpen(false);
  };

  const navLinks = [
    {
      label: "Studio",
      href: "/",
      icon: Sliders,
      active: pathname === "/",
    },
    {
      label: "Review Queue",
      href: "/review",
      icon: ShieldAlert,
      badge: queueCount > 0 ? queueCount : undefined,
      active: pathname === "/review",
    },
    {
      label: "History",
      href: "/history",
      icon: History,
      active: pathname === "/history",
    },
    {
      label: "Brand Rules",
      href: "/guidelines",
      icon: BookOpen,
      active: pathname === "/guidelines",
    },
    {
      label: "Insights",
      href: "/insights",
      icon: BarChart3,
      active: pathname === "/insights",
    },
  ];

  const getRoleDisplay = (p: Persona) => {
    if (p.role === "CREATOR") return "Rahul (Creator)";
    if (p.role === "REVIEWER") return "Ananya (Reviewer)";
    if (p.role === "MANAGER") return "Alex (Manager)";
    return "System Admin (Admin)";
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-foreground flex flex-col font-sans">
      {/* 1. Slim Top Bar */}
      <header className="sticky top-0 z-40 h-14 border-b border-border bg-card/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Mobile hamburger + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex size-7 items-center justify-center rounded-lg bg-foreground text-background">
              <Shield className="size-4" />
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-semibold tracking-tight text-foreground">
                Verity
              </span>
              <span className="text-[11px] text-muted-foreground font-mono hidden sm:inline">
                Aegis BioHealth Demo
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Guide Button + Role Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Guide Button */}
          <button
            onClick={() => setIsGuideOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors shadow-2xs"
            title="Open 2-minute product walkthrough"
          >
            <HelpCircle className="size-3.5 text-[#cf4f27]" />
            <span>Guide</span>
          </button>

          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors shadow-2xs"
            >
              <span className="size-2 rounded-full bg-[#cf4f27]" />
              <span>{getRoleDisplay(persona)}</span>
              <ChevronDown className="size-3 text-muted-foreground" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-border bg-card p-2 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2.5 py-1.5 border-b border-border mb-1 space-y-0.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                    Switch Active Role
                  </div>
                  <div className="text-[11px] text-muted-foreground leading-snug">
                    Demo mode: switch roles to see each person&apos;s view. No real sign-in.
                  </div>
                </div>

                <div className="space-y-1">
                  {DEMO_PERSONAS.map((p) => {
                    const isSelected = p.id === persona.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleSelectRole(p)}
                        className={`w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                          isSelected
                            ? "bg-muted text-foreground font-semibold"
                            : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                        }`}
                      >
                        <div>
                          <div className="text-foreground">{getRoleDisplay(p)}</div>
                          <div className="text-[10px] text-muted-foreground">{p.title}</div>
                        </div>
                        {isSelected && <Check className="size-3.5 text-foreground" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. Main Layout Container: Left Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar (Desktop) */}
        <aside className="hidden md:flex flex-col w-56 shrink-0 border-r border-border p-4 justify-between bg-card/40">
          <div className="space-y-4">
            <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold px-2">
              Navigation
            </div>
            <nav className="space-y-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      item.active
                        ? "bg-foreground text-background font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="size-3.5" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[10px] font-mono font-bold ${
                          item.active
                            ? "bg-background text-foreground"
                            : "bg-[#cf4f27] text-white"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="pt-4 border-t border-border space-y-2">
            <button
              onClick={() => DemoStepperStore.resetDemo()}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <RotateCcw className="size-3" />
              <span>Reset demo state</span>
            </button>
            <div className="text-[11px] text-center font-mono text-muted-foreground">
              Verity · Team OPK · Round 2
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-x-0 top-14 z-30 border-b border-border bg-card p-4 space-y-3 shadow-xl">
            <nav className="space-y-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                      item.active
                        ? "bg-foreground text-background font-semibold"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="size-3.5" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className="rounded-full bg-[#cf4f27] text-white px-1.5 py-0.2 text-[10px] font-mono font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
            <div className="pt-2 border-t border-border text-[11px] text-center font-mono text-muted-foreground">
              Verity · Team OPK · Round 2
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {children}
        </main>
      </div>

      {/* Welcome / Guided Demo Modal */}
      <WelcomeModal
        isOpen={isGuideOpen}
        onClose={handleCloseGuide}
        onStartDemo={handleCloseGuide}
      />
    </div>
  );
}
