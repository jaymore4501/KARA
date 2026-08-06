"use client";

import React, { useState, useEffect } from "react";
import { Download, FileText, Package, FileCode, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { projectsApi, type ProjectResponse } from "@/lib/api";

export default function ExportsPage() {
  const { accessToken } = useAuthStore();
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) return;

    projectsApi.list(accessToken)
      .then((data) => {
        const completedOnly = data.projects.filter(p => p.status === "completed");
        setProjects(completedOnly);
        if (completedOnly.length > 0) {
          setSelectedProjectId(completedOnly[0].id);
        }
      })
      .catch((err) => {
        console.error("Failed to load projects", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [accessToken]);

  const handleDownload = async (projectId: string, type: string, filename: string) => {
    if (!accessToken) return;
    setDownloadingId(type);
    setErrorMsg(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const url = type === "bundle"
        ? `${baseUrl}/exports/bundle/${projectId}`
        : `${baseUrl}/exports/download/${projectId}/${type}`;

      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || "Export file is not compiled yet. Make sure you run the startup builder pipeline first.");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to download export file");
    } finally {
      setDownloadingId(null);
    }
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const getExportAssets = (project: ProjectResponse) => [
    { type: "bundle", name: `${project.name} - Full Package`, ext: "zip", size: "Zip Archive", icon: Package, filename: `${project.name}_Startup_Package.zip` },
    { type: "business", name: `${project.name} - Business Plan`, ext: "txt", size: "Plain Text (.txt)", icon: FileText, filename: `${project.name}_Business_Plan.txt` },
    { type: "research", name: `${project.name} - Market Research`, ext: "txt", size: "Plain Text (.txt)", icon: FileText, filename: `${project.name}_Market_Research.txt` },
    { type: "architecture", name: `${project.name} - Architecture Spec`, ext: "txt", size: "Plain Text (.txt)", icon: FileText, filename: `${project.name}_Architecture.txt` },
    { type: "database", name: `${project.name} - Database Schema`, ext: "txt", size: "Plain Text (.txt)", icon: FileCode, filename: `${project.name}_Database_Schema.txt` },
    { type: "code", name: `${project.name} - Codebase Blueprint`, ext: "txt", size: "Plain Text (.txt)", icon: FileCode, filename: `${project.name}_Codebase.txt` },
    { type: "investor", name: `${project.name} - Investor Pitch Deck`, ext: "txt", size: "Plain Text (.txt)", icon: FileText, filename: `${project.name}_Pitch_Deck.txt` },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
          <Download className="w-5 h-5 text-brand-primary" />
          Exports
        </h1>
        <p className="text-xs text-brand-text-secondary mt-1">Download your compiled project archives and business sheets</p>
      </div>

      {isLoading ? (
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-brand-primary border-t-transparent animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-xl bg-white/5 mx-auto flex items-center justify-center text-brand-text-secondary">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-white">No Compiled Projects</h3>
          <p className="text-xs text-brand-text-secondary leading-relaxed">
            There are no fully compiled startup projects ready for export. Navigate to Projects, select a project workspace, and trigger the AI agent workforce pipeline to generate files.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Project Selection Dropdown */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 glass-card rounded-2xl">
            <div className="text-left">
              <span className="text-[9px] font-mono text-brand-text-secondary uppercase tracking-widest block mb-1">Active workspace</span>
              <h4 className="text-sm font-semibold text-white">Select Startup Package</h4>
            </div>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-[#0D0B16] border border-white/10 focus:border-brand-primary/40 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl border border-brand-danger/20 bg-brand-danger/10 text-xs text-brand-danger animate-fadeIn text-left">
              {errorMsg}
            </div>
          )}

          {selectedProject && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {getExportAssets(selectedProject).map((exp, idx) => (
                <div key={idx} className="glass-card rounded-2xl p-5 hover:border-brand-primary/20 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-highlight">
                      <exp.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <h3 className="text-sm font-semibold text-white group-hover:text-brand-highlight transition-colors truncate">
                        {exp.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[9px] font-mono text-brand-text-secondary uppercase">{exp.ext}</span>
                        <span className="text-[9px] text-brand-text-secondary">{exp.size}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(selectedProject.id, exp.type, exp.filename)}
                      disabled={downloadingId !== null}
                      className="p-3 rounded-xl bg-brand-primary/10 text-brand-highlight hover:bg-brand-primary/20 transition-all cursor-pointer disabled:opacity-40"
                    >
                      {downloadingId === exp.type ? (
                        <div className="w-4 h-4 border-2 border-brand-highlight border-t-transparent animate-spin rounded-full" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
