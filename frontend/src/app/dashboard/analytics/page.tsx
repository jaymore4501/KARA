"use client";

import React, { useState } from "react";
import { BarChart3, TrendingUp, Zap, Clock, Activity, Calendar } from "lucide-react";

export default function AnalyticsPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const weeklyData = [
    { day: "Mon", tokens: 3200, agents: 12 },
    { day: "Tue", tokens: 5100, agents: 18 },
    { day: "Wed", tokens: 4200, agents: 14 },
    { day: "Thu", tokens: 6800, agents: 22 },
    { day: "Fri", tokens: 3900, agents: 15 },
    { day: "Sat", tokens: 1200, agents: 4 },
    { day: "Sun", tokens: 600, agents: 2 },
  ];

  const maxTokens = Math.max(...weeklyData.map((d) => d.tokens));
  const totalTokens = weeklyData.reduce((acc, curr) => acc + curr.tokens, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-brand-primary" />
            Analytics
          </h1>
          <p className="text-xs text-brand-text-secondary mt-1">Track your AI agent usage and performance metrics</p>
        </div>
        <div className="flex items-center gap-2 bg-brand-card border border-white/5 px-3 py-1.5 rounded-xl self-start font-mono text-[10px] text-brand-text-secondary">
          <Calendar className="w-3.5 h-3.5 text-brand-primary" />
          <span>July 26 - Aug 02, 2026</span>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Tokens", value: "24,500", change: "+12%", icon: Zap, accent: "text-brand-primary", bg: "group-hover:border-brand-primary/20" },
          { label: "Agent Runs", value: "87", change: "+8%", icon: Activity, accent: "text-brand-success", bg: "group-hover:border-brand-success/20" },
          { label: "Avg. Exec Time", value: "14.3s", change: "-5%", icon: Clock, accent: "text-brand-highlight", bg: "group-hover:border-brand-highlight/20" },
          { label: "Success Rate", value: "98.4%", change: "+0.3%", icon: TrendingUp, accent: "text-brand-success", bg: "group-hover:border-brand-success/20" },
        ].map((stat, idx) => (
          <div key={idx} className="glass-card rounded-2xl p-5 relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-brand-text-secondary uppercase tracking-widest">{stat.label}</span>
              <div className="p-1.5 rounded-lg bg-white/5">
                <stat.icon className={`w-4 h-4 ${stat.accent}`} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-bold text-2xl text-white">{stat.value}</span>
              <span className={`text-[10px] font-mono font-medium ${stat.change.startsWith("+") ? "text-brand-success" : "text-brand-danger"}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Token Usage Chart Card */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />
        
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-primary" />
            Weekly Token Usage
          </h2>
          <span className="text-[10px] font-mono text-brand-text-secondary">
            Accumulated: <strong className="text-white">{totalTokens.toLocaleString()} tokens</strong>
          </span>
        </div>

        {/* Chart Container */}
        <div className="relative h-64 flex flex-col justify-end">
          {/* Y-Axis Guidelines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[6000, 4000, 2000, 0].map((val, idx) => (
              <div key={idx} className="w-full flex items-center gap-4">
                <span className="w-8 text-[9px] font-mono text-brand-text-secondary text-right">{val}</span>
                <div className="flex-grow border-t border-white/5 border-dashed" />
              </div>
            ))}
          </div>

          {/* Columns Section */}
          <div className="relative z-10 flex items-end justify-between gap-4 h-48 pl-12 pr-4">
            {weeklyData.map((d, idx) => {
              const heightPct = (d.tokens / maxTokens) * 100;
              const isHovered = hoveredIndex === idx;
              
              return (
                <div 
                  key={idx} 
                  className="flex-1 flex flex-col items-center gap-3 group cursor-pointer relative"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Tooltip */}
                  <div className={`absolute top-[-36px] bg-brand-surface border border-white/10 rounded-lg px-2.5 py-1 text-center shadow-xl transition-all duration-200 pointer-events-none z-20 ${
                    isHovered ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95"
                  }`}>
                    <div className="text-[9px] font-mono text-brand-text-secondary">Tokens</div>
                    <div className="text-[10px] font-mono font-bold text-brand-primary">{d.tokens.toLocaleString()}</div>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full h-36 relative rounded-t-lg bg-white/[0.02] border border-white/5 group-hover:border-brand-primary/40 overflow-hidden transition-all duration-300 transform group-hover:-translate-y-1.5 group-hover:shadow-[0_0_25px_rgba(157,108,255,0.3)]">
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-secondary to-brand-primary group-hover:from-brand-primary group-hover:to-brand-highlight rounded-t-lg transition-all duration-500"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>

                  {/* Labels */}
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-mono font-medium text-white group-hover:text-brand-primary transition-colors">{d.day}</span>
                    <span className="text-[8px] font-mono text-brand-text-secondary mt-0.5">{d.tokens}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
