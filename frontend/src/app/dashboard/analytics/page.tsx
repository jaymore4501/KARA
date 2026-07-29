"use client";

import React from "react";
import { BarChart3, TrendingUp, Zap, Clock, Activity } from "lucide-react";

export default function AnalyticsPage() {
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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-brand-primary" />
          Analytics
        </h1>
        <p className="text-xs text-brand-text-secondary mt-1">Track your AI agent usage and performance metrics</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Tokens", value: "24,500", change: "+12%", icon: Zap, accent: "text-brand-highlight" },
          { label: "Agent Runs", value: "87", change: "+8%", icon: Activity, accent: "text-brand-success" },
          { label: "Avg. Exec Time", value: "14.3s", change: "-5%", icon: Clock, accent: "text-brand-primary" },
          { label: "Success Rate", value: "98.4%", change: "+0.3%", icon: TrendingUp, accent: "text-brand-success" },
        ].map((stat, idx) => (
          <div key={idx} className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono text-brand-text-secondary uppercase tracking-widest">{stat.label}</span>
              <stat.icon className={`w-4 h-4 ${stat.accent}`} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className={`font-display font-bold text-2xl ${stat.accent}`}>{stat.value}</span>
              <span className={`text-[10px] font-mono ${stat.change.startsWith("+") ? "text-brand-success" : "text-brand-danger"}`}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Token Usage Chart */}
      <div className="glass-card rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-white mb-6 flex items-center gap-2">
          <Zap className="w-4 h-4 text-brand-highlight" />
          Weekly Token Usage
        </h2>
        <div className="flex items-end justify-between gap-3 h-48">
          {weeklyData.map((d, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[9px] font-mono text-brand-text-secondary">{d.tokens.toLocaleString()}</span>
              <div className="w-full relative rounded-t-lg overflow-hidden bg-white/5" style={{ height: "100%" }}>
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-secondary to-brand-primary rounded-t-lg transition-all duration-700"
                  style={{ height: `${(d.tokens / maxTokens) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-brand-text-secondary">{d.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
