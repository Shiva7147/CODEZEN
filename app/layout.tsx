import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Verity: Pre-Publication Brand Governance",
  description: "Ground every marketing claim in brand guidelines, verify citations with deterministic Bitap algorithms, and keep human reviewers in control."
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-foreground selection:text-background">
        {children}
      </body>
    </html>
  );
}
