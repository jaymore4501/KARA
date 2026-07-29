"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Sparkles,
  Play,
  Terminal,
  Code,
  Layers,
  Database,
  BarChart3,
  Bot,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Cpu,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { projectsApi, type ProjectResponse } from "@/lib/api";

const workspaceTabs = [
  { id: "overview", label: "Overview", icon: Layers },
  { id: "research", label: "Market Research", icon: BarChart3 },
  { id: "business", label: "Business Plan", icon: FileText },
  { id: "architecture", label: "Architecture", icon: Cpu },
  { id: "database", label: "Database Schema", icon: Database },
  { id: "code", label: "Codebase", icon: Code },
  { id: "investor", label: "Pitch Deck", icon: TrendingUp },
];

export default function ProjectWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;
  const { accessToken } = useAuthStore();

  const [project, setProject] = useState<ProjectResponse | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);

  // Mock initial state for a new project
  useEffect(() => {
    if (!accessToken || !projectId) return;

    const fetchProject = async () => {
      try {
        const data = await projectsApi.get(accessToken, projectId);
        setProject(data);
      } catch (err) {
        console.error("Failed to load project", err);
        // Fallback to mock project for visual testing if DB is not ready yet
        setProject({
          id: projectId,
          name: "VeloCloud",
          idea: "Serverless real-time developer metrics engine",
          problem: "Developers lack unified real-time insights into resource usage, performance, and API logs.",
          target_users: "DevOps teams, SaaS startup founders, Full-stack developers",
          country: "United States",
          budget: "$10K - $50K",
          status: "draft",
          startup_score: null,
          total_tokens_used: 0,
          total_agents_run: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          completed_at: null,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [accessToken, projectId]);

  const startSimulation = () => {
    setIsSimulating(true);
    setSimulationStep(0);
    if (project) {
      setProject((prev) => prev ? { ...prev, status: "generating" } : null);
    }
  };

  useEffect(() => {
    if (!isSimulating) return;

    const timer = setInterval(() => {
      setSimulationStep((prev) => {
        if (prev >= 6) {
          clearInterval(timer);
          setIsSimulating(false);
          if (project) {
            setProject((p) => p ? { ...p, status: "completed", startup_score: 89, total_agents_run: 10, total_tokens_used: 48500 } : null);
          }
          return 6;
        }
        return prev + 1;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [isSimulating, project]);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
          <span className="text-[10px] font-mono text-brand-text-secondary uppercase">LOADING WORKSPACE...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center gap-4">
        <AlertCircle className="w-12 h-12 text-brand-danger" />
        <h2 className="text-lg font-semibold text-white">Project Not Found</h2>
        <button onClick={() => router.push("/dashboard/projects")} className="text-xs text-brand-highlight hover:underline">
          Back to Projects
        </button>
      </div>
    );
  }

  const pipelineSteps = [
    { name: "CEO Strategic Design", agent: "Nova", status: simulationStep > 0 ? "completed" : simulationStep === 0 && isSimulating ? "running" : "pending" },
    { name: "TAM & Competitor Analysis", agent: "Atlas", status: simulationStep > 1 ? "completed" : simulationStep === 1 ? "running" : "pending" },
    { name: "PRD & Product Roadmap", agent: "Pulse", status: simulationStep > 2 ? "completed" : simulationStep === 2 ? "running" : "pending" },
    { name: "Architecture Specification", agent: "Forge", status: simulationStep > 3 ? "completed" : simulationStep === 3 ? "running" : "pending" },
    { name: "Database Schema Design", agent: "Forge", status: simulationStep > 4 ? "completed" : simulationStep === 4 ? "running" : "pending" },
    { name: "Implementation Codebase", agent: "CodeX & Flux", status: simulationStep > 5 ? "completed" : simulationStep === 5 ? "running" : "pending" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ─── Project Header ──────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 glass-card rounded-2xl">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display font-bold text-2xl text-white">{project.name}</h1>
            <span className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              project.status === "completed" ? "text-brand-success bg-brand-success/10 border-brand-success/20" :
              project.status === "generating" ? "text-brand-primary bg-brand-primary/10 border-brand-primary/20 animate-pulse" :
              "text-brand-text-secondary bg-white/5 border-white/5"
            }`}>
              {project.status}
            </span>
          </div>
          <p className="text-xs text-brand-text-secondary font-light mt-1.5 line-clamp-1">{project.idea}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {project.status === "draft" && (
            <button
              onClick={startSimulation}
              className="flex items-center gap-2 rounded-xl text-xs font-semibold px-5 py-3 bg-gradient-to-r from-brand-secondary to-brand-primary text-white shadow-lg shadow-brand-primary/10 hover:shadow-brand-primary/25 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              Build Startup Idea
            </button>
          )}

          {project.startup_score && (
            <div className="bg-brand-success/10 border border-brand-success/20 rounded-xl px-4 py-2 text-center">
              <div className="text-lg font-mono font-bold text-brand-success">{project.startup_score}%</div>
              <div className="text-[8px] text-brand-text-secondary uppercase">Startup Score</div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Simulation Pipeline Monitor ─────────────── */}
      {project.status === "generating" && (
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-primary animate-spin-slow" />
              Autonomous Agent Assembly Line
            </h2>
            <div className="text-[10px] font-mono text-brand-primary uppercase">
              Step {simulationStep + 1} of 6
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {pipelineSteps.map((step, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border transition-all text-center ${
                  step.status === "completed" ? "bg-brand-success/5 border-brand-success/20 text-brand-success" :
                  step.status === "running" ? "bg-brand-primary/10 border-brand-primary text-brand-highlight animate-pulse" :
                  "bg-white/[0.02] border-white/5 text-brand-text-secondary"
                }`}
              >
                <div className="text-[9px] font-mono mb-1">{step.agent}</div>
                <div className="text-[10px] font-semibold truncate">{step.name}</div>
                <div className="text-[8px] font-mono mt-2 uppercase">
                  {step.status === "completed" ? "Success" : step.status === "running" ? "Compiling..." : "Idle"}
                </div>
              </div>
            ))}
          </div>

          {/* Terminal Console */}
          <div className="bg-black/40 border border-white/5 rounded-xl p-4 font-mono text-[10px] text-brand-highlight space-y-1.5 h-36 overflow-y-auto scrollbar-none">
            <div>[KARA SYSTEM] Initializing autonomous agent swarm for project: {project.name}</div>
            {simulationStep >= 0 && <div>[CEO - Nova] Strategic guidelines generated. Establishing core business objectives.</div>}
            {simulationStep >= 1 && <div>[Market Research - Atlas] Scoping market size. Compiling TAM/SAM metrics. Compiling competitors.</div>}
            {simulationStep >= 2 && <div>[Product Manager - Pulse] Creating PRD. Mapping core user stories and roadmap.</div>}
            {simulationStep >= 3 && <div>[Architect - Forge] Drafting system design. Mapping microservices.</div>}
            {simulationStep >= 4 && <div>[Database - Forge] Compiling SQLAlchemy models. Designing index schemas.</div>}
            {simulationStep >= 5 && <div>[Engineers - CodeX & Flux] Writing application code. Linking components.</div>}
            {simulationStep === 6 && <div className="text-brand-success">[SYSTEM] Workspace successfully compiled! Access full startup package below.</div>}
            <div className="animate-pulse">_</div>
          </div>
        </div>
      )}

      {/* ─── Main Tabs Workspace ─────────────────────── */}
      {project.status !== "generating" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-3 flex flex-col gap-1">
            {workspaceTabs.map((tab) => {
              const Icon = tab.icon;
              const isAvailable = project.status === "completed" || tab.id === "overview";
              return (
                <button
                  key={tab.id}
                  onClick={() => isAvailable && setActiveTab(tab.id)}
                  disabled={!isAvailable}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-semibold border transition-all ${
                    activeTab === tab.id
                      ? "bg-brand-primary/10 text-brand-highlight border-brand-primary/20"
                      : isAvailable
                      ? "bg-transparent text-brand-text-secondary hover:text-white hover:bg-white/5 border-transparent"
                      : "bg-transparent text-white/10 border-transparent cursor-not-allowed"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content Panels */}
          <div className="lg:col-span-9 glass-card rounded-2xl p-8">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-semibold text-lg text-white mb-2">Workspace Overview</h2>
                  <p className="text-xs text-brand-text-secondary font-light leading-relaxed">
                    This workspace contains the complete specifications, planning documents, and codebase generated by KARA&apos;s AI agent team. Use the navigation panel on the left to explore the details.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Startup Idea", value: project.idea },
                    { label: "Target Market", value: project.country || "Not specified" },
                    { label: "Budget Allocation", value: project.budget || "Not specified" },
                    { label: "Core Problem", value: project.problem || "Not specified" },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-[8px] font-mono text-brand-text-secondary uppercase tracking-wider block mb-1">{item.label}</span>
                      <span className="text-xs text-white font-light">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "research" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-semibold text-lg text-white mb-2">Market Analysis & TAM</h2>
                  <p className="text-xs text-brand-text-secondary font-light">Compiled by Atlas (Market Research Agent)</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Total Addressable Market (TAM)", value: "$2.4B" },
                    { label: "Serviceable Addressable Market (SAM)", value: "$680M" },
                    { label: "Serviceable Obtainable Market (SOM)", value: "$45M" },
                  ].map((tam, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-brand-primary/5 border border-brand-primary/10 text-center">
                      <div className="text-base font-mono font-bold text-brand-highlight">{tam.value}</div>
                      <div className="text-[8px] text-brand-text-secondary uppercase mt-1">{tam.label}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-semibold text-white">Competitor Matrix</h3>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
                    <div className="flex justify-between font-mono text-[9px] text-brand-text-secondary uppercase pb-2 border-b border-white/5">
                      <span>Competitor</span>
                      <span>Strengths</span>
                      <span>Vulnerability</span>
                    </div>
                    {[
                      { name: "Datadog", strength: "Comprehensive platform, high brand recognition", weakness: "Complex setup, extremely expensive pricing tier" },
                      { name: "Loggly", strength: "Simple log management focus", weakness: "Lack of real-time serverless execution insights" },
                    ].map((comp, idx) => (
                      <div key={idx} className="flex justify-between items-start gap-4 py-2 border-b border-white/[0.02]">
                        <span className="font-semibold text-white w-24 shrink-0">{comp.name}</span>
                        <span className="text-brand-text-secondary text-[11px] font-light flex-1">{comp.strength}</span>
                        <span className="text-brand-highlight text-[11px] font-light flex-1">{comp.weakness}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Other tabs can render simple mock details matching the premium design */}
            {activeTab !== "overview" && activeTab !== "research" && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-display font-semibold text-lg text-white mb-2">{workspaceTabs.find((t) => t.id === activeTab)?.label}</h2>
                  <p className="text-xs text-brand-text-secondary font-light">Workspace asset successfully compiled by KARA workforce.</p>
                </div>
                <div className="p-6 bg-white/[0.01] border border-white/5 rounded-xl font-mono text-xs text-brand-text-secondary space-y-4">
                  <div>// Simulated {activeTab} content schema</div>
                  <div>// Complete details are fully populated inside the database export structure</div>
                  <div className="flex items-center gap-2 text-brand-highlight">
                    <span>Explore details using the chat companion or download the full export package.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
