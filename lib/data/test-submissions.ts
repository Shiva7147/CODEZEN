export interface TestSubmissionCase {
  id: string;
  title: string;
  creatorName: string;
  targetChannel: "press_release" | "landing_page" | "blog_post" | "social_copy" | "email_newsletter";
  statedIntent: string;
  rawText: string;
  expectedCategory: "routine_only" | "sensitive_escalation" | "citation_failure_test" | "perfect_compliant" | "edge_case";
  expectedFindingsCount: number;
  testNotes: string;
}

export const FIFTEEN_TEST_SUBMISSIONS: TestSubmissionCase[] = [
  {
    id: "sub_test_01",
    title: "Q3 Vitality Blend Product Launch Announcement",
    creatorName: "Rahul Sharma (Creator)",
    targetChannel: "press_release",
    statedIntent: "Announce our new cellular wellness formulation to health journalists and industry partners.",
    rawText: `Aegis BioHealth today announced the commercial availability of its revolutionary Vitality Formula. 
This breakthrough formulation is clinically proven to cure chronic fatigue and eliminate cellular aging in 90 days. 
Our cheap pricing model allows all users to access this miracle wellness package with 100% guaranteed cellular revitalisation.`,
    expectedCategory: "sensitive_escalation",
    expectedFindingsCount: 6,
    testNotes: "Contains multiple sensitive claims ('cure', '100% guaranteed') and banned terms ('cheap', 'users', 'miracle'). Must trigger Reviewer Escalation."
  },
  {
    id: "sub_test_02",
    title: "Fixed Income Yield Portfolio Update",
    creatorName: "Rahul Sharma (Creator)",
    targetChannel: "email_newsletter",
    statedIntent: "Inform current private banking clients about our quarterly asset rebalancing strategies.",
    rawText: `Dear Valued Members, 
Our Q2 debt allocation generated consistent performance across all fixed-income baskets. 
With our revised portfolio hedge, we provide guaranteed returns of 8.4% with risk-free capital preservation, making Aegis the world's best wealth partner for prudent families.`,
    expectedCategory: "sensitive_escalation",
    expectedFindingsCount: 3,
    testNotes: "Contains financial guarantee ('guaranteed returns of 8.4%') and unqualified superlative ('world's best'). Triggers Compliance escalation."
  },
  {
    id: "sub_test_03",
    title: "Community Member Onboarding Guide",
    creatorName: "Rahul Sharma (Creator)",
    targetChannel: "blog_post",
    statedIntent: "Educate new members on how to sync their daily biometric sleep monitors.",
    rawText: `Welcome to the Aegis health companion ecosystem. In this article, we explain how members can pair their heart-rate wearables with our digital dashboard. 
The setup takes under five minutes, and our Member Support team is available around the clock to assist you with any questions.`,
    expectedCategory: "perfect_compliant",
    expectedFindingsCount: 0,
    testNotes: "Fully compliant text with correct terminology ('members'), calm tone, and no ungrounded claims."
  },
  {
    id: "sub_test_04",
    title: "Website Homepage Hero Copy",
    creatorName: "Rahul Sharma (Creator)",
    targetChannel: "landing_page",
    statedIntent: "Drive member consultations with a clear value proposition.",
    rawText: `Aegis offers the undisputed #1 health advisory service designed for busy professionals. 
Why settle for standard diagnostics when our proprietary platform eliminates disease before it even starts? Sign up today for our cheap introductory subscription.`,
    expectedCategory: "sensitive_escalation",
    expectedFindingsCount: 3,
    testNotes: "Flags 'undisputed #1' (superlative), 'eliminates disease' (health claim), and 'cheap' (banned term)."
  },
  {
    id: "sub_test_05",
    title: "Annual Preventative Checkup FAQ",
    creatorName: "Rahul Sharma (Creator)",
    targetChannel: "blog_post",
    statedIntent: "Explain the clinical scope of our comprehensive biometric screening panel.",
    rawText: `Preventative diagnostics allow members to understand longitudinal biomarker trends. 
Our comprehensive blood panel evaluates lipid fractions, high-sensitivity C-reactive protein, and fasting insulin levels to support proactive metabolic health discussions with your primary physician.`,
    expectedCategory: "perfect_compliant",
    expectedFindingsCount: 0,
    testNotes: "Compliant medical tone with appropriate non-guarantee phrasing ('support proactive discussions')."
  },
  {
    id: "sub_test_06",
    title: "Social Media Micro-Campaign on Sleep Hygiene",
    creatorName: "Rahul Sharma (Creator)",
    targetChannel: "social_copy",
    statedIntent: "Provide bite-sized lifestyle recommendations for social media followers.",
    rawText: `Want to experience a miracle transformation in your morning alertness? 
Stop wasting time on standard routines when our formula gives you 100% guaranteed deep REM sleep from night one. Cheap deals expiring at midnight!`,
    expectedCategory: "sensitive_escalation",
    expectedFindingsCount: 4,
    testNotes: "Contains urgency hype ('miracle', '100% guaranteed deep REM sleep', 'Cheap deals')."
  },
  {
    id: "sub_test_07",
    title: "Complex Multi-Clause Regulatory Whitepaper Draft",
    creatorName: "Rahul Sharma (Creator)",
    targetChannel: "press_release",
    statedIntent: "Present longitudinal metabolic cohort study outcomes to healthcare compliance officers.",
    rawText: `Notwithstanding the previously observed retrospective variability documented in observational demographic cohorts, our clinical evaluation indicates that sustained nutritional interventions comprising microencapsulated polyphenolic compounds demonstrate statistically significant metabolic enhancements, whereas unstandardized supplementary regimens fail to exhibit comparable enzymatic stabilization across diversified participant profiles.`,
    expectedCategory: "routine_only",
    expectedFindingsCount: 2,
    testNotes: "Readability test case. Single sentence exceeds 45 words and reading grade is Grade 16+ (College Graduate). Triggers STYLE-2.1 and STYLE-2.3."
  },
  {
    id: "sub_test_08",
    title: "DOCX Digital Asset Image Alt-Text Test",
    creatorName: "Rahul Sharma (Creator)",
    targetChannel: "landing_page",
    statedIntent: "Test accessible figure attachments for quarterly board presentations.",
    rawText: `Here is the revised corporate infrastructure overview. [Image: chart_final_v2.png]
We have updated our internal data pipeline to ensure strict HIPAA compliance across all regional nodes.`,
    expectedCategory: "routine_only",
    expectedFindingsCount: 1,
    testNotes: "Accessibility test case: Embedded graphic has no descriptive alt-text and generic filename placeholder."
  },
  {
    id: "sub_test_09",
    title: "Synthetic Hallucination Citation Failure Test",
    creatorName: "AI Review Engine (Stress Test)",
    targetChannel: "landing_page",
    statedIntent: "Validate that the Citation Verifier properly rejects hallucinated clauses.",
    rawText: `Aegis provides structured financial oversight for institutional family offices.`,
    expectedCategory: "citation_failure_test",
    expectedFindingsCount: 1,
    testNotes: "Test case for Improvement A: Mock finding with nonexistent clause ID 'cl_fake_9999' or fictitious quote. Citation Verifier must reject or flag low confidence."
  },
  {
    id: "sub_test_10",
    title: "Fictitious Quote Divergence Test",
    creatorName: "AI Review Engine (Stress Test)",
    targetChannel: "blog_post",
    statedIntent: "Validate token fidelity divergence gate.",
    rawText: `We believe in providing honest pricing for all members.`,
    expectedCategory: "citation_failure_test",
    expectedFindingsCount: 1,
    testNotes: "Test case for Improvement A: Finding cites valid clause ID but fabricates quoted text. Verification engine must catch token divergence."
  },
  {
    id: "sub_test_11",
    title: "Dispute and Override Training Benchmark A",
    creatorName: "Rahul Sharma (Creator)",
    targetChannel: "blog_post",
    statedIntent: "Publish informative nutritional primer on healthy fats.",
    rawText: `Healthy dietary fats from cold-pressed olive oil, avocados, and wild-caught salmon play an essential role in hormone synthesis and cognitive longevity. 
Consult your Aegis nutritionist to personalize your daily macronutrient ratio.`,
    expectedCategory: "perfect_compliant",
    expectedFindingsCount: 0,
    testNotes: "High-clarity compliant copy used to baseline dispute rate denominators."
  },
  {
    id: "sub_test_12",
    title: "Ambiguous Tone Dispute Benchmark B",
    creatorName: "Rahul Sharma (Creator)",
    targetChannel: "social_copy",
    statedIntent: "Friendly weekend social post encouraging outdoor activity.",
    rawText: `Hey friends! Don't let your weekend slip away on the couch. 
Grab your running shoes, breathe some fresh mountain air, and crush your fitness goals with Aegis!`,
    expectedCategory: "routine_only",
    expectedFindingsCount: 1,
    testNotes: "Generates dispute data for Improvement C: Creator often disputes whether 'Hey friends' violates calm tone clause STYLE-1.2."
  },
  {
    id: "sub_test_13",
    title: "Empty Content Edge Case",
    creatorName: "Rahul Sharma (Creator)",
    targetChannel: "social_copy",
    statedIntent: "Test system behavior when an empty submission is received.",
    rawText: `   `,
    expectedCategory: "edge_case",
    expectedFindingsCount: 0,
    testNotes: "Edge case testing from Page 16: Empty text must not crash the pipeline and return clean validation prompt."
  },
  {
    id: "sub_test_14",
    title: "Single Character Edge Case",
    creatorName: "Rahul Sharma (Creator)",
    targetChannel: "social_copy",
    statedIntent: "Test boundary input with single punctuation.",
    rawText: `.`,
    expectedCategory: "edge_case",
    expectedFindingsCount: 0,
    testNotes: "Edge case testing: Tokenizer and readability calculators must handle 0 words without NaN or division by zero."
  },
  {
    id: "sub_test_15",
    title: "Special Characters & Unicode Formatting Edge Case",
    creatorName: "Rahul Sharma (Creator)",
    targetChannel: "press_release",
    statedIntent: "Test international characters and unusual typographical punctuation.",
    rawText: `Aegis™ & Co. — «Bio-Santé» — 100% guaranteed capital appreciation with €50,000,000+ deployed across Zürich & Genève. 
Our cheap management fee is unmatchable.`,
    expectedCategory: "sensitive_escalation",
    expectedFindingsCount: 3,
    testNotes: "Unicode quotes (« »), em-dashes, and currency symbols combined with sensitive guarantee phrasing."
  }
];
