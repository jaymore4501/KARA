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
            className="group relative glass-card rounded-3xl p-6 border transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between min-h-[235px]"
            style={{
              borderColor: "rgba(255, 255, 255, 0.05)",
              backgroundColor: "rgba(25, 22, 38, 0.2)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${agent.glow}50`;
              e.currentTarget.style.boxShadow = `0 15px 30px -5px ${agent.glow}20`;
              e.currentTarget.style.backgroundColor = "rgba(25, 22, 38, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.backgroundColor = "rgba(25, 22, 38, 0.2)";
            }}
          >
            {/* Top decorative glass overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none rounded-3xl" />
            
            {/* Ambient corner glow */}
            <div 
              className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 transition-opacity duration-300 pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${agent.glow} 0%, transparent 70%)`
              }}
            />

            {/* Header info */}
            <div className="relative flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${agent.color} p-[1.5px] shadow-lg shadow-black/30`}>
                  <div className="w-full h-full rounded-2xl bg-[#0F0D19] flex items-center justify-center text-xs font-bold text-white tracking-wider">
                    {agent.name.substring(0, 2).toUpperCase()}
                  </div>
                </div>
                
                {/* Active Indicator Badge */}
                <div className="flex items-center gap-1.5 bg-brand-success/5 border border-brand-success/15 px-2.5 py-0.5 rounded-full select-none">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-success opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-success" />
                  </span>
                  <span className="text-[8px] font-mono text-brand-success font-semibold uppercase tracking-wider">Active</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white tracking-wide">{agent.name}</h3>
                <p className="text-[10px] text-brand-text-secondary font-mono mt-0.5">{agent.role}</p>
              </div>
            </div>

            {/* Core Metrics */}
            <div className="space-y-4 mt-6">
              <div>
                <div className="flex justify-between text-[9px] font-mono mb-1.5">
                  <span className="text-brand-text-secondary">COGNITIVE EFFICIENCY</span>
                  <span className="text-brand-success font-semibold">{agent.efficiency}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden p-[1px]">
                  <div 
                    className="h-full bg-brand-success rounded-full transition-all duration-1000" 
                    style={{ 
                      width: `${agent.efficiency}%`,
                      boxShadow: "0 0 6px rgba(52, 211, 153, 0.5)"
                    }} 
                  />
                </div>
              </div>

              <div className="flex items-center justify-between px-3 py-2.5 rounded-2xl bg-white/[0.02] border border-white/5 font-mono text-[9px] hover:bg-white/[0.04] transition-all">
                <span className="text-brand-text-secondary uppercase tracking-wider">Tickets Compiled</span>
                <strong className="text-white text-xs font-bold font-display">{agent.tasks}</strong>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
