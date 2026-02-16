import React, { createContext, useContext, useState, ReactNode } from 'react';
import { setDemoMode } from '@/data/demoData';

export interface DemoStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export interface DemoState {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  steps: DemoStep[];
  phase: 'landing' | 'creator-auth' | 'creator-tour' | 'transition' | 'sponsor-auth' | 'sponsor-tour' | 'complete';
  demoUser: 'creator' | 'sponsor' | null;
}

interface DemoContextType {
  demoState: DemoState;
  startDemo: () => void;
  nextStep: () => void;
  previousStep: () => void;
  skipStep: () => void;
  exitDemo: () => void;
  setPhase: (phase: DemoState['phase']) => void;
  setDemoUser: (user: 'creator' | 'sponsor' | null) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

const initialDemoState: DemoState = {
  isActive: false,
  currentStep: 0,
  totalSteps: 0,
  steps: [],
  phase: 'landing',
  demoUser: null
};

// ---------------------------------------------------------------------------
// Step definitions
// ---------------------------------------------------------------------------

const LANDING_STEPS: DemoStep[] = [
  {
    id: 'welcome-demo',
    title: 'Welcome to VibeMatch!',
    description: 'Let\'s start from the Sponsor side — create a campaign and let AI find the best creators.',
    target: '[data-demo="sponsor-button"]',
    position: 'bottom',
  },
];

const SPONSOR_TOUR_STEPS: DemoStep[] = [
  {
    id: 'sponsor-dashboard',
    title: 'Sponsor Dashboard',
    description: 'Your KPIs at a glance: campaigns, matched creators, reach, and ROI.',
    target: '[data-demo="dashboard"]',
    position: 'bottom',
  },
  {
    id: 'sponsor-find-creators',
    title: 'Find Matching Creators',
    description: 'Click this button to create a campaign and let AI find the ideal YouTube creators.',
    target: '[data-demo="find-creators"]',
    position: 'bottom',
  },
  {
    id: 'sponsor-campaign-form',
    title: 'Create Your Campaign',
    description: 'Fill in your campaign brief, or click Next and we\'ll auto-fill "iPhone 17 Launch" for you.',
    target: '[data-demo="campaign-dialog"]',
    position: 'right',
  },
  {
    id: 'sponsor-campaign-submit',
    title: 'Launch AI Matching',
    description: 'Click "Find Matching Creators" to run the matching algorithm.',
    target: '[data-demo="campaign-submit"]',
    position: 'top',
  },
  {
    id: 'sponsor-match-result',
    title: 'Top Match Found',
    description: 'Click "Analyze" next to the top result to deep-dive into their YouTube content.',
    target: '[data-demo="first-match"]',
    position: 'left',
  },
  {
    id: 'sponsor-analyze',
    title: 'Launch AI Analysis',
    description: 'Click "Analyze Creator" to run the full pipeline: YouTube data, transcript extraction, niche detection, and GPT-4o scoring.',
    target: '[data-demo="analyze-button"]',
    position: 'bottom',
  },
  {
    id: 'sponsor-niches',
    title: 'Niche Detection',
    description: 'LDA topic modeling + LLM validation detect the creator\'s primary niches with confidence scores.',
    target: '[data-demo="niche-results"]',
    position: 'right',
  },
  {
    id: 'sponsor-transcripts',
    title: 'Video Transcripts',
    description: 'Full transcripts extracted via InnerTube API — click any video to read what the AI analyzed.',
    target: '[data-demo="video-transcripts"]',
    position: 'top',
  },
  {
    id: 'sponsor-analytics',
    title: 'Analytics',
    description: 'Track campaign performance and ROI.',
    target: '[data-demo="nav-analytics"]',
    position: 'right',
  },
];

const TRANSITION_STEPS: DemoStep[] = [
  {
    id: 'sponsor-transition',
    title: 'Now the Creator Side',
    description: 'Let\'s see how creators discover brands and manage collaborations.',
    target: '[data-demo="creator-button"]',
    position: 'bottom',
  },
];

const CREATOR_TOUR_STEPS: DemoStep[] = [
  {
    id: 'creator-dashboard',
    title: 'Creator Dashboard',
    description: 'Performance metrics, AI score, and recommended sponsors.',
    target: '[data-demo="dashboard"]',
    position: 'bottom',
  },
  {
    id: 'creator-ai-score',
    title: 'AI Profile Score',
    description: 'YouTube content analyzed across 6 dimensions to generate a creator score.',
    target: '[data-demo="ai-profile-score"]',
    position: 'right',
  },
  {
    id: 'creator-matches',
    title: 'AI Matches',
    description: 'Tinder-like interface to discover matching brands.',
    target: '[data-demo="nav-ai-matches"]',
    position: 'right',
  },
  {
    id: 'creator-swipe',
    title: 'Swipe to Match',
    description: 'Swipe right to like, left to pass. Watch the card fly!',
    target: '[data-demo="swipe-card-top"]',
    position: 'top',
  },
  {
    id: 'creator-campaigns',
    title: 'My Campaigns',
    description: 'Active collaborations, deliverables, and earnings.',
    target: '[data-demo="nav-campaigns"]',
    position: 'right',
  },
  {
    id: 'creator-marketplace',
    title: 'Campaign Marketplace',
    description: 'Browse campaigns from Nike, Apple, Sephora, and more.',
    target: '[data-demo="nav-all-campaigns"]',
    position: 'right',
  },
  {
    id: 'creator-leaderboard',
    title: 'Leaderboard',
    description: 'Gamified ranking among creators.',
    target: '[data-demo="nav-leaderboard"]',
    position: 'right',
  },
  {
    id: 'creator-analytics',
    title: 'Analytics',
    description: 'Detailed performance metrics and engagement trends.',
    target: '[data-demo="nav-analytics"]',
    position: 'right',
  },
  {
    id: 'creator-messages',
    title: 'Messages',
    description: 'Direct messaging with brands.',
    target: '[data-demo="nav-messages"]',
    position: 'right',
  },
];

const COMPLETE_STEPS: DemoStep[] = [
  {
    id: 'demo-complete',
    title: 'Demo Complete!',
    description: 'You\'ve seen both sides of VibeMatch. Ready to try it for real?',
  },
];

function getStepsForPhase(phase: DemoState['phase']): { steps: DemoStep[]; totalSteps: number } {
  switch (phase) {
    case 'landing':      return { steps: LANDING_STEPS, totalSteps: LANDING_STEPS.length };
    case 'sponsor-tour': return { steps: SPONSOR_TOUR_STEPS, totalSteps: SPONSOR_TOUR_STEPS.length };
    case 'transition':   return { steps: TRANSITION_STEPS, totalSteps: TRANSITION_STEPS.length };
    case 'creator-tour': return { steps: CREATOR_TOUR_STEPS, totalSteps: CREATOR_TOUR_STEPS.length };
    case 'complete':     return { steps: COMPLETE_STEPS, totalSteps: COMPLETE_STEPS.length };
    default:             return { steps: [], totalSteps: 0 };
  }
}

export const GLOBAL_TOTAL_STEPS =
  LANDING_STEPS.length + SPONSOR_TOUR_STEPS.length + TRANSITION_STEPS.length + CREATOR_TOUR_STEPS.length + COMPLETE_STEPS.length;

export const PHASE_OFFSETS: Record<string, number> = {
  landing: 0,
  'sponsor-tour': LANDING_STEPS.length,
  transition: LANDING_STEPS.length + SPONSOR_TOUR_STEPS.length,
  'creator-tour': LANDING_STEPS.length + SPONSOR_TOUR_STEPS.length + TRANSITION_STEPS.length,
  complete: LANDING_STEPS.length + SPONSOR_TOUR_STEPS.length + TRANSITION_STEPS.length + CREATOR_TOUR_STEPS.length,
};

export function persistPhaseToStorage(phase: DemoState['phase'], demoUser: 'creator' | 'sponsor') {
  const { steps, totalSteps } = getStepsForPhase(phase);
  localStorage.setItem('demo-state', JSON.stringify({
    isActive: true, currentStep: 0, totalSteps, steps, phase, demoUser,
  } satisfies DemoState));
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [demoState, setDemoState] = useState<DemoState>(() => {
    const s = localStorage.getItem('demo-state');
    if (s) { try { return JSON.parse(s); } catch { /* ignore */ } }
    return initialDemoState;
  });

  const persist = (state: DemoState) => { localStorage.setItem('demo-state', JSON.stringify(state)); return state; };

  const startDemo = () => {
    const { steps, totalSteps } = getStepsForPhase('landing');
    setDemoState(persist({ ...initialDemoState, isActive: true, phase: 'landing', steps, totalSteps }));
  };
  const nextStep = () => setDemoState(p => p.currentStep + 1 >= p.totalSteps ? p : persist({ ...p, currentStep: p.currentStep + 1 }));
  const previousStep = () => setDemoState(p => persist({ ...p, currentStep: Math.max(p.currentStep - 1, 0) }));
  const skipStep = () => nextStep();
  const exitDemo = () => {
    setDemoState(initialDemoState);
    setDemoMode(false);
    localStorage.removeItem('demo-mode');
    localStorage.removeItem('demo-user-type');
    localStorage.removeItem('demo-state');
    sessionStorage.removeItem('demo-refreshed');
    window.location.href = '/';
  };
  const setPhase = (phase: DemoState['phase']) => {
    const { steps, totalSteps } = getStepsForPhase(phase);
    setDemoState(p => persist({ ...p, isActive: true, phase, steps, totalSteps, currentStep: 0 }));
  };
  const setDemoUser = (user: 'creator' | 'sponsor' | null) => setDemoState(p => ({ ...p, demoUser: user }));

  return (
    <DemoContext.Provider value={{ demoState, startDemo, nextStep, previousStep, skipStep, exitDemo, setPhase, setDemoUser }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemo must be used within a DemoProvider');
  return context;
}
