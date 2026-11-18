import { Finding, UserRole } from "../engine/types";
import { FIFTEEN_TEST_SUBMISSIONS, TestSubmissionCase } from "../data/test-submissions";

export type SubmissionStatus =
  | "Draft"
  | "Sensitive Hold"
  | "Legal Review"
  | "Approved"
  | "Changes Requested"
  | "Rejected";

export interface SubmissionComment {
  id: string;
  author: string;
  role: UserRole;
  timestamp: string;
  content: string;
}

export interface StoredSubmission {
  id: string;
  title: string;
  creatorName: string;
  targetChannel: string;
  statedIntent: string;
  rawText: string;
  status: SubmissionStatus;
  updatedAt: string;
  findings: Finding[];
  comments: SubmissionComment[];
}

export interface HistoryEvent {
  id: string;
  sequenceIndex: number;
  action:
    | "checked"
    | "accepted fix"
    | "disputed"
    | "escalated"
    | "commented"
    | "approved"
    | "rejected"
    | "changes_requested";
  submissionId: string;
  submissionTitle: string;
  actor: string;
  role: UserRole;
  timestamp: string;
  clauseInvolved: string;
  rationale: string;
  entryHash?: string;
}

const STORAGE_KEY_SUBMISSIONS = "verity_submissions_v2";
const STORAGE_KEY_HISTORY = "verity_history_v2";

// Initial seed history log
const INITIAL_SEED_HISTORY: HistoryEvent[] = [
  {
    id: "hist_01",
    sequenceIndex: 1,
    action: "checked",
    submissionId: "sub_test_01",
    submissionTitle: "Q3 Vitality Blend Product Launch Announcement",
    actor: "Rahul Sharma",
    role: "CREATOR",
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    clauseInvolved: "MED-1.0",
    rationale: "Creator ran initial compliance check on draft copy.",
    entryHash: "sha256:01a9f4c398e21",
  },
  {
    id: "hist_02",
    sequenceIndex: 2,
    action: "escalated",
    submissionId: "sub_test_01",
    submissionTitle: "Q3 Vitality Blend Product Launch Announcement",
    actor: "System Rule Engine",
    role: "ADMIN",
    timestamp: new Date(Date.now() - 3600000 * 2.9).toISOString(),
    clauseInvolved: "MED-1.0",
    rationale: "Sensitive claim detected ('cure chronic fatigue'). Quarantined for mandatory Legal Review.",
    entryHash: "sha256:49bd812ef901c",
  },
  {
    id: "hist_03",
    sequenceIndex: 3,
    action: "commented",
    submissionId: "sub_test_01",
    submissionTitle: "Q3 Vitality Blend Product Launch Announcement",
    actor: "Rahul Sharma",
    role: "CREATOR",
    timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(),
    clauseInvolved: "MED-1.0",
    rationale: "Our lab team has in-vitro data supporting fatigue reduction.",
    entryHash: "sha256:7c82a13f890e1",
  },
  {
    id: "hist_04",
    sequenceIndex: 4,
    action: "checked",
    submissionId: "sub_test_02",
    submissionTitle: "Fixed Income Yield Portfolio Update",
    actor: "Rahul Sharma",
    role: "CREATOR",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    clauseInvolved: "FIN-2.1",
    rationale: "Creator ran check on quarterly investor note.",
    entryHash: "sha256:91ef23c10a88b",
  },
  {
    id: "hist_05",
    sequenceIndex: 5,
    action: "escalated",
    submissionId: "sub_test_02",
    submissionTitle: "Fixed Income Yield Portfolio Update",
    actor: "System Rule Engine",
    role: "ADMIN",
    timestamp: new Date(Date.now() - 3600000 * 1.9).toISOString(),
    clauseInvolved: "FIN-2.1",
    rationale: "Financial guarantee detected ('guaranteed returns of 8.4%'). Routed to Legal Review queue.",
    entryHash: "sha256:b512c44aa019e",
  },
  {
    id: "hist_06",
    sequenceIndex: 6,
    action: "approved",
    submissionId: "sub_test_03",
    submissionTitle: "Community Member Onboarding Guide",
    actor: "Ananya Sen",
    role: "REVIEWER",
    timestamp: new Date(Date.now() - 3600000 * 1.2).toISOString(),
    clauseInvolved: "TERM-1.1",
    rationale: "Standard educational copy. All claims grounded and verified.",
    entryHash: "sha256:e091b29fc34a0",
  },
];

// Initial seed submissions
function createInitialSubmissions(): StoredSubmission[] {
  return FIFTEEN_TEST_SUBMISSIONS.map((sub, idx) => {
    let status: SubmissionStatus = "Draft";
    if (sub.id === "sub_test_01") status = "Sensitive Hold";
    else if (sub.id === "sub_test_02") status = "Legal Review";
    else if (sub.id === "sub_test_04") status = "Sensitive Hold";
    else if (sub.id === "sub_test_03") status = "Approved";

    const comments: SubmissionComment[] = [];
    if (sub.id === "sub_test_01") {
      comments.push({
        id: "c_1",
        author: "Rahul Sharma",
        role: "CREATOR",
        timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(),
        content: "Our lab team has in-vitro cellular data supporting fatigue reduction. Can we keep this phrasing with a disclaimer?",
      });
    }

    return {
      id: sub.id,
      title: sub.title,
      creatorName: "Rahul Sharma (Creator)",
      targetChannel: sub.targetChannel,
      statedIntent: sub.statedIntent,
      rawText: sub.rawText,
      status,
      updatedAt: new Date(Date.now() - (15 - idx) * 3600000).toISOString(),
      findings: [],
      comments,
    };
  });
}

// Client Storage Helper
export class SubmissionsStore {
  private static isClient(): boolean {
    return typeof window !== "undefined";
  }

  public static getSubmissions(): StoredSubmission[] {
    if (!this.isClient()) return createInitialSubmissions();
    try {
      const data = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
      if (!data) {
        const initial = createInitialSubmissions();
        localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch {
      return createInitialSubmissions();
    }
  }

  public static getSubmission(id: string): StoredSubmission | undefined {
    const list = this.getSubmissions();
    return list.find((s) => s.id === id);
  }

  public static updateSubmission(
    id: string,
    updates: Partial<StoredSubmission>
  ): StoredSubmission | undefined {
    const list = this.getSubmissions();
    const idx = list.findIndex((s) => s.id === id);
    if (idx === -1) return undefined;

    list[idx] = {
      ...list[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (this.isClient()) {
      try {
        localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(list));
        window.dispatchEvent(new Event("verity-state-updated"));
      } catch (e) {
        console.warn("Error persisting submission:", e);
      }
    }
    return list[idx];
  }

  public static addComment(
    submissionId: string,
    author: string,
    role: UserRole,
    content: string
  ): SubmissionComment | undefined {
    const submission = this.getSubmission(submissionId);
    if (!submission) return undefined;

    const newComment: SubmissionComment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      author,
      role,
      timestamp: new Date().toISOString(),
      content: content.trim(),
    };

    const updatedComments = [...(submission.comments || []), newComment];
    this.updateSubmission(submissionId, { comments: updatedComments });

    // Append history
    this.logHistory({
      action: "commented",
      submissionId,
      submissionTitle: submission.title,
      actor: author,
      role,
      clauseInvolved: "COLLAB",
      rationale: content.trim(),
    });

    return newComment;
  }

  public static updateStatus(
    submissionId: string,
    status: SubmissionStatus,
    actor: string,
    role: UserRole,
    reason: string,
    clauseCode = "GOV-1.0"
  ): StoredSubmission | undefined {
    const submission = this.getSubmission(submissionId);
    if (!submission) return undefined;

    const updated = this.updateSubmission(submissionId, { status });

    let action: HistoryEvent["action"] = "commented";
    if (status === "Approved") action = "approved";
    else if (status === "Rejected") action = "rejected";
    else if (status === "Changes Requested") action = "changes_requested";
    else if (status === "Sensitive Hold" || status === "Legal Review") action = "escalated";

    this.logHistory({
      action,
      submissionId,
      submissionTitle: submission.title,
      actor,
      role,
      clauseInvolved: clauseCode,
      rationale: reason,
    });

    return updated;
  }

  public static getHistory(): HistoryEvent[] {
    if (!this.isClient()) return INITIAL_SEED_HISTORY;
    try {
      const data = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(INITIAL_SEED_HISTORY));
        return INITIAL_SEED_HISTORY;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SEED_HISTORY;
    }
  }

  public static logHistory(event: Omit<HistoryEvent, "id" | "sequenceIndex" | "timestamp" | "entryHash">): HistoryEvent {
    const history = this.getHistory();
    const timestamp = new Date().toISOString();
    const sequenceIndex = history.length + 1;
    const entryHash = `sha256:${Math.random().toString(16).substring(2, 10)}${Date.now().toString(16)}`;

    const newRecord: HistoryEvent = {
      id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sequenceIndex,
      timestamp,
      entryHash,
      ...event,
    };

    const updated = [newRecord, ...history];

    if (this.isClient()) {
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
        window.dispatchEvent(new Event("verity-state-updated"));
      } catch (e) {
        console.warn("Error persisting history:", e);
      }
    }

    return newRecord;
  }
}
