"use client";

import React from "react";
import Link from "next/link";
import { UserRole } from "@/lib/engine/types";
import { ShieldCheck, User, Users, FileCheck2, BarChart3, BookOpen } from "lucide-react";

export interface Persona {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  avatarInitials: string;
}

export const DEMO_PERSONAS: Persona[] = [
  {
    id: "p_rahul",
    name: "Rahul Sharma",
    role: "CREATOR",
    title: "Agency Digital Creator",
    avatarInitials: "RS"
  },
  {
    id: "p_priya",
    name: "Priya Nair",
    role: "MANAGER",
    title: "Brand & Content Manager",
    avatarInitials: "PN"
  },
  {
    id: "p_ananya",
    name: "Ananya Sen",
    role: "REVIEWER",
    title: "Compliance & Legal Reviewer",
    avatarInitials: "AS"
  },
  {
    id: "p_admin",
    name: "System Admin",
    role: "ADMIN",
    title: "Workspace Administrator",
    avatarInitials: "AD"
  }
];

interface TopNavProps {
  currentPersona: Persona;
  onSelectPersona: (persona: Persona) => void;
}

export function TopNav({ currentPersona, onSelectPersona }: TopNavProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm">
      {/* 1-Click Persona Switcher Banner (Hackathon Law 1: Zero Login Friction) */}
      <div className="border-b border-zinc-900 bg-zinc-900/60 px-4 py-1.5 text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-2 text-zinc-400">
            <span className="font-medium text-zinc-300">1-Click Demo Persona:</span>
            <span className="text-zinc-500 hidden sm:inline">Switch roles to experience the multi-user governance flow</span>
          </div>

          <div className="flex items-center space-x-1">
            {DEMO_PERSONAS.map((p) => {
              const isActive = p.id === currentPersona.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectPersona(p)}
                  className={`flex items-center space-x-1.5 rounded-md px-2.5 py-1 text-xs transition-colors ${
                    isActive
                      ? "bg-zinc-800 text-zinc-100 font-medium ring-1 ring-zinc-700"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      p.role === "REVIEWER"
                        ? "bg-rose-400"
                        : p.role === "MANAGER"
                        ? "bg-amber-400"
                        : p.role === "CREATOR"
                        ? "bg-emerald-400"
                        : "bg-blue-400"
                    }`}
                  />
                  <span>{p.name.split(" ")[0]}</span>
                  <span className="text-[10px] text-zinc-500 uppercase tracking-wider hidden md:inline">
                    ({p.role.slice(0, 3)})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="flex h-7 w-7 items-center justify-center rounded border border-zinc-700 bg-zinc-900 text-zinc-100 transition-colors group-hover:border-zinc-500">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold tracking-tight text-zinc-100 text-sm">VERITY</span>
              <span className="text-[10px] text-zinc-400 -mt-0.5">Pre-Publication Governance</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            <Link
              href="/"
              className="flex items-center space-x-1.5 rounded-md px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100"
            >
              <FileCheck2 className="h-3.5 w-3.5 text-zinc-400" />
              <span>Review Workspace</span>
            </Link>
            <Link
              href="/guidelines"
              className="flex items-center space-x-1.5 rounded-md px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100"
            >
              <BookOpen className="h-3.5 w-3.5 text-zinc-400" />
              <span>Brand Guidelines</span>
            </Link>
            <Link
              href="/insights"
              className="flex items-center space-x-1.5 rounded-md px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-900 hover:text-zinc-100"
            >
              <BarChart3 className="h-3.5 w-3.5 text-zinc-400" />
              <span>Guideline Clarity</span>
            </Link>
          </nav>
        </div>

        {/* Current Active User Status */}
        <div className="flex items-center space-x-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-medium text-zinc-200">{currentPersona.name}</div>
            <div className="text-[11px] text-zinc-400">{currentPersona.title}</div>
          </div>
          <div className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800 text-xs font-medium text-zinc-200">
            {currentPersona.avatarInitials}
          </div>
        </div>
      </div>
    </header>
  );
}
