/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, X, ArrowRight } from 'lucide-react';
import { Github } from './BrandIcons';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  onLaunchDashboard: () => void;
}

export default function Navbar({ onNavigate, onLaunchDashboard }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Dashboard', id: 'dashboard' },
    { name: 'Features', id: 'features' },
    { name: 'Agents', id: 'agents' },
    { name: 'How It Works', id: 'workflow' },
    { name: 'Pricing', id: 'pricing' },
    { name: 'FAQs', id: 'faqs' },
  ];

  const handleLinkClick = (id: string) => {
    setIsMobileMenuOpen(false);
    onNavigate(id);
  };

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${isScrolled
          ? 'bg-brand-bg/80 backdrop-blur-md border-white/5 py-3 shadow-xl'
          : 'bg-transparent border-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => handleLinkClick('hero')}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-secondary to-brand-primary p-[1px] shadow-lg group-hover:shadow-brand-primary/25 transition-all">
            <div className="absolute inset-0 rounded-xl bg-brand-primary/20 blur-sm group-hover:blur-md transition-all" />
            <div className="relative w-full h-full rounded-xl bg-brand-bg flex items-center justify-center overflow-hidden">
              <img src="/KARA-LOGO.png" alt="KARA Logo" className="w-full h-full object-cover rounded-xl" />
            </div>
          </div>
          <span className="font-display font-bold text-xl tracking-wider bg-gradient-to-r from-white via-brand-highlight to-brand-primary bg-clip-text text-transparent">
            KARA
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1 bg-white/5 border border-white/5 py-1 px-1.5 rounded-full backdrop-blur-sm">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className="text-xs font-medium px-4 py-2 rounded-full text-brand-text-secondary hover:text-white transition-all duration-300 relative group"
            >
              <span className="relative z-10">{link.name}</span>
              <span className="absolute inset-0 bg-white/5 scale-0 group-hover:scale-100 rounded-full transition-transform duration-300" />
            </button>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-brand-text-secondary hover:text-white transition-colors p-2"
          >
            <Github className="w-4 h-4" />
          </a>
          <button
            onClick={onLaunchDashboard}
            className="relative overflow-hidden group rounded-full text-xs font-semibold px-5 py-2.5 bg-gradient-to-r from-brand-secondary to-brand-primary text-white shadow-lg shadow-brand-primary/10 hover:shadow-brand-primary/25 transition-all duration-300 flex items-center gap-1.5"
          >
            <span className="relative z-10 flex items-center gap-1">
              Launch Platform <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-brand-primary to-brand-highlight transition-transform duration-500 ease-out" />
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={onLaunchDashboard}
            className="text-[10px] font-semibold px-3 py-1.5 bg-gradient-to-r from-brand-secondary to-brand-primary rounded-full"
          >
            Launch
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-brand-text-secondary hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[100%] left-0 right-0 bg-brand-bg/95 backdrop-blur-lg border-b border-white/5 shadow-2xl py-6 px-6 animate-fadeIn">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="text-left text-sm font-medium py-2.5 text-brand-text-secondary hover:text-white border-b border-white/5"
              >
                {link.name}
              </button>
            ))}
            <div className="flex items-center justify-between pt-4">
              <span className="text-xs text-brand-text-secondary">Explore Code</span>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-brand-highlight hover:text-white"
              >
                <Github className="w-4 h-4" /> GitHub
              </a>
            </div>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onLaunchDashboard();
              }}
              className="w-full text-center py-3 bg-gradient-to-r from-brand-secondary to-brand-primary text-white rounded-xl text-xs font-semibold shadow-lg mt-2"
            >
              Launch Platform
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
