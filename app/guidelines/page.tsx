"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { DEMO_PERSONAS, Persona } from "@/components/navigation/top-nav";
import { AEGIS_BRAND_GUIDELINE_CLAUSES } from "@/lib/data/sample-brand-guidelines";
import { StoredClause } from "@/lib/engine/verification/citation-verifier";
import { ClauseDrawer } from "@/components/review/clause-drawer";
import { PersonaStore } from "@/lib/workflow/persona-store";
import { BookOpen, Upload, Search, ArrowLeft } from "lucide-react";

export default function GuidelinesPage() {
  const [currentPersona, setCurrentPersona] = useState<Persona>(() => PersonaStore.getActivePersona());
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
    <AppLayout activePersona={currentPersona} onSelectPersona={setCurrentPersona}>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header Breadcrumb & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/"
                className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                <span>Back to Studio</span>
              </Link>
            </div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                <BookOpen className="size-5 text-muted-foreground" />
                <span>Brand Rules</span>
              </h1>
              <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-mono font-medium text-foreground">
                {clauses.length} Rules Active
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Fictional demo company: Aegis BioHealth. Authoritative source clauses, citable claims, and restricted compliance assets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card hover:bg-muted px-3 py-1.5 text-xs font-medium text-foreground cursor-pointer transition-colors shadow-2xs">
              <Upload className="size-3.5" />
              <span>Ingest Guidelines (PDF / DOCX)</span>
              <input
                type="file"
                accept=".docx,.pdf,.txt"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    alert(`Successfully ingested "${e.target.files[0].name}" into citable brand rules.`);
                  }
                }}
              />
            </label>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 py-2 text-xs shadow-xs">
          <Search className="size-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search brand rules by clause code (e.g. TERM-1.1), title, or keyword..."
            className="w-full bg-transparent text-foreground placeholder-muted-foreground focus:outline-none"
          />
        </div>

        {/* Clauses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClauses.map((clause) => (
            <div
              key={clause.id}
              onClick={() => handleOpenClause(clause)}
              className="rounded-2xl border border-border bg-card p-4 space-y-2.5 cursor-pointer hover:border-foreground/30 transition-colors shadow-xs group"
            >
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="font-mono text-xs font-semibold text-foreground group-hover:text-[#cf4f27] transition-colors">
                  {clause.clauseCode}
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                  {clause.id}
                </span>
              </div>

              <div>
                <div className="text-xs font-semibold text-foreground line-clamp-1">
                  {clause.sectionHeading}
                </div>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {clause.clauseText}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border text-[10px] font-mono text-muted-foreground">
                <span className="capitalize">{clause.category ? clause.category.replace("_", " ") : "Policy Rule"}</span>
                <span>Click to view details</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ClauseDrawer
        clause={activeClause}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </AppLayout>
  );
}
