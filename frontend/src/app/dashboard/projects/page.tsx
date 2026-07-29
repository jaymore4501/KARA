"use client";

import React from "react";
import Link from "next/link";
import { Plus, FolderKanban, ArrowUpRight, Search, Filter } from "lucide-react";

export default function ProjectsListPage() {
  const projects = [
    { id: "1", name: "VeloCloud", idea: "Serverless real-time developer metrics engine", status: "completed", score: 87, agents: 10, updated: "2 hours ago" },
    { id: "2", name: "AeroCrate", idea: "Drone delivery metrics and logistics platform", status: "generating", score: null, agents: 4, updated: "5 min ago" },
    { id: "3", name: "FitSynth", idea: "Biometric AI-powered posture trainer", status: "draft", score: null, agents: 0, updated: "1 day ago" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-brand-primary" />
            Projects
          </h1>
          <p className="text-xs text-brand-text-secondary mt-1">Manage your autonomous startup projects</p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="flex items-center gap-2 rounded-xl text-xs font-semibold px-5 py-3 bg-gradient-to-r from-brand-secondary to-brand-primary text-white shadow-lg shadow-brand-primary/10 hover:shadow-brand-primary/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          New Startup
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full bg-white/5 border border-white/5 focus:border-brand-primary/30 focus:outline-none py-2.5 pl-9 pr-4 rounded-xl text-xs text-white placeholder-white/30 transition-all"
          />
        </div>
        {["All", "Draft", "Generating", "Completed"].map((filter) => (
          <button
            key={filter}
            className="text-[10px] font-mono px-3 py-2 rounded-lg border border-white/5 bg-white/5 text-brand-text-secondary hover:text-white hover:border-brand-primary/20 transition-all"
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/dashboard/projects/${project.id}`}
            className="glass-card rounded-2xl p-6 hover:border-brand-primary/20 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-secondary/20 to-brand-primary/20 flex items-center justify-center text-brand-highlight text-sm font-bold border border-brand-primary/10">
                {project.name.charAt(0)}
              </div>
              <span className={`text-[9px] font-mono uppercase tracking-wider px-2 py-1 rounded-full border ${
                project.status === "completed" ? "text-brand-success bg-brand-success/10 border-brand-success/20" :
                project.status === "generating" ? "text-brand-primary bg-brand-primary/10 border-brand-primary/20 animate-pulse" :
                "text-brand-text-secondary bg-white/5 border-white/5"
              }`}>
                {project.status}
              </span>
            </div>

            <h3 className="font-display font-semibold text-base text-white mb-1 group-hover:text-brand-highlight transition-colors">
              {project.name}
            </h3>
            <p className="text-[11px] text-brand-text-secondary font-light line-clamp-2 mb-4">
              {project.idea}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <span className="text-[9px] text-brand-text-secondary font-mono">{project.updated}</span>
              {project.score && (
                <span className="text-xs font-mono font-semibold text-brand-success">{project.score}%</span>
              )}
              <ArrowUpRight className="w-3.5 h-3.5 text-brand-text-secondary group-hover:text-brand-highlight transition-colors" />
            </div>
          </Link>
        ))}

        {/* Empty New Card */}
        <Link
          href="/dashboard/projects/new"
          className="border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-brand-primary/30 hover:bg-brand-primary/5 transition-all min-h-[200px]"
        >
          <Plus className="w-8 h-8 text-brand-text-secondary" />
          <span className="text-xs text-brand-text-secondary font-medium">Create New Project</span>
        </Link>
      </div>
    </div>
  );
}
