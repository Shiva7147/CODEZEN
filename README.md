# Verity: Pre-Publication Brand Governance & Compliance Platform

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2.35-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-29%2F29%20Passing-brightgreen?style=flat)]()
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-gray?style=flat)]()

> **Eliminate handoff breakdowns, protect regulatory posture, and verify citations before digital marketing scripts, video reels, and brand copy ever reach the public.**

Developed by **Team OPK** (*Shiva Shankar S, Sanjay V, D V Visvajit Chandran*) for **CodeZen India 2026 — Round 2 (The Build)**.

---

## 🏆 Round 2 Submission Deliverables

- **Working Project Link (No Sign-in Required):** [https://codezen-jet.vercel.app/](https://codezen-jet.vercel.app/)
- **Source-Code Repository:** [https://github.com/Shiva7147/CODEZEN](https://github.com/Shiva7147/CODEZEN)
- **Updated Project PDF (Round 2 Submission Document):** [Download Submission PDF](public/Verity_Round2_Project_Submission_Team_OPK.pdf)
- **Product Demo Video (83s Full Walkthrough):** [Watch Video](public/videos/verity-full-product-walkthrough.mp4)

---

## 🌟 Overview & Problem Statement

Digital marketing campaigns, social media video scripts, and product launch announcements often suffer from ambiguous guidelines (e.g., *"maintain a professional yet friendly tone"*), scattered review comments, and regulatory liabilities. 

When creators or agencies use standard AI writing tools, those tools frequently hallucinate non-existent rules, fail to distinguish between routine grammar and sensitive legal liabilities, and maintain no tamper-evident audit trail.

**Verity** solves this by establishing a **hybrid deterministic and verified LLM architecture**:
- **High-Speed AST Parser & Rule Scanner**: Scans text in `<10ms` for banned terms, unapproved superlatives, and reading level.
- **Citation Verifier (Bitap Fuzzy Match)**: Requires every AI finding to quote verbatim source text from an approved brand rule, eliminating hallucinations.
- **Risk-Based Escalation Router**: Empowers authors to accept 1-click diffs for routine issues, while automatically locking and routing high-risk medical or financial guarantees to Authorised Legal Reviewers.
- **Cryptographic State Machine**: Logs every proposal, dispute, edit, and sign-off in an immutable HMAC-SHA256 forward-linked audit ledger.
- **Guideline Clarity Analytics**: Distinguishes ambiguous corporate guidelines from creator training gaps using dispute-rate heuristics.

---

## 🚀 Live Demo & One-Click Vercel Deployment

Deploy Verity directly to Vercel with zero extra setup:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Environment Variables (Optional)
Verity features **Instant Demo Insurance**: if no API key is provided, the application runs in high-fidelity demo mode with 15 verified scenarios and deterministic rules. To enable real-time Gemini generation:

| Variable | Description | Default / Fallback |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini API key for live LLM review | Fallback to verified rule database |
| `NEXT_PUBLIC_DEMO_MODE` | Forces deterministic offline fallback (`true`/`false`) | `false` |

---

## 🏗️ Architecture & Core Modules

```
                           +---------------------------+
                           |  Marketing Script Input   |
                           |  (Plain Text / DOCX / MD) |
                           +-------------+-------------+
                                         |
                                         v
                           +---------------------------+
                           | Module 2: Source Parser   |
                           |  & Clause Chunker (<10ms) |
                           +-------------+-------------+
                                         |
                     +-------------------+-------------------+
                     |                                       |
                     v                                       v
         +-----------------------+               +-----------------------+
         | Module 1: Deterministic|               | Module 3: Vector RAG  |
         | Regex & AST Matcher   |               | & Gemini Client       |
         +-----------+-----------+               +-----------+-----------+
                     |                                       |
                     +-------------------+-------------------+
                                         |
                                         v
                           +---------------------------+
                           | Module 4: Citation Check  |
                           | (Bitap Fuzzy Verification)|
                           +-------------+-------------+
                                         |
                                         v
                           +---------------------------+
                           | Module 5: Risk Escalation |
                           |  - Routine -> 1-Click Fix |
                           |  - Sensitive -> Legal Hold|
                           +-------------+-------------+
                                         |
                                         v
                           +---------------------------+
                           | Module 6: FSM Audit Trail |
                           | (HMAC-SHA256 Hash Chain)  |
                           +-------------+-------------+
                                         |
                                         v
                           +---------------------------+
                           | Module 7: UI & Heatmap    |
                           | (Inter & Tailwind Design) |
                           +---------------------------+
```

### Module Breakdown

| Module | Core Responsibility | Key Open-Source Foundations |
| :--- | :--- | :--- |
| **Module 1: Deterministic Rules Engine** | Regex AST pattern matching for prohibited hype terms, superlatives, and Flesch-Kincaid readability scoring. | Custom compiled AST, `flesch-kincaid`, `syllable` |
| **Module 2: Source Parser & Clause Chunker** | Extracts clauses from uploaded `.docx` brand guidelines, preserving paragraph boundaries and character offsets. | `mammoth`, `jszip`, `@xmldom/xmldom` |
| **Module 3: Vector Retrieval & Gemini Reviewer** | Semantic embedding retrieval of relevant brand clauses and structured Gemini analysis with verified schema. | `@google/genai`, cosine similarity |
| **Module 4: Citation Verifier (Improvement A)** | Verifies verbatim quotes using Bitap fuzzy string matching. Rejects hallucinated clauses. | `diff-match-patch`, Bitap algorithm |
| **Module 5: Risk Escalation Router (Improvement B)** | Classifies findings into ROUTINE vs SENSITIVE. Enforces security lock preventing authors from dismissing legal claims. | Policy escalation rules |
| **Module 6: Governance State Machine & Ledger** | Strict role-based transitions (Creator, Manager, Reviewer) backed by an HMAC-SHA256 forward-linked audit log. | Finite state machine, Web Crypto API |
| **Module 7: Presentation UI & Clarity Heatmap** | High-craft progressive disclosure UI, interactive diff editor, and clause dispute ranking heatmap. | Next.js 14 App Router, Radix UI, Lucide |

---

## 🧪 Comprehensive Verification & Test Suite

Verity includes an automated test runner validating all **29 exit criteria** across the 6 core functional modules and the **15 Round 1 Test Submissions**:

```bash
npx tsx test-runner.ts
```

### Test Suite Execution Output
```
================================================================================
   VERITY COMPREHENSIVE END-TO-END TEST SUITE (ROUNDS 1, 2 & 3 EXIT CRITERIA)   
================================================================================

--- TEST GROUP 1: MODULE 1 DETERMINISTIC RULES ENGINE ---
  ✅ [PASS] Detects multiple banned terms ('cheap', 'cure', 'users')
  ✅ [PASS] Recommends approved replacement 'cost-effective' for 'cheap'
  ✅ [PASS] Computes Flesch Reading Ease score
  ✅ [PASS] Computes Flesch-Kincaid Grade Level
  ✅ [PASS] Sub-millisecond execution latency (8.87 ms)

--- TEST GROUP 2: MODULE 4 CITATION VERIFICATION (IMPROVEMENT A) ---
  ✅ [PASS] Valid quote verified as confirmed (100% Match)
  ✅ [PASS] Rejects hallucinated non-existent Clause ID
  ✅ [PASS] Flags fabricated quote divergence as low_confidence

--- TEST GROUP 3: MODULE 5 RISK ESCALATION ROUTER (IMPROVEMENT B) ---
  ✅ [PASS] Routine findings do not trigger Reviewer Escalation
  ✅ [PASS] Sensitive findings ('cure' / 'guaranteed') trigger Reviewer Escalation
  ✅ [PASS] Security Lock: Creator cannot unilaterally dismiss or accept sensitive claims

--- TEST GROUP 4: MODULE 6 STATE MACHINE & CRYPTOGRAPHIC AUDIT LOG ---
  ✅ [PASS] HMAC-SHA256 forward-linked hash chain verifies as 100% tamper-evident

--- TEST GROUP 5: 15 TEST SUBMISSIONS VERIFICATION (ROUND 1 EXIT CRITERIA) ---
  ✅ [PASS] Scenario #1 (Q3 Vitality Blend Launch): Successfully escalates sensitive claims
  ✅ [PASS] Scenario #2 (Fixed Income Yield Update): Successfully escalates sensitive claims
  ✅ [PASS] Scenario #3 (Community Onboarding Guide): Zero false positives on compliant copy
  ✅ [PASS] Scenario #4 (Website Homepage Hero): Successfully escalates sensitive claims
  ✅ [PASS] Scenario #5 (Annual Checkup FAQ): Zero false positives on compliant copy
  ✅ [PASS] Scenario #6 (Social Media Micro-Campaign): Successfully escalates sensitive claims
  ✅ [PASS] Scenario #7 (Complex Multi-Clause Regulatory): Evaluated successfully
  ✅ [PASS] Scenario #8 (DOCX Digital Asset Guidelines): Evaluated successfully
  ✅ [PASS] Scenario #9 (Synthetic Hallucination Boundary Test): Hallucination rejected
  ✅ [PASS] Scenario #10 (Fictitious Quote Divergence): Divergence flagged low confidence
  ✅ [PASS] Scenario #11 (Dispute and Override Tracking): Audit trail records overrides
  ✅ [PASS] Scenario #12 (Ambiguous Tone Dispute Benchmark): Clarity analytics flagged
  ✅ [PASS] Scenario #13 (Edge Case - Empty Input): Pipeline executes safely
  ✅ [PASS] Scenario #14 (Edge Case - Malformed Document): Pipeline executes safely
  ✅ [PASS] Scenario #15 (Special Characters & Unicode): Successfully escalates sensitive claims

--- TEST GROUP 6: GUIDELINE CLARITY RANKING (IMPROVEMENT C) ---
  ✅ [PASS] Calculates metrics for all brand guideline clauses
  ✅ [PASS] Dispute rate calculated as valid percentage

================================================================================
   TEST RESULTS: 29 / 29 TESTS PASSED (100% SUCCESS)
================================================================================
```

---

## 💻 Local Development Setup

### 1. Clone & Install
```bash
git clone https://github.com/Shiva7147/CODEZEN.git
cd CODEZEN
npm install
```

### 2. Configure Environment (Optional)
Create a `.env.local` file:
```bash
# Optional: Provide for live Gemini AI generation
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🎨 Design Craft & Anti-Slop Principles

Verity adheres strictly to human-centered design principles:
- **Quiet Neutral Chrome**: Graphite and warm stone surfaces (`#fafafa` and `#0e0e0e`) with a single restrained ember-orange accent (`#cf4f27`).
- **Progressive Disclosure**: All finding diffs, technical architectures, and scenario breakdowns start minimal at rest and reveal details only upon user click.
- **Zero AI Slop**: No purple/pink gradients, no emoji icons, no glowing drop-shadows, and no hyperbolic marketing copy.
- **4px Spacing Grid**: Strict spacing rhythms and tabular figure alignments for readability.

---

## 👥 Authors & Acknowledgments

- **Team OPK**:
  - **Shiva Shankar S** ([@Shiva7147](https://github.com/Shiva7147))
  - **Sanjay V**
  - **D V Visvajit Chandran**
- **Problem Statement**: Inkloom AI — *Automated Brand Governance & Pre-Publication Verification Challenge*.
