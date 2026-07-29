"use client";

import React from "react";
import { FileText, Download, Search, Upload } from "lucide-react";

const documents = [
  { title: "VeloCloud Market Research Report", type: "market_research", agent: "Atlas", date: "2h ago", size: "24 KB" },
  { title: "VeloCloud Business Plan v2", type: "business_plan", agent: "Pulse", date: "3h ago", size: "42 KB" },
  { title: "VeloCloud System Architecture", type: "architecture", agent: "Forge", date: "4h ago", size: "18 KB" },
  { title: "VeloCloud Database Schema", type: "db_schema", agent: "Forge", date: "4h ago", size: "12 KB" },
  { title: "VeloCloud UI Design System", type: "ui_spec", agent: "Aura", date: "5h ago", size: "31 KB" },
  { title: "VeloCloud Marketing Strategy", type: "marketing", agent: "Echo", date: "6h ago", size: "28 KB" },
  { title: "VeloCloud Financial Model", type: "finance", agent: "Ledger", date: "6h ago", size: "35 KB" },
  { title: "VeloCloud Investor Pitch Deck", type: "pitch_deck", agent: "Vertex", date: "7h ago", size: "48 KB" },
];

export default function DocumentsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-primary" />
            Documents
          </h1>
          <p className="text-xs text-brand-text-secondary mt-1">All generated and uploaded documents across your projects</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl text-xs font-semibold px-4 py-2.5 bg-white/5 border border-white/10 text-white hover:border-brand-primary/30 transition-all">
          <Upload className="w-3.5 h-3.5" />
          Upload Document
        </button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
        <input
          type="text"
          placeholder="Search documents..."
          className="w-full bg-white/5 border border-white/5 focus:border-brand-primary/30 focus:outline-none py-2.5 pl-9 pr-4 rounded-xl text-xs text-white placeholder-white/30 transition-all"
        />
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-6 py-3 border-b border-white/5 text-[9px] font-mono text-brand-text-secondary uppercase tracking-widest">
          <span>Document</span>
          <span>Type</span>
          <span>Agent</span>
          <span>Size</span>
          <span></span>
        </div>
        {documents.map((doc, idx) => (
          <div key={idx} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-6 py-4 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="w-4 h-4 text-brand-highlight shrink-0" />
              <span className="text-xs text-white font-medium truncate">{doc.title}</span>
            </div>
            <span className="text-[9px] font-mono text-brand-text-secondary uppercase px-2 py-1 bg-white/5 rounded-md">{doc.type.replace("_", " ")}</span>
            <span className="text-[10px] text-brand-primary font-mono">{doc.agent}</span>
            <span className="text-[10px] text-brand-text-secondary font-mono">{doc.size}</span>
            <button className="text-brand-text-secondary hover:text-brand-highlight transition-colors">
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
