"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { OuterFrame } from "@/components/reworker/outer-frame";
import { NotchedNavbar } from "@/components/reworker/notched-navbar";
import { DEMO_PERSONAS, Persona } from "@/components/navigation/top-nav";
import { SubmissionsStore, HistoryEvent } from "@/lib/workflow/submissions-store";
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
  const [currentPersona, setCurrentPersona] = useState<Persona>(DEMO_PERSONAS[3]); // Admin by default
  const [historyList, setHistoryList] = useState<HistoryEvent[]>([]);
  const [filterAction, setFilterAction] = useState<string>("ALL");

  const refreshHistory = () => {
    setHistoryList(SubmissionsStore.getHistory());
  };

  useEffect(() => {
    refreshHistory();
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
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      case "changes_requested":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "escalated":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "disputed":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "accepted fix":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "commented":
        return "bg-zinc-100 text-zinc-700 border-zinc-200";
      case "checked":
      default:
        return "bg-muted text-foreground border-border";
    }
  };

  return (
    <OuterFrame>
      <NotchedNavbar
        currentPersona={currentPersona}
        onSelectPersona={setCurrentPersona}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 pt-24 pb-20 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Link
                href="/#studio"
                className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                <span>Back to Studio</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2.5">
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
              <Lock className="size-3 text-muted-foreground" />
              <span>Append-Only · Tamper-Evident</span>
            </span>
          </div>
        </div>

        {/* Notice Banner */}
        <div className="rounded-xl border border-border bg-muted/30 p-3.5 text-xs text-foreground flex items-center gap-2.5">
          <span className="size-2 rounded-full bg-foreground shrink-0" />
          <span className="text-[11px] leading-relaxed">
            <strong>Audit Guarantee:</strong> Every check, fix acceptance, human dispute, reviewer escalation, comment, and publication approval is permanently recorded with actor identity, timestamp, and guideline clause.
          </span>
        </div>

        {/* Action Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-muted-foreground text-xs font-mono mr-1 flex items-center gap-1">
            <Filter className="size-3" />
            <span>Filter:</span>
          </span>
          {[
            { label: "All Actions", val: "ALL" },
            { label: "Checked", val: "checked" },
            { label: "Accepted Fix", val: "accepted fix" },
            { label: "Disputed", val: "disputed" },
            { label: "Escalated", val: "escalated" },
            { label: "Commented", val: "commented" },
            { label: "Approved", val: "approved" },
            { label: "Rejected", val: "rejected" },
          ].map((item) => (
            <button
              key={item.val}
              onClick={() => setFilterAction(item.val)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                filterAction === item.val
                  ? "bg-foreground text-background"
                  : "border border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Append-Only Event Table */}
        <div className="rounded-2xl border border-border bg-card shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border text-[11px] font-mono uppercase tracking-wider text-muted-foreground bg-muted/40">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Actor & Role</th>
                  <th className="py-3 px-4">Campaign / Submission</th>
                  <th className="py-3 px-4">Clause Involved</th>
                  <th className="py-3 px-4">Reason / Notes</th>
                  <th className="py-3 px-4 text-right">Audit Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs font-sans">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-muted-foreground">
                      No matching actions found.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-muted-foreground text-[11px]">
                        {filteredHistory.length - idx}
                      </td>
                      <td className="py-3 px-4 font-mono text-muted-foreground whitespace-nowrap text-[11px]">
                        {new Date(item.timestamp).toLocaleString([], {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border ${getActionBadge(
                            item.action
                          )}`}
                        >
                          {item.action}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-medium text-foreground">{item.actor}</div>
                        <div className="text-[10px] font-mono text-muted-foreground">
                          {item.role}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-foreground max-w-xs truncate">
                        {item.submissionTitle}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-foreground whitespace-nowrap">
                        {item.clauseInvolved}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground max-w-sm leading-relaxed">
                        {item.rationale}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[10px] text-muted-foreground whitespace-nowrap">
                        {item.entryHash || `sha256:${item.id.slice(-8)}`}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </OuterFrame>
  );
}
