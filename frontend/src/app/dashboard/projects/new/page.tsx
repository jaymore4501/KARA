"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Users,
  Globe,
  DollarSign,
  Upload,
  Rocket,
  CheckCircle2,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { projectsApi } from "@/lib/api";

export default function NewProjectPage() {
  const router = useRouter();
  const { accessToken } = useAuthStore();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    idea: "",
    problem: "",
    target_users: "",
    country: "",
    budget: "",
  });

  const totalSteps = 3;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!accessToken) return;
    setIsSubmitting(true);
    setError("");

    try {
      const project = await projectsApi.create(accessToken, {
        name: formData.name || formData.idea.split(" ").slice(0, 2).join(""),
        idea: formData.idea,
        problem: formData.problem || undefined,
        target_users: formData.target_users || undefined,
        country: formData.country || undefined,
        budget: formData.budget || undefined,
      });
      router.push(`/dashboard/projects/${project.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create project");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 border border-brand-primary/10 bg-brand-primary/5 py-1.5 px-4 rounded-full text-[10px] font-semibold text-brand-highlight uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-brand-primary animate-pulse" />
          New Startup Project
        </div>
        <h1 className="font-display font-bold text-3xl text-white">
          Tell Us Your{" "}
          <span className="bg-gradient-to-r from-brand-highlight to-brand-primary bg-clip-text text-transparent">
            Vision
          </span>
        </h1>
        <p className="text-xs text-brand-text-secondary mt-2 max-w-md mx-auto font-light">
          KARA&apos;s agents will transform your idea into a complete startup package — from market research to investor pitch decks.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-mono font-bold border transition-all ${
                s === step
                  ? "bg-brand-primary/10 border-brand-primary text-brand-highlight"
                  : s < step
                  ? "bg-brand-success/10 border-brand-success text-brand-success"
                  : "bg-white/5 border-white/10 text-brand-text-secondary"
              }`}
            >
              {s < step ? <CheckCircle2 className="w-4 h-4" /> : s}
            </div>
            {s < totalSteps && (
              <div className={`w-12 h-[2px] rounded ${s < step ? "bg-brand-success" : "bg-white/10"}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Form Card */}
      <div className="glass-card rounded-3xl p-8 shadow-2xl">
        {error && (
          <div className="mb-6 px-4 py-3 bg-brand-danger/10 border border-brand-danger/20 rounded-xl text-xs text-brand-danger text-center animate-fadeIn">
            {error}
          </div>
        )}

        {/* Step 1: Core Idea */}
        {step === 1 && (
          <div className="animate-fadeIn space-y-6">
            <div>
              <label className="text-[10px] font-mono text-brand-text-secondary uppercase tracking-widest mb-2 block">
                <Lightbulb className="w-3 h-3 inline mr-1.5" />
                Your Startup Idea *
              </label>
              <textarea
                value={formData.idea}
                onChange={(e) => handleChange("idea", e.target.value)}
                placeholder="e.g., Build an AI-powered fitness application for senior citizens that provides personalized exercise routines..."
                rows={4}
                required
                className="w-full bg-brand-bg/60 border border-white/10 focus:border-brand-primary/40 focus:outline-none py-3.5 px-4 rounded-xl text-sm text-white placeholder-white/25 transition-all resize-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-brand-text-secondary uppercase tracking-widest mb-2 block">
                Project Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., FitSenior"
                className="w-full bg-brand-bg/60 border border-white/10 focus:border-brand-primary/40 focus:outline-none py-3.5 px-4 rounded-xl text-sm text-white placeholder-white/25 transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-brand-text-secondary uppercase tracking-widest mb-2 block">
                Problem Being Solved
              </label>
              <textarea
                value={formData.problem}
                onChange={(e) => handleChange("problem", e.target.value)}
                placeholder="What pain point does your product address?"
                rows={3}
                className="w-full bg-brand-bg/60 border border-white/10 focus:border-brand-primary/40 focus:outline-none py-3.5 px-4 rounded-xl text-sm text-white placeholder-white/25 transition-all resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 2: Target & Market */}
        {step === 2 && (
          <div className="animate-fadeIn space-y-6">
            <div>
              <label className="text-[10px] font-mono text-brand-text-secondary uppercase tracking-widest mb-2 block">
                <Users className="w-3 h-3 inline mr-1.5" />
                Target Users
              </label>
              <input
                type="text"
                value={formData.target_users}
                onChange={(e) => handleChange("target_users", e.target.value)}
                placeholder="e.g., Senior citizens aged 60+, their caregivers, retirement communities"
                className="w-full bg-brand-bg/60 border border-white/10 focus:border-brand-primary/40 focus:outline-none py-3.5 px-4 rounded-xl text-sm text-white placeholder-white/25 transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-brand-text-secondary uppercase tracking-widest mb-2 block">
                <Globe className="w-3 h-3 inline mr-1.5" />
                Target Country / Market
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
                placeholder="e.g., United States, India, Global"
                className="w-full bg-brand-bg/60 border border-white/10 focus:border-brand-primary/40 focus:outline-none py-3.5 px-4 rounded-xl text-sm text-white placeholder-white/25 transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-brand-text-secondary uppercase tracking-widest mb-2 block">
                <DollarSign className="w-3 h-3 inline mr-1.5" />
                Budget Range
              </label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => handleChange("budget", e.target.value)}
                placeholder="e.g., $10K - $50K, Bootstrapped, $500K seed"
                className="w-full bg-brand-bg/60 border border-white/10 focus:border-brand-primary/40 focus:outline-none py-3.5 px-4 rounded-xl text-sm text-white placeholder-white/25 transition-all"
              />
            </div>
          </div>
        )}

        {/* Step 3: Review & Launch */}
        {step === 3 && (
          <div className="animate-fadeIn space-y-6">
            <div className="text-center mb-4">
              <Rocket className="w-10 h-10 text-brand-highlight mx-auto mb-3" />
              <h2 className="font-display font-bold text-xl text-white">Ready to Launch</h2>
              <p className="text-xs text-brand-text-secondary mt-1">Review your startup details before deploying the AI workforce.</p>
            </div>

            <div className="space-y-3">
              {[
                { label: "Startup Idea", value: formData.idea },
                { label: "Project Name", value: formData.name || "Auto-generated" },
                { label: "Problem", value: formData.problem || "Not specified" },
                { label: "Target Users", value: formData.target_users || "Not specified" },
                { label: "Country", value: formData.country || "Not specified" },
                { label: "Budget", value: formData.budget || "Not specified" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-[9px] font-mono text-brand-text-secondary uppercase tracking-widest w-28 shrink-0 pt-0.5">{item.label}</span>
                  <span className="text-xs text-white font-light flex-1">{item.value || "—"}</span>
                </div>
              ))}
            </div>

            {/* Agent Preview */}
            <div className="p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/10">
              <div className="text-[9px] font-mono text-brand-highlight uppercase tracking-widest mb-3">AGENTS THAT WILL BE DEPLOYED</div>
              <div className="flex flex-wrap gap-2">
                {["Nova (CEO)", "Atlas (Research)", "Pulse (PM)", "Forge (Architect)", "CodeX (Backend)", "Flux (Frontend)", "Aura (UI/UX)", "Echo (Marketing)", "Ledger (Finance)", "Vertex (Investor)"].map((agent, idx) => (
                  <span key={idx} className="text-[9px] font-mono text-brand-text-secondary bg-white/5 border border-white/5 px-2 py-1 rounded-lg">
                    {agent}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="flex items-center gap-2 text-xs text-brand-text-secondary hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {step < totalSteps ? (
            <button
              onClick={() => {
                if (step === 1 && !formData.idea.trim()) return;
                setStep(step + 1);
              }}
              disabled={step === 1 && !formData.idea.trim()}
              className="relative group overflow-hidden flex items-center gap-2 rounded-xl text-xs font-semibold px-6 py-3 bg-gradient-to-r from-brand-secondary to-brand-primary text-white shadow-lg shadow-brand-primary/10 hover:shadow-brand-primary/25 transition-all disabled:opacity-40"
            >
              <span className="relative z-10 flex items-center gap-2">
                Continue
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-brand-primary to-brand-highlight transition-transform duration-500 ease-out" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.idea.trim()}
              className="relative group overflow-hidden flex items-center gap-2 rounded-xl text-xs font-semibold px-6 py-3 bg-gradient-to-r from-brand-success to-brand-primary text-white shadow-lg shadow-brand-primary/10 hover:shadow-brand-primary/25 transition-all disabled:opacity-50"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isSubmitting ? "Deploying Agents..." : "Generate Startup"}
                <Rocket className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
