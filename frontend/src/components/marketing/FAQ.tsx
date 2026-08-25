/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User, HelpCircle, Shield, Zap, RefreshCw, MessageSquare, Terminal } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'kara';
  text: string;
  timestamp: string;
  category?: 'startup' | 'user';
}

interface PrelistedQuestion {
  id: string;
  category: 'startup' | 'user';
  label: string;
  question: string;
  answer: string;
}

const PRELISTED_QUESTIONS: PrelistedQuestion[] = [
  // --- Startup Perspective Questions ---
  {
    id: 'startup-1',
    category: 'startup',
    label: '🚀 Idea to Startup Pipeline',
    question: 'How does KARA turn a 1-sentence prompt into a complete startup?',
    answer: `When you enter a high-level business idea (e.g. "Real estate contract AI compiler"), KARA's autonomous swarm engine activates 9 specialized AI agents in parallel:\n\n1. Nova (CEO Lead) outlines the executive roadmap & strategy.\n2. Atlas (Market Research) crawls competitors & computes TAM/SAM market size.\n3. Pulse (Product Manager) drafts detailed Product Requirements Documents (PRDs).\n4. Forge (Software Architect) designs system schemas & OpenAPI contracts.\n5. CodeX & Flux synthesize production-ready FastAPI backend & Next.js frontend code.\n6. Echo, Ledger & Vertex generate marketing campaigns, financial models, and VC pitch decks.`
  },
  {
    id: 'startup-2',
    category: 'startup',
    label: '📦 Startup Deliverables',
    question: 'What complete full-stack deliverables does KARA generate for a startup?',
    answer: `KARA generates an end-to-end launch portfolio containing:\n\n• Production-Ready Full Stack Code: Modular Next.js 15 client & FastAPI Python backend\n• Database Architecture: Relational PostgreSQL / SQLite Drizzle schemas\n• Market Intelligence: TAM/SAM analysis, competitor positioning, and customer segmentation\n• Financial Projections: CAC, LTV, 12-month runway forecasts, and unit economics\n• Pitch Portfolio: Executive summary and investor pitch deck presentations.`
  },
  {
    id: 'startup-3',
    category: 'startup',
    label: '📊 Market & Financial Models',
    question: 'How does KARA calculate market size (TAM/SAM) and financial runway projections?',
    answer: `Atlas (Market Research Agent) and Ledger (Finance Analyst) synthesize real-time industry data, pricing benchmarks, and developer acquisition channels. They calculate Total Addressable Market (TAM), Serviceable Addressable Market (SAM), break-even user volume, and 12-month cash burn projections with 98.9% mathematical precision.`
  },

  // --- User Perspective Questions ---
  {
    id: 'user-1',
    category: 'user',
    label: '🛡️ IP & Data Security',
    question: 'Is my business idea and intellectual property secure with KARA?',
    answer: `Yes, 100%. Your business ideas, prompts, and synthesized source code remain strictly confidential and sovereign to your workspace. KARA operates inside isolated execution sandboxes with CORS control, rate limiting, and zero third-party data training on your proprietary ideas.`
  },
  {
    id: 'user-2',
    category: 'user',
    label: '💾 Code & PDF Exports',
    question: 'Can I export the full codebase and HD PDF analytics reports?',
    answer: `Absolutely! You can export your entire startup project as a clean .ZIP archive, export source code files, or generate high-definition dark-themed PDF analytics reports anytime from your workspace exports tab.`
  },
  {
    id: 'user-3',
    category: 'user',
    label: '⚡ Credit Billing & Token Costs',
    question: 'How does credit billing work for token consumption across the 9 agents?',
    answer: `KARA uses a transparent 1-credit per 1,000 processed tokens billing system. All core agent communications, code synthesis runs, and schema compilations are tracked in real-time on your dashboard topbar with live telemetry.`
  },
  {
    id: 'user-4',
    category: 'user',
    label: '🤝 9 Swarm Agents Collaboration',
    question: 'How do KARA\'s 9 autonomous AI agents collaborate without manual prompting?',
    answer: `Unlike single-chat AI bots, KARA employs a synchronized Multi-Agent Swarm architecture. Nova delegates sub-tasks across specialized agent nodes (Atlas, Pulse, Forge, CodeX, Flux, Aura, Echo, Ledger, Vertex) who message each other via internal event streams, review schema dependencies, and solve complex product engineering tasks autonomously.`
  }
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'startup' | 'user'>('all');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'kara',
      text: "Greetings! I am KARA, your Autonomous Multi-Agent AI Assistant. Ask me anything about turning ideas into startups, code synthesis, full-stack deliverables, or user privacy. Click any question below to chat with me instantly!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSelectQuestion = (q: PrelistedQuestion) => {
    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q.question,
      timestamp: userTime,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const karaMsg: ChatMessage = {
        id: `kara-${Date.now()}`,
        sender: 'kara',
        text: q.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        category: q.category,
      };
      setMessages((prev) => [...prev, karaMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleSendCustomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim()) return;

    const queryText = inputQuery.trim();
    setInputQuery('');

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: userTime,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Match query against prelisted questions or return intelligent default KARA response
    setTimeout(() => {
      const matched = PRELISTED_QUESTIONS.find(
        (q) => q.question.toLowerCase().includes(queryText.toLowerCase()) || q.answer.toLowerCase().includes(queryText.toLowerCase())
      );

      const responseText = matched
        ? matched.answer
        : `KARA is an enterprise-grade Autonomous Multi-Agent System. I coordinate 9 specialized AI agents (Nova CEO, Atlas Research, Pulse PM, Forge Architect, CodeX Backend, Flux Frontend, Aura UI/UX, Echo Marketing, Ledger Finance) to transform high-level prompts into market intelligence, production code, and launch portfolios.\n\nFor details on "${queryText}", feel free to click any prelisted question below or launch the platform dashboard!`;

      const karaMsg: ChatMessage = {
        id: `kara-${Date.now()}`,
        sender: 'kara',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, karaMsg]);
      setIsTyping(false);
    }, 800);
  };

  const filteredQuestions = activeCategory === 'all'
    ? PRELISTED_QUESTIONS
    : PRELISTED_QUESTIONS.filter((q) => q.category === activeCategory);

  return (
    <section id="faqs" className="py-20 px-6 relative overflow-hidden bg-[#06050D]">
      {/* Ambient Lighting Background */}
      <div className="absolute top-[20%] left-[-10%] w-[45%] aspect-square rounded-full bg-brand-primary/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[40%] aspect-square rounded-full bg-brand-secondary/10 blur-[130px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="inline-flex items-center gap-1.5 border border-brand-primary/20 bg-brand-primary/10 py-1 px-3.5 rounded-full text-[10px] font-mono font-semibold text-brand-highlight uppercase tracking-wider">
            <Bot className="w-3.5 h-3.5 text-brand-primary" />
            <span>Interactive KARA AI Assistant</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
            Ask{' '}
            <span className="bg-gradient-to-r from-white via-brand-highlight to-brand-primary bg-clip-text text-transparent">
              KARA AI
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-brand-text-secondary max-w-xl font-light">
            Interactive AI guidance answering startup creation, full-stack code synthesis, and user privacy questions in real-time.
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex items-center justify-center gap-2">
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'startup', label: '🚀 Startup Perspective' },
            { id: 'user', label: '👥 User & Security Perspective' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`text-xs font-mono px-4 py-2 rounded-xl transition-all border ${
                activeCategory === cat.id
                  ? 'bg-brand-primary/20 text-white border-brand-primary/40 font-semibold shadow-md shadow-brand-primary/10'
                  : 'bg-white/5 text-brand-text-secondary border-white/10 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Main KARA AI Chat Interface Window */}
        <div className="rounded-2xl border border-white/10 bg-[#090713]/90 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col h-[560px]">
          
          {/* Chat Header Bar */}
          <div className="px-6 py-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-secondary to-brand-primary p-[1px] shadow-md shrink-0">
                <div className="relative w-full h-full rounded-xl bg-[#06050D] flex items-center justify-center overflow-hidden">
                  <img src="/KARA-LOGO.png" alt="KARA AI Agent" className="w-full h-full object-cover" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-brand-success border-2 border-[#090713] animate-pulse" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-sm text-white">KARA AI Agent</h3>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-brand-primary/20 text-brand-highlight border border-brand-primary/30">
                    Swarm Assistant
                  </span>
                </div>
                <span className="text-[10px] font-mono text-brand-text-secondary flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-success" />
                  <span>Online & Ready for Questions</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setMessages([messages[0]])}
              className="p-2 text-brand-text-secondary hover:text-white transition-colors rounded-lg hover:bg-white/5"
              title="Reset Chat Stream"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Stream Container */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-white/10">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 text-left ${
                  msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                {msg.sender === 'kara' ? (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-secondary to-brand-primary p-[1px] shrink-0 mt-0.5">
                    <div className="w-full h-full rounded-xl bg-[#06050D] flex items-center justify-center overflow-hidden">
                      <img src="/KARA-LOGO.png" alt="KARA AI" className="w-full h-full object-cover" />
                    </div>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-brand-highlight" />
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-[82%] p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-brand-secondary to-brand-primary text-white font-medium rounded-tr-none shadow-lg shadow-brand-primary/10'
                      : 'bg-white/5 border border-white/10 text-brand-text-secondary rounded-tl-none font-light whitespace-pre-line'
                  }`}
                >
                  <p className="text-white/90">{msg.text}</p>
                  <span className="text-[8px] font-mono text-white/40 block mt-2 text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 text-left">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-secondary to-brand-primary p-[1px] shrink-0">
                  <div className="w-full h-full rounded-xl bg-[#06050D] flex items-center justify-center overflow-hidden">
                    <img src="/KARA-LOGO.png" alt="KARA AI" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Prelisted Questions Suggestion Chips */}
          <div className="px-6 py-3 border-t border-white/5 bg-white/[0.01] flex items-center gap-2 overflow-x-auto scrollbar-none text-left">
            <span className="text-[9px] font-mono text-brand-text-secondary uppercase tracking-widest shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-primary" />
              Suggested Questions:
            </span>
            {filteredQuestions.map((q) => (
              <button
                key={q.id}
                onClick={() => handleSelectQuestion(q)}
                className="text-[10px] font-mono px-3 py-1.5 rounded-full bg-white/5 hover:bg-brand-primary/20 border border-white/10 hover:border-brand-primary/40 text-brand-text-secondary hover:text-white transition-all shrink-0 cursor-pointer"
              >
                {q.label}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendCustomMessage} className="p-4 border-t border-white/10 bg-[#06050D] flex items-center gap-3">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask KARA AI any question about startups, code, or pricing..."
              className="flex-1 bg-white/5 border border-white/10 focus:border-brand-primary/40 focus:outline-none py-2.5 px-4 rounded-xl text-xs text-white placeholder-white/30 transition-all font-light"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="p-2.5 rounded-xl bg-gradient-to-r from-brand-secondary to-brand-primary text-white hover:opacity-90 transition-all disabled:opacity-40 cursor-pointer shrink-0 shadow-lg shadow-brand-primary/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </section>
  );
}
