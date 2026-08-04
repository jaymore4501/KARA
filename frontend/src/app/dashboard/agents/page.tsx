"use client";

import React from "react";
import { Bot } from "lucide-react";

const agents = [
  { name: "Nova", role: "CEO Agent", color: "from-[#FF8F6B] to-[#FF6B81]", glow: "#FF8F6B", efficiency: 98.4, tasks: 142 },
  { name: "Atlas", role: "Market Research", color: "from-[#FF6B81] to-[#D946EF]", glow: "#FF6B81", efficiency: 95.8, tasks: 184 },
  { name: "Pulse", role: "Product Manager", color: "from-[#D946EF] to-[#9D6CFF]", glow: "#D946EF", efficiency: 97.2, tasks: 215 },
  { name: "Forge", role: "Software Architect", color: "from-[#9D6CFF] to-[#7C5CFF]", glow: "#9D6CFF", efficiency: 99.1, tasks: 109 },
  { name: "CodeX", role: "Backend Engineer", color: "from-[#7C5CFF] to-[#60A5FA]", glow: "#7C5CFF", efficiency: 96.5, tasks: 312 },
  { name: "Flux", role: "Frontend Engineer", color: "from-[#60A5FA] to-[#34D399]", glow: "#60A5FA", efficiency: 94.9, tasks: 289 },
  { name: "Aura", role: "UI/UX Designer", color: "from-[#34D399] to-[#FBBF24]", glow: "#34D399", efficiency: 96.0, tasks: 156 },
  { name: "Echo", role: "Marketing Strategist", color: "from-[#FBBF24] to-[#F97316]", glow: "#FBBF24", efficiency: 95.1, tasks: 198 },
  { name: "Ledger", role: "Finance Analyst", color: "from-[#F97316] to-[#EF4444]", glow: "#F97316", efficiency: 98.9, tasks: 87 },
  { name: "Vertex", role: "Investor Advisor", color: "from-[#EF4444] to-[#FF8F6B]", glow: "#EF4444", efficiency: 97.6, tasks: 74 },
];

export default function AgentsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 p-1 sm:p-2">
      <div>
        <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
          <Bot className="w-5 h-5 text-brand-primary" />
          AI Agents
        </h1>
        <p className="text-xs text-brand-text-secondary mt-1">Monitor your autonomous AI workforce</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {agents.map((agent) => (
          <div 
            key={agent.name} 
            className="group relative glass-card rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
            style={{
              borderColor: "rgba(255, 255, 255, 0.05)",
              backgroundColor: "rgba(25, 22, 38, 0.25)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${agent.glow}40`;
              e.currentTarget.style.boxShadow = `0 10px 25px -5px ${agent.glow}15`;
              e.currentTarget.style.backgroundColor = "rgba(25, 22, 38, 0.55)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.backgroundColor = "rgba(25, 22, 38, 0.25)";
            }}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            
            <div className="relative">
              {/* Header Info */}
              <div className="flex items-center gap-2.5 mb-5 relative">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${agent.color} p-[1px]`}>
                  <div className="w-full h-full rounded-xl bg-brand-bg flex items-center justify-center text-[10px] font-bold text-white">
                    {agent.name.substring(0, 2).toUpperCase()}
                  </div>
                </div>
                <div className="flex flex-col min-w-0 pr-10">
                  <h3 className="text-xs font-semibold text-white truncate leading-snug">{agent.name}</h3>
                  <p className="text-[9px] text-brand-text-secondary font-mono truncate">{agent.role}</p>
                </div>
                
                {/* Active Indicator Pin */}
                <div className="absolute top-0.5 right-0 flex items-center gap-1 bg-brand-success/10 border border-brand-success/20 px-1.5 py-0.5 rounded-md">
                  <span className="relative flex h-1 w-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-success opacity-75" />
                    <span className="relative inline-flex rounded-full h-1 w-1 bg-brand-success" />
                  </span>
                  <span className="text-[7px] font-mono text-brand-success font-semibold uppercase tracking-wider">Active</span>
                </div>
              </div>

              {/* Core Metrics */}
              <div className="space-y-3.5">
                <div>
                  <div className="flex justify-between text-[9px] font-mono mb-1">
                    <span className="text-brand-text-secondary">Efficiency</span>
                    <span className="text-brand-success font-semibold">{agent.efficiency}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-success rounded-full transition-all duration-1000" 
                      style={{ width: `${agent.efficiency}%` }} 
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between px-2.5 py-2 rounded-xl bg-white/[0.01] border border-white/5 font-mono text-[9px]">
                  <span className="text-brand-text-secondary">Tasks Compiled</span>
                  <strong className="text-white">{agent.tasks}</strong>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
