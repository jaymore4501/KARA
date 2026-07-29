"use client";

import React from "react";
import { Download, FileText, Package, FileCode } from "lucide-react";

const exports = [
  { name: "VeloCloud - Full Package", type: "zip", size: "4.2 MB", date: "2h ago", icon: Package },
  { name: "VeloCloud - Business Plan", type: "pdf", size: "1.2 MB", date: "3h ago", icon: FileText },
  { name: "VeloCloud - Pitch Deck", type: "pdf", size: "2.8 MB", date: "4h ago", icon: FileText },
  { name: "VeloCloud - All Docs", type: "md", size: "820 KB", date: "4h ago", icon: FileCode },
];

export default function ExportsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-brand-primary" />
          Exports
        </h1>
        <p className="text-xs text-brand-text-secondary mt-1">Download your generated startup packages</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {exports.map((exp, idx) => (
          <div key={idx} className="glass-card rounded-2xl p-6 hover:border-brand-primary/20 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-highlight">
                <exp.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white group-hover:text-brand-highlight transition-colors truncate">{exp.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[9px] font-mono text-brand-text-secondary uppercase">{exp.type}</span>
                  <span className="text-[9px] text-brand-text-secondary">{exp.size}</span>
                  <span className="text-[9px] text-brand-text-secondary">{exp.date}</span>
                </div>
              </div>
              <button className="p-3 rounded-xl bg-brand-primary/10 text-brand-highlight hover:bg-brand-primary/20 transition-all">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
