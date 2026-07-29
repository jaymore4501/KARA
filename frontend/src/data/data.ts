/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Agent, WorkflowNode, DashboardTask, ChatMessage, PricingPlan, Testimonial, FAQItem, PitchDeckSlide } from './types';

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'nova',
    name: 'Nova',
    role: 'CEO Agent',
    iconName: 'Crown',
    avatarColor: 'from-[#FF8F6B] to-[#FF6B81]',
    status: 'idle',
    description: 'Autonomous director aligning business objectives, coordinating workforce efforts, and managing high-level timeline priorities.',
    capabilities: ['Strategic Visioning', 'Dynamic Agent Delegation', 'KPI Auditing', 'Product Roadmap Decisions'],
    metrics: { efficiency: 98.4, tasksCompleted: 142, contributionRate: 20 }
  },
  {
    id: 'atlas',
    name: 'Atlas',
    role: 'Market Research',
    iconName: 'TrendingUp',
    avatarColor: 'from-[#FF6B81] to-[#D946EF]',
    status: 'idle',
    description: 'Deep intelligence crawler evaluating TAM, analyzing competitive landscapes, and tracking real-time industry trends.',
    capabilities: ['Competitor Sentiment Analysis', 'Niche Discovery Engines', 'TAM Estimation Matrix', 'Consumer Demand Forecasting'],
    metrics: { efficiency: 95.8, tasksCompleted: 184, contributionRate: 15 }
  },
  {
    id: 'pulse',
    name: 'Pulse',
    role: 'Product Manager',
    iconName: 'ClipboardList',
    avatarColor: 'from-[#D946EF] to-[#9D6CFF]',
    status: 'idle',
    description: 'Pragmatic planner auto-writing detailed PRDs, prioritizing backlogs, and translating strategies into technical tickets.',
    capabilities: ['PRD Document Autogeneration', 'Ticket Mapping & Sprints', 'Feature Value Scoring', 'UX Priority Hierarchies'],
    metrics: { efficiency: 97.2, tasksCompleted: 215, contributionRate: 14 }
  },
  {
    id: 'forge',
    name: 'Forge',
    role: 'Software Architect',
    iconName: 'Boxes',
    avatarColor: 'from-[#9D6CFF] to-[#7C5CFF]',
    status: 'idle',
    description: 'Elite designer drafting clean structural system design files, infrastructure mapping, and schema structures.',
    capabilities: ['Database Schema Generation', 'Serverless Microservices Routing', 'API Contracts (OpenAPI 3.0)', 'System Resiliency Modeling'],
    metrics: { efficiency: 99.1, tasksCompleted: 109, contributionRate: 11 }
  },
  {
    id: 'codex',
    name: 'CodeX',
    role: 'Backend Engineer',
    iconName: 'Database',
    avatarColor: 'from-[#7C5CFF] to-[#60A5FA]',
    status: 'idle',
    description: 'Autopilot developer coding high-speed Node.js/Rust services, DB integrations, and writing comprehensive test suites.',
    capabilities: ['ORM/SQL Migration Writing', 'Express API Implementation', 'OAuth & Session Controls', 'Unit & End-to-End Testing'],
    metrics: { efficiency: 96.5, tasksCompleted: 312, contributionRate: 18 }
  },
  {
    id: 'flux',
    name: 'Flux',
    role: 'Frontend Engineer',
    iconName: 'Cpu',
    avatarColor: 'from-[#60A5FA] to-[#34D399]',
    status: 'idle',
    description: 'Component compiler building high-fidelity interactive client frameworks, responsive styles, and state management hooks.',
    capabilities: ['React & Vite Boilerplates', 'Tailwind Integration Systems', 'State Management Setup', 'Client Routing Assemblies'],
    metrics: { efficiency: 94.9, tasksCompleted: 289, contributionRate: 15 }
  },
  {
    id: 'aura',
    name: 'Aura',
    role: 'UI/UX Designer',
    iconName: 'Palette',
    avatarColor: 'from-[#34D399] to-[#FBBF24]',
    status: 'idle',
    description: 'Artistic synthesizer formulating high-contrast dark visual themes, custom layouts, and luxury design templates.',
    capabilities: ['Color Palette Harmonizer', 'Typography Sizing Framework', 'Component Layout Drafts', 'Interactive Micro-motions'],
    metrics: { efficiency: 96.0, tasksCompleted: 156, contributionRate: 8 }
  },
  {
    id: 'echo',
    name: 'Echo',
    role: 'Marketing Strategist',
    iconName: 'Megaphone',
    avatarColor: 'from-[#FBBF24] to-[#F97316]',
    status: 'idle',
    description: 'Launch specialist setting up landing page copy, programmatic social assets, and targeted digital campaign templates.',
    capabilities: ['Ad Copy Autowriter', 'SEO Positioning Blueprints', 'Social Rollout Sequencer', 'Product Hunt Pre-launch Setup'],
    metrics: { efficiency: 95.1, tasksCompleted: 198, contributionRate: 10 }
  },
  {
    id: 'ledger',
    name: 'Ledger',
    role: 'Finance Analyst',
    iconName: 'DollarSign',
    avatarColor: 'from-[#F97316] to-[#EF4444]',
    status: 'idle',
    description: 'Budgeting algorithm keeping tabs on server costs, marketing acquisition CAC, and pricing model yield metrics.',
    capabilities: ['COGS Calculation Engines', 'SaaS Pricing Simulator', 'Breakeven Timeline Forecast', 'Runway Burn Rate Projections'],
    metrics: { efficiency: 98.9, tasksCompleted: 87, contributionRate: 6 }
  },
  {
    id: 'vertex',
    name: 'Vertex',
    role: 'Investor Advisor',
    iconName: 'Rocket',
    avatarColor: 'from-[#EF4444] to-[#FF8F6B]',
    status: 'idle',
    description: 'Pitching oracle preparing executive summaries, competitive matrix slides, and structuring capital-raising reports.',
    capabilities: ['VC Pitch Deck Structure', 'Investment Proposal Drafting', 'Valuation Matrix Calculators', 'Key Traction Storyboards'],
    metrics: { efficiency: 97.6, tasksCompleted: 74, contributionRate: 5 }
  }
];

export const WORKFLOW_STEPS: WorkflowNode[] = [
  {
    id: 'step-1',
    title: 'Market Viability Exploration',
    description: 'Atlas crawls trending topics, competitive pricing, and estimates the TAM for the proposed startup idea.',
    agentId: 'atlas',
    status: 'completed',
    outputs: ['10+ Competitor Positioning Profiles', 'Estimated $4.2B Beachhead Market Report', 'Key Segment Defensibility Points']
  },
  {
    id: 'step-2',
    title: 'PRD Drafting & Epics Design',
    description: 'Pulse takes research data and auto-generates a detailed Product Requirements Document with structural epics.',
    agentId: 'pulse',
    status: 'completed',
    outputs: ['Feature Priority Matrix V1.0', '14 Core Agile User Epic Outlines', 'Friction-Free Launch Scope']
  },
  {
    id: 'step-3',
    title: 'High-Fidelity UI/UX System Design',
    description: 'Aura creates luxury color specifications, typography scale guidelines, and layout frameworks.',
    agentId: 'aura',
    status: 'active',
    outputs: ['Futuristic Cosmic Slate UI Presets', 'Framer-ready Layout Dimensions', 'Micro-interaction Guides']
  },
  {
    id: 'step-4',
    title: 'System Schema & DB Architecture',
    description: 'Forge designs a multi-tenant DB schema, backend routes structure, and drafts the OpenAPI specifications.',
    agentId: 'forge',
    status: 'pending',
    outputs: ['PostgreSQL Relational Schema (SQL)', 'Distributed Cache Policy', 'Edge Middleware Contract']
  },
  {
    id: 'step-5',
    title: 'Core Engine Backend Development',
    description: 'CodeX translates Forge blueprints into fast Node.js/Express API routes with clean test coverage.',
    agentId: 'codex',
    status: 'pending',
    outputs: ['Modular API Engine on Express', 'Unit Test Suites with Vitest', 'Dockerized Core Setup']
  },
  {
    id: 'step-6',
    title: 'Interactive Client Compilation',
    description: 'Flux hooks up the frontend code, connects the active API routes, and designs premium smooth transitions.',
    agentId: 'flux',
    status: 'pending',
    outputs: ['React 19 SPA Component Structure', 'Fast-loading Asset Pipelines', 'Dynamic Client States']
  },
  {
    id: 'step-7',
    title: 'Launch Mechanics & Pricing Strategy',
    description: 'Ledger structures multi-tier plans, while Echo designs an organic pre-launch blueprint with Vertex.',
    agentId: 'echo',
    status: 'pending',
    outputs: ['Programmatic Pitch Deck Slideshow', 'Programmatic Social Campaign', 'Cost-Optimized Pricing Models']
  }
];

export const INITIAL_TASKS: DashboardTask[] = [
  { id: 't-1', title: 'Market Sentiment Crawl', status: 'done', assignedTo: 'atlas', progress: 100, timestamp: '10 min ago' },
  { id: 't-2', title: 'Feature Value Priority Matrix', status: 'done', assignedTo: 'pulse', progress: 100, timestamp: '8 min ago' },
  { id: 't-3', title: 'Cosmic Glassmorphism Theme presets', status: 'in_progress', assignedTo: 'aura', progress: 68, timestamp: 'Active' },
  { id: 't-4', title: 'Define SQL Drizzle Schema', status: 'todo', assignedTo: 'forge', progress: 0, timestamp: 'Pending Aura' },
  { id: 't-5', title: 'Draft API routing handlers', status: 'todo', assignedTo: 'codex', progress: 0, timestamp: 'Waiting schema' },
  { id: 't-6', title: 'Configure client state store', status: 'todo', assignedTo: 'flux', progress: 0, timestamp: 'Waiting layout' },
  { id: 't-7', title: 'Simulate server cost forecasting', status: 'todo', assignedTo: 'ledger', progress: 0, timestamp: 'Queued' },
];

export const MOCK_CHATS: ChatMessage[] = [
  {
    id: 'c-1',
    senderId: 'nova',
    senderName: 'Nova',
    senderRole: 'CEO Agent',
    message: "Greetings team. The user wants us to build 'VeloCloud' — a serverless, real-time developer metrics engine. Atlas, trigger an initial market assessment immediately to identify our beachhead advantage.",
    timestamp: '12:00:15',
    type: 'system'
  },
  {
    id: 'c-2',
    senderId: 'atlas',
    senderName: 'Atlas',
    senderRole: 'Market Research',
    message: "Analyzing developer APM landscape. I detect a huge segment gap: current solutions have a 12-second logging telemetry latency. If we build with edge streaming, we can offer <200ms latency. TAM is $3.2B. Let's position VeloCloud as: 'The Instantaneous Telemetry Fabric for AI Applications'.",
    timestamp: '12:00:48',
    type: 'text'
  },
  {
    id: 'c-3',
    senderId: 'pulse',
    senderName: 'Pulse',
    senderRole: 'Product Manager',
    message: "Excellent data, Atlas. I have modeled our launch PRD. Phase 1 will focus on 3 core Epics: 1. Live Webhook Receiver, 2. Dynamic Metric Visualizer, 3. Slack Trigger Alerter. Scope is lean, Aura, please draft the visual identity. Let's aim for luxurious minimalism.",
    timestamp: '12:01:22',
    type: 'text'
  },
  {
    id: 'c-4',
    senderId: 'aura',
    senderName: 'Aura',
    senderRole: 'UI/UX Designer',
    message: "On it! Designing our visual preset 'Deep Obsidian Neon'. Utilizing #05050B as the background core with deep purple glow (#8B5CF6) highlights. Spacing at 24px default padding with ultra-thin glass borders (rgba(255,255,255,0.06)). Check our styling config:",
    timestamp: '12:02:10',
    type: 'code',
    codeSnippet: {
      language: 'css',
      fileName: 'theme-config.css',
      code: `:root {
  --velocloud-black: #05050B;
  --velocloud-glow: rgba(139, 92, 246, 0.15);
  --glass-border: rgba(255, 255, 255, 0.06);
  --glass-blur: backdrop-filter: blur(12px);
  --neon-purple: #A78BFA;
}`
    }
  },
  {
    id: 'c-5',
    senderId: 'forge',
    senderName: 'Forge',
    senderRole: 'Software Architect',
    message: "Sleek theme, Aura. I am designing our telemetry pipeline. We will ingest via ultra-fast Edge-ready POST endpoints, writing directly to a time-series table. Here is the relational schema definition for our metrics:",
    timestamp: '12:03:05',
    type: 'code',
    codeSnippet: {
      language: 'typescript',
      fileName: 'schema.ts',
      code: `import { pgTable, uuid, timestamp, varchar, jsonb } from 'drizzle-orm/pg-core';

export const metricsIngest = pgTable('telemetry_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id').notNull(),
  metricName: varchar('metric_name', { length: 256 }).notNull(),
  value: varchar('value', { length: 128 }).notNull(),
  metadata: jsonb('metadata'),
  recordedAt: timestamp('recorded_at').defaultNow()
});`
    }
  },
  {
    id: 'c-6',
    senderId: 'codex',
    senderName: 'CodeX',
    senderRole: 'Backend Engineer',
    message: "Great structure Forge. Implementing the ingest endpoint. Using high-speed streaming middleware. I'm injecting safe validation schemas with Zod to maintain robust type integrity.",
    timestamp: '12:04:15',
    type: 'code',
    codeSnippet: {
      language: 'typescript',
      fileName: 'ingest-route.ts',
      code: `import express from 'express';
import { z } from 'zod';

const router = express.Router();

const TelemetryPayload = z.object({
  projectId: z.string().uuid(),
  metricName: z.string().max(256),
  value: z.number(),
  metadata: z.record(z.any()).optional()
});

router.post('/api/v1/telemetry', async (req, res) => {
  const parse = TelemetryPayload.safeParse(req.body);
  if (!parse.success) return res.status(400).json(parse.error);
  
  await db.insert(telemetryEvents).values(parse.data);
  return res.status(202).json({ status: 'queued', latencyMs: 2 });
});`
    }
  },
  {
    id: 'c-7',
    senderId: 'flux',
    senderName: 'Flux',
    senderRole: 'Frontend Engineer',
    message: "API looks extremely clean, CodeX! I am building the dashboard stream listener. Connecting server-sent events (SSE) to render incoming events instantly in our charts without rendering lag.",
    timestamp: '12:05:01',
    type: 'text'
  },
  {
    id: 'c-8',
    senderId: 'ledger',
    senderName: 'Ledger',
    senderRole: 'Finance Analyst',
    message: "Financial simulation complete. Based on serverless DB compute costs, our margin stands at 84% at $49/mo pricing. Break-even will occur at exactly 114 paying workspace accounts, assuming a CAC of $12 via Echo's pre-launch campaign. Running fully green.",
    timestamp: '12:05:30',
    type: 'metric'
  }
];

export const PITCH_DECK_SLIDES: PitchDeckSlide[] = [
  {
    title: 'The Problem',
    subtitle: 'Developers are Blind to Real-Time Telemetry',
    bullets: [
      'Telemetry solutions take up to 15 seconds to ingest and show errors.',
      'SaaS teams waste an average of 42 developer-hours per month debugging blindspots.',
      'High configuration complexity prevents early-stage teams from adopting analytics.'
    ],
    stat: { value: '42 hrs', label: 'Wasted/Mo Debugging' }
  },
  {
    title: 'The Solution: VeloCloud',
    subtitle: 'The Telemetry Fabric for the Instant Era',
    bullets: [
      'Edge streaming telemetry pipeline with guaranteed sub-200ms roundtrip ingestion.',
      'One-line integration compatible with all modern framework runtimes.',
      'Autonomous alert thresholds powered by custom threshold heuristics.'
    ],
    stat: { value: '<200ms', label: 'Ingestion Latency' }
  },
  {
    title: 'The Market Opportunity',
    subtitle: 'Tapping into a Massive Cloud Analytics TAM',
    bullets: [
      'Developer APM sector growing at an exponential 18.2% CAGR.',
      'Our beachhead audience: 450,000 active AI application developers globally.',
      'Serviced Addressable Market (SAM) estimated at a lucrative $4.2 Billion.'
    ],
    stat: { value: '$4.2B', label: 'SaaS Market Size' }
  },
  {
    title: 'Financial Model Summary',
    subtitle: 'Healthy SaaS Margins with Compound Expansion',
    bullets: [
      'Core cost-of-goods-sold (COGS) kept minimal through distributed edge compute.',
      'High customer lifetime value (LTV) relative to organic developer acquisition cost.',
      'Profitable inside 4 months, scaling rapidly to $1M ARR.'
    ],
    stat: { value: '84%', label: 'Projected Gross Margin' }
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Builder Core',
    price: '$49',
    period: 'month',
    description: 'Perfect for solo founders looking to spin up proof-of-concepts rapidly with our AI workforce.',
    features: [
      'Access to 4 Core Agents (CEO, PM, Backend, Frontend)',
      'Up to 12 active startup projects simultaneously',
      'Basic Postgres/SQLite database architecture modeling',
      'Live code generation & sandboxed preview access',
      'Git export integrations'
    ],
    isPopular: false,
    ctaText: 'Deploy Builder'
  },
  {
    name: 'Autonomous Suite',
    price: '$149',
    period: 'month',
    description: 'Unleash the full potential of a complete coordinated enterprise department working at lightspeed.',
    features: [
      'Access to all 10 Premium Agents with unique personalities',
      'Unlimited active startup pipelines and exports',
      'Production-grade DB schema planning & migrations (SQL/ORM)',
      'Automated marketing sequence & ad copy generator',
      'Interactive Pitch Deck & financial model builder',
      'Priority dedicated container runtime'
    ],
    isPopular: true,
    ctaText: 'Unlock Full Workforce'
  },
  {
    name: 'Sovereign Nexus',
    price: '$499',
    period: 'month',
    description: 'Custom fine-tuned agent layers, enterprise security baselines, and bespoke cloud landing zones.',
    features: [
      'Bespoke agent modeling trained on your specific brand guidelines',
      'Dedicated on-premise relational database synchronization',
      'Fine-grained OAuth permission scopes controls',
      'Bespoke security & compliance checks (SOC2, GDPR)',
      '24/7 priority enterprise SLA assistance & core hooks access'
    ],
    isPopular: false,
    ctaText: 'Establish Sovereign Nexus'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Sarah Chen',
    role: 'Founder & CEO',
    company: 'HyperStream',
    content: "We built our entire MVP for HyperStream in 48 hours using KARA. Nova coordinated Flux and CodeX seamlessly. When Atlas identified a market gap in developer latency, our pitch deck was updated on the fly. We just raised a $2.4M seed round using the generated pitch material. Simply remarkable.",
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80'
  },
  {
    id: 'test-2',
    name: 'Marcus Vance',
    role: 'Principal Architect',
    company: 'AetherDB',
    content: "The level of engineering consistency in KARA's codebase is incredible. Forge's DB schema definitions are cleaner than most senior architects write, and CodeX implement routes with full validation coverage. It's like having an elite, highly paid engineering squad working 24/7 for a fraction of the cost.",
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80'
  },
  {
    id: 'test-3',
    name: 'Elena Rostova',
    role: 'Head of Growth',
    company: 'ScribeAI',
    content: "Echo and Ledger completely revolutionized how we approach pricing and market positioning. Ledger's CAC and runway simulator prevented us from underpricing our plans, while Echo formulated a targeted pre-launch strategy that drove 12,000 sign-ups before our main UI was even finalized.",
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80'
  }
];

export const FAQS: FAQItem[] = [
  {
    question: "How does KARA's multi-agent workforce actually operate?",
    answer: "Unlike single-chat LLMs that require manual prompts for every step, KARA utilizes a coordinated agent framework. When you define a startup vision, Nova (CEO Agent) creates a structured launch timeline and delegates sub-tasks to Atlas, Pulse, and Forge. The agents message each other, review each other's code, compile visual styles, and collaborate autonomously to solve complex tasks."
  },
  {
    question: "Can I export the source code generated by the agents?",
    answer: "Absolutely. Once CodeX (Backend) and Flux (Frontend) compile your codebase, you can download a complete ZIP archive, export directly to a GitHub repository, or deploy instantly to serverless containers with one click."
  },
  {
    question: "Can we connect our real databases or existing AWS accounts?",
    answer: "Yes. Under our Sovereign Nexus plan, KARA can be granted secure temporary IAM roles or database credentials. Forge will then generate migrations directly compatible with your production PostgreSQL/MySQL schemas, and CodeX can draft routes that query your existing tables."
  },
  {
    question: "How is the pricing calculated? Are there extra token costs?",
    answer: "No. Our monthly subscription plans include all underlying LLM and token computation costs. You will never receive an unexpected bill for agent communication or code compilations. Your monthly rate is fully inclusive."
  }
];

export const TRUSTED_COMPANIES = [
  { name: 'Linear', logo: '⚡' },
  { name: 'Stripe', logo: '💳' },
  { name: 'Apple', logo: '🍎' },
  { name: 'Vercel', logo: '▲' },
  { name: 'Framer', logo: '⌘' },
  { name: 'OpenAI', logo: '🧠' }
];
