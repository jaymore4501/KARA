/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Terminal, 
  Code, 
  Send, 
  Cpu, 
  Database, 
  Boxes, 
  BarChart3, 
  Rocket, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Activity, 
  ChevronRight, 
  Layers, 
  FileCode,
  Users,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { INITIAL_TASKS, MOCK_CHATS, PITCH_DECK_SLIDES, INITIAL_AGENTS } from '../data';
import { ChatMessage, DashboardTask, PitchDeckSlide } from '../types';

export default function InteractiveDashboard() {
  // Navigation inside the mock dashboard
  const [activeTab, setActiveTab] = useState<'chat' | 'code' | 'architecture' | 'analytics' | 'pitch'>('chat');
  
  // Custom Prompt simulation state
  const [promptInput, setPromptInput] = useState('');
  const [currentStartupName, setCurrentStartupName] = useState('VeloCloud');
  const [isSimulating, setIsSimulating] = useState(false);
  
  // Tasks state
  const [tasks, setTasks] = useState<DashboardTask[]>(INITIAL_TASKS);
  
  // Chats state
  const [chats, setChats] = useState<ChatMessage[]>(MOCK_CHATS);
  
  // Code Editor active file state
  const [selectedFile, setSelectedFile] = useState<'schema.ts' | 'ingest-route.ts' | 'theme-config.css'>('schema.ts');

  // Pitch Deck State
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

  // Chat container ref for auto scroll
  const chatScrollRef = useRef<HTMLDivElement | null>(null);

  // Preset custom startup ideas
  const startupPresets = [
    { name: 'AeroCrate', desc: 'Drone delivery metrics logs', tag: 'Logistics' },
    { name: 'FitSynth', desc: 'Biometric posture AI trainer', tag: 'Biometrics' },
    { name: 'OptiFarm', desc: 'Satellite smart irrigation core', tag: 'ClimateTech' }
  ];

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chats]);

  // Simulate AI Multi-Agent pipeline step-by-step
  const handleInitiateSimulation = (name: string, description: string) => {
    if (isSimulating) return;
    
    setIsSimulating(true);
    setCurrentStartupName(name);
    
    // Reset tasks and chats
    const initialSystemMessage: ChatMessage = {
      id: 'sim-0',
      senderId: 'nova',
      senderName: 'Nova',
      senderRole: 'CEO Agent',
      message: `System alert: Initializing workforce deployment pipeline for project '${name}' (${description}). Restructuring agent prioritizations.`,
      timestamp: '12:07:01',
      type: 'system'
    };
    
    setChats([initialSystemMessage]);
    
    // Reset all tasks to todo
    setTasks(prev => prev.map(t => ({
      ...t,
      status: 'todo',
      progress: 0,
      timestamp: 'Queued'
    })));

    // Sequential simulation timeline
    const simulationSequence = [
      {
        delay: 2000,
        senderId: 'atlas',
        senderName: 'Atlas',
        senderRole: 'Market Research',
        message: `Atlas online. Exploring TAM and competitive profiles for '${name}'. Identified 3 adjacent incumbents. Est SAM: $1.8B. Recommended beachhead focus: Enterprise API rate logs with zero-knowledge encryption guarantees. Updating backlog.`,
        type: 'text' as const,
        taskId: 't-1'
      },
      {
        delay: 4500,
        senderId: 'pulse',
        senderName: 'Pulse',
        senderRole: 'Product Manager',
        message: `Pulse reporting. Backlog categorized. Writing functional PRD V1.0 for '${name}'. 10 key specifications locked. Aura, please draft core token schemas and high-contrast visuals matching this focus.`,
        type: 'text' as const,
        taskId: 't-2'
      },
      {
        delay: 7000,
        senderId: 'aura',
        senderName: 'Aura',
        senderRole: 'UI/UX Designer',
        message: `Aura synced. Building customized CSS design tokens under the project label 'Cosmic Glow'. Incorporating responsive glassmorphism constraints. Injecting variables:`,
        type: 'code' as const,
        codeSnippet: {
          language: 'css',
          fileName: 'theme-config.css',
          code: `:root {
  --theme-startup-accent: #9D6CFF;
  --theme-glass-bg: rgba(17, 16, 26, 0.75);
  --theme-shadow-glow: 0 0 24px rgba(157, 108, 255, 0.15);
  --theme-card-radius: 24px;
}`
        },
        taskId: 't-3'
      },
      {
        delay: 10000,
        senderId: 'forge',
        senderName: 'Forge',
        senderRole: 'Software Architect',
        message: `Forge online. Architecture mapping complete. Designing database model. We will implement high-frequency telemetry indexes with a clustered UUID key strategy to assure optimal fetch indexes.`,
        type: 'code' as const,
        codeSnippet: {
          language: 'typescript',
          fileName: 'schema.ts',
          code: `import { pgTable, text, timestamp, doublePrecision } from 'drizzle-orm/pg-core';

export const telemetryEvents = pgTable('telemetry_events', {
  uuid: text('uuid').primaryKey(),
  projectName: text('project_name').notNull(),
  metricValue: doublePrecision('metric_value').default(0.0),
  loggedAt: timestamp('logged_at').defaultNow()
});`
        },
        taskId: 't-4'
      },
      {
        delay: 13000,
        senderId: 'codex',
        senderName: 'CodeX',
        senderRole: 'Backend Engineer',
        message: `CodeX synced. Transcribed Forge's schema definitions into fast Express route structures. Testing ingress validations on POST routes. Deploy pipeline validated. Ready for launch compilation.`,
        type: 'code' as const,
        codeSnippet: {
          language: 'typescript',
          fileName: 'ingest-route.ts',
          code: `import { Router } from 'express';
const router = Router();

router.post('/api/ingress', (req, res) => {
  const { projectName, metricValue } = req.body;
  if(!projectName) return res.status(400).json({ error: 'Missing' });
  
  // Real-time telemetry streaming queue trigger
  console.log('Telemetry logged for', projectName, 'val:', metricValue);
  res.status(202).json({ success: true, timestamp: Date.now() });
});`
        },
        taskId: 't-5'
      },
      {
        delay: 15500,
        senderId: 'ledger',
        senderName: 'Ledger',
        senderRole: 'Finance Analyst',
        message: `Ledger reporting. Completed COGS calculation. Projecting gross margins of 86.8% utilizing edge stream bundling. Break-even achieved at 84 subscriptions. Runways look fully green.`,
        type: 'metric' as const,
        taskId: 't-7'
      }
    ];

    simulationSequence.forEach((step) => {
      setTimeout(() => {
        // Add chat message
        const newMsg: ChatMessage = {
          id: `sim-${step.taskId}`,
          senderId: step.senderId,
          senderName: step.senderName,
          senderRole: step.senderRole,
          message: step.message,
          timestamp: new Date().toTimeString().split(' ')[0],
          type: step.type,
          codeSnippet: step.codeSnippet
        };
        
        setChats(prev => [...prev, newMsg]);

        // Mark task as done
        setTasks(prev => prev.map(t => {
          if (t.id === step.taskId) {
            return { ...t, status: 'done', progress: 100, timestamp: 'Compiled' };
          }
          // Mark matching prior tasks as done, and next tasks as in_progress
          if (t.id === 't-3' && step.taskId === 't-2') {
            return { ...t, status: 'in_progress', progress: 30, timestamp: 'Aura Drafting' };
          }
          if (t.id === 't-4' && step.taskId === 't-3') {
            return { ...t, status: 'in_progress', progress: 45, timestamp: 'Forge Designing' };
          }
          if (t.id === 't-5' && step.taskId === 't-4') {
            return { ...t, status: 'in_progress', progress: 60, timestamp: 'CodeX Building' };
          }
          if (t.id === 't-6' && step.taskId === 't-5') {
            return { ...t, status: 'in_progress', progress: 75, timestamp: 'Flux Compiling' };
          }
          return t;
        }));

        if (step.taskId === 't-7') {
          // Final complete
          setTasks(prev => prev.map(t => t.id === 't-6' ? { ...t, status: 'done', progress: 100, timestamp: 'Linked' } : t));
          setIsSimulating(false);
          setActiveTab('analytics'); // Swivel tab to showcase charts after completion!
        }
      }, step.delay);
    });
  };

  const handleCustomPromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() || isSimulating) return;
    
    const startupName = promptInput.split(' ')[0] || 'MyStartup';
    const cleanName = startupName.charAt(0).toUpperCase() + startupName.slice(1).replace(/[^a-zA-Z]/g, '');
    
    handleInitiateSimulation(cleanName, promptInput);
    setPromptInput('');
  };

  // Content rendering based on tabs
  const getFileContent = () => {
    const fileObj = chats.find(c => c.codeSnippet?.fileName === selectedFile);
    return fileObj?.codeSnippet?.code || `// File code loading... Select an active agent file to inspect compiled source code output.`;
  };

  return (
    <section
      id="dashboard"
      className="py-24 px-6 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-brand-primary/10 to-transparent" />
      <div className="absolute top-1/2 left-0 right-0 h-[120px] bg-brand-primary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 border border-brand-primary/10 bg-brand-primary/5 py-1 px-3.5 rounded-full text-[10px] font-semibold text-brand-highlight uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-brand-primary animate-pulse" />
              <span>Real-Time Sandbox Environment</span>
            </div>
            <h2 className="font-display font-bold text-3xl text-white tracking-tight">
              Live Coordinated{' '}
              <span className="bg-gradient-to-r from-brand-highlight via-brand-primary to-brand-secondary bg-clip-text text-transparent">
                Dashboard
              </span>
            </h2>
            <p className="text-xs text-brand-text-secondary font-light mt-1 max-w-lg">
              Observe how the agents communicate, write actual modular code, draft database schemas, and map financial models.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="flex items-center gap-4 border border-white/5 bg-brand-card/20 rounded-2xl p-4 w-full md:w-auto backdrop-blur-sm">
            <div>
              <div className="text-[10px] font-mono text-brand-text-secondary uppercase">Active Project</div>
              <div className="text-sm font-display font-bold text-brand-highlight">{currentStartupName}</div>
            </div>
            <div className="w-[1px] h-8 bg-white/5" />
            <div>
              <div className="text-[10px] font-mono text-brand-text-secondary uppercase">Agents Engaged</div>
              <div className="text-sm font-display font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-success animate-ping" />
                10/10 Active
              </div>
            </div>
          </div>
        </div>

        {/* Outer Dashboard Shell */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch border border-white/5 bg-[#11101A]/60 backdrop-blur-md rounded-[32px] p-6 lg:p-8 shadow-2xl relative">
          
          {/* Neon Spotlight */}
          <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-brand-primary/10 rounded-full blur-[80px] pointer-events-none" />

          {/* Sidebar Navigation */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 border-b lg:border-b-0 lg:border-r border-white/5 pb-4 lg:pb-0 lg:pr-6 overflow-x-auto lg:overflow-x-visible scrollbar-none whitespace-nowrap">
            
            <p className="text-[9px] font-mono text-brand-text-secondary uppercase tracking-widest hidden lg:block mb-4">
              WORKSPACE OPERATIONS
            </p>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold w-full transition-all text-left ${
                activeTab === 'chat'
                  ? 'bg-brand-primary/10 text-brand-highlight border border-brand-primary/20'
                  : 'text-brand-text-secondary hover:text-white border border-transparent hover:bg-white/5'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span>Pipeline Logs & Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold w-full transition-all text-left ${
                activeTab === 'analytics'
                  ? 'bg-brand-primary/10 text-brand-highlight border border-brand-primary/20'
                  : 'text-brand-text-secondary hover:text-white border border-transparent hover:bg-white/5'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Business Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold w-full transition-all text-left ${
                activeTab === 'architecture'
                  ? 'bg-brand-primary/10 text-brand-highlight border border-brand-primary/20'
                  : 'text-brand-text-secondary hover:text-white border border-transparent hover:bg-white/5'
              }`}
            >
              <Boxes className="w-4 h-4" />
              <span>System Blueprint</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold w-full transition-all text-left ${
                activeTab === 'code'
                  ? 'bg-brand-primary/10 text-brand-highlight border border-brand-primary/20'
                  : 'text-brand-text-secondary hover:text-white border border-transparent hover:bg-white/5'
              }`}
            >
              <Code className="w-4 h-4" />
              <span>Compiled Code Editor</span>
            </button>

            <button
              onClick={() => setActiveTab('pitch')}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold w-full transition-all text-left ${
                activeTab === 'pitch'
                  ? 'bg-brand-primary/10 text-brand-highlight border border-brand-primary/20'
                  : 'text-brand-text-secondary hover:text-white border border-transparent hover:bg-white/5'
              }`}
            >
              <Rocket className="w-4 h-4" />
              <span>Pitch Deck Summary</span>
            </button>

            {/* Quick Presets Section inside sidebar */}
            <div className="hidden lg:flex flex-col gap-3 mt-8 pt-6 border-t border-white/5">
              <p className="text-[9px] font-mono text-brand-text-secondary uppercase tracking-widest">
                LAUNCH PRESET STARTUPS
              </p>
              <div className="flex flex-col gap-2">
                {startupPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    disabled={isSimulating}
                    onClick={() => handleInitiateSimulation(preset.name, preset.desc)}
                    className="flex flex-col items-start gap-1 p-2.5 bg-white/5 hover:bg-brand-primary/5 border border-white/5 hover:border-brand-primary/20 rounded-xl text-left transition-all disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px] font-semibold text-white">{preset.name}</span>
                      <span className="text-[8px] font-mono text-brand-highlight px-1 bg-brand-primary/10 rounded">{preset.tag}</span>
                    </div>
                    <span className="text-[9px] text-brand-text-secondary font-light line-clamp-1">{preset.desc}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Core Content Area */}
          <div className="lg:col-span-6 flex flex-col min-h-[460px] lg:border-r border-white/5 lg:pr-6 lg:pl-2">
            
            {/* Panel Content: CHAT */}
            {activeTab === 'chat' && (
              <div className="flex flex-col h-full">
                
                {/* Chat window viewport */}
                <div 
                  ref={chatScrollRef}
                  className="flex-grow overflow-y-auto max-h-[340px] pr-2 flex flex-col gap-4 scrollbar-none"
                >
                  {chats.map((msg) => {
                    const isSystem = msg.type === 'system';
                    const isCode = msg.type === 'code';
                    const isMetric = msg.type === 'metric';

                    if (isSystem) {
                      return (
                        <div key={msg.id} className="text-center py-2 px-4 border border-brand-primary/10 bg-brand-primary/5 rounded-2xl text-[10px] text-brand-highlight font-mono leading-relaxed">
                          {msg.message}
                        </div>
                      );
                    }

                    return (
                      <div key={msg.id} className="flex gap-3 items-start animate-fadeIn">
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-xl bg-brand-card flex items-center justify-center font-bold text-[10px] shrink-0 border border-white/10 text-white select-none">
                          {msg.senderName.substring(0, 2)}
                        </div>

                        {/* Content Box */}
                        <div className="flex-grow flex flex-col gap-1.5 bg-brand-card/40 border border-white/5 p-3.5 rounded-2xl">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                              {msg.senderName}
                              <span className="text-[9px] font-mono font-normal text-brand-text-secondary">
                                — {msg.senderRole}
                              </span>
                            </span>
                            <span className="text-[8px] font-mono text-white/35">{msg.timestamp}</span>
                          </div>

                          <p className="text-[11px] text-brand-text-secondary font-light leading-relaxed">
                            {msg.message}
                          </p>

                          {/* Render preview file banner if code is included */}
                          {isCode && msg.codeSnippet && (
                            <button
                              onClick={() => {
                                setSelectedFile(msg.codeSnippet!.fileName as any);
                                setActiveTab('code');
                              }}
                              className="mt-2.5 flex items-center justify-between gap-3 bg-brand-bg/60 hover:bg-brand-bg border border-white/5 hover:border-brand-primary/30 p-2.5 rounded-xl text-left transition-all group"
                            >
                              <div className="flex items-center gap-2 text-[10px] font-mono text-brand-highlight">
                                <FileCode className="w-3.5 h-3.5" />
                                <span>{msg.codeSnippet.fileName}</span>
                              </div>
                              <span className="text-[8px] font-mono text-white/35 group-hover:text-brand-highlight transition-all">
                                Open in Editor ↗
                              </span>
                            </button>
                          )}

                          {isMetric && (
                            <div className="mt-2 p-2.5 bg-brand-success/5 border border-brand-success/15 rounded-xl flex items-center justify-between text-[10px] font-mono text-brand-success">
                              <span>SIMULATION ENGINE OK</span>
                              <span>MARGIN: 86.8%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Prompt Injection Form */}
                <form 
                  onSubmit={handleCustomPromptSubmit}
                  className="mt-4 pt-4 border-t border-white/5 relative z-10 flex items-center gap-2"
                >
                  <input
                    type="text"
                    disabled={isSimulating}
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="Describe any business idea (e.g. Real estate contract AI compiler)"
                    className="flex-grow bg-brand-card/60 hover:bg-brand-card border border-white/5 focus:border-brand-primary/40 focus:outline-none py-3 px-4 rounded-xl text-xs text-white font-light placeholder-white/30 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isSimulating || !promptInput.trim()}
                    className="p-3 bg-brand-primary hover:bg-brand-secondary text-white rounded-xl transition-all shadow-lg hover:shadow-brand-primary/20 disabled:opacity-40 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

              </div>
            )}

            {/* Panel Content: ANALYTICS */}
            {activeTab === 'analytics' && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-brand-text-secondary uppercase">Projected ARR (Subscribers Yield)</span>
                  <span className="text-[10px] bg-brand-success/10 text-brand-success py-0.5 px-2 rounded-full font-mono font-semibold">
                    +184% Growth
                  </span>
                </div>

                {/* High fidelity pure-SVG area chart */}
                <div className="relative h-[220px] bg-[#09070F]/60 border border-white/5 rounded-2xl p-4 flex flex-col justify-end">
                  {/* Grid Lines */}
                  <div className="absolute inset-x-4 top-4 bottom-12 flex flex-col justify-between pointer-events-none opacity-10">
                    <div className="w-full h-[1px] bg-white" />
                    <div className="w-full h-[1px] bg-white" />
                    <div className="w-full h-[1px] bg-white" />
                    <div className="w-full h-[1px] bg-white" />
                  </div>

                  {/* Projected Graph */}
                  <svg className="w-full h-[120px] overflow-visible" viewBox="0 0 400 100" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="purpleGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#9D6CFF" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#9D6CFF" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Area under line */}
                    <path
                      d="M 0 90 Q 60 75, 120 62 T 240 38 T 320 22 T 400 5 L 400 100 L 0 100 Z"
                      fill="url(#purpleGlow)"
                    />
                    {/* Glowing Stroke Line */}
                    <path
                      d="M 0 90 Q 60 75, 120 62 T 240 38 T 320 22 T 400 5"
                      fill="none"
                      stroke="#9D6CFF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Interactive glowing nodes on the line */}
                    <circle cx="240" cy="38" r="4.5" fill="#FFFFFF" stroke="#9D6CFF" strokeWidth="2" />
                    <circle cx="400" cy="5" r="4.5" fill="#C7A5FF" stroke="#9D6CFF" strokeWidth="2" />
                  </svg>

                  {/* X Axis labels */}
                  <div className="flex justify-between text-[9px] font-mono text-brand-text-secondary mt-4 pt-2 border-t border-white/5">
                    <span>Month 01</span>
                    <span>Month 03 (Break-even)</span>
                    <span>Month 06</span>
                    <span>Month 12 ($1M ARR)</span>
                  </div>
                </div>

                {/* KPI Cards inside analytics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-white/5 bg-brand-bg/50 p-4 rounded-xl">
                    <span className="text-[9px] font-mono text-brand-text-secondary uppercase">Gross Margins</span>
                    <div className="text-lg font-display font-bold text-brand-success mt-1">86.8%</div>
                  </div>
                  <div className="border border-white/5 bg-brand-bg/50 p-4 rounded-xl">
                    <span className="text-[9px] font-mono text-brand-text-secondary uppercase">Customer LTV</span>
                    <div className="text-lg font-display font-bold text-brand-highlight mt-1">$1,480</div>
                  </div>
                </div>
              </div>
            )}

            {/* Panel Content: ARCHITECTURE */}
            {activeTab === 'architecture' && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <span className="text-xs font-mono text-brand-text-secondary uppercase">Pipeline Routing Map</span>
                
                {/* Visual node structure representing system diagram */}
                <div className="flex flex-col gap-5 bg-[#09070F]/50 border border-white/5 rounded-2xl p-6 relative">
                  
                  {/* Node 1: Edge Client Ingress */}
                  <div className="flex items-center justify-between border border-white/5 bg-brand-card/60 p-3.5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary text-xs font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white">Edge API Ingress</h4>
                        <p className="text-[9px] text-brand-text-secondary">Express server router on Docker Container</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-brand-success">INGESTING</span>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex justify-center -my-2 opacity-30">
                    <div className="w-[1.5px] h-6 bg-brand-primary" />
                  </div>

                  {/* Node 2: PostgreSQL Storage layer */}
                  <div className="flex items-center justify-between border border-white/5 bg-brand-card/60 p-3.5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-secondary/10 flex items-center justify-center text-brand-secondary text-xs font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white">Relational SQL DB</h4>
                        <p className="text-[9px] text-brand-text-secondary">Drizzle schema mapping tables securely</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-brand-primary">DURABLE</span>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex justify-center -my-2 opacity-30">
                    <div className="w-[1.5px] h-6 bg-brand-primary" />
                  </div>

                  {/* Node 3: Render Layer */}
                  <div className="flex items-center justify-between border border-white/5 bg-brand-card/60 p-3.5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-highlight/10 flex items-center justify-center text-brand-highlight text-xs font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white">React Client SPA</h4>
                        <p className="text-[9px] text-brand-text-secondary">Responsive UI styled with Tailwind CSS</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-brand-highlight">RENDERED</span>
                  </div>

                </div>
              </div>
            )}

            {/* Panel Content: CODE EDITOR */}
            {activeTab === 'code' && (
              <div className="flex flex-col h-full animate-fadeIn">
                {/* File selectors */}
                <div className="flex gap-2 mb-3">
                  {['schema.ts', 'ingest-route.ts', 'theme-config.css'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setSelectedFile(f as any)}
                      className={`text-[10px] font-mono py-1.5 px-3 rounded-lg border transition-all ${
                        selectedFile === f
                          ? 'bg-brand-primary/10 border-brand-primary/30 text-brand-highlight'
                          : 'bg-white/5 border-transparent text-brand-text-secondary hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {/* Editor display */}
                <div className="flex-grow bg-[#09070F] border border-white/5 rounded-2xl p-4 font-mono text-[10px] leading-relaxed text-brand-text-secondary overflow-y-auto max-h-[300px] shadow-inner select-text">
                  <pre className="text-white/80">
                    <code>{getFileContent()}</code>
                  </pre>
                </div>
              </div>
            )}

            {/* Panel Content: PITCH DECK */}
            {activeTab === 'pitch' && (
              <div className="flex flex-col h-full justify-between animate-fadeIn">
                
                {/* Pitch Slide preview container */}
                <div className="bg-brand-card/40 border border-white/5 rounded-2xl p-6 min-h-[260px] flex flex-col justify-between relative overflow-hidden">
                  {/* Slide background glow */}
                  <div className="absolute top-0 right-0 w-[140px] h-[140px] bg-brand-primary/5 rounded-full blur-[40px] pointer-events-none" />

                  <div>
                    <span className="text-[9px] font-mono text-brand-primary uppercase tracking-widest">
                      Slide 0{currentSlideIdx + 1} / 04
                    </span>
                    <h3 className="font-display font-bold text-xl text-white mt-1">
                      {PITCH_DECK_SLIDES[currentSlideIdx].title}
                    </h3>
                    <p className="text-xs text-brand-highlight font-mono mt-0.5">
                      {PITCH_DECK_SLIDES[currentSlideIdx].subtitle}
                    </p>

                    <ul className="mt-4 flex flex-col gap-2">
                      {PITCH_DECK_SLIDES[currentSlideIdx].bullets.map((bullet, idx) => (
                        <li key={idx} className="text-[11px] text-brand-text-secondary font-light leading-tight flex items-start gap-2">
                          <span className="text-brand-primary text-[9px] mt-0.5">■</span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {PITCH_DECK_SLIDES[currentSlideIdx].stat && (
                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-brand-text-secondary uppercase">KEY METRIC TRACTION</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-display font-bold text-lg text-brand-success">{PITCH_DECK_SLIDES[currentSlideIdx].stat?.value}</span>
                        <span className="text-[9px] text-brand-text-secondary font-light">({PITCH_DECK_SLIDES[currentSlideIdx].stat?.label})</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Slide navigators */}
                <div className="flex justify-between items-center mt-4">
                  <span className="text-[10px] text-brand-text-secondary">Pitch Deck Investor Report</span>
                  <div className="flex gap-1.5">
                    {PITCH_DECK_SLIDES.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlideIdx(idx)}
                        className={`w-6 h-6 rounded-md text-[10px] font-mono font-bold border transition-all ${
                          currentSlideIdx === idx
                            ? 'bg-brand-primary/15 border-brand-primary/40 text-brand-highlight'
                            : 'bg-white/5 border-transparent text-brand-text-secondary hover:text-white'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Right Column: Agile Ticket Pipeline / Backlog Monitor */}
          <div className="lg:col-span-3 flex flex-col justify-between mt-6 lg:mt-0 lg:pl-6">
            <div>
              <p className="text-[9px] font-mono text-brand-text-secondary uppercase tracking-widest mb-4 flex justify-between">
                <span>AGILE TASK BACKLOG</span>
                <span className="text-[8px] px-1.5 py-0.5 bg-white/5 rounded text-white/40">7 TICKETS</span>
              </p>

              <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto scrollbar-none pr-1">
                {tasks.map((task) => {
                  const isDone = task.status === 'done';
                  const isInProgress = task.status === 'in_progress';

                  return (
                    <div 
                      key={task.id} 
                      className={`border p-3.5 rounded-2xl flex flex-col gap-1.5 transition-all ${
                        isDone 
                          ? 'bg-brand-bg/20 border-white/5 opacity-60' 
                          : isInProgress
                            ? 'bg-brand-primary/5 border-brand-primary/20 shadow-md shadow-brand-primary/5'
                            : 'bg-brand-card/40 border-white/5'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className={`text-[10px] font-semibold ${isDone ? 'text-white/40 line-through' : 'text-white'}`}>
                          {task.title}
                        </span>
                        <span className={`text-[8px] font-mono px-1.5 rounded uppercase font-bold shrink-0 ${
                          isDone 
                            ? 'bg-brand-success/15 text-brand-success' 
                            : isInProgress
                              ? 'bg-brand-primary/15 text-brand-highlight animate-pulse'
                              : 'bg-white/5 text-white/30'
                        }`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[9px] font-mono text-white/40">
                        <span>Assignee: <span className="text-brand-highlight uppercase">{task.assignedTo}</span></span>
                        <span>{task.timestamp}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Simulated Live Action Indicators */}
            <div className="border-t border-white/5 pt-4 mt-6">
              <div className="flex items-center gap-2">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-success"></span>
                </div>
                <span className="text-[9px] font-mono text-brand-success tracking-widest uppercase">
                  COMPILER: RE-DEPLOY READY
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
