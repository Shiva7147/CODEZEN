"use client";

import React from "react";

interface OuterFrameProps {
  children: React.ReactNode;
}

export function OuterFrame({ children }: OuterFrameProps) {
  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased selection:bg-foreground selection:text-background">
      {children}
    </div>
  );
}
