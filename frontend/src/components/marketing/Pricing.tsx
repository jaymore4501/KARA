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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-6xl mx-auto">
          {PRICING_PLANS.map((plan, idx) => {
            return (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-[24px] p-8 flex flex-col justify-between min-h-[580px] border transition-all duration-500 shadow-2xl hover:translate-y-[-4px] ${plan.isPopular
                    ? 'bg-[#171522]/90 border-brand-primary shadow-brand-primary/5'
                    : 'bg-[#11101A]/60 border-white/5 hover:border-white/10 hover:bg-[#171522]/40'
                  }`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute top-4 right-4 bg-brand-primary/20 text-brand-highlight text-[8px] font-mono tracking-widest font-bold py-1 px-3 rounded-full border border-brand-primary/40 uppercase">
                    MOST POPULAR
                  </div>
                )}

                {/* Top Section */}
                <div>
                  <h3 className="font-display font-bold text-lg text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-[11px] text-brand-text-secondary font-light leading-relaxed mb-6">
                    {plan.description}
                  </p>

                  <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-white/5">
                    <span className="font-display font-bold text-4xl text-white">
                      {plan.price}
                    </span>
                    <span className="text-xs text-brand-text-secondary font-light">
                      / {plan.period}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="flex flex-col gap-3.5">
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-white">
                        <Check className="w-4 h-4 text-brand-success shrink-0 mt-0.5" />
                        <span className="text-brand-text-secondary font-light text-[11px]">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Call To Action */}
                <div className="mt-8">
                  <button
                    onClick={onLaunchDashboard}
                    className={`w-full py-3.5 rounded-2xl text-xs font-semibold tracking-wide transition-all duration-300 ${plan.isPopular
                        ? 'bg-gradient-to-r from-brand-secondary to-brand-primary text-white shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-primary/30 text-white'
                      }`}
                  >
                    {plan.ctaText}
                  </button>

                  <div className="flex items-center gap-1.5 justify-center text-[9px] text-white/30 mt-3">
                    <AlertCircle className="w-3 h-3" />
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
