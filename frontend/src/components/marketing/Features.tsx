/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Zap, 
  Shield, 
  Layers, 
  Code2, 
  Terminal, 
  GitBranch, 
  Database, 
  LineChart 
} from 'lucide-react';

export default function Features() {
  const featureList = [
    {
      icon: Layers,
      title: 'Autonomous Coordinated Workforce',
      desc: 'No more isolated chat interfaces. KARA initializes a full virtual staff of 10 autonomous officers who brainstorm, inspect, and approve each other’s tasks.'
    },
    {
      icon: Database,
      title: 'Production-Grade Schemas',
      desc: 'Forge designs relational database contracts, PostgreSQL/SQL schemas, indices, and Drizzle/Prisma migrations with enterprise integrity.'
    },
    {
      icon: GitBranch,
      title: 'Direct Version Control Ingress',
      desc: 'Automatically commit backend and frontend source files directly to your secure branch in GitHub or export clean ZIP files.'
    },
    {
      icon: LineChart,
      title: 'Runway & CAC Simulation Engines',
      desc: 'Ledger calculates cloud computing server costs, estimates acquisition limits, and simulates multiple pricing yields in real-time.'
    },
    {
      icon: Code2,
      title: 'Bespoke Client Compilation',
      desc: 'Flux and Aura design futuristic layouts and combine functional state-management hooks to bundle responsive single-page applications.'
    },
    {
      icon: Shield,
      title: 'Regulatory & Compliance Guardrails',
      desc: 'Verify authorization checks, secure API token storage, and trace SOC2/GDPR compliance guidelines autonomously.'
    }
  ];

  return (
    <section
      id="features"
      className="py-24 px-6 relative overflow-hidden"
    >
      {/* Visual background decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[45%] aspect-square rounded-full bg-brand-primary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-20">
          <div className="inline-flex items-center gap-1.5 border border-brand-primary/10 bg-brand-primary/5 py-1 px-3.5 rounded-full text-[10px] font-semibold text-brand-highlight uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-brand-primary" />
            <span>Core Capabilities</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
            Designed for the{' '}
            <span className="bg-gradient-to-r from-brand-highlight via-brand-primary to-brand-secondary bg-clip-text text-transparent">
              Decentralized Startup
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-brand-text-secondary max-w-xl font-light">
            Skip months of development overhead. KARA provides a cohesive, end-to-end framework to architect, compile, and launch digital assets instantly.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map((f, idx) => (
            <div
              key={idx}
              className="relative group overflow-hidden rounded-[24px] bg-[#171522]/30 border border-white/5 hover:border-brand-primary/20 p-8 hover:translate-y-[-4px] transition-all duration-500 shadow-xl"
            >
              {/* Subtle top horizontal gradient strip */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-brand-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Glowing core sphere in background */}
              <div className="absolute bottom-[-50px] right-[-50px] w-24 h-24 bg-brand-primary/5 rounded-full blur-xl group-hover:bg-brand-primary/10 transition-all duration-500" />

              {/* Icon */}
              <div className="w-11 h-11 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-brand-highlight mb-6 group-hover:border-brand-primary/30 group-hover:bg-brand-primary/5 transition-all">
                <f.icon className="w-5 h-5" />
              </div>

              {/* Title */}
              <h3 className="font-display font-semibold text-white text-base mb-3">
                {f.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-brand-text-secondary leading-relaxed font-light">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
