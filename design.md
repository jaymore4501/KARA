# 🎨 KARA Design System & Aesthetic Blueprint

> **Design Theme:** Dark Cyberpunk / Enterprise AI Command-Center Visual Language  
> This specification documents the exact color palette, typography hierarchy, glassmorphism tokens, gradients, and micro-animations powering KARA. Use this guide to apply the exact same theme and aesthetic to any web application.

---

## 🎨 1. Color Palette & Design Tokens

KARA uses a curated dark mode palette with obsidian deep backgrounds (`#09070F`), translucent glassmorphism surfaces (`#171522`), and vivid electric violet/purple highlights (`#9D6CFF`, `#7C5CFF`).

### Primary Palette Tokens

| Token Name | Hex Code | RGB | Usage |
| :--- | :---: | :---: | :--- |
| **`brand-bg`** | `#09070F` | `rgb(9, 7, 15)` | Global page background |
| **`brand-surface`** | `#11101A` | `rgb(17, 16, 26)` | Navigation bars, sidebars, modal overlays |
| **`brand-card`** | `#171522` | `rgb(23, 21, 34)` | Glass cards, pricing containers, agent nodes |
| **`brand-primary`** | `#9D6CFF` | `rgb(157, 108, 255)` | Primary neon purple brand accent, active states |
| **`brand-secondary`** | `#7C5CFF` | `rgb(124, 92, 255)` | Secondary deep violet accent, gradient stops |
| **`brand-highlight`** | `#C7A5FF` | `rgb(199, 165, 255)` | Light lavender text highlights, pill badges |
| **`brand-text-primary`**| `#FFFFFF` | `rgb(255, 255, 255)` | Headings, button text, crisp high-contrast text |
| **`brand-text-secondary`**| `#A9A6C4` | `rgb(169, 166, 196)` | Muted body copy, subtitles, metadata labels |
| **`brand-success`** | `#34D399` | `rgb(52, 211, 153)` | Online indicators, positive growth metrics |
| **`brand-danger`** | `#FF6B81` | `rgb(255, 107, 129)` | System warnings, error tags, drop metrics |
| **`brand-warning`** | `#FBBF24` | `rgb(251, 191, 36)` | GitHub stars badge, alert callouts |

---

## 🔤 2. Typography Framework

KARA pairs modern geometric display fonts for headings with high-legibility sans-serif fonts for body copy and monospaced fonts for technical data.

* **Display Font (Headings & Key Metrics):** `Space Grotesk` (Google Fonts)
* **Sans Font (Body Copy, Buttons, Navigation):** `Inter` (Google Fonts)
* **Mono Font (Code Snippets, Badges, Telemetry):** `JetBrains Mono` (Google Fonts)

### Font Loading Snippet
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

---

## 🔮 3. Glassmorphism & UI Component Tokens

### Glassmorphism Card Spec (`.glass-card`)
```css
.glass-card {
  background: rgba(23, 21, 34, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
}

.glass-card-hover:hover {
  background: rgba(23, 21, 34, 0.85);
  border-color: rgba(157, 108, 255, 0.3);
  box-shadow: 0 0 30px rgba(157, 108, 255, 0.2);
}
```

### Signature Text Gradient
Apply to hero headlines and section titles for a futuristic metallic glow:
```css
.text-gradient-brand {
  background: linear-gradient(135deg, #C7A5FF 0%, #9D6CFF 50%, #7C5CFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## ⚡ 4. Buttons & Interactive Hover FX

### Primary CTA Button ("Launch Autonomous Dashboard")
Featuring a 200% gradient shift, ambient neon violet glow, and glossy reflection sweep on hover:

```html
<button className="relative group overflow-hidden rounded-2xl text-xs font-semibold px-8 py-4 bg-gradient-to-r from-[#7C5CFF] via-[#9D6CFF] to-[#C7A5FF] bg-[length:200%_auto] text-white shadow-[0_0_25px_rgba(124,92,255,0.3)] hover:shadow-[0_0_40px_rgba(157,108,255,0.65)] hover:bg-right hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 ease-out border border-[#C7A5FF]/30 cursor-pointer">
  <!-- Glossy Reflection Sweep -->
  <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out pointer-events-none" />
  
  <span className="relative z-10 flex items-center gap-2 font-semibold tracking-wide">
    Launch Autonomous Dashboard →
  </span>
</button>
```

### Secondary Button ("Watch Platform Demo")
```html
<button className="flex items-center justify-center gap-2 border border-white/15 hover:border-[#9D6CFF]/60 bg-white/5 hover:bg-[#9D6CFF]/10 hover:shadow-lg hover:shadow-[#9D6CFF]/15 hover:scale-[1.02] active:scale-[0.98] py-4 px-8 rounded-2xl text-xs font-semibold text-white transition-all duration-300 cursor-pointer">
  ▶ Watch Platform Demo
</button>
```

---

## 💫 5. Keyframe Animations & FX

Add these CSS keyframe animations to your stylesheet to reproduce KARA's floating 3D orb and pulse rings:

```css
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(1deg); }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.25; transform: scale(1); }
  50% { opacity: 0.45; transform: scale(1.05); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.animate-float-core {
  animation: float 6s ease-in-out infinite;
}

.animate-pulse-glow {
  animation: pulse-glow 4s ease-in-out infinite;
}
```

---

## 🛠️ 6. Drop-in Tailwind CSS Configuration

To apply this theme directly to any Tailwind CSS project, add the `@theme` block to your `globals.css` (Tailwind v4) or update `tailwind.config.js` (Tailwind v3):

### Tailwind v4 (`globals.css`)
```css
@import "tailwindcss";

@theme {
  --font-sans: "Inter", sans-serif;
  --font-display: "Space Grotesk", sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  --color-brand-bg: #09070F;
  --color-brand-surface: #11101A;
  --color-brand-card: #171522;
  --color-brand-primary: #9D6CFF;
  --color-brand-secondary: #7C5CFF;
  --color-brand-highlight: #C7A5FF;
  --color-brand-text-primary: #FFFFFF;
  --color-brand-text-secondary: #A9A6C4;
  --color-brand-success: #34D399;
  --color-brand-danger: #FF6B81;
  --color-brand-warning: #FBBF24;
}
```

---

## 🌐 7. Complete UI Layout Sequence

When replicating KARA's landing page, maintain the exact section sequence:
1. **Header & Navigation Bar** (`Navbar`) with dynamic Live GitHub Star badge
2. **Hero Section** (`Hero`) with Holographic AI Core & primary/secondary CTAs
3. **Interactive Workspace Preview** (`InteractiveDashboard`)
4. **Features Showcase** (`Features`)
5. **9 Autonomous Agents Grid** (`AgentGrid`)
6. **How It Works Timeline** (`WorkflowTimeline`)
7. **Investment Structure** (`Pricing`) with 3 glassmorphism cards ($29, $79, $119)
8. **Interactive KARA AI FAQ Chatbot** (`FAQ`)
9. **Footer & Compliance** (`Footer`)
