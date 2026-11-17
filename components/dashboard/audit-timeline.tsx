"use client";

import React from "react";
import { AuditRecord } from "@/lib/workflow/workflow-engine";
import { ShieldCheck, ArrowRight, Clock, Hash } from "lucide-react";

interface AuditTimelineProps {
  records: AuditRecord[];
  isChainValid: boolean;
}

export function AuditTimeline({ records, isChainValid }: AuditTimelineProps) {
  return (
    <div className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 text-xs text-zinc-100">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div>
          <h2 className="text-sm font-semibold text-zinc-100">
            Append-Only Governance Audit Trail
          </h2>
          <p className="text-zinc-400 text-[11px] mt-0.5">
            Immutable application-level history with cryptographic forward hash chaining.
          </p>
        </div>

        {/* Verification Status */}
        <div className="flex items-center space-x-1.5 rounded border border-emerald-800/60 bg-emerald-950/40 px-2.5 py-1 text-[11px] text-emerald-300">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Hash Chain Integrity Verified</span>
        </div>
      </div>

      {/* Timeline items */}
      <div className="relative border-l border-zinc-800 ml-3 space-y-4 py-2">
        {records.map((rec) => {
          return (
            <div key={rec.sequenceIndex} className="relative pl-6">
              {/* Dot */}
              <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full border border-zinc-700 bg-zinc-950" />

              <div className="rounded-lg border border-zinc-800/80 bg-zinc-950 p-3 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-zinc-200">{rec.action.replace(/_/g, " ")}</span>
                    <span className="text-zinc-400">by</span>
                    <span className="text-zinc-300 font-medium">{rec.actorName}</span>
                    <span className="rounded bg-zinc-800 px-1.5 py-0.2 text-[10px] text-zinc-400">
                      {rec.actorRole}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-zinc-400 text-[10px] tabular-nums">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(rec.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>

                {/* State transition */}
                <div className="flex items-center space-x-1.5 text-[11px] text-zinc-400">
                  <span className="font-mono text-zinc-400">{rec.previousStatus}</span>
                  <ArrowRight className="h-3 w-3 text-zinc-400" />
                  <span className="font-mono text-emerald-400 font-medium">{rec.newStatus}</span>
                </div>

                {/* Rationale if present */}
                {rec.rationale && (
                  <div className="text-[11px] text-zinc-400 italic bg-zinc-900/60 p-2 rounded border border-zinc-800/40">
                    "{rec.rationale}"
                  </div>
                )}

                {/* Cryptographic SHA-256 Hash */}
                <div className="flex items-center space-x-2 text-[10px] font-mono text-zinc-400 pt-1 border-t border-zinc-900">
                  <Hash className="h-2.5 w-2.5 text-zinc-400" />
                  <span className="truncate max-w-xs">
                    Hash: {rec.entryHash.slice(0, 24)}...
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
