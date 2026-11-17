"use client";

import React, { useState } from "react";
import { Quote, Check } from "lucide-react";

export function CustomerStories() {
  const [activeStory, setActiveStory] = useState(0);

  const stories = [
    {
      id: "rahul",
      name: "Rahul Sharma",
      role: "Digital Marketing Executive",
      org: "Apex Digital Agency",
      focus: "Creator Persona",
      quote:
        "Guidelines are often very general, like 'maintain a professional yet friendly tone', and feedback used to be scattered across emails and doc comments. I would rewrite copy three times without knowing which rule was broken. Verity shows the exact guideline clause and gives me an intent-preserving diff before I even send drafts to my manager.",
      impact: "Reduced multi-round rewrite cycles by 65%"
    },
    {
      id: "priya",
      name: "Priya Nair",
      role: "Brand & Content Manager",
      org: "Zenith Consumer Brands",
      focus: "Manager Persona",
      quote:
        "Visibility was our biggest nightmare. When multiple freelancers and agencies work simultaneously, nobody could track which version was final or who approved what. Verity gave us a centralized audit trail, and the Guideline Clarity dashboard finally answered my question: is a recurring error an employee training gap or an ambiguous guideline?",
      impact: "100% auditable version history & approval tracking"
    },
    {
      id: "ananya",
      name: "Ananya Sen",
      role: "Compliance & Quality Reviewer",
      org: "Sovereign Financial Services",
      focus: "Reviewer Persona",
      quote:
        "Unsupported promotional claims are a major concern. If someone writes that a product guarantees a result or is 'world's best', where is the evidence? Verity's risk escalation automatically filters out routine grammar issues and routes sensitive claims to my desk with verified citations and source evidence attached.",
      impact: "100% of high-risk claims escalated with zero auto-approvals"
    }
  ];

  return (
    <section id="stories" className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12 py-16 sm:py-24 scroll-mt-20">
      <div className="mb-10">
        <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1.5">
          User Case Studies
        </div>
        <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-foreground">
          People who've got going.
        </h2>
      </div>

      {/* Story Carousel / Slider Card matching Reworker */}
      <div className="rounded-3xl border border-border/70 bg-card p-6 sm:p-10 shadow-xs relative overflow-hidden">
        {/* Progress Rail */}
        <div className="flex items-center gap-2 mb-8">
          {stories.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setActiveStory(idx)}
              className="flex-1 text-left group"
            >
              <div
                className={`h-1 rounded-full transition-all duration-300 ${
                  activeStory === idx
                    ? "bg-foreground"
                    : "bg-muted group-hover:bg-muted-foreground/40"
                }`}
              />
              <div className="mt-2 text-[11px] font-mono text-muted-foreground truncate">
                0{idx + 1} · {s.name}
              </div>
            </button>
          ))}
        </div>

        {/* Story Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <Quote className="size-5 text-muted-foreground" />
            <blockquote className="text-base sm:text-lg font-normal leading-relaxed text-foreground">
              "{stories[activeStory].quote}"
            </blockquote>

            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <Check className="size-3.5 text-foreground" />
              <span>Measurable Outcome: {stories[activeStory].impact}</span>
            </div>
          </div>

          {/* Author Card Info */}
          <div className="lg:col-span-4 rounded-2xl border border-border/60 bg-muted/20 p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full border border-border/60 bg-muted flex items-center justify-center font-medium text-xs text-foreground font-mono">
                {stories[activeStory].name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">
                  {stories[activeStory].name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stories[activeStory].role}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border/40 text-[11px] font-mono text-muted-foreground flex items-center justify-between">
              <span>{stories[activeStory].org}</span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-foreground">
                {stories[activeStory].focus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
