"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { DEMO_PERSONAS, Persona } from "@/components/navigation/top-nav";
import { SubmissionsStore, HistoryEvent } from "@/lib/workflow/submissions-store";
import { DemoStepperStore } from "@/lib/workflow/demo-stepper-store";
import { PersonaStore } from "@/lib/workflow/persona-store";
import {
  History,
  ShieldCheck,
  ArrowLeft,
  Filter,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  ShieldAlert,
  XCircle,
  FileText,
  Lock
} from "lucide-react";

export default function HistoryPage() {
  const [currentPersona, setCurrentPersona] = useState<Persona>(() => PersonaStore.getActivePersona());
  const [historyList, setHistoryList] = useState<HistoryEvent[]>([]);
  const [filterAction, setFilterAction] = useState<string>("ALL");

  const refreshHistory = () => {
    setHistoryList(SubmissionsStore.getHistory());
  };

  useEffect(() => {
    refreshHistory();
    // Mark Step 4 (History visited) in stepper
    DemoStepperStore.markStep("history");

    const handler = () => refreshHistory();
    window.addEventListener("verity-state-updated", handler);
    return () => window.removeEventListener("verity-state-updated", handler);
  }, []);

  const filteredHistory = filterAction === "ALL"
    ? historyList
    : historyList.filter((h) => h.action.toLowerCase() === filterAction.toLowerCase());

  const getActionBadge = (action: HistoryEvent["action"]) => {
    switch (action) {
      case "approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:border-red-900";
      case "changes_requested":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900";
      case "escalated":
        return "bg-orange-50 text-[#cf4f27] border-orange-200 dark:bg-orange-950/30 dark:border-orange-900";
      case "disputed":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:border-purple-900";
      case "accepted fix":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900";
      case "commented":
        return "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700";
      case "checked":
      default:
        return "bg-muted text-foreground border-border";
    }
  };

  return (
    <AppLayout activePersona={currentPersona} onSelectPersona={setCurrentPersona}>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header Breadcrumb */}
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
                <History className="size-5 text-muted-foreground" />
                <span>Immutable Governance History</span>
              </h1>
              <span className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-mono font-medium text-foreground">
                {historyList.length} Actions Logged
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Fictional demo company: Aegis BioHealth. Append-only chronological audit log of every human decision and rule evaluation. Entries cannot be edited or deleted.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-mono text-muted-foreground">
              <Lock className="size-3 text-emerald-600" />
              <span>Cryptographic Hash Ledger</span>
            </span>
          </div>
        </div>

        {/* Action Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground font-mono flex items-center gap-1 mr-1">
            <Filter className="size-3" />
            <span>Filter:</span>
          </span>
          {[
            { id: "ALL", label: "All Actions" },
            { id: "approved", label: "Approved" },
            { id: "accepted fix", label: "Accepted Fix" },
            { id: "escalated", label: "Escalated" },
            { id: "changes_requested", label: "Changes Requested" },
            { id: "rejected", label: "Rejected" },
            { id: "commented", label: "Commented" },
            { id: "checked", label: "Checked" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilterAction(btn.id)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                filterAction === btn.id
                  ? "bg-foreground text-background font-semibold"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Append-only Table */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-4"># Seq</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor &amp; Role</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Clause Code</th>
                  <th className="py-3 px-4">Submission / Details</th>
                  <th className="py-3 px-4">SHA-256 Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredHistory.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-mono text-muted-foreground">
                      #{String(row.sequenceIndex).padStart(3, "0")}
                    </td>
                    <td className="py-3 px-4 font-mono text-muted-foreground whitespace-nowrap">
                      {new Date(row.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground">{row.actor}</div>
                      <div className="font-mono text-[10px] text-muted-foreground uppercase">{row.role}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block rounded-full border px-2 py-0.5 text-[11px] font-mono capitalize ${getActionBadge(row.action)}`}>
                        {row.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-foreground">
                      {row.clauseInvolved || "—"}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-medium text-foreground truncate">{row.submissionTitle}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{row.rationale}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[10px] text-muted-foreground">
                      {row.entryHash || "sha256:7f81e..."}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
