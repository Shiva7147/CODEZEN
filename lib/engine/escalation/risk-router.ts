import { Finding, FindingSeverity, UserRole } from "../types";

export interface EscalationDecision {
  overallSubmissionSeverity: FindingSeverity;
  requiresReviewerApproval: boolean;
  sensitiveFindingsCount: number;
  routineFindingsCount: number;
  escalationReason?: string;
  annotatedFindings: Finding[];
}

export class RiskEscalationRouter {
  // Categories that are unconditionally treated as sensitive
  private sensitiveCategories = new Set([
    "unsupported_claim",
    "promotional_guarantee",
    "regulatory_disclosure",
    "medical_efficacy"
  ]);

  /**
   * Evaluates all findings on a submission to classify severity and route to appropriate roles.
   */
  public routeFindings(findings: Finding[]): EscalationDecision {
    let sensitiveCount = 0;
    let routineCount = 0;
    const escalationReasons: string[] = [];

    const annotatedFindings = findings.map((finding) => {
      // Determine if finding is sensitive
      const isSensitiveCategory = this.sensitiveCategories.has(finding.issueCategory);
      const isExplicitSensitive = finding.severity === "SENSITIVE";

      // If category is sensitive or already marked sensitive
      const finalSeverity: FindingSeverity =
        isSensitiveCategory || isExplicitSensitive ? "SENSITIVE" : "ROUTINE";

      // Designated role routing:
      // Sensitive -> Authorised Reviewer (cannot be dismissed by creator alone)
      // Routine -> Creator / Manager
      const assignedRole: UserRole = finalSeverity === "SENSITIVE" ? "REVIEWER" : "CREATOR";

      if (finalSeverity === "SENSITIVE") {
        sensitiveCount++;
        escalationReasons.push(
          `Clause ${finding.clauseCode || "Unknown"}: ${finding.issueCategory} (${finding.flaggedText.slice(0, 30)}...)`
        );
      } else {
        routineCount++;
      }

      return {
        ...finding,
        severity: finalSeverity,
        assignedRole
      };
    });

    const requiresReviewerApproval = sensitiveCount > 0;
    const overallSubmissionSeverity: FindingSeverity = requiresReviewerApproval ? "SENSITIVE" : "ROUTINE";

    const escalationReason = requiresReviewerApproval
      ? `Submission contains ${sensitiveCount} sensitive claim(s) requiring sign-off by an Authorised Reviewer:\n- ${escalationReasons.slice(0, 3).join("\n- ")}`
      : undefined;

    return {
      overallSubmissionSeverity,
      requiresReviewerApproval,
      sensitiveFindingsCount: sensitiveCount,
      routineFindingsCount: routineCount,
      escalationReason,
      annotatedFindings
    };
  }

  /**
   * Security guard: Determines whether a given user role can dismiss or resolve a finding.
   */
  public canUserDismissFinding(userRole: UserRole, finding: Finding): { allowed: boolean; reason?: string } {
    if (finding.severity === "SENSITIVE") {
      if (userRole !== "REVIEWER" && userRole !== "ADMIN") {
        return {
          allowed: false,
          reason: "Risk Escalation Policy: Sensitive claims cannot be dismissed or accepted by a Content Creator alone. Approval from an Authorised Reviewer (Compliance/Legal) is mandatory."
        };
      }
    }

    return { allowed: true };
  }
}
