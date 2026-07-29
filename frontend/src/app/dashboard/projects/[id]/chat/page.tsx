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
  sender_agent?: string;
  content: string;
  created_at: string;
}

export default function ProjectChatPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;
  const { accessToken } = useAuthStore();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender_type: "agent",
      sender_agent: "Nova",
      content: "Hello! I am Nova, the CEO companion of your KARA workspace. I'm connected to your project repository. Ask me anything about your strategic plans, database architecture, pricing strategies, or code assets.",
      created_at: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    setInputMessage("");

    // Add user message
    const userMsg: Message = {
      id: Math.random().toString(),
      sender_type: "user",
      content: userText,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Mock API call delay to show typing state
    setTimeout(() => {
      let reply = "I've reviewed the documents for this project. ";
      
      if (userText.toLowerCase().includes("database") || userText.toLowerCase().includes("db")) {
        reply += "Our database schema is successfully compiled on PostgreSQL. It contains tables for users, projects, agent runs, documents, and chat records with optimized indexes.";
      } else if (userText.toLowerCase().includes("pricing") || userText.toLowerCase().includes("monetiz")) {
        reply += "The pricing structure is designed around three tiers: Free Builder tier, Autonomous tier at $49/mo, and Sovereign custom contract tiers for high-volume execution.";
      } else if (userText.toLowerCase().includes("competitor") || userText.toLowerCase().includes("market")) {
        reply += "Atlas completed the competitor analysis. Our primary competitive moat is instant deployment of functional microservices, which saves founders weeks of development latency.";
      } else {
        reply += "The agents have successfully finalized the MVP codebase templates. You can download the complete system bundle from the Exports tab.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender_type: "agent",
          sender_agent: "Nova",
          content: reply,
          created_at: new Date().toISOString(),
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4 glass-card rounded-2xl shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/dashboard/projects/${projectId}`)}
            className="p-2 hover:bg-white/5 rounded-xl text-brand-text-secondary hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-semibold text-white flex items-center gap-2">
              <Bot className="w-4 h-4 text-brand-primary" />
              Nova Chat Companion
            </h1>
            <p className="text-[10px] text-brand-text-secondary">Project-aware AI workspace manager</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-brand-primary/10 border border-brand-primary/20 px-3 py-1 rounded-full">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-success opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-success" />
          </span>
          <span className="text-[8px] font-mono text-brand-success uppercase">CONNECTED</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 glass-card rounded-2xl p-6 overflow-y-auto space-y-4 scrollbar-none">
        {messages.map((msg) => {
          const isUser = msg.sender_type === "user";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[80%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 border ${
                  isUser
                    ? "bg-brand-primary/10 border-brand-primary/20 text-brand-highlight"
                    : "bg-white/5 border-white/5 text-white"
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5 text-brand-primary" />}
              </div>

              {/* Bubble */}
              <div>
                {!isUser && (
                  <span className="text-[9px] font-mono text-brand-text-secondary block mb-1">
                    {msg.sender_agent || "System"}
                  </span>
                )}
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? "bg-gradient-to-r from-brand-secondary to-brand-primary text-white rounded-tr-none"
                      : "bg-white/[0.02] border border-white/5 text-brand-text-secondary rounded-tl-none"
                  }`}
                >
                  {msg.content}
                </div>
                <span className="text-[8px] font-mono text-brand-text-secondary block mt-1 text-right">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 mr-auto max-w-[80%]">
            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 text-brand-primary animate-pulse" />
            </div>
            <div>
              <span className="text-[9px] font-mono text-brand-text-secondary block mb-1">Nova</span>
              <div className="p-4 rounded-2xl rounded-tl-none bg-white/[0.02] border border-white/5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="glass-card rounded-2xl p-3 flex items-center gap-3 shrink-0">
        <button
          type="button"
          className="p-2.5 rounded-xl bg-white/5 text-brand-text-secondary hover:text-white transition-colors"
        >
          <Paperclip className="w-4 h-4" />
        </button>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask Nova a question about this startup..."
          className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-xs text-white placeholder-white/20 px-2"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim()}
          className="p-2.5 rounded-xl bg-gradient-to-r from-brand-secondary to-brand-primary text-white shadow-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
