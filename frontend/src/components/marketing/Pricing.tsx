/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PRICING_PLANS } from '../data';
import { Check, Sparkles, Info } from 'lucide-react';

interface PricingProps {
  onLaunchDashboard: () => void;
}

export default function Pricing({ onLaunchDashboard }: PricingProps) {
  return (
    <section
      id="pricing"
      className="py-24 px-6 relative overflow-hidden bg-[#06050D]"
    >
      {/* Background radial glow effects */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] aspect-square rounded-full bg-brand-secondary/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-[10%] left-[-10%] w-[35%] aspect-square rounded-full bg-brand-primary/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4">
          <div className="inline-flex items-center gap-1.5 border border-brand-primary/20 bg-brand-primary/10 py-1.5 px-4 rounded-full text-[10px] font-mono font-semibold text-brand-highlight uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
            <span>Investment Structure</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight">
            Predictable Plans for{' '}
            <span className="bg-gradient-to-r from-white via-brand-highlight to-brand-primary bg-clip-text text-transparent">
              Infinite Scale
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-brand-text-secondary max-w-xl font-light">
            No unexpected API token overhead bills. Pay once monthly and unlock continuous, autonomous enterprise creation cycles.
          </p>
        </div>

        {/* Pricing Cards Grid (Matching User Screenshot Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {PRICING_PLANS.map((plan, idx) => {
            const isPopular = plan.isPopular;

            return (
              <div
                key={idx}
                className={`relative rounded-[28px] p-8 flex flex-col justify-between transition-all duration-500 text-left ${
                  isPopular
                    ? 'bg-[#0E0A1B] border-2 border-[#9D6CFF] shadow-[0_0_40px_rgba(157,108,255,0.25)] scale-[1.03] z-20'
                    : 'bg-[#0B0914] border border-white/10 hover:border-white/20 shadow-xl'
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute top-5 right-5 bg-[#251842] text-[#C4A5FF] text-[9px] font-mono tracking-widest font-bold py-1 px-3 rounded-full border border-[#9D6CFF]/40 uppercase">
                    MOST POPULAR
                  </div>
                )}

                {/* Top Content Area */}
                <div>
                  <h3 className="font-display font-bold text-xl text-white mb-2 tracking-tight">
                    {plan.name}
                  </h3>
                  <p className="text-[11px] text-brand-text-secondary font-light leading-relaxed mb-8 min-h-[36px]">
                    {plan.description}
                  </p>

                  {/* Price Row */}
                  <div className="flex items-baseline gap-2 mb-8 pb-8 border-b border-white/10">
                    <span className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-xs text-brand-text-secondary font-light font-mono">
                      / month
                    </span>
                  </div>

                  {/* Features Bullet List */}
                  <div className="space-y-4">
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-[12px] text-white/80 font-light leading-snug">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Call To Action Button & Footer Note */}
                <div className="mt-10 pt-4">
                  <button
                    onClick={onLaunchDashboard}
                    className={`w-full py-4 rounded-2xl text-xs font-display font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                      isPopular
                        ? 'bg-gradient-to-r from-[#7C5CFF] via-[#8B5CF6] to-[#9D6CFF] text-white shadow-[0_0_25px_rgba(157,108,255,0.45)] hover:shadow-[0_0_40px_rgba(157,108,255,0.75)] hover:scale-[1.02] active:scale-[0.98]'
                        : 'bg-[#181427] hover:bg-[#221B38] border border-white/10 hover:border-white/20 text-white hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                  >
                    {plan.ctaText}
                  </button>
                  
                  <div className="flex items-center gap-1.5 justify-center text-[10px] text-white/35 mt-3 font-mono">
                    <Info className="w-3 h-3 text-white/40" />
                    <span>Instant activation. Cancel anytime.</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
