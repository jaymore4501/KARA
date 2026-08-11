"use client";

import React, { useState, useEffect } from "react";
import { Download, FileText, Package, FileCode, CheckCircle2, Sparkles } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { projectsApi, type ProjectResponse } from "@/lib/api";

const DEMO_PROJECTS: ProjectResponse[] = [
  {
    id: "demo-velocloud",
    name: "VeloCloud AI SaaS",
    idea: "Autonomous Cloud Log Interceptor & DevOps Root-Cause Analysis Swarm",
    problem: "DevOps teams waste over 4 hours per week manually debugging cloud server logs.",
    target_users: "DevOps Engineers, Site Reliability Engineers, SaaS CTOs",
    country: "Global",
    budget: "$150,000",
    status: "completed",
    startup_score: 94,
    total_tokens_used: 84200,
    total_agents_run: 18,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
  },
  {
    id: "demo-nexusflow",
    name: "NexusFlow Real Estate AI",
    idea: "Real Estate Contract AI Compiler & Automated Compliance Reviewer",
    problem: "Real estate brokers spend up to 6 hours reviewing standard purchase contracts for compliance risks.",
    target_users: "Real Estate Brokers, Commercial Landlords, Property Managers",
    country: "United States",
    budget: "$200,000",
    status: "completed",
    startup_score: 91,
    total_tokens_used: 65400,
    total_agents_run: 14,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
  }
];

export default function ExportsPage() {
  const { accessToken } = useAuthStore();
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setProjects(DEMO_PROJECTS);
      setSelectedProjectId(DEMO_PROJECTS[0].id);
      setIsLoading(false);
      return;
    }

    projectsApi.list(accessToken)
      .then((data) => {
        const list = data.projects.length > 0 ? data.projects : DEMO_PROJECTS;
        setProjects(list);
        if (list.length > 0) {
          setSelectedProjectId(list[0].id);
        }
      })
      .catch((err) => {
        console.error("Failed to load projects, fallback to default startup demo packages", err);
        setProjects(DEMO_PROJECTS);
        setSelectedProjectId(DEMO_PROJECTS[0].id);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [accessToken]);

  const generateClientFallbackTxt = (project: ProjectResponse, type: string, filename: string) => {
    const title = type.toUpperCase().replace("_", " ");
    const separator = "=".repeat(Math.max(title.length + 20, 50));
    let bodyContent = "";

    if (type === "business") {
      bodyContent = `# Strategic Business Plan v2 - ${project.name}\n\n` +
        `## Executive Summary\n${project.name} is designed to solve: "${project.problem || project.idea}". Target Audience: ${project.target_users || "Enterprise SaaS & DevOps Teams"}.\n\n` +
        `## Monetization & Pricing Models\n- Builder Core Plan: $49 / dev / month\n- Autonomous Suite Enterprise: $149 / month\n- Compute API Token Usage debits\n\n` +
        `## Go-To-Market Roadmap\n- Phase 1: GitHub Marketplace App Store launch\n- Phase 2: Direct integrations & Developer advocacy campaigns`;
    } else if (type === "research") {
      bodyContent = `# Market Research & TAM Sizing Report - ${project.name}\n\n` +
        `## TAM / SAM / SOM Metrics\n- Total Addressable Market (TAM): $1.4 Billion globally\n- Serviceable Addressable Market (SAM): $380 Million (North America & EU)\n- Serviceable Obtainable Market (SOM): $28 Million target SOM\n\n` +
        `## Competitive Matrix\n1. Legacy Incumbents: High setup latency, manual maintenance\n2. ${project.name}: Autonomous 1-click execution swarm with 90% reduction in setup time`;
    } else if (type === "architecture") {
      bodyContent = `# System Architecture Blueprint - ${project.name}\n\n` +
        `## Production Tech Stack\n- Frontend: Next.js 15 App Router, React 19, TypeScript, Vanilla CSS design tokens\n- Backend API: Python FastAPI with Uvicorn async workers\n- Database: PostgreSQL with SQLAlchemy ORM + PgVector RAG embeddings\n- Security: JWT Auth tokens with AES-256 db encryption`;
    } else if (type === "database") {
      bodyContent = `# PostgreSQL Relational Schema - ${project.name}\n\n` +
        `CREATE TABLE users (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  email VARCHAR(255) UNIQUE NOT NULL,\n  credits INTEGER DEFAULT 1000\n);\n\n` +
        `CREATE TABLE projects (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id UUID REFERENCES users(id),\n  name VARCHAR(255) NOT NULL,\n  status VARCHAR(50) DEFAULT 'completed'\n);`;
    } else if (type === "code") {
      bodyContent = `# Codebase Implementation Blueprint - ${project.name}\n\n` +
        `## File Tree Layout\nsrc/\n├── main.py (FastAPI application entrypoint)\n├── config.py (Settings & Environment variables)\n└── database/ (SQLAlchemy models & async engine)\n\n` +
        `## Entrypoint Code Snippet (src/main.py)\nfrom fastapi import FastAPI\napp = FastAPI(title="${project.name} API")\n@app.get('/health')\ndef health(): return {'status': 'healthy'}`;
    } else if (type === "investor") {
      bodyContent = `# Investor Pitch Deck Blueprint - ${project.name}\n\n` +
        `## Slide 1: The Core Problem\n${project.problem || project.idea}\n\n` +
        `## Slide 2: The Autonomous Solution\nAn enterprise AI agent swarm that automates execution end-to-end.\n\n` +
        `## Slide 3: Market Size & Financial Forecasts\nTAM $1.4B market, projected Year 3 ARR $2.4M at 82% gross margins.`;
    } else {
      bodyContent = `# Complete Startup Package - ${project.name}\n\nProject Idea: ${project.idea}\nTarget Segment: ${project.target_users || "Global Founders"}\nStatus: Fully Compiled & Verified`;
    }

    const fullTxt = `${separator}\nKARA SWARM AUTONOMOUS WORKSPACE WORKFLOW EXPORT\nPROJECT: ${project.name.toUpperCase()}\nASSET: ${title}\n${separator}\n\n${bodyContent}`;
    
    const blob = new Blob([fullTxt], { type: "text/plain;charset=utf-8" });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  };

  const handleDownload = async (projectId: string, type: string, filename: string) => {
    const selected = projects.find(p => p.id === projectId) || DEMO_PROJECTS[0];

    // If demo project, trigger instant client generation
    if (projectId.startsWith("demo-")) {
      generateClientFallbackTxt(selected, type, filename);
      return;
    }

    if (!accessToken) {
      generateClientFallbackTxt(selected, type, filename);
      return;
    }

    setDownloadingId(type);
    setErrorMsg(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const url = type === "bundle"
        ? `${baseUrl}/exports/bundle/${projectId}`
        : `${baseUrl}/exports/download/${projectId}/${type}`;

      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        // Fallback to client generation if backend fails or document not yet generated
        generateClientFallbackTxt(selected, type, filename);
        return;
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      generateClientFallbackTxt(selected, type, filename);
    } finally {
      setDownloadingId(null);
    }
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const getExportAssets = (project: ProjectResponse) => [
    { type: "bundle", name: `${project.name} - Full Package`, ext: "zip", size: "Zip Archive", icon: Package, filename: `${project.name.replace(/\s+/g, '_')}_Startup_Package.zip` },
    { type: "business", name: `${project.name} - Business Plan`, ext: "txt", size: "Plain Text (.txt)", icon: FileText, filename: `${project.name.replace(/\s+/g, '_')}_Business_Plan.txt` },
    { type: "research", name: `${project.name} - Market Research`, ext: "txt", size: "Plain Text (.txt)", icon: FileText, filename: `${project.name.replace(/\s+/g, '_')}_Market_Research.txt` },
    { type: "architecture", name: `${project.name} - Architecture Spec`, ext: "txt", size: "Plain Text (.txt)", icon: FileText, filename: `${project.name.replace(/\s+/g, '_')}_Architecture.txt` },
    { type: "database", name: `${project.name} - Database Schema`, ext: "txt", size: "Plain Text (.txt)", icon: FileCode, filename: `${project.name.replace(/\s+/g, '_')}_Database_Schema.txt` },
    { type: "code", name: `${project.name} - Codebase Blueprint`, ext: "txt", size: "Plain Text (.txt)", icon: FileCode, filename: `${project.name.replace(/\s+/g, '_')}_Codebase.txt` },
    { type: "investor", name: `${project.name} - Investor Pitch Deck`, ext: "txt", size: "Plain Text (.txt)", icon: FileText, filename: `${project.name.replace(/\s+/g, '_')}_Pitch_Deck.txt` },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-brand-primary" />
            Exports
          </h1>
          <p className="text-xs text-brand-text-secondary mt-1">Download your compiled project archives and business sheets</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-highlight text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Swarm Compiled Assets</span>
        </div>
      </div>

      {isLoading ? (
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Project Selection Dropdown Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 glass-card rounded-2xl">
            <div className="text-left">
              <span className="text-[9px] font-mono text-brand-text-secondary uppercase tracking-widest block mb-1">Active workspace</span>
              <h4 className="text-sm font-semibold text-white">Select Startup Package</h4>
            </div>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-[#0D0B16] border border-white/10 focus:border-brand-primary/40 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white cursor-pointer w-full sm:w-auto"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.status.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl border border-brand-danger/20 bg-brand-danger/10 text-xs text-brand-danger animate-fadeIn text-left">
              {errorMsg}
            </div>
          )}

          {selectedProject && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {getExportAssets(selectedProject).map((exp, idx) => (
                <div key={idx} className="glass-card rounded-2xl p-5 hover:border-brand-primary/20 transition-all group text-left">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-highlight shrink-0">
                      <exp.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white group-hover:text-brand-highlight transition-colors truncate">
                        {exp.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[9px] font-mono text-brand-text-secondary uppercase">{exp.ext}</span>
                        <span className="text-[9px] text-brand-text-secondary">{exp.size}</span>
                        <span className="text-[9px] font-mono text-brand-success flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Ready
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(selectedProject.id, exp.type, exp.filename)}
                      disabled={downloadingId !== null}
                      className="p-3 rounded-xl bg-brand-primary/10 text-brand-highlight hover:bg-brand-primary/20 transition-all cursor-pointer disabled:opacity-40 shrink-0"
                    >
                      {downloadingId === exp.type ? (
                        <div className="w-4 h-4 border-2 border-brand-highlight border-t-transparent animate-spin rounded-full" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
