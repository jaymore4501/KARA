/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WORKFLOW_STEPS } from '../data';
import { WorkflowNode } from '../types';
import { Sparkles, ArrowRight, Play, CheckCircle2, ChevronRight, Activity, Cpu } from 'lucide-react';

export default function WorkflowTimeline() {
  const [activeStepId, setActiveStepId] = useState<string>('step-3'); // Aura UI/UX as active by default

  const activeStep = WORKFLOW_STEPS.find((s) => s.id === activeStepId) || WORKFLOW_STEPS[2];
  const activeIndex = WORKFLOW_STEPS.findIndex((s) => s.id === activeStepId);
  const progressPercent = WORKFLOW_STEPS.length > 1 ? (activeIndex / (WORKFLOW_STEPS.length - 1)) * 100 : 0;

  const handleStepClick = (id: string) => {
    setActiveStepId(id);
  };

  return (
    <section
      id="workflow"
      className="py-24 px-6 relative overflow-hidden"
    >
      {/* Background radial effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] aspect-square rounded-full bg-brand-primary/5 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <div className="inline-flex items-center gap-1.5 border border-brand-primary/10 bg-brand-primary/5 py-1 px-3.5 rounded-full text-[10px] font-semibold text-brand-highlight uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5 text-brand-primary" />
            <span>Autonomous Pipeline</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
            The Multi-Agent{' '}
            <span className="bg-gradient-to-r from-brand-highlight via-brand-primary to-brand-secondary bg-clip-text text-transparent">
              Assembly Line
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-brand-text-secondary max-w-xl font-light">
            KARA maps out your startup blueprint in chronological phases. Click on each block of our coordinated pipeline to inspect active agent directives.
          </p>
        </div>

        {/* Timeline Line & Node Container */}
        <div className="relative mb-12 pb-6 overflow-x-auto scrollbar-none">
          {/* Inner scroll wrapper with horizontal padding to guarantee breathing room and prevent clipping */}
          <div className="min-w-[1000px] lg:w-full px-16 py-4 relative">
            
            {/* Steps Horizontal Row */}
            <div className="flex justify-between items-start relative z-10">
              
              {/* Dynamic Connecting Lines (relative to this row, behind nodes!) */}
              <div className="absolute top-[28px] left-[56px] right-[56px] h-[1.5px] bg-white/5 z-0" />
              <div 
                className="absolute top-[28px] left-[56px] h-[1.5px] bg-gradient-to-r from-brand-success via-brand-primary to-brand-secondary z-0 transition-all duration-500"
                style={{ width: `calc((100% - 112px) * ${progressPercent / 100})` }}
              />

              {WORKFLOW_STEPS.map((step, idx) => {
                const isActive = step.id === activeStepId;
                const isCompleted = idx < activeIndex;
                const isCurrentActive = idx === activeIndex;

                return (
                  <div
                    key={step.id}
                    onClick={() => handleStepClick(step.id)}
                    className="flex flex-col items-center gap-3 w-28 relative z-10 cursor-pointer select-none group focus:outline-none"
                  >
                    {/* Circular Node */}
                    <div
                      className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-500 relative ${
                        isActive 
                          ? 'bg-[#171522] border-brand-primary shadow-xl shadow-brand-primary/10 scale-110'
                          : isCompleted
                            ? 'bg-[#11101A] border-brand-success hover:border-brand-success/50'
                            : isCurrentActive
                              ? 'bg-[#11101A] border-brand-primary hover:border-brand-primary/50'
                              : 'bg-brand-bg border-white/5 hover:border-white/20'
                      }`}
                    >
                      {/* Ring Pulse for Active/Selected */}
                      {isCurrentActive && (
                        <div className="absolute -inset-1 rounded-full border border-brand-primary/30 animate-pulse-ring" />
                      )}

                      {/* Step Number or Check */}
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-brand-success" />
                      ) : (
                        <span className={`font-mono text-xs font-semibold ${isActive ? 'text-brand-primary' : 'text-brand-text-secondary'}`}>
                          0{idx + 1}
                        </span>
                      )}
                    </div>

                    {/* Text labels */}
                    <div className="text-center w-full">
                      <h4 className={`text-[10px] font-semibold tracking-tight transition-colors duration-300 ${isActive ? 'text-brand-highlight' : 'text-brand-text-secondary'}`}>
                        {step.title.split(' ')[0]} {step.title.split(' ')[1] || ''}
                      </h4>
                      <p className="text-[8px] font-mono tracking-widest text-white/30 uppercase mt-0.5">
                        {step.agentId}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detailed Inspector Card for Selected Phase */}
        <div className="max-w-4xl mx-auto bg-brand-card/30 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
          {/* Top Decorative gradient border */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-60" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Description Column */}
            <div className="md:col-span-7 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono py-1 px-3 border border-white/5 bg-white/5 rounded-full text-brand-highlight uppercase">
                  Phase 0{WORKFLOW_STEPS.findIndex((s) => s.id === activeStep.id) + 1}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-primary animate-ping" />
                  <span className="text-[9px] font-mono uppercase tracking-widest text-brand-text-secondary">
                    PROCESSING
                  </span>
                </div>
              </div>

              <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                {activeStep.title}
              </h3>

              <p className="text-xs text-brand-text-secondary leading-relaxed font-light">
                {activeStep.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-brand-highlight font-mono mt-2">
                <span>Principal Officer Assigned:</span>
                <span className="text-white capitalize px-2 py-0.5 bg-brand-primary/10 border border-brand-primary/20 rounded">
                  {activeStep.agentId}
                </span>
              </div>
            </div>

            {/* Right Output Column */}
            <div className="md:col-span-5 bg-brand-bg/50 border border-white/5 rounded-2xl p-5">
              <h4 className="text-[10px] font-mono text-white tracking-widest uppercase mb-4 flex items-center justify-between">
                <span>AUTO-GENERATED OUTPUTS</span>
                <span className="text-[9px] text-brand-primary lowercase font-normal">v1.0.0</span>
              </h4>

              <div className="flex flex-col gap-2.5">
                {activeStep.outputs.map((output, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-white">
                    <span className="text-brand-success shrink-0 mt-0.5">✔</span>
                    <span className="font-light text-brand-text-secondary text-[11px] leading-tight">
                      {output}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
