/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, ArrowUpRight, Send } from 'lucide-react';
import { Github, Twitter, Linkedin } from './BrandIcons';
import { getAssetUrl } from '@/lib/assets';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const footerLinks = [
    {
      title: 'Platform',
      links: [
        { name: 'Dashboard', href: '#dashboard' },
        { name: 'Features', href: '#features' },
        { name: 'Agents', href: '#agents' },
        { name: 'Pricing', href: '#pricing' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '#' },
        { name: 'Agent Sandbox', href: '#' },
        { name: 'API Contracts', href: '#' },
        { name: 'Github Ingress', href: 'https://github.com/jaymore4501/KARA' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Team', href: '#' },
        { name: 'Venture Backing', href: '#' },
        { name: 'Security Audits', href: '#' },
        { name: 'Compliance SOC2', href: '#' }
      ]
    }
  ];

  return (
    <footer className="relative border-t border-white/5 bg-[#11101A]/30 pt-20 pb-12 px-6 overflow-hidden">
      
      {/* Absolute decorative gradient border */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />
      
      {/* Background blurred sphere */}
      <div className="absolute bottom-[-50px] left-[50%] -translate-x-1/2 w-[300px] h-[150px] bg-brand-primary/5 rounded-full blur-[60px]" />

      <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 pb-16 border-b border-white/5">
        
        {/* Left Col: Brand & Newsletter */}
        <div className="lg:col-span-5 flex flex-col items-start gap-5">
          <div className="flex items-center gap-2 select-none">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-secondary to-brand-primary p-[1px] shadow-lg overflow-hidden">
              <img src={getAssetUrl("/KARA-LOGO.png")} alt="KARA Logo" className="w-full h-full object-cover rounded-xl" />
            </div>
            <span className="font-display font-bold text-lg text-white tracking-wider">
              KARA
            </span>
          </div>

          <p className="text-xs text-brand-text-secondary leading-relaxed font-light max-w-sm">
            KARA leverages a secure, coordinated multi-agent runtime workspace to build fully production-grade code, financial runways, and market portfolios instantly.
          </p>

          {/* Newsletter form */}
          <div className="w-full max-w-sm mt-2">
            <h4 className="text-[10px] font-mono text-white tracking-widest uppercase mb-3">
              SUBSCRIBE TO DEEP-DIVE LOGS
            </h4>

            <form onSubmit={handleSubscribe} className="flex gap-2 w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter workspace email"
                required
                className="flex-grow bg-[#09070F] border border-white/15 focus:border-brand-primary/40 focus:outline-none py-2.5 px-4 rounded-xl text-xs text-white placeholder-white/35 font-light transition-all"
              />
              <button
                type="submit"
                className="py-2.5 px-4 rounded-xl bg-white text-brand-bg hover:bg-brand-highlight hover:text-brand-bg font-semibold text-xs transition-all flex items-center gap-1.5 shrink-0"
              >
                {subscribed ? 'Subscribed' : <Send className="w-3.5 h-3.5" />}
              </button>
            </form>
          </div>

        </div>

        {/* Right Col: Navigation Category blocks */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
          {footerLinks.map((block, index) => (
            <div key={index} className="flex flex-col gap-4">
              <h4 className="text-[10px] font-mono text-white tracking-widest uppercase">
                {block.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {block.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <a
                      href={link.href}
                      className="text-xs text-brand-text-secondary hover:text-white transition-colors font-light flex items-center gap-0.5 group"
                    >
                      <span>{link.name}</span>
                      <ArrowUpRight className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>

      {/* Elegant Dark Design Traction and Node Metrics */}
      <div className="max-w-7xl mx-auto py-8 border-t border-white/5 mt-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10 bg-[#09070F]/50 p-6 sm:p-8 rounded-2xl border border-white/5">
        <div className="flex flex-wrap gap-x-12 gap-y-6">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-brand-text-secondary mb-1 font-mono">Active Nodes</div>
            <div className="text-xl font-bold font-display text-white">1,248</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-brand-text-secondary mb-1 font-mono">Capital Managed</div>
            <div className="text-xl font-bold font-display text-white">$42.1M</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-brand-text-secondary mb-1 font-mono">Success Rate</div>
            <div className="text-xl font-bold font-display text-brand-success">98.4%</div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2.5">
            <div className="w-8 h-8 rounded-full border-2 border-[#09070F] bg-[#171522] flex items-center justify-center text-xs shadow-lg select-none">⚡️</div>
            <div className="w-8 h-8 rounded-full border-2 border-[#09070F] bg-[#171522] flex items-center justify-center text-xs shadow-lg select-none">🔥</div>
            <div className="w-8 h-8 rounded-full border-2 border-[#09070F] bg-[#171522] flex items-center justify-center text-xs shadow-lg select-none">✨</div>
          </div>
          <span className="text-xs text-brand-text-secondary font-light">Joined by 2.4k founders this week</span>
        </div>
      </div>

      {/* Bottom Legal footer row */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10">
        <p className="text-[10px] text-brand-text-secondary font-light font-mono">
          © {new Date().getFullYear()} KARA AI Technologies Inc. All rights reserved.
        </p>

        {/* Social Buttons */}
        <div className="flex items-center gap-5">
          <a href="https://github.com/jaymore4501/KARA" className="text-brand-text-secondary hover:text-white transition-colors">
            <Github className="w-4 h-4" />
          </a>
          <a href="#" className="text-brand-text-secondary hover:text-white transition-colors">
            <Twitter className="w-4 h-4" />
          </a>
          <a href="#" className="text-brand-text-secondary hover:text-white transition-colors">
            <Linkedin className="w-4 h-4" />
          </a>
        </div>
      </div>

    </footer>
  );
}
