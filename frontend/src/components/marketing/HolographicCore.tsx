/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';

export default function HolographicCore() {
  const [activePulse, setActivePulse] = useState(false);
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const triggerCorePulse = () => {
    if (activePulse) return;
    setActivePulse(true);
    setTimeout(() => {
      setActivePulse(false);
    }, 1800);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    // Normalized coordinates from -0.5 to 0.5
    const x = (e.clientX - rect.left) / width - 0.5;
    const y = (e.clientY - rect.top) / height - 0.5;
    setMouseCoords({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseCoords({ x: 0, y: 0 });
  };

  return (
    <div
      id="holographic-agent-core"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={triggerCorePulse}
      style={{ perspective: 1200 }}
      className="relative w-full aspect-square max-w-[680px] mx-auto flex items-center justify-center cursor-pointer select-none group"
    >
      {/* Premium Subtle Ambient Background Layer (Very soft, non-flashy) */}
      <div
        className="absolute inset-0 rounded-full bg-brand-primary/5 blur-[100px] pointer-events-none transition-opacity duration-700"
        style={{
          transform: `translate3d(${mouseCoords.x * -15}px, ${mouseCoords.y * -15}px, 0) scale(${isHovered ? 1.05 : 1})`,
          transition: isHovered ? 'none' : 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      />

      {/* Holographic HUD Orbits and Grid Elements */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          transform: `translate3d(${mouseCoords.x * 12}px, ${mouseCoords.y * 12}px, 0)`,
          transition: isHovered ? 'none' : 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        {/* Bottom HUD Analytics */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-[9px] font-mono tracking-widest text-brand-text-secondary border border-white/5 bg-brand-surface/75 backdrop-blur-md py-1.5 px-4 rounded-full flex items-center gap-4 shadow-xl whitespace-nowrap z-30">
          <span>LATENCY: &lt;1.2ms</span>
          <span className="text-white/20">|</span>
          <span>SCAN RATE: 480Hz</span>
          <span className="text-white/20">|</span>
          <span className="text-brand-highlight">AI MATCH: 100%</span>
        </div>

        {/* Orbits Visual Decoration */}
        <div className="absolute w-[88%] h-[88%] rounded-full border border-white/5 pointer-events-none opacity-25" />
        <div className="absolute w-[94%] h-[94%] rounded-full border border-dashed border-brand-primary/10 pointer-events-none opacity-20" />
      </div>

      {/* ROBOT HERO Image with 3D Mouse Parallax and Tilt */}
      <div
        className="w-[96%] h-[96%] relative z-10 flex items-center justify-center select-none pointer-events-none"
        style={{
          transform: `translate3d(${mouseCoords.x * 15}px, ${mouseCoords.y * 15}px, 0) rotateY(${mouseCoords.x * 10}deg) rotateX(${-mouseCoords.y * 10}deg) scale(${activePulse ? 1.34 : 1.30})`,
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        <img
          src="/ROBOT_HERO_IMG.png"
          alt="KARA AI Robot Core"
          className="w-full h-full object-contain filter drop-shadow-[0_20px_50px_rgba(124,92,255,0.2)]"
        />

        {/* Glowing laser scanning HUD overlay */}
        <svg
          viewBox="0 0 450 450"
          className="absolute inset-0 w-full h-full pointer-events-none z-15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Tech Data Markings */}
          <text x="50" y="90" fill="#9D6CFF" fontSize="7.5" fontFamily="monospace" letterSpacing="1.2" opacity="0.3">SYS_STAT // ACTIVE</text>
          <text x="315" y="90" fill="#9D6CFF" fontSize="7.5" fontFamily="monospace" letterSpacing="1.2" opacity="0.3">DECISION // OPTIMIZED</text>

          {/* Dotted HUD Calibration Circles */}
          <circle cx="225" cy="225" r="160" stroke="#9D6CFF" strokeWidth="1" strokeDasharray="3 9" opacity="0.1" />
          <circle cx="225" cy="225" r="120" stroke="#7C5CFF" strokeWidth="0.75" strokeDasharray="1 5" opacity="0.08" />

          {/* Center Target Scope Crosshair */}
          <g id="center-hud" opacity="0.25">
            <circle cx="225" cy="225" r="8" stroke="#9D6CFF" strokeWidth="1.5" />
            <circle cx="225" cy="225" r="2" fill="#9D6CFF" />
            <line x1="225" y1="210" x2="225" y2="215" stroke="#9D6CFF" strokeWidth="1.5" />
            <line x1="225" y1="235" x2="225" y2="240" stroke="#9D6CFF" strokeWidth="1.5" />
            <line x1="210" y1="225" x2="215" y2="225" stroke="#9D6CFF" strokeWidth="1.5" />
            <line x1="235" y1="225" x2="240" y2="225" stroke="#9D6CFF" strokeWidth="1.5" />
          </g>

          {/* Corner brackets */}
          <g id="bounding-box-brackets" opacity="0.3">
            <path d="M50,120 L50,100 L70,100" stroke="#9D6CFF" strokeWidth="1.2" fill="none" />
            <path d="M400,120 L400,100 L380,100" stroke="#9D6CFF" strokeWidth="1.2" fill="none" />
            <path d="M50,285 L50,305 L70,305" stroke="#9D6CFF" strokeWidth="1.2" fill="none" />
            <path d="M400,285 L400,305 L380,305" stroke="#9D6CFF" strokeWidth="1.2" fill="none" />
          </g>
        </svg>
      </div>

      {/* Floating Elegant Dark Design Overlay Cards */}
      {/* Nova Card */}
      <div
        className="absolute top-4 right-4 w-44 p-4 bg-[#171522]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl z-20 hidden sm:block"
        style={{
          transform: `translate3d(${mouseCoords.x * -8}px, ${mouseCoords.y * -8}px, 0) rotate(1deg)`,
          transition: isHovered ? 'none' : 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-[#9D6CFF]/20 border border-[#9D6CFF]/40 flex items-center justify-center text-xs">👑</div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-white">Nova</div>
            <div className="text-[9px] text-[#A9A6C4]">CEO Agent</div>
          </div>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-[#9D6CFF] rounded-full"></div>
        </div>
        <div className="mt-2 text-[9px] text-[#34D399] flex items-center gap-1">
          <div className="w-1.5 h-1.5 bg-[#34D399] rounded-full animate-ping"></div> Optimizing strategy...
        </div>
      </div>

      {/* Forge Card */}
      <div
        className="absolute bottom-4 left-4 w-48 p-4 bg-[#171522]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl z-20 hidden sm:block"
        style={{
          transform: `translate3d(${mouseCoords.x * 12}px, ${mouseCoords.y * 12}px, 0) rotate(-1deg)`,
          transition: isHovered ? 'none' : 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-[#34D399]/20 border border-[#34D399]/40 flex items-center justify-center text-xs">🏗️</div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-white">Forge</div>
            <div className="text-[9px] text-[#A9A6C4]">Software Architect</div>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-full bg-white/5 rounded flex items-center px-2 text-[8px] text-[#A9A6C4] font-mono">Analyzing schema.sql</div>
          <div className="h-4 w-3/4 bg-white/5 rounded flex items-center px-2 text-[8px] text-[#A9A6C4] font-mono">Mapping API endpoints</div>
        </div>
      </div>

      {/* Market Pulse Card */}
      <div
        className="absolute top-[35%] left-4 w-40 p-3 bg-[#11101A]/95 backdrop-blur-lg border border-white/5 rounded-2xl shadow-2xl z-20 hidden lg:block"
        style={{
          transform: `translate3d(${mouseCoords.x * -12}px, ${mouseCoords.y * 12}px, 0)`,
          transition: isHovered ? 'none' : 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)'
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-[#7C5CFF]/20 border border-[#7C5CFF]/40 flex items-center justify-center text-[10px]">📈</div>
          <div className="text-[10px] font-medium text-white">Market Pulse</div>
        </div>
        <div className="flex items-end gap-1.5 h-8 pt-1">
          <div className="flex-1 bg-[#9D6CFF] h-[40%] rounded-sm animate-pulse"></div>
          <div className="flex-1 bg-[#9D6CFF] h-[60%] rounded-sm animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="flex-1 bg-[#9D6CFF] h-[90%] rounded-sm animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          <div className="flex-1 bg-[#9D6CFF] h-[75%] rounded-sm animate-pulse" style={{ animationDelay: '0.6s' }}></div>
          <div className="flex-1 bg-[#9D6CFF] h-[100%] rounded-sm animate-pulse" style={{ animationDelay: '0.8s' }}></div>
        </div>
      </div>
    </div>
  );
}
