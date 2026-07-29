/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FAQS } from '../data';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleIdx = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section
      id="faqs"
      className="py-24 px-6 relative overflow-hidden"
    >
      {/* Decorative lighting */}
      <div className="absolute top-[40%] left-[-10%] w-[35%] aspect-square rounded-full bg-brand-primary/5 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <div className="inline-flex items-center gap-1.5 border border-brand-primary/10 bg-brand-primary/5 py-1 px-3.5 rounded-full text-[10px] font-semibold text-brand-highlight uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-brand-primary" />
            <span>Faq Repository</span>
          </div>
          <h2 className="font-display font-bold text-3xl text-white tracking-tight">
            Got Questions?{' '}
            <span className="bg-gradient-to-r from-brand-highlight via-brand-primary to-brand-secondary bg-clip-text text-transparent">
              We Have Answers
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-brand-text-secondary max-w-xl font-light">
            Everything you need to know about autonomous multi-agent engineering workflows and deployment safety constraints.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="flex flex-col gap-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/5 bg-[#171522]/20 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleIdx(idx)}
                  className="w-full text-left py-5 px-6 flex justify-between items-center gap-4 hover:bg-white/5 transition-all"
                >
                  <span className="font-display font-semibold text-sm text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-brand-text-secondary transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-brand-highlight' : ''
                    }`}
                  />
                </button>

                {/* Animated content expansion */}
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    isOpen ? 'max-h-[300px] border-t border-white/5 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-6 text-xs text-brand-text-secondary leading-relaxed font-light bg-brand-bg/40">
                    {faq.answer}
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
