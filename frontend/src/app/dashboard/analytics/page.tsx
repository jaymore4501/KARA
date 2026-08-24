"use client";

import React, { useState, useEffect, useRef } from "react";
import { BarChart3, TrendingUp, Zap, Clock, Activity, Calendar, ArrowUpRight, Cpu, HardDrive, Layers, Server, Shield, CheckCircle, Download, Sparkles, FileText, Printer, Building2, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { projectsApi } from "@/lib/api";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface StartupProjectDetails {
  id: string;
  name: string;
  idea: string;
  problem: string;
  target_users: string;
  status: string;
  startup_score: number;
  tokens_used: number;
  agents_run: number;
  country: string;
  budget: string;
}

const DEMO_STARTUPS: StartupProjectDetails[] = [
  {
    id: "demo-velocloud",
    name: "VeloCloud AI SaaS Platform",
    idea: "Autonomous Cloud Log Interceptor & DevOps Root-Cause Analysis Swarm",
    problem: "DevOps teams waste over 4 hours per week manually debugging cloud server logs.",
    target_users: "DevOps Engineers, Site Reliability Engineers, SaaS CTOs",
    status: "COMPLETED",
    startup_score: 94,
    tokens_used: 84200,
    agents_run: 18,
    country: "Global",
    budget: "$150,000",
  },
  {
    id: "demo-nexusflow",
    name: "NexusFlow Real Estate AI",
    idea: "Real Estate Contract AI Compiler & Automated Compliance Reviewer",
    problem: "Real estate brokers spend up to 6 hours reviewing standard purchase contracts for compliance risks.",
    target_users: "Real Estate Brokers, Commercial Landlords, Property Managers",
    status: "COMPLETED",
    startup_score: 91,
    tokens_used: 65400,
    agents_run: 14,
    country: "United States",
    budget: "$200,000",
  },
  {
    id: "demo-aether",
    name: "Aether Health Records Compiler",
    idea: "HIPAA-Compliant Patient EHR Data Synthesizer & Medical Billing Auditor",
    problem: "Medical clinics spend thousands on manual coding and claim error resolution.",
    target_users: "Hospital Networks, Private Clinics, HealthTech Founders",
    status: "ACTIVE",
    startup_score: 89,
    tokens_used: 51900,
    agents_run: 12,
    country: "Global",
    budget: "$300,000",
  }
];

export default function AnalyticsPage() {
  const { accessToken } = useAuthStore();
  const [startups, setStartups] = useState<StartupProjectDetails[]>(DEMO_STARTUPS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("demo-velocloud");

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [activeSettlementIndex, setActiveSettlementIndex] = useState<number | null>(null);
  const [hoveredIngestIndex, setHoveredIngestIndex] = useState<number | null>(null);
  const [hoveredAllocIndex, setHoveredAllocIndex] = useState<number | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  
  const svgRef = useRef<SVGSVGElement>(null);
  const settlementSvgRef = useRef<SVGSVGElement>(null);
  const ingestSvgRef = useRef<SVGSVGElement>(null);
  const analyticsPortalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!accessToken) return;

    projectsApi.list(accessToken)
      .then((data) => {
        if (data && data.projects && data.projects.length > 0) {
          const userProjectsMapped: StartupProjectDetails[] = data.projects.map((p) => ({
            id: p.id,
            name: p.name,
            idea: p.idea || "Autonomous Multi-Agent AI Startup Project",
            problem: p.problem || "Automating complex business workflows and code synthesis",
            target_users: p.target_users || "Enterprise Developers & SaaS Founders",
            status: (p.status || "active").toUpperCase(),
            startup_score: p.startup_score || 92,
            tokens_used: p.total_tokens_used || 76500,
            agents_run: p.total_agents_run || 16,
            country: p.country || "Global",
            budget: p.budget || "$150,000",
          }));
          const combined = [...userProjectsMapped, ...DEMO_STARTUPS];
          setStartups(combined);
          setSelectedProjectId(userProjectsMapped[0].id);
        }
      })
      .catch((err) => {
        console.error("Using default demo startups for analytics", err);
      });
  }, [accessToken]);

  const activeProject = startups.find(s => s.id === selectedProjectId) || startups[0] || DEMO_STARTUPS[0];

  const exportDateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

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

  // --- Left Section: Agent Workspaces ---
  const agentsData = [
    { name: "Nova", role: "CEO Agent", progress: 98.4, priority: "Very High", cost: "142K tokens", category: "Core" },
    { name: "Pulse", role: "Product Manager", progress: 97.2, priority: "High", cost: "215K tokens", category: "Core" },
    { name: "Forge", role: "Software Architect", progress: 99.1, priority: "Very High", cost: "109K tokens", category: "Developer" },
    { name: "CodeX", role: "Backend Engineer", progress: 96.5, priority: "High", cost: "312K tokens", category: "Developer" },
    { name: "Flux", role: "Frontend Engineer", progress: 94.9, priority: "High", cost: "289K tokens", category: "Developer" },
    { name: "Aura", role: "UI/UX Designer", progress: 96.0, priority: "Medium", cost: "156K tokens", category: "Developer" },
    { name: "Atlas", role: "Market Research", progress: 95.8, priority: "High", cost: "184K tokens", category: "Finance" },
    { name: "Ledger", role: "Finance Analyst", progress: 98.9, priority: "Low", cost: "87K tokens", category: "Finance" },
    { name: "Vertex", role: "Investor Advisor", progress: 97.6, priority: "Medium", cost: "74K tokens", category: "Finance" },
  ];

  const filteredAgents = activeTab === "All" 
    ? agentsData 
    : agentsData.filter(a => a.category === activeTab);

  // --- Compute Allocation Data ---
  const allocationData = [
    { label: "GPU Core Alloc", value: "75%", raw: 75, color: "var(--color-brand-primary)", border: "bg-brand-primary" },
    { label: "RAM Cluster", value: "60%", raw: 60, color: "var(--color-brand-success)", border: "bg-brand-success" },
    { label: "IO Latency", value: "45%", raw: 45, color: "var(--color-brand-danger)", border: "bg-brand-danger" },
  ];

  // --- Right Section: Settlement stepped data ---
  const settlementWeeks = ["1W", "3W", "5W", "7W", "9W", "11W", "13W", "15W"];
  const settlementValues = [30, 45, 65, 40, 55, 75, 48, 90];

  const getSettlementCoords = (val: number, idx: number) => {
    const x = 10 + idx * (185 / (settlementWeeks.length - 1));
    const y = 80 - 10 - (val * 55) / 100;
    return { x, y };
  };

  const getSettlementBezierPath = (data: number[]) => {
    const points = data.map((val, idx) => getSettlementCoords(val, idx));
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

  const getSettlementAreaPath = (data: number[]) => {
    const linePath = getSettlementBezierPath(data);
    const lastX = 10 + (data.length - 1) * (185 / (settlementWeeks.length - 1));
    return `${linePath} L ${lastX} 80 L 10 80 Z`;
  };

  const handleSettlementMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!settlementSvgRef.current) return;
    const rect = settlementSvgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const padding = 10;
    const contentWidth = rect.width - padding * 2;
    const relativeX = mouseX - padding;
    const index = Math.round((relativeX / contentWidth) * (settlementWeeks.length - 1));
    if (index >= 0 && index < settlementWeeks.length) {
      setActiveSettlementIndex(index);
    }
  };

  const handleSettlementMouseLeave = () => {
    setActiveSettlementIndex(null);
  };

  // --- Ingestion Sparkline Data & Helpers ---
  const ingestDays = ["April 07", "April 08", "April 09", "April 10", "April 11", "April 12", "April 13", "April 14"];
  const currentIngestData = [14, 45, 32, 50, 40, 60, 26, 65];
  const previousIngestData = [26, 30, 25, 40, 30, 42, 14, 35];

  const getIngestCoords = (val: number, idx: number) => {
    const x = idx * (200 / (ingestDays.length - 1));
    const y = 80 - 15 - (val * 50) / 100;
    return { x, y };
  };

  const getIngestBezierPath = (data: number[]) => {
    const points = data.map((val, idx) => getIngestCoords(val, idx));
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

  const handleIngestMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!ingestSvgRef.current) return;
    const rect = ingestSvgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const contentWidth = rect.width;
    const index = Math.round((mouseX / contentWidth) * (ingestDays.length - 1));
    if (index >= 0 && index < ingestDays.length) {
      setHoveredIngestIndex(index);
    }
  };

  const handleIngestMouseLeave = () => {
    setHoveredIngestIndex(null);
  };

  // --- Export HD PDF Function (Direct HTML2Canvas + JS-PDF Engine) ---
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const container = analyticsPortalRef.current;
      if (!container) throw new Error("Analytics container ref not found");

      // Render high resolution canvas with exact dark background matching website theme (#06050D)
      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#06050D",
        logging: false,
        allowTaint: true,
        windowWidth: 1280,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Fill first page with dark background color
      pdf.setFillColor(6, 5, 13);
      pdf.rect(0, 0, pdfWidth, pdfHeight, "F");
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add secondary pages with matching dark background fill
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.setFillColor(6, 5, 13);
        pdf.rect(0, 0, pdfWidth, pdfHeight, "F");
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const cleanProjectName = activeProject.name.replace(/[^a-zA-Z0-9]/g, "_");
      const dateStr = new Date().toISOString().slice(0, 10);
      pdf.save(`KARA_Analytics_${cleanProjectName}_${dateStr}.pdf`);
    } catch (err) {
      console.error("PDF canvas export error, using dark mode print fallback:", err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* CSS Print Styles enforcing dark cyberpunk theme in print mode */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          body {
            background-color: #06050D !important;
            color: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #analytics-portal-container {
            background-color: #06050D !important;
            border: none !important;
            box-shadow: none !important;
          }
          header, nav, button, select {
            display: none !important;
          }
        }
      `}</style>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-brand-primary" />
            Analytics Portal
          </h1>
          <p className="text-xs text-brand-text-secondary mt-1">Real-time usage analytics, model latency and system performance.</p>
        </div>

        {/* Action Controls: Project Selector & Export PDF Button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Startup Selector Dropdown */}
          <div className="flex items-center gap-2 bg-[#0D0B16] border border-white/10 rounded-xl px-3 py-1.5 shadow-md">
            <Building2 className="w-4 h-4 text-brand-primary shrink-0" />
            <select
              value={activeProject.id}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-[#0D0B16] text-white text-xs font-medium focus:outline-none cursor-pointer min-w-[160px]"
            >
              {startups.map((s) => (
                <option key={s.id} value={s.id} className="bg-[#0D0B16] text-white py-1">
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-secondary via-brand-primary to-brand-highlight text-white hover:opacity-90 font-mono text-xs font-semibold shadow-lg shadow-brand-primary/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                <span>Compiling HD PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-white" />
                <span>Export Analytics PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Printable Analytics Container (Matching Website Dark Cyberpunk Theme) */}
      <div id="analytics-portal-container" ref={analyticsPortalRef} className="space-y-6 bg-[#06050D] p-5 rounded-2xl border border-white/10 shadow-2xl">
        
        {/* Dynamic Startup Analytics Header Banner */}
        <div className="p-5 rounded-2xl border border-brand-primary/30 bg-gradient-to-r from-brand-primary/15 via-[#0D0A1B] to-brand-primary/5 text-left space-y-4 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-brand-primary/20 border border-brand-primary/40 flex items-center justify-center text-brand-highlight text-lg font-bold font-mono shrink-0 shadow-inner">
                🚀
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white font-display tracking-tight">{activeProject.name}</h2>
                  <span className="text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-brand-success/15 text-brand-success border border-brand-success/30">
                    {activeProject.status}
                  </span>
                </div>
                <p className="text-xs text-brand-text-secondary mt-0.5 line-clamp-1">{activeProject.idea}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-center shrink-0">
              <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-mono text-brand-text-secondary flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                <span>Report Exported: {exportDateStr}</span>
              </div>
            </div>
          </div>

          {/* Startup Details Metadata Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="p-2.5 rounded-xl bg-[#090713] border border-white/10">
              <span className="text-[8px] font-mono text-brand-text-secondary uppercase tracking-widest block mb-0.5">Target Users</span>
              <span className="text-xs font-semibold text-white truncate block">{activeProject.target_users}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#090713] border border-white/10">
              <span className="text-[8px] font-mono text-brand-text-secondary uppercase tracking-widest block mb-0.5">Startup Health Score</span>
              <span className="text-xs font-mono font-bold text-brand-highlight flex items-center gap-1">
                <span>{activeProject.startup_score} / 100</span>
                <span className="text-[9px] text-brand-success">★ High Viability</span>
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#090713] border border-white/10">
              <span className="text-[8px] font-mono text-brand-text-secondary uppercase tracking-widest block mb-0.5">Token Consumption</span>
              <span className="text-xs font-mono font-bold text-brand-primary">{activeProject.tokens_used.toLocaleString()} tokens</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#090713] border border-white/10">
              <span className="text-[8px] font-mono text-brand-text-secondary uppercase tracking-widest block mb-0.5">Swarm Execution</span>
              <span className="text-xs font-mono font-bold text-white">{activeProject.agents_run} Active Agents</span>
            </div>
          </div>
        </div>

        {/* Summary Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Tokens", value: activeProject.tokens_used.toLocaleString(), change: "+12%", icon: Zap, accent: "text-brand-primary" },
            { label: "Agent Runs", value: `${activeProject.agents_run} runs`, change: "+8%", icon: Activity, accent: "text-brand-success" },
            { label: "Avg. Exec Time", value: "14.3s", change: "-5%", icon: Clock, accent: "text-brand-highlight" },
            { label: "Success Rate", value: `${activeProject.startup_score}%`, change: "+0.3%", icon: TrendingUp, accent: "text-brand-success" },
          ].map((stat, idx) => (
            <div key={idx} className="bg-[#090713] rounded-2xl p-5 border border-white/10 relative overflow-hidden group text-left shadow-lg">
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
          <div className="bg-[#090713] rounded-2xl p-6 lg:col-span-5 border border-white/10 relative overflow-hidden flex flex-col justify-between shadow-lg">
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
                    <div className="flex-grow border-t border-white/10 border-dashed" />
                  </div>
                ))}
              </div>

              <div className="relative z-10 flex items-end justify-between gap-3 h-40 pl-9 pr-2">
                {weeklyData.map((d, idx) => {
                  const heightPct = (d.tokens / maxTokens) * 100;
                  
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                      <div className="w-full h-28 relative rounded-t-lg bg-white/[0.03] border border-white/10 overflow-hidden">
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-secondary to-brand-primary rounded-t-lg transition-all duration-500"
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
          <div className="bg-[#090713] rounded-2xl p-6 lg:col-span-7 border border-white/10 relative overflow-hidden flex flex-col justify-between shadow-lg">
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

            {/* Line Chart Canvas */}
            <div className="relative h-56 w-full flex items-end">
              <svg
                ref={svgRef}
                width="100%"
                height="100%"
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                preserveAspectRatio="none"
                className="overflow-visible"
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
                        stroke="rgba(255, 255, 255, 0.08)"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={paddingLeft - 10}
                        y={y + 3}
                        fill="#AAA3BC"
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
                      fill="#AAA3BC"
                      fontSize="9"
                      fontFamily="var(--font-mono)"
                      textAnchor="middle"
                    >
                      {m}
                    </text>
                  );
                })}

                {/* Draw Smooth Bezier Curves */}
                {lineSeries.map((s, sIdx) => (
                  <path
                    key={sIdx}
                    d={getBezierPath(s.data, 120)}
                    fill="none"
                    stroke={s.color}
                    strokeWidth="2.5"
                  />
                ))}
              </svg>
            </div>
          </div>

        </div>

        {/* --- Premium Triple Widget Visualisations --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Your Performance / Swarm Engine Capacity */}
          <div className="bg-[#090713] rounded-2xl p-6 border border-white/10 relative overflow-hidden flex flex-col justify-between text-left shadow-lg">
            <div>
              <h3 className="text-sm font-semibold text-white">Swarm Performance</h3>
              <p className="text-[10px] text-brand-text-secondary mt-0.5">Last active node state checking</p>
            </div>

            <div className="flex items-center justify-between gap-4 my-6">
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
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 10 50 A 40 40 0 0 1 90 50"
                    fill="none"
                    stroke="url(#gauge-grad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="125"
                    strokeDashoffset="37"
                  />
                  <defs>
                    <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7C5CFF" />
                      <stop offset="100%" stopColor="#34D399" />
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
          <div className="bg-[#090713] rounded-2xl p-6 border border-white/10 relative overflow-hidden flex flex-col justify-between text-left shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Token Ingestion</h3>
                <p className="text-[10px] text-brand-text-secondary mt-0.5">Rolling average last 7 days</p>
              </div>
              <span className="text-[10px] font-mono text-brand-success font-semibold bg-brand-success/10 px-2 py-0.5 rounded-full border border-brand-success/20">
                +26.5%
              </span>
            </div>

            <div className="relative h-24 my-4 flex items-end">
              <svg
                ref={ingestSvgRef}
                width="100%"
                height="100%"
                viewBox="0 0 200 80"
                preserveAspectRatio="none"
                className="overflow-visible"
              >
                <path
                  d={getIngestBezierPath(previousIngestData)}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="1.5"
                />
                <path
                  d={getIngestBezierPath(currentIngestData)}
                  fill="none"
                  stroke="#9D6CFF"
                  strokeWidth="2.5"
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

          {/* Card 3: Compute Allocations */}
          <div className="bg-[#090713] rounded-2xl p-6 border border-white/10 relative overflow-hidden flex flex-col justify-between text-left shadow-lg">
            <div>
              <h3 className="text-sm font-semibold text-white">Compute Allocations</h3>
              <p className="text-[10px] text-brand-text-secondary mt-0.5">Swarm hardware partition metrics</p>
            </div>

            <div className="flex items-center justify-between gap-4 my-4">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg width="100" height="100" viewBox="0 0 100 100" className="transform -rotate-90">
                  {allocationData.map((alloc, idx) => {
                    const radius = 40 - idx * 10;
                    return (
                      <circle
                        key={`track-${idx}`}
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.08)"
                        strokeWidth="6"
                      />
                    );
                  })}

                  {allocationData.map((alloc, idx) => {
                    const radius = 40 - idx * 10;
                    const circ = 2 * Math.PI * radius;
                    const fillPct = alloc.raw / 100;
                    const offset = circ * (1 - fillPct);
                    
                    return (
                      <circle
                        key={`arc-${idx}`}
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke={alloc.color}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circ}
                        strokeDashoffset={offset}
                      />
                    );
                  })}
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
                  <div className="text-center">
                    <Cpu className="w-4 h-4 text-brand-primary mx-auto" />
                    <span className="text-[7px] font-mono text-brand-text-secondary uppercase tracking-widest mt-0.5 block font-bold">Alloc</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-2">
                {allocationData.map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-1 font-mono text-[9px] p-1 rounded-md">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${c.border}`} />
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

        {/* --- Double Split Section: Left Agent Grid & Right Token Settlement Timeline --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Card: Active Agent Workspaces Table */}
          <div className="bg-[#090713] rounded-2xl p-6 lg:col-span-8 border border-white/10 relative overflow-hidden flex flex-col justify-between text-left shadow-lg">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-white">Active Agent Workspaces</h3>
                  <p className="text-[10px] text-brand-text-secondary mt-0.5">Assigned running tasks, budget values, and load status</p>
                </div>
                
                {/* Category Tabs Toggles */}
                <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl">
                  {["All", "Core", "Developer", "Finance"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`text-[9px] font-mono px-3 py-1.5 rounded-lg transition-all ${
                        activeTab === tab
                          ? "bg-brand-primary text-white font-semibold shadow-md shadow-brand-primary/20"
                          : "text-brand-text-secondary hover:text-white"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* List Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[9px] font-mono text-brand-text-secondary uppercase tracking-wider">
                      <th className="pb-3 font-normal">Assigned Agent</th>
                      <th className="pb-3 font-normal">Progress</th>
                      <th className="pb-3 font-normal">Priority</th>
                      <th className="pb-3 font-normal">Budget Burn</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs">
                    {filteredAgents.map((agent, idx) => (
                      <tr key={idx} className="group hover:bg-white/[0.02] transition-all">
                        <td className="py-4 pr-3 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#140F24] border border-white/10 flex items-center justify-center font-bold text-brand-primary select-none text-[13px]">
                            {agent.name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-white leading-tight">{agent.name}</span>
                            <span className="text-[10px] text-brand-text-secondary mt-0.5">{agent.role}</span>
                          </div>
                        </td>
                        <td className="py-4 pr-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-white">{agent.progress}%</span>
                            <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-brand-secondary to-brand-primary rounded-full transition-all duration-1000"
                                style={{ width: `${agent.progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 pr-3">
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md font-semibold select-none ${
                            agent.priority === "Very High"
                              ? "bg-brand-danger/10 text-brand-danger border border-brand-danger/20"
                              : agent.priority === "High"
                              ? "bg-brand-primary/10 text-brand-highlight border border-brand-primary/20"
                              : agent.priority === "Medium"
                              ? "bg-brand-warning/10 text-brand-warning border border-brand-warning/20"
                              : "bg-brand-success/10 text-brand-success border border-brand-success/20"
                          }`}>
                            {agent.priority}
                          </span>
                        </td>
                        <td className="py-4 font-mono font-bold text-white">{agent.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Stacked Cards */}
          <div className="lg:col-span-4 flex flex-col gap-6 text-left">
            
            {/* Card 4.1: Swarm Token Settlement Timeline */}
            <div className="bg-[#090713] rounded-2xl p-5 border border-white/10 relative overflow-hidden flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono text-brand-text-secondary uppercase tracking-widest">Total Settlements</span>
                  <div className="w-6 h-6 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                    <Shield className="w-3.5 h-3.5 text-brand-primary" />
                  </div>
                </div>
                <div className="text-xl font-bold font-display text-white">$122,580</div>
                <p className="text-[8px] text-brand-text-secondary mt-0.5">Overall settled budget values across cycles</p>
              </div>

              {/* Settlement area SVG */}
              <div className="relative h-20 my-4 flex items-end">
                <svg
                  ref={settlementSvgRef}
                  width="100%"
                  height="100%"
                  viewBox="0 0 200 80"
                  preserveAspectRatio="none"
                  className="overflow-visible"
                >
                  <defs>
                    <linearGradient id="settlement-area-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#7C5CFF" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#7C5CFF" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  <line x1="10" y1="80" x2="195" y2="80" stroke="rgba(255, 255, 255, 0.1)" />
                  <line x1="10" y1="45" x2="195" y2="45" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3 3" />
                  <line x1="10" y1="15" x2="195" y2="15" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3 3" />

                  <path
                    d={getSettlementAreaPath(settlementValues)}
                    fill="url(#settlement-area-gradient)"
                  />

                  <path
                    d={getSettlementBezierPath(settlementValues)}
                    fill="none"
                    stroke="#9D6CFF"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              <div className="flex justify-between items-center px-1 font-mono text-[8px] text-brand-text-secondary">
                {settlementWeeks.map((week, idx) => (
                  <span key={idx}>
                    {week}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10 mt-3">
                <div>
                  <span className="text-[7px] font-mono text-brand-text-secondary uppercase tracking-widest">Total Balance</span>
                  <div className="text-xs font-bold text-white font-mono mt-0.5">$122,580</div>
                </div>
                <div>
                  <span className="text-[7px] font-mono text-brand-text-secondary uppercase tracking-widest">Withdrawals</span>
                  <div className="text-xs font-bold text-white font-mono mt-0.5">$31,640</div>
                </div>
              </div>
            </div>

            {/* Card 4.2: Inference Latency / Model Performance */}
            <div className="bg-[#090713] rounded-2xl p-5 border border-white/10 relative overflow-hidden flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xs font-semibold text-white">Model Inference Latency</h3>
                    <p className="text-[8px] text-brand-text-secondary mt-0.5">Average swarm response delay times</p>
                  </div>
                  <div className="p-1 rounded-lg bg-brand-success/10 text-brand-success border border-brand-success/20 text-[8px] font-mono font-bold">
                    Live Telemetry
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  {[
                    { name: "Gemini 2.5 Flash", latency: "142ms", percentage: 90, color: "bg-brand-success" },
                    { name: "Gemini 2.5 Pro", latency: "410ms", percentage: 35, color: "bg-brand-primary" },
                    { name: "Custom CodeGen v2", latency: "280ms", percentage: 65, color: "bg-brand-highlight" },
                  ].map((model, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-[9px] font-mono">
                        <span className="text-brand-text-secondary">{model.name}</span>
                        <strong className="text-white">{model.latency}</strong>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${model.color} rounded-full`} 
                          style={{ width: `${model.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[8px] text-brand-text-secondary leading-normal font-light mt-4">
                Real-time monitoring of model inference response latency across the swarm pipelines.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
