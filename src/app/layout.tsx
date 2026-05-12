import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StackTrim AI Spend Audit",
  description: "Find wasted AI tool spend and get a shareable savings report in minutes.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "StackTrim AI Spend Audit",
    description: "A free audit for AI subscriptions, seats, and API spend.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StackTrim AI Spend Audit",
    description: "Find wasted AI tool spend and Credex credit opportunities.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
