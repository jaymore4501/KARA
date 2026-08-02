"use client";

import React, { useState, useRef } from "react";
import { BarChart3, TrendingUp, Zap, Clock, Activity, Calendar, ArrowUpRight, Cpu, HardDrive, Layers, Server } from "lucide-react";

export default function AnalyticsPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

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

  // --- Swarm Performance Line Chart Data ---
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
  const lineSeries = [
    {
      name: "Tokens (k)",
      color: "#9D6CFF", // Purple
      data: [100, 75, 80, 45, 20, 40, 0, 25],
    },
    {
      name: "Agent Runs",
      color: "#FF6B81", // Pink
      data: [50, 60, 30, 50, 75, 60, 100, 120],
    },
    {
      name: "Success Rate (%)",
      color: "#34D399", // Cyan
      data: [35, 45, 42, 50, 35, 55, 40, 45],
    },
  ];

  // Chart dimensions
  const chartWidth = 600;
  const chartHeight = 180;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 20;

  const getCoordinates = (val: number, index: number, maxVal: number) => {
    const x = paddingLeft + (index * (chartWidth - paddingLeft - paddingRight)) / (months.length - 1);
    const y = chartHeight - paddingBottom - (val * (chartHeight - paddingTop - paddingBottom)) / maxVal;
    return { x, y };
  };

  const getBezierPath = (data: number[], maxVal: number) => {
    const points = data.map((val, idx) => getCoordinates(val, idx, maxVal));
    if (points.length === 0) return "";
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const handleSvgMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const chartContentWidth = chartWidth - paddingLeft - paddingRight;
    const relativeX = mouseX - paddingLeft;
    const index = Math.round((relativeX / chartContentWidth) * (months.length - 1));
    if (index >= 0 && index < months.length) {
      setActiveLineIndex(index);
    }
  };

  const handleSvgMouseLeave = () => {
    setActiveLineIndex(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-brand-primary" />
            Analytics Portal
          </h1>
          <p className="text-xs text-brand-text-secondary mt-1">Real-time usage analytics, model latency and system performance.</p>
        </div>
        <div className="flex items-center gap-2 bg-brand-card border border-white/5 px-3 py-1.5 rounded-xl self-start font-mono text-[10px] text-brand-text-secondary">
          <Calendar className="w-3.5 h-3.5 text-brand-primary" />
          <span>July 26 - Aug 02, 2026</span>
        </div>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Tokens", value: "24,500", change: "+12%", icon: Zap, accent: "text-brand-primary" },
          { label: "Agent Runs", value: "87", change: "+8%", icon: Activity, accent: "text-brand-success" },
          { label: "Avg. Exec Time", value: "14.3s", change: "-5%", icon: Clock, accent: "text-brand-highlight" },
          { label: "Success Rate", value: "98.4%", change: "+0.3%", icon: TrendingUp, accent: "text-brand-success" },
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

      {/* Main Grid Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Token Usage Bar Chart (Left) */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-5 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-primary" />
              Weekly Token Usage
            </h2>
            <span className="text-[9px] font-mono text-brand-text-secondary">
              Total: <strong className="text-white">{totalTokens.toLocaleString()}</strong>
            </span>
          </div>

          <div className="relative h-56 flex flex-col justify-end">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[6000, 4000, 2000, 0].map((val, idx) => (
                <div key={idx} className="w-full flex items-center gap-3">
                  <span className="w-6 text-[8px] font-mono text-brand-text-secondary text-right">{val}</span>
                  <div className="flex-grow border-t border-white/5 border-dashed" />
                </div>
              ))}
            </div>

            <div className="relative z-10 flex items-end justify-between gap-3 h-40 pl-9 pr-2">
              {weeklyData.map((d, idx) => {
                const heightPct = (d.tokens / maxTokens) * 100;
                const isHovered = hoveredIndex === idx;
                
                return (
                  <div 
                    key={idx} 
                    className="flex-1 flex flex-col items-center gap-2 group cursor-pointer relative"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div className={`absolute top-[-34px] bg-brand-surface border border-white/10 rounded-lg px-2 py-0.5 text-center shadow-xl transition-all duration-200 pointer-events-none z-20 ${
                      isHovered ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-2 scale-95"
                    }`}>
                      <span className="text-[9px] font-mono font-bold text-brand-primary">{d.tokens.toLocaleString()}</span>
                    </div>

                    <div className="w-full h-28 relative rounded-t-lg bg-white/[0.02] border border-white/5 group-hover:border-brand-primary/40 overflow-hidden transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-[0_0_20px_rgba(157,108,255,0.2)]">
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-secondary to-brand-primary group-hover:from-brand-primary group-hover:to-brand-highlight rounded-t-lg transition-all duration-500"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-mono text-brand-text-secondary">{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Swarm Performance Forecast Line Chart (Right) */}
        <div className="glass-card rounded-2xl p-6 lg:col-span-7 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none" />

          {/* Chart Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand-success" />
                Revenue & Performance Forecast
              </h2>
              <p className="text-[10px] text-brand-text-secondary mt-0.5">Overview of profit, runs & token margins</p>
            </div>
            
            {/* Series Legend */}
            <div className="flex items-center gap-4">
              {lineSeries.map((s, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-[9px] font-mono text-brand-text-secondary">{s.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Line Chart Canvas */}
          <div className="relative h-56 w-full flex items-end">
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              preserveAspectRatio="none"
              className="overflow-visible cursor-crosshair"
              onMouseMove={handleSvgMouseMove}
              onMouseLeave={handleSvgMouseLeave}
            >
              {/* Grid Lines */}
              {[120, 80, 40, 0].map((val, idx) => {
                const y = chartHeight - paddingBottom - (val * (chartHeight - paddingTop - paddingBottom)) / 120;
                return (
                  <g key={idx}>
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={chartWidth - paddingRight}
                      y2={y}
                      stroke="rgba(255, 255, 255, 0.04)"
                      strokeDasharray="4 4"
                    />
                    <text
                      x={paddingLeft - 10}
                      y={y + 3}
                      fill="var(--color-brand-text-secondary)"
                      fontSize="9"
                      fontFamily="var(--font-mono)"
                      textAnchor="end"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* X-Axis Labels */}
              {months.map((m, idx) => {
                const x = paddingLeft + (idx * (chartWidth - paddingLeft - paddingRight)) / (months.length - 1);
                return (
                  <text
                    key={idx}
                    x={x}
                    y={chartHeight - 4}
                    fill="var(--color-brand-text-secondary)"
                    fontSize="9"
                    fontFamily="var(--font-mono)"
                    textAnchor="middle"
                  >
                    {m}
                  </text>
                );
              })}

              {/* Vertical Guide Line */}
              {activeLineIndex !== null && (
                <line
                  x1={getCoordinates(0, activeLineIndex, 120).x}
                  y1={paddingTop}
                  x2={getCoordinates(0, activeLineIndex, 120).x}
                  y2={chartHeight - paddingBottom}
                  stroke="rgba(157, 108, 255, 0.25)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              )}

              {/* Draw Smooth Bezier Curves */}
              {lineSeries.map((s, sIdx) => (
                <path
                  key={sIdx}
                  d={getBezierPath(s.data, 120)}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2"
                  className="transition-all duration-300"
                  style={{
                    opacity: hoveredIndex !== null && hoveredIndex !== sIdx ? 0.35 : 1,
                  }}
                />
              ))}

              {/* Draw Intersection Glowing Dots */}
              {activeLineIndex !== null &&
                lineSeries.map((s, sIdx) => {
                  const val = s.data[activeLineIndex];
                  const coords = getCoordinates(val, activeLineIndex, 120);
                  return (
                    <g key={sIdx}>
                      {/* Glow circle */}
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r="6"
                        fill={s.color}
                        opacity="0.3"
                      />
                      {/* Inner solid dot */}
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r="3.5"
                        fill={s.color}
                        stroke="#09070F"
                        strokeWidth="1"
                      />
                    </g>
                  );
                })}
            </svg>

            {/* Hover Tooltip Card */}
            {activeLineIndex !== null && (
              <div
                className="absolute z-20 bg-brand-surface/95 backdrop-blur-md border border-white/10 rounded-2xl p-3.5 shadow-2xl pointer-events-none transition-all duration-150 ease-out"
                style={{
                  left: `${((paddingLeft + (activeLineIndex * (chartWidth - paddingLeft - paddingRight)) / (months.length - 1)) / chartWidth) * 100}%`,
                  top: "15%",
                  width: "135px",
                  transform: activeLineIndex >= 5 ? "translateX(-115%)" : "translateX(15%)",
                }}
              >
                <div className="text-[10px] font-mono font-bold text-white mb-2 pb-1 border-b border-white/5">
                  {months[activeLineIndex]}
                </div>
                <div className="space-y-1.5">
                  {lineSeries.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="text-[8px] font-mono text-brand-text-secondary">
                          {s.name.split(" ")[0]}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-white">
                        {s.data[activeLineIndex]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* --- Premium Triple Widget Visualisations --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Your Performance / Swarm Engine Capacity */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between group hover:border-brand-primary/20 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />
          
          <div>
            <h3 className="text-sm font-semibold text-white">Swarm Performance</h3>
            <p className="text-[10px] text-brand-text-secondary mt-0.5">Last active node state checking</p>
          </div>

          <div className="flex items-center justify-between gap-4 my-6">
            {/* Left Items */}
            <div className="space-y-3.5 flex-1">
              {[
                { label: "Tasks Completed", count: "64 runs", desc: "Processing", icon: Layers, color: "text-brand-primary", bg: "bg-brand-primary/10" },
                { label: "Tasks in Queue", count: "4 runs", desc: "On hold", icon: Server, color: "text-brand-warning", bg: "bg-brand-warning/10" },
                { label: "Deployments Active", count: "12 runs", desc: "Delivered", icon: Cpu, color: "text-brand-success", bg: "bg-brand-success/10" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg ${item.bg}`}>
                    <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-white font-mono leading-none">{item.count}</span>
                    <span className="text-[8px] text-brand-text-secondary mt-0.5">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Gauge SVG */}
            <div className="relative w-28 h-20 flex flex-col items-center justify-center">
              <svg width="110" height="70" viewBox="0 0 100 60" className="overflow-visible">
                {/* Background arc */}
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* Foreground arc (gradient color) */}
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  fill="none"
                  stroke="url(#gauge-grad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="125"
                  strokeDashoffset="37" /* Approx 70% value fill */
                />
                <defs>
                  <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--color-brand-secondary)" />
                    <stop offset="100%" stopColor="var(--color-brand-success)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute bottom-[-10px] text-center">
                <span className="text-xl font-bold font-display text-white">275</span>
                <p className="text-[7px] text-brand-text-secondary leading-tight mt-0.5">Active swarm threads</p>
              </div>
            </div>
          </div>
          
          <p className="text-[9px] text-brand-text-secondary leading-normal font-light">
            Monitor real-time micro-agent allocation capacity across isolated runtime sandbox clusters.
          </p>
        </div>

        {/* Card 2: Customers / Token Ingest Sparkline */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between group hover:border-brand-primary/20 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />

          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Token Ingestion</h3>
              <p className="text-[10px] text-brand-text-secondary mt-0.5">Rolling average last 7 days</p>
            </div>
            <span className="text-[10px] font-mono text-brand-success font-semibold bg-brand-success/10 px-2 py-0.5 rounded-full">
              +26.5%
            </span>
          </div>

          {/* Mini Sparkline Chart */}
          <div className="relative h-24 my-4 flex items-end">
            <svg width="100%" height="100%" viewBox="0 0 200 80" preserveAspectRatio="none" className="overflow-visible">
              {/* Previous week line (grey) */}
              <path
                d="M 0 65 Q 30 50 60 55 T 120 40 T 180 50 T 200 45"
                fill="none"
                stroke="rgba(255, 255, 255, 0.15)"
                strokeWidth="1.5"
              />
              {/* Current week line (gradient purple) */}
              <path
                d="M 0 70 Q 30 35 60 48 T 120 30 T 180 20 T 200 15"
                fill="none"
                stroke="var(--color-brand-primary)"
                strokeWidth="2"
                className="drop-shadow-[0_2px_8px_rgba(157,108,255,0.4)]"
              />
            </svg>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[9px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-primary" />
                <span className="text-brand-text-secondary">April 07 - April 14</span>
              </div>
              <strong className="text-white">6,380 k</strong>
            </div>
            <div className="flex items-center justify-between text-[9px] font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-white/20" />
                <span className="text-brand-text-secondary">Last Week</span>
              </div>
              <strong className="text-white">4,298 k</strong>
            </div>
          </div>
        </div>

        {/* Card 3: Sales Overview / Resource Compute Allocations */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between group hover:border-brand-primary/20 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />

          <div>
            <h3 className="text-sm font-semibold text-white">Compute Allocations</h3>
            <p className="text-[10px] text-brand-text-secondary mt-0.5">Swarm hardware partition metrics</p>
          </div>

          <div className="flex items-center justify-between gap-4 my-4">
            {/* SVG Concentric Radial Arcs */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg width="100" height="100" viewBox="0 0 100 100" className="transform -rotate-90">
                {/* Track lines */}
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="6" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="6" />
                <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="6" />

                {/* Outer (Purple) - 75% */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="var(--color-brand-primary)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="251"
                  strokeDashoffset="62.7" /* 251 * 0.25 offset = 75% fill */
                />
                {/* Middle (Cyan) - 60% */}
                <circle
                  cx="50"
                  cy="50"
                  r="30"
                  fill="none"
                  stroke="var(--color-brand-success)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="188.4"
                  strokeDashoffset="75.3" /* 188.4 * 0.4 offset = 60% fill */
                />
                {/* Inner (Pink) - 45% */}
                <circle
                  cx="50"
                  cy="50"
                  r="20"
                  fill="none"
                  stroke="var(--color-brand-danger)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="125.6"
                  strokeDashoffset="69" /* 125.6 * 0.55 offset = 45% fill */
                />
              </svg>
              {/* Concentric scale axis labels */}
              <div className="absolute text-[8px] font-mono text-brand-text-secondary/40 font-bold select-none pointer-events-none">
                <span className="absolute top-[8px] left-[46%]">0%</span>
                <span className="absolute right-[4px] top-[45%]">25%</span>
                <span className="absolute bottom-[4px] left-[43%]">50%</span>
                <span className="absolute left-[2px] top-[45%]">75%</span>
              </div>
            </div>

            {/* List labels */}
            <div className="flex-1 space-y-2">
              {[
                { label: "GPU Core Alloc", value: "75%", color: "bg-brand-primary" },
                { label: "RAM Cluster", value: "60%", color: "bg-brand-success" },
                { label: "IO Latency", value: "45%", color: "bg-brand-danger" },
              ].map((c, idx) => (
                <div key={idx} className="flex items-center justify-between gap-1 font-mono text-[9px]">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${c.color}`} />
                    <span className="text-brand-text-secondary leading-none">{c.label}</span>
                  </div>
                  <strong className="text-white">{c.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[9px] text-brand-text-secondary leading-normal font-light">
            Displays memory and model inference pipeline load balances.
          </p>
        </div>

      </div>

    </div>
  );
}
