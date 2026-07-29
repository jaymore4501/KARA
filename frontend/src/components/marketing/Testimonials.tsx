/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TESTIMONIALS } from '../data';
import { Users, Star } from 'lucide-react';

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="py-24 px-6 relative overflow-hidden"
    >
      {/* Decorative lighting */}
      <div className="absolute top-[30%] right-[-10%] w-[35%] aspect-square rounded-full bg-brand-primary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-20">
          <div className="inline-flex items-center gap-1.5 border border-brand-primary/10 bg-brand-primary/5 py-1 px-3.5 rounded-full text-[10px] font-semibold text-brand-highlight uppercase tracking-wider">
            <Users className="w-3.5 h-3.5 text-brand-primary" />
            <span>Success Indicators</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
            Loved by{' '}
            <span className="bg-gradient-to-r from-brand-highlight via-brand-primary to-brand-secondary bg-clip-text text-transparent">
              High-Growth Founders
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-brand-text-secondary max-w-xl font-light">
            Read how global engineering leaders and venture-backed builders deploy their MVPs inside a fraction of traditional development runways.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="relative overflow-hidden rounded-[24px] bg-[#171522]/30 border border-white/5 p-8 flex flex-col justify-between shadow-xl"
            >
              {/* Star indicators */}
              <div className="flex gap-1 mb-6 text-brand-highlight">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} className="w-3.5 h-3.5 fill-brand-highlight" />
                ))}
              </div>

              {/* Content quote */}
              <p className="text-xs text-brand-text-secondary leading-relaxed font-light mb-8 italic">
                "{t.content}"
              </p>

              {/* Client Profile */}
              <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                <img
                  src={t.avatar}
                  alt={t.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                />
                <div>
                  <h4 className="font-display font-semibold text-xs text-white">
                    {t.name}
                  </h4>
                  <p className="text-[10px] text-brand-text-secondary font-mono">
                    {t.role}, <span className="text-brand-highlight">{t.company}</span>
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
