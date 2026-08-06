"use client";

import React, { useState, useEffect, useRef } from "react";
import { FileText, Download, Search, Upload, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { projectsApi, documentsApi, type ProjectResponse, type DocumentResponse } from "@/lib/api";

export default function DocumentsPage() {
  const { accessToken } = useAuthStore();
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!accessToken) return;

    projectsApi.list(accessToken)
      .then((data) => {
        setProjects(data.projects);
        if (data.projects.length > 0) {
          setSelectedProjectId(data.projects[0].id);
        }
      })
      .catch((err) => {
        console.error("Failed to load projects", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken || !selectedProjectId) return;

    documentsApi.list(accessToken, selectedProjectId)
      .then((docs) => {
        setDocuments(docs);
      })
      .catch(() => {
        setDocuments([]);
      });
  }, [accessToken, selectedProjectId]);

  const handleDownload = async (docType: string, title: string) => {
    if (!accessToken || !selectedProjectId) return;
    setDownloadingId(docType);
    setErrorMsg(null);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const url = `${baseUrl}/exports/download/${selectedProjectId}/${docType}`;

      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.detail || "Document content is not compiled yet.");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `${title.replace(/\s+/g, '_')}.txt`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to download document");
    } finally {
      setDownloadingId(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !accessToken || !selectedProjectId) return;

    setUploading(true);
    setErrorMsg(null);
    try {
      await documentsApi.upload(accessToken, selectedProjectId, file);
      const updatedDocs = await documentsApi.list(accessToken, selectedProjectId);
      setDocuments(updatedDocs);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upload document");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.doc_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const agentMap: Record<string, string> = {
    business: "Nova (CEO)",
    business_plan: "Nova (CEO)",
    research: "Atlas (Market)",
    market_research: "Atlas (Market)",
    architecture: "Forge (Architect)",
    database: "Forge (Database)",
    db_schema: "Forge (Database)",
    code: "CodeX & Flux",
    investor: "Ledger & Vertex",
    pitch_deck: "Ledger & Vertex",
    uploaded: "User Upload",
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept=".txt,.md,.pdf,.docx"
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-primary" />
            Documents
          </h1>
          <p className="text-xs text-brand-text-secondary mt-1">All generated and uploaded documents across your projects</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || !selectedProjectId}
          className="flex items-center gap-2 rounded-xl text-xs font-semibold px-4 py-2.5 bg-white/5 border border-white/10 text-white hover:border-brand-primary/30 disabled:opacity-40 transition-all cursor-pointer"
        >
          <Upload className="w-3.5 h-3.5" />
          {uploading ? "Uploading..." : "Upload Document"}
        </button>
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
          <h3 className="text-sm font-semibold text-white">No Projects Found</h3>
          <p className="text-xs text-brand-text-secondary leading-relaxed">
            Create a project first to access and generate workspace documents.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 glass-card rounded-2xl">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents by name or type..."
                className="w-full bg-white/5 border border-white/5 focus:border-brand-primary/30 focus:outline-none py-2.5 pl-10 pr-4 rounded-xl text-xs text-white placeholder-white/30 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-[10px] font-mono text-brand-text-secondary uppercase tracking-wider whitespace-nowrap">Project:</span>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="bg-[#0D0B16] border border-white/10 focus:border-brand-primary/40 focus:outline-none rounded-xl px-4 py-2 text-xs text-white cursor-pointer w-full sm:w-auto"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {errorMsg && (
            <div className="p-4 rounded-xl border border-brand-danger/20 bg-brand-danger/10 text-xs text-brand-danger animate-fadeIn text-left">
              {errorMsg}
            </div>
          )}

          {/* Table */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 px-6 py-3 border-b border-white/5 text-[9px] font-mono text-brand-text-secondary uppercase tracking-widest">
              <span>Document</span>
              <span>Type</span>
              <span>Agent Author</span>
              <span>Format</span>
              <span></span>
            </div>

            {filteredDocs.length === 0 ? (
              <div className="p-12 text-center text-xs font-mono text-brand-text-secondary">
                No documents found for this project workspace. Build the project pipeline to generate files.
              </div>
            ) : (
              filteredDocs.map((doc) => (
                <div key={doc.id} className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-6 py-4 border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3 min-w-0 text-left">
                    <FileText className="w-4 h-4 text-brand-highlight shrink-0" />
                    <span className="text-xs text-white font-medium truncate">{doc.title}</span>
                  </div>
                  <span className="text-[9px] font-mono text-brand-text-secondary uppercase px-2 py-1 bg-white/5 rounded-md">
                    {doc.doc_type.replace("_", " ")}
                  </span>
                  <span className="text-[10px] text-brand-primary font-mono">
                    {agentMap[doc.doc_type] || "Swarm Agent"}
                  </span>
                  <span className="text-[10px] text-brand-success font-mono uppercase font-semibold">
                    .TXT
                  </span>
                  <button
                    onClick={() => handleDownload(doc.doc_type, doc.title)}
                    disabled={downloadingId !== null}
                    className="p-2 text-brand-text-secondary hover:text-brand-highlight transition-colors cursor-pointer disabled:opacity-40"
                  >
                    {downloadingId === doc.doc_type ? (
                      <div className="w-3.5 h-3.5 border-2 border-brand-highlight border-t-transparent animate-spin rounded-full" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
