/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Crown,
  TrendingUp,
  ClipboardList,
  Boxes,
  Database,
  Cpu,
  Palette,
  Megaphone,
  DollarSign,
  Rocket,
  Activity,
  Check,
  X,
  Sparkles
} from 'lucide-react';
import { Agent } from '../types';
import { INITIAL_AGENTS } from '../data';

// Map icon names to Lucide icons
const iconMap: Record<string, React.ComponentType<any>> = {
  Crown,
  TrendingUp,
  ClipboardList,
  Boxes,
  Database,
  Cpu,
  Palette,
  Megaphone,
  DollarSign,
  Rocket
};

export default function AgentGrid() {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(INITIAL_AGENTS[0]);

  return (
    <section
      id="agents"
      className="py-24 px-6 relative overflow-hidden"
    >
      {/* Background Lighting */}
      <div className="absolute top-[20%] right-[-10%] w-[40%] aspect-square rounded-full bg-brand-secondary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[35%] aspect-square rounded-full bg-brand-primary/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <div className="inline-flex items-center gap-1.5 border border-brand-primary/10 bg-brand-primary/5 py-1 px-3.5 rounded-full text-[10px] font-semibold text-brand-highlight uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-brand-primary animate-pulse" />
            <span>Operational Personnel</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
            An Elite, Coordinated{' '}
            <span className="bg-gradient-to-r from-brand-highlight via-brand-primary to-brand-secondary bg-clip-text text-transparent">
              AI Workforce
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-brand-text-secondary max-w-xl font-light">
            Instead of a generic chat interface, KARA deploys dedicated AI agents with customized personas, metrics, and cognitive pipelines operating in synchronous harmony.
          </p>
        </div>

        {/* Master Details Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Grid: 10 Agent Cards */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {agents.map((agent) => {
              const IconComponent = iconMap[agent.iconName] || Crown;
              const isSelected = selectedAgent?.id === agent.id;

              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`relative overflow-hidden rounded-3xl p-6 transition-all duration-500 cursor-pointer border ${isSelected
                      ? 'bg-brand-card/90 border-brand-primary/40 shadow-xl shadow-brand-primary/5 translate-y-[-2px]'
                      : 'bg-brand-card/40 border-white/5 hover:border-white/10 hover:bg-brand-card/60 hover:translate-y-[-2px]'
                    }`}
                >
                  {/* Subtle Glowing Radial */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${agent.avatarColor} opacity-[0.03] rounded-full blur-2xl`} />

                  {/* Top: Icon & Status */}
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${agent.avatarColor} p-[1px]`}>
                      <div className="w-full h-full rounded-2xl bg-[#11101A] flex items-center justify-center">
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-success opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-success"></span>
                      </span>
                      <span className="text-[9px] font-mono tracking-wider text-brand-success uppercase">
                        ACTIVE
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <h3 className="font-display font-bold text-sm text-white flex items-center gap-2 mb-1">
                    {agent.name}
                    <span className="text-xs font-normal text-brand-text-secondary">
                      — {agent.role.replace(' Agent', '')}
                    </span>
                  </h3>
                  <p className="text-[11px] text-brand-text-secondary font-light leading-relaxed line-clamp-2">
                    {agent.description}
                  </p>

                  {/* Core Metric bar preview */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-4">
                    <span className="text-[9px] font-mono text-brand-text-secondary uppercase">
                      Efficiency Index
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-brand-highlight">
                      {agent.metrics.efficiency}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Agent Specs and Capability Inspector */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            {selectedAgent ? (
              <div className="rounded-3xl p-6 bg-[#171522]/90 border border-brand-primary/20 shadow-2xl relative overflow-hidden animate-fadeIn">

                {/* Background Ambient Aura */}
                <div className={`absolute top-[-10%] right-[-10%] w-[200px] h-[200px] bg-gradient-to-br ${selectedAgent.avatarColor} opacity-[0.06] rounded-full blur-3xl`} />

                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${selectedAgent.avatarColor} p-[1px]`}>
                      <div className="w-full h-full rounded-2xl bg-[#11101A] flex items-center justify-center">
                        {React.createElement(iconMap[selectedAgent.iconName] || Crown, { className: "w-5 h-5 text-white" })}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-white">
                        {selectedAgent.name}
                      </h3>
                      <p className="text-xs text-brand-highlight font-mono uppercase tracking-wider">
                        {selectedAgent.role}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Long Description */}
                <p className="text-xs text-brand-text-secondary font-light leading-relaxed mb-6">
                  {selectedAgent.description}
                </p>

                {/* Key Capabilities */}
                <div className="mb-6">
                  <h4 className="text-[10px] font-mono text-white tracking-widest uppercase mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-brand-highlight" />
                    Bespoke Skillsets
                  </h4>
                  <div className="flex flex-col gap-2">
                    {selectedAgent.capabilities.map((capability, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2.5 bg-white/5 border border-white/5 px-3 py-2 rounded-xl text-[10px] text-white"
                      >
                        <Check className="w-3.5 h-3.5 text-brand-success shrink-0" />
                        <span>{capability}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Operational KPIs */}
                <div className="pt-5 border-t border-white/5">
                  <h4 className="text-[10px] font-mono text-white tracking-widest uppercase mb-4">
                    Active Run Diagnostics
                  </h4>

                  <div className="flex flex-col gap-4">
                    {/* Efficiency KPI */}
                    <div>
                      <div className="flex justify-between text-[10px] mb-1.5">
                        <span className="text-brand-text-secondary">COGNITIVE EFFICIENCY</span>
                        <span className="text-brand-success font-mono font-semibold">{selectedAgent.metrics.efficiency}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-success rounded-full transition-all duration-1000"
                          style={{ width: `${selectedAgent.metrics.efficiency}%` }}
                        />
                      </div>
                    </div>

                    {/* Contribution Rate */}
                    <div>
                      <div className="flex justify-between text-[10px] mb-1.5">
                        <span className="text-brand-text-secondary">PIPELINE CONTRIBUTION</span>
                        <span className="text-brand-primary font-mono font-semibold">{selectedAgent.metrics.contributionRate}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-primary rounded-full transition-all duration-1000"
                          style={{ width: `${selectedAgent.metrics.contributionRate * 4}%` }} // exaggerated slightly for visuals
                        />
                      </div>
                    </div>

                    {/* Tasks completed */}
                    <div className="flex items-center justify-between bg-white/5 border border-white/5 p-3 rounded-2xl mt-2">
                      <div>
                        <div className="font-display font-bold text-lg text-white">
                          {selectedAgent.metrics.tasksCompleted}
                        </div>
                        <div className="text-[9px] text-brand-text-secondary uppercase tracking-widest">
                          Tickets Compiled
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary text-xs font-mono font-bold">
                        #A
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="h-[400px] border border-dashed border-white/5 rounded-3xl flex items-center justify-center text-brand-text-secondary text-xs">
                Select an agent card to inspect cognitive pipeline.
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
