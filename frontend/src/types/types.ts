/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Agent {
  id: string;
  name: string;
  role: string;
  iconName: string;
  avatarColor: string;
  status: 'idle' | 'analyzing' | 'building' | 'deploying' | 'completed' | 'active';
  description: string;
  capabilities: string[];
  recentAction?: string;
  metrics: {
    efficiency: number;
    tasksCompleted: number;
    contributionRate: number;
  };
}

export interface WorkflowNode {
  id: string;
  title: string;
  description: string;
  agentId: string;
  status: 'pending' | 'active' | 'completed';
  outputs: string[];
}

export interface DashboardTask {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  assignedTo: string; // Agent ID
  progress: number;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  senderId: string; // Agent ID or 'user'
  senderName: string;
  senderRole: string;
  message: string;
  timestamp: string;
  type: 'text' | 'code' | 'system' | 'metric';
  codeSnippet?: {
    language: string;
    code: string;
    fileName: string;
  };
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  isPopular: boolean;
  ctaText: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PitchDeckSlide {
  title: string;
  subtitle: string;
  bullets: string[];
  stat?: {
    value: string;
    label: string;
  };
}
