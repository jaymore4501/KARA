/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, Sparkles, ArrowRight, Zap, Shield, ChevronRight } from 'lucide-react';
import HolographicCore from './HolographicCore';
import { TRUSTED_COMPANIES } from '../data';

interface HeroProps {
  onLaunchDashboard: () => void;
  onNavigate: (sectionId: string) => void;
}

export default function Hero({ onLaunchDashboard, onNavigate }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen pt-32 pb-24 px-6 overflow-hidden flex flex-col justify-center"
    >
      {/* Background Animated Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] aspect-square rounded-full bg-brand-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[50%] aspect-square rounded-full bg-brand-secondary/5 blur-[140px] pointer-events-none" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)] pointer-events-none opacity-60" />

      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left: Premium Content */}
        <div className="col-span-1 lg:col-span-6 flex flex-col items-start gap-6 lg:pr-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-brand-primary/20 bg-brand-primary/5 py-1.5 px-4 rounded-full text-xs font-semibold text-brand-highlight tracking-wide shadow-inner shadow-brand-primary/5 animate-fadeIn">
            <Sparkles className="w-3.5 h-3.5 text-brand-highlight animate-pulse" />
            <span>AI-Powered Multi-Agent Startup Builder</span>
          </div>

          {/* Heading */}
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-[1.08] max-w-xl">
            Build an Entire Startup with{' '}
            <span className="bg-gradient-to-r from-brand-highlight via-brand-primary to-brand-secondary bg-clip-text text-transparent">
              AI Agents
            </span>
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-base text-brand-text-secondary leading-relaxed max-w-lg font-light">
            KARA coordinates a workforce of autonomous AI agents—from CEO and software architects to financial modeling algorithm specialists—to design, build, and deploy your startup from a single prompt.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-2">
            <button
              onClick={onLaunchDashboard}
              className="w-full sm:w-auto relative group overflow-hidden rounded-2xl text-xs font-semibold px-8 py-4 bg-gradient-to-r from-brand-secondary via-brand-primary to-brand-highlight bg-[length:200%_auto] text-white shadow-[0_0_25px_rgba(124,92,255,0.3)] hover:shadow-[0_0_40px_rgba(157,108,255,0.65)] hover:bg-right hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 ease-out flex items-center justify-center gap-2 cursor-pointer border border-brand-highlight/30"
            >
              {/* Glossy Shimmer Reflection Sweep */}
              <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out pointer-events-none" />
              
              <span className="relative z-10 flex items-center gap-2 text-white font-display font-semibold tracking-wide">
                <span>Launch Autonomous Dashboard</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1.5 transition-transform duration-300 ease-out" />
              </span>
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 border border-white/15 hover:border-brand-primary/60 bg-white/5 hover:bg-brand-primary/10 hover:shadow-lg hover:shadow-brand-primary/15 hover:scale-[1.02] active:scale-[0.98] py-4 px-8 rounded-2xl text-xs font-semibold text-white transition-all duration-300 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-brand-highlight fill-brand-highlight group-hover:scale-110 transition-transform" />
              <span>Watch Platform Demo</span>
            </button>
          </div>

          {/* Traction Mini Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-6 border-t border-white/5 w-full max-w-md">
            <div>
              <div className="font-display font-semibold text-xl text-white">48 Hours</div>
              <div className="text-[10px] text-brand-text-secondary uppercase tracking-wider">Average MVP Delivery</div>
            </div>
            <div>
              <div className="font-display font-semibold text-xl text-white">$240M+</div>
              <div className="text-[10px] text-brand-text-secondary uppercase tracking-wider">Total Funding Raised</div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="font-display font-semibold text-xl text-white">99.8%</div>
              <div className="text-[10px] text-brand-text-secondary uppercase tracking-wider">Ingestion Success</div>
            </div>
          </div>

        </div>

        {/* Right: Holographic AI Assistant Core */}
        <div className="col-span-1 lg:col-span-6 flex items-center justify-center relative">
          <div className="absolute -inset-4 bg-radial-glow opacity-30 blur-[100px] pointer-events-none" />
          
          {/* Ambient Lighting Background behind the crystal */}
          <div className="absolute w-[380px] h-[380px] bg-brand-primary/10 rounded-full blur-[80px] pointer-events-none" />
          
          {/* Animated circular orbits around the Core */}
          <div className="absolute w-[480px] h-[480px] rounded-full border border-white/5 animate-[spin_40s_linear_infinite]" />
          <div className="absolute w-[580px] h-[580px] rounded-full border border-dashed border-brand-primary/10 animate-[spin_60s_linear_infinite_reverse]" />

          <HolographicCore />
        </div>

      </div>

      {/* Trusted Companies Slider */}
      <div className="max-w-7xl mx-auto w-full mt-20 pt-8 border-t border-white/5 relative z-10">
        <p className="text-center text-[10px] tracking-widest text-brand-text-secondary uppercase mb-6 font-medium">
          ENGINEERED BY INDIVIDUALS FROM AWARD-WINNING TEAMS
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-45 grayscale hover:opacity-75 hover:grayscale-0 transition-all duration-500">
          {TRUSTED_COMPANIES.map((company, idx) => (
            <div key={idx} className="flex items-center gap-2 select-none">
              <span className="text-xl">{company.logo}</span>
              <span className="font-display font-semibold tracking-wider text-sm text-white">
                {company.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
