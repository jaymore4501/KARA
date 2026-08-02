"use client";

import React, { useState, useRef } from "react";
import { BarChart3, TrendingUp, Zap, Clock, Activity, Calendar, ArrowUpRight } from "lucide-react";

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

  // Generate smooth SVG Cubic Bezier path
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

  // Handle mouse moves over SVG to track vertical hover line
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

      {/* Chart Section Grid */}
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
    </div>
  );
}
