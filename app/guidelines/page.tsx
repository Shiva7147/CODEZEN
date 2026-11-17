"use client";

import React, { useState } from "react";
import Link from "next/link";
import { OuterFrame } from "@/components/reworker/outer-frame";
import { NotchedNavbar } from "@/components/reworker/notched-navbar";
import { DEMO_PERSONAS, Persona } from "@/components/navigation/top-nav";
import { AEGIS_BRAND_GUIDELINE_CLAUSES } from "@/lib/data/sample-brand-guidelines";
import { StoredClause } from "@/lib/engine/verification/citation-verifier";
import { ClauseDrawer } from "@/components/review/clause-drawer";
import { BookOpen, Upload, Search, ArrowLeft } from "lucide-react";

export default function GuidelinesPage() {
  const [currentPersona, setCurrentPersona] = useState<Persona>(DEMO_PERSONAS[3]); // Admin by default
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [clauses, setClauses] = useState<StoredClause[]>(AEGIS_BRAND_GUIDELINE_CLAUSES);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeClause, setActiveClause] = useState<StoredClause | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filteredClauses = clauses.filter(
    (c) =>
      c.clauseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sectionHeading?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.clauseText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenClause = (clause: StoredClause) => {
    setActiveClause(clause);
    setIsDrawerOpen(true);
  };

  return (
    <OuterFrame>
      <NotchedNavbar
        currentPersona={currentPersona}
        onSelectPersona={setCurrentPersona}
      />

      <main className="mx-auto max-w-5xl px-4 pt-28 pb-20 space-y-8">
        {/* Header & Source Ingestion Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                <span>Back to Studio</span>
              </Link>
            </div>
            <h1 className="text-2xl font-normal tracking-tight text-foreground flex items-center gap-2.5">
              <BookOpen className="size-5 text-muted-foreground" />
              <span>Approved Brand Guideline Library</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1.5 font-normal">
              Authoritative source clauses, citable facts, and restricted compliance assets.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 rounded-full bg-foreground text-background hover:opacity-90 px-4 py-2 text-xs font-medium cursor-pointer transition-colors shadow-xs">
              <Upload className="size-3.5" />
              <span>Upload Guidelines (PDF / DOCX)</span>
              <input
                type="file"
                accept=".docx,.pdf,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    alert(`Successfully ingested "${e.target.files[0].name}" into citable clauses.`);
                  }
                }}
              />
            </label>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 rounded-full border border-border/70 bg-card px-4 py-2.5 text-xs shadow-xs">
          <Search className="size-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guidelines by clause code, keyword, or section..."
            className="w-full bg-transparent text-foreground placeholder-muted-foreground focus:outline-none"
          />
        </div>

        {/* Clauses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClauses.map((clause) => (
            <div
              key={clause.id}
              onClick={() => handleOpenClause(clause)}
              className="rounded-2xl border border-border/70 bg-card p-5 space-y-3 cursor-pointer hover:border-border transition-colors shadow-xs group"
            >
              <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                <span className="font-mono text-xs font-medium text-foreground group-hover:text-accent transition-colors">
                  {clause.clauseCode}
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                  {clause.id}
                </span>
              </div>

              <div>
                <div className="text-xs font-medium text-foreground line-clamp-1">
                  {clause.sectionHeading}
                </div>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed font-mono">
                  {clause.clauseText}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] font-mono text-muted-foreground">
                <span className="capitalize">{clause.category ? clause.category.replace("_", " ") : "Public Guideline"}</span>
                <span className="size-1.5 rounded-full bg-foreground" />
              </div>
            </div>
          ))}
        </div>
      </main>

      <ClauseDrawer
        clause={activeClause}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </OuterFrame>
  );
}
