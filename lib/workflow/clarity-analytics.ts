import { StoredClause } from "../engine/verification/citation-verifier";
import { AuditRecord } from "./workflow-engine";

export interface ClauseClarityMetric {
  clauseId: string;
  clauseCode: string;
  sectionHeading: string;
  clauseText: string;
  timesFlagged: number;
  timesAccepted: number;
  timesDisputed: number;
  timesEdited: number;
  disputeRate: number; // 0% - 100%
  clarityVerdict: "HIGH_CLARITY" | "MODERATE" | "AMBIGUOUS_GUIDELINE" | "TRAINING_NEED";
  recommendation: string;
}

export function computeGuidelineClarityMetrics(
  storedClauses: StoredClause[],
  auditRecords: AuditRecord[]
): ClauseClarityMetric[] {
  const statsMap = new Map<
    string,
    {
      flagged: number;
      accepted: number;
      disputed: number;
      edited: number;
    }
  >();

  // Initialize all clauses
  for (const clause of storedClauses) {
    statsMap.set(clause.id, { flagged: 0, accepted: 0, disputed: 0, edited: 0 });
  }

  // Aggregate from audit history
  for (const record of auditRecords) {
    if (!record.clauseId) continue;
    const stat = statsMap.get(record.clauseId) || { flagged: 0, accepted: 0, disputed: 0, edited: 0 };

    if (record.action === "FINDING_ACCEPTED") {
      stat.flagged++;
      stat.accepted++;
    } else if (record.action === "FINDING_DISPUTED") {
      stat.flagged++;
      stat.disputed++;
    } else if (record.action === "FINDING_EDITED") {
      stat.flagged++;
      stat.edited++;
    }
    statsMap.set(record.clauseId, stat);
  }

  // Compute dispute rates and verdicts
  const metrics: ClauseClarityMetric[] = storedClauses.map((clause) => {
    const stat = statsMap.get(clause.id) || { flagged: 0, accepted: 0, disputed: 0, edited: 0 };
    const totalEvents = stat.flagged;
    const disputeRate = totalEvents > 0 ? Number(((stat.disputed / totalEvents) * 100).toFixed(1)) : 0;

    let clarityVerdict: ClauseClarityMetric["clarityVerdict"] = "HIGH_CLARITY";
    let recommendation = "Guideline is clearly understood and consistently adopted.";

    if (totalEvents >= 3 && disputeRate >= 25) {
      clarityVerdict = "AMBIGUOUS_GUIDELINE";
      recommendation = "High creator dispute rate indicates ambiguity. Recommend legal/brand committee redraft of this clause.";
    } else if (totalEvents >= 5 && disputeRate < 10 && stat.accepted >= 4) {
      clarityVerdict = "TRAINING_NEED";
      recommendation = "Low dispute rate with frequent recurring errors indicates team training needed rather than policy rewrite.";
    } else if (disputeRate > 10) {
      clarityVerdict = "MODERATE";
      recommendation = "Monitor dispute frequency; provide explanatory examples in brand training handbook.";
    }

    return {
      clauseId: clause.id,
      clauseCode: clause.clauseCode,
      sectionHeading: clause.sectionHeading || "General Guidelines",
      clauseText: clause.clauseText,
      timesFlagged: stat.flagged,
      timesAccepted: stat.accepted,
      timesDisputed: stat.disputed,
      timesEdited: stat.edited,
      disputeRate,
      clarityVerdict,
      recommendation
    };
  });

  // Rank by dispute rate descending (highest disputes first)
  return metrics.sort((a, b) => b.disputeRate - a.disputeRate);
}
