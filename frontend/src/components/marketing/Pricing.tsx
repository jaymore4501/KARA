/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PRICING_PLANS } from '../data';
import { Check, Sparkles, AlertCircle } from 'lucide-react';

interface PricingProps {
  onLaunchDashboard: () => void;
}

export default function Pricing({ onLaunchDashboard }: PricingProps) {
  return (
    <section
      id="pricing"
      className="py-24 px-6 relative overflow-hidden"
    >
      {/* Background radial effects */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] aspect-square rounded-full bg-brand-secondary/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[10%] left-[-10%] w-[35%] aspect-square rounded-full bg-brand-primary/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-20">
          <div className="inline-flex items-center gap-1.5 border border-brand-primary/10 bg-brand-primary/5 py-1 px-3.5 rounded-full text-[10px] font-semibold text-brand-highlight uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
            <span>Investment Structure</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
            Predictable Plans for{' '}
            <span className="bg-gradient-to-r from-brand-highlight via-brand-primary to-brand-secondary bg-clip-text text-transparent">
              Infinite Scale
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-brand-text-secondary max-w-xl font-light">
            No unexpected API token overhead bills. Pay once monthly and unlock continuous, autonomous enterprise creation cycles.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {PRICING_PLANS.map((plan, idx) => {
            return (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-[28px] p-8 flex flex-col justify-between min-h-[620px] transition-all duration-500 shadow-2xl ${
                  plan.isPopular
                    ? 'bg-[#0E0C1C] border-2 border-[#8B5CF6]/90 shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:shadow-[0_0_55px_rgba(157,108,255,0.45)] hover:-translate-y-1'
                    : 'bg-[#090713] border border-white/10 hover:border-white/20 hover:bg-[#0D0B1B] hover:-translate-y-1'
                }`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute top-5 right-6 bg-[#7C5CFF]/20 text-[#A78BFA] text-[9px] font-mono tracking-widest font-bold py-1 px-3 rounded-full border border-[#7C5CFF]/50 uppercase shadow-sm">
                    MOST POPULAR
                  </div>
                )}

                {/* Top Section */}
                <div>
                  <h3 className="font-display font-bold text-xl text-white mb-3 tracking-tight">
                    {plan.name}
                  </h3>
                  <p className="text-[12px] text-brand-text-secondary font-light leading-relaxed mb-8 min-h-[36px]">
                    {plan.description}
                  </p>

                  <div className="flex items-baseline gap-1.5 mb-8 pb-8 border-b border-white/10">
                    <span className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-xs text-brand-text-secondary font-light">
                      / {plan.period}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="flex flex-col gap-4">
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3 text-xs text-white">
                        <Check className="w-4 h-4 text-brand-success shrink-0 mt-0.5" />
                        <span className="text-brand-text-secondary font-light text-xs leading-snug">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Call To Action */}
                <div className="mt-10">
                  <button
                    onClick={onLaunchDashboard}
                    className={`w-full py-4 rounded-[20px] text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer ${
                      plan.isPopular
                        ? 'bg-[#8B5CF6] hover:bg-[#7C5CFF] text-white shadow-[0_0_30px_rgba(139,92,246,0.55)] hover:shadow-[0_0_45px_rgba(157,108,255,0.8)] hover:scale-[1.02] active:scale-[0.98]'
                        : 'bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 hover:border-brand-primary/40 text-white hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                  >
                    {plan.ctaText}
                  </button>
                  
                  <div className="flex items-center gap-1.5 justify-center text-[10px] text-white/40 mt-3 font-light">
                    <AlertCircle className="w-3 h-3 text-white/30" />
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
