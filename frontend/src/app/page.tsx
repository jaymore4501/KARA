"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { useRouter } from "next/navigation";

// Import original marketing components from the Vite project
// These are copied/migrated from the original src/components/
import Navbar from "@/components/marketing/Navbar";
import Hero from "@/components/marketing/Hero";
import InteractiveDashboard from "@/components/marketing/InteractiveDashboard";
import AgentGrid from "@/components/marketing/AgentGrid";
import WorkflowTimeline from "@/components/marketing/WorkflowTimeline";
import Features from "@/components/marketing/Features";
import Pricing from "@/components/marketing/Pricing";
import Testimonials from "@/components/marketing/Testimonials";
import FAQ from "@/components/marketing/FAQ";
import Footer from "@/components/marketing/Footer";

export default function LandingPage() {
  const router = useRouter();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavigate = (sectionId: string) => {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleLaunchDashboard = () => {
    router.push("/login");
  };

  return (
    <div id="application-root" className="min-h-screen bg-brand-bg text-white font-sans relative">
      {/* Scroll Progress Indicator */}
      <div
        className="fixed top-0 left-0 h-[2.5px] bg-gradient-to-r from-brand-secondary via-brand-primary to-brand-highlight z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Background Atmospheric Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[20%] left-[-15%] w-[600px] h-[600px] rounded-full bg-brand-primary/5 blur-[160px] animate-pulse-glow" />
        <div className="absolute bottom-[20%] right-[-15%] w-[700px] h-[700px] rounded-full bg-brand-secondary/5 blur-[180px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:60px_60px] opacity-40" />
      </div>

      {/* Main Components Sequence (Matching Navbar Menu Order) */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar onNavigate={handleNavigate} onLaunchDashboard={handleLaunchDashboard} />
        <Hero onLaunchDashboard={handleLaunchDashboard} onNavigate={handleNavigate} />

        {/* 1. Dashboard (#dashboard) */}
        <InteractiveDashboard />

        {/* 2. Features (#features) */}
        <Features />

        {/* 3. Autonomous Agents (#agents) */}
        <AgentGrid />

        {/* 4. How It Works Workflow (#workflow) */}
        <WorkflowTimeline />

        {/* 5. Pricing (#pricing) & Community Wall */}
        <Pricing onLaunchDashboard={handleLaunchDashboard} />
        <Testimonials />

        {/* 6. Interactive KARA AI FAQ Chatbot (#faqs) & Footer */}
        <FAQ />
        <Footer />
      </div>

      {/* Scroll-to-Top */}
      {showScrollTop && (
        <button
          onClick={handleScrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl bg-brand-card/80 border border-white/10 hover:border-brand-primary/40 text-brand-highlight hover:text-white transition-all shadow-2xl backdrop-blur-md hover:translate-y-[-2px] group"
        >
          <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}
    </div>
  );
}
