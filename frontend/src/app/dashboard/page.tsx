"use client";

import React from "react";
import Link from "next/link";
import {
  Plus,
  FolderKanban,
  Bot,
  Zap,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Activity,
  Clock,
  FileText,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export default function DashboardPage() {
  const { user } = useAuthStore();

  const recentProjects = [
    { id: "1", name: "VeloCloud", status: "completed", score: 87, agents: 10, updated: "2 hours ago" },
    { id: "2", name: "AeroCrate", status: "generating", score: null, agents: 4, updated: "5 min ago" },
    { id: "3", name: "FitSynth", status: "draft", score: null, agents: 0, updated: "1 day ago" },
  ];

  const agentActivity = [
    { agent: "Nova", role: "CEO Agent", action: "Completed strategic vision for VeloCloud", time: "2h ago", color: "from-[#FF8F6B] to-[#FF6B81]" },
    { agent: "Atlas", role: "Market Research", action: "Analyzing TAM for AeroCrate logistics sector", time: "5m ago", color: "from-[#FF6B81] to-[#D946EF]" },
    { agent: "Forge", role: "Software Architect", action: "Generated PostgreSQL schema v2.1", time: "3h ago", color: "from-[#9D6CFF] to-[#7C5CFF]" },
    { agent: "Ledger", role: "Finance Analyst", action: "Simulated break-even at 114 accounts", time: "4h ago", color: "from-[#F97316] to-[#EF4444]" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* ─── Welcome Header ──────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white">
            Welcome back, <span className="bg-gradient-to-r from-brand-highlight to-brand-primary bg-clip-text text-transparent">{user?.name?.split(" ")[0] || "Builder"}</span>
          </h1>
          <p className="text-xs text-brand-text-secondary font-light mt-1">
            Your autonomous workforce is ready. What would you like to build today?
          </p>
        </div>

        <Link
          href="/dashboard/projects/new"
          className="flex items-center gap-2 rounded-xl text-xs font-semibold px-5 py-3 bg-gradient-to-r from-brand-secondary to-brand-primary text-white shadow-lg shadow-brand-primary/10 hover:shadow-brand-primary/25 transition-all group"
        >
          <Plus className="w-4 h-4" />
          New Startup
          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* ─── Stats Cards ─────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Projects", value: "3", icon: FolderKanban, accent: "text-brand-primary" },
          { label: "Agents Deployed", value: "10", icon: Bot, accent: "text-brand-success" },
          { label: "Total Tokens Used", value: "24.5K", icon: Zap, accent: "text-brand-highlight" },
          { label: "Startup Score Avg", value: "87%", icon: TrendingUp, accent: "text-brand-success" },
        ].map((stat, idx) => (
          <div key={idx} className="glass-card rounded-2xl p-5 group hover:border-brand-primary/20 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-brand-text-secondary uppercase tracking-widest">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.accent}`} />
            </div>
            <div className={`font-display font-bold text-2xl ${stat.accent}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* ─── Main Grid: Projects + Agent Activity ────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Recent Projects */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-brand-primary" />
              Recent Projects
            </h2>
            <Link href="/dashboard/projects" className="text-[10px] text-brand-highlight hover:text-white transition-colors font-mono">
              View All →
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {recentProjects.map((project) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-brand-primary/20 hover:bg-white/[0.04] transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-secondary/20 to-brand-primary/20 flex items-center justify-center text-brand-highlight text-xs font-bold border border-brand-primary/10">
                    {project.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-brand-highlight transition-colors">{project.name}</h3>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className={`text-[9px] font-mono uppercase tracking-wider ${
                        project.status === "completed" ? "text-brand-success" :
                        project.status === "generating" ? "text-brand-primary animate-pulse" :
                        "text-brand-text-secondary"
                      }`}>
                        {project.status}
                      </span>
                      <span className="text-[9px] text-brand-text-secondary">{project.updated}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {project.score && (
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-mono font-semibold text-brand-success">{project.score}%</div>
                      <div className="text-[8px] text-brand-text-secondary uppercase">Score</div>
                    </div>
                  )}
                  <ArrowUpRight className="w-4 h-4 text-brand-text-secondary group-hover:text-brand-highlight transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Agent Activity */}
        <div className="lg:col-span-5 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-success" />
              Agent Activity
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-success" />
              </span>
              <span className="text-[9px] font-mono text-brand-success uppercase">LIVE</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {agentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${activity.color} p-[1px] shrink-0`}>
                  <div className="w-full h-full rounded-lg bg-brand-bg flex items-center justify-center text-[10px] font-bold text-white">
                    {activity.agent.substring(0, 2)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">{activity.agent}</span>
                    <span className="text-[9px] text-brand-text-secondary font-mono">— {activity.role}</span>
                  </div>
                  <p className="text-[10px] text-brand-text-secondary font-light mt-0.5 line-clamp-1">{activity.action}</p>
                </div>
                <span className="text-[9px] font-mono text-brand-text-secondary shrink-0">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Quick Actions ───────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: FileText, label: "Latest Documents", count: "12", desc: "Generated outputs ready for review" },
          { icon: Sparkles, label: "Token Usage", count: "24.5K / 50K", desc: "Monthly allocation" },
          { icon: Clock, label: "Last Active", count: "5 min ago", desc: "AeroCrate — Market Research" },
        ].map((item, idx) => (
          <div key={idx} className="glass-card rounded-2xl p-5 hover:border-brand-primary/20 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-brand-highlight">
                <item.icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-white">{item.label}</span>
            </div>
            <div className="font-display font-bold text-lg text-brand-highlight mb-0.5">{item.count}</div>
            <div className="text-[10px] text-brand-text-secondary font-light">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
