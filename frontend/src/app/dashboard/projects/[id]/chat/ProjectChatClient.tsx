"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Sparkles,
  Send,
  ArrowLeft,
  Bot,
  User,
  Paperclip,
  FileText,
  Clock,
  Terminal,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

interface Message {
  id: string;
  sender_type: "user" | "agent" | "system";
  agent_name?: string;
  text: string;
  timestamp: string;
}

export default function ProjectChatClient() {
  const params = useParams();
  const router = useRouter();
  const projectId = (params?.id as string) || "demo-velocloud";
  const { accessToken } = useAuthStore();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m1",
      sender_type: "system",
      text: "KARA Swarm Multi-Agent Session Initialized. Connected agents: Nova (CEO), Atlas (Market Research), Pulse (PM), Forge (Architect), CodeX (Backend), Flux (Frontend).",
      timestamp: "Just now",
    },
    {
      id: "m2",
      sender_type: "agent",
      agent_name: "Nova (CEO)",
      text: "Welcome to your startup execution workspace! I have aligned our agent swarm around your core idea. What aspect would you like to review or refine first?",
      timestamp: "Just now",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isReplying]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender_type: "user",
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentQuery = inputText.trim();
    setInputText("");
    setIsReplying(true);

    // Simulate Agent Swarm Response
    setTimeout(() => {
      let replyText = "I have analyzed your request against our current architecture and updated the PRD roadmap.";
      let agentName = "Pulse (Product Manager)";

      if (currentQuery.toLowerCase().includes("code") || currentQuery.toLowerCase().includes("backend") || currentQuery.toLowerCase().includes("api")) {
        agentName = "CodeX (Backend Engineer)";
        replyText = "I've drafted the FastAPI endpoint route definition and verified model validation schemas.";
      } else if (currentQuery.toLowerCase().includes("market") || currentQuery.toLowerCase().includes("competitor") || currentQuery.toLowerCase().includes("tam")) {
        agentName = "Atlas (Market Research)";
        replyText = "TAM metrics updated. SAM is estimated at $380M across North American enterprise accounts.";
      } else if (currentQuery.toLowerCase().includes("cost") || currentQuery.toLowerCase().includes("price") || currentQuery.toLowerCase().includes("money")) {
        agentName = "Ledger (Finance Lead)";
        replyText = "Runway projections updated. At 80% gross margins, break-even occurs at Month 14.";
      }

      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender_type: "agent",
        agent_name: agentName,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, agentMsg]);
      setIsReplying(false);
    }, 1800);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 glass-card rounded-2xl bg-[#0B0813] border border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/dashboard/projects/${projectId}`)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-display font-bold text-base text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-brand-primary" />
              Swarm Agent Chatroom
            </h1>
            <p className="text-[10px] text-brand-text-secondary">Project Workspace: {projectId}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>9 Agents Connected</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 glass-card rounded-2xl p-6 bg-[#0B0813] border border-white/10 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 text-left ${
              msg.sender_type === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                msg.sender_type === "user"
                  ? "bg-brand-primary/20 border-brand-primary/40 text-brand-highlight"
                  : msg.sender_type === "system"
                  ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                  : "bg-brand-secondary/20 border-brand-secondary/40 text-white"
              }`}
            >
              {msg.sender_type === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-4 text-xs font-light leading-relaxed border ${
                msg.sender_type === "user"
                  ? "bg-gradient-to-r from-brand-secondary/30 to-brand-primary/30 border-brand-primary/30 text-white"
                  : msg.sender_type === "system"
                  ? "bg-amber-500/5 border-amber-500/10 text-amber-200/90 font-mono text-[10px]"
                  : "bg-white/[0.03] border-white/10 text-white/90"
              }`}
            >
              {msg.agent_name && (
                <div className="text-[10px] font-mono font-bold text-brand-highlight mb-1">
                  {msg.agent_name}
                </div>
              )}
              <p className="whitespace-pre-wrap">{msg.text}</p>
              <span className="text-[8px] font-mono text-white/30 block mt-2 text-right">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isReplying && (
          <div className="flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-xs text-brand-text-secondary flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping" />
              <span>Swarm agents reviewing schema dependencies...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-3 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Nova, Pulse, Forge or CodeX any question about your startup..."
          className="flex-1 bg-[#090712] border border-white/15 focus:border-brand-primary focus:outline-none rounded-xl px-4 py-3 text-xs text-white placeholder-white/30"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-5 py-3 rounded-xl bg-brand-primary hover:bg-brand-highlight text-white text-xs font-semibold shadow-lg shadow-brand-primary/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
