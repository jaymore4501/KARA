import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KARA - Knowledge AI for Research & Automation",
  description:
    "Build an entire startup with a coordinated workforce of autonomous AI agents. From market research to investor pitch decks — one prompt, complete execution.",
  keywords: ["AI", "startup builder", "multi-agent", "autonomous", "SaaS", "KARA"],
  icons: {
    icon: [
      { url: "/ROBOT_HERO_IMG.png" },
      { url: "/icon.png" },
    ],
    shortcut: "/ROBOT_HERO_IMG.png",
    apple: "/ROBOT_HERO_IMG.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-brand-bg text-white">
        {children}
      </body>
    </html>
  );
}
