"use client";

import React from "react";
import { Bot, Activity } from "lucide-react";

const agents = [
  { name: "Nova", role: "CEO Agent", color: "from-[#FF8F6B] to-[#FF6B81]", efficiency: 98.4, tasks: 142 },
  { name: "Atlas", role: "Market Research", color: "from-[#FF6B81] to-[#D946EF]", efficiency: 95.8, tasks: 184 },
  { name: "Pulse", role: "Product Manager", color: "from-[#D946EF] to-[#9D6CFF]", efficiency: 97.2, tasks: 215 },
  { name: "Forge", role: "Software Architect", color: "from-[#9D6CFF] to-[#7C5CFF]", efficiency: 99.1, tasks: 109 },
  { name: "CodeX", role: "Backend Engineer", color: "from-[#7C5CFF] to-[#60A5FA]", efficiency: 96.5, tasks: 312 },
  { name: "Flux", role: "Frontend Engineer", color: "from-[#60A5FA] to-[#34D399]", efficiency: 94.9, tasks: 289 },
  { name: "Aura", role: "UI/UX Designer", color: "from-[#34D399] to-[#FBBF24]", efficiency: 96.0, tasks: 156 },
  { name: "Echo", role: "Marketing Strategist", color: "from-[#FBBF24] to-[#F97316]", efficiency: 95.1, tasks: 198 },
  { name: "Ledger", role: "Finance Analyst", color: "from-[#F97316] to-[#EF4444]", efficiency: 98.9, tasks: 87 },
  { name: "Vertex", role: "Investor Advisor", color: "from-[#EF4444] to-[#FF8F6B]", efficiency: 97.6, tasks: 74 },
];

export default function AgentsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
          <Bot className="w-5 h-5 text-brand-primary" />
          AI Agents
        </h1>
        <p className="text-xs text-brand-text-secondary mt-1">Monitor your autonomous AI workforce</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {agents.map((agent) => (
          <div key={agent.name} className="glass-card rounded-2xl p-6 hover:border-brand-primary/20 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${agent.color} p-[1px]`}>
                <div className="w-full h-full rounded-xl bg-brand-bg flex items-center justify-center text-xs font-bold text-white">
                  {agent.name.substring(0, 2)}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">{agent.name}</h3>
                <p className="text-[10px] text-brand-text-secondary font-mono">{agent.role}</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-success opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-success" />
                </span>
                <span className="text-[9px] font-mono text-brand-success uppercase">ACTIVE</span>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-brand-text-secondary">Efficiency</span>
                  <span className="text-brand-success font-mono font-semibold">{agent.efficiency}%</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-success rounded-full transition-all duration-1000" style={{ width: `${agent.efficiency}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-[10px] text-brand-text-secondary">Tasks Compiled</span>
                <span className="text-sm font-display font-bold text-white">{agent.tasks}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
