import React, { createContext, useContext, useState, ReactNode } from 'react';
import { setDemoMode } from '@/data/demoData';

export interface DemoStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: string;
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

export function DemoProvider({ children }: { children: ReactNode }) {
  const [demoState, setDemoState] = useState<DemoState>(() => {
    // Restore demo state from localStorage if it exists
    const savedState = localStorage.getItem('demo-state');
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (e) {
        return initialDemoState;
      }
    }
    return initialDemoState;
  });

  const startDemo = () => {
    setDemoState({
      ...initialDemoState,
      isActive: true,
      phase: 'landing',
      steps: [
        {
          id: 'welcome',
          title: 'Welcome to VibeMatch Demo',
          description: 'Let us show you how VibeMatch revolutionizes influencer marketing. Click "Content Creator" to start your journey.',
          target: '[data-demo="creator-button"]',
          position: 'bottom'
        }
      ],
      totalSteps: 1
    });
  };

  const nextStep = () => {
    setDemoState(prev => {
      const newStep = Math.min(prev.currentStep + 1, prev.totalSteps - 1);
      
      // Handle phase transitions
      if (newStep >= prev.totalSteps - 1) {
        console.log('Demo step completed, current phase:', prev.phase);
        switch (prev.phase) {
          case 'landing':
            // Move directly to creator tour and set demo mode immediately
            console.log('Moving directly to creator-tour phase');
            setDemoMode(true);
            setDemoUser('creator');
            localStorage.setItem('demo-user-type', 'creator');
            setTimeout(() => setPhase('creator-tour'), 100);
            break;
          case 'creator-tour':
            // Move to transition phase
            console.log('Moving to transition phase');
            setTimeout(() => setPhase('transition'), 100);
            break;
          case 'transition':
            // Return to landing page and prepare brand demo
            console.log('Moving to transition - returning to landing page');
            setDemoUser('sponsor');
            localStorage.setItem('demo-user-type', 'sponsor');
            window.location.href = '/';
            break;
          case 'sponsor-tour':
            // Complete demo
            console.log('Demo completed');
            setTimeout(() => setPhase('complete'), 100);
            break;
        }
      }
      
      const newState = {
        ...prev,
        currentStep: newStep
      };
      
      // Save state to localStorage for persistence
      localStorage.setItem('demo-state', JSON.stringify(newState));
      return newState;
    });
  };

  const previousStep = () => {
    setDemoState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0)
    }));
  };

  const skipStep = () => {
    nextStep();
  };

  const exitDemo = () => {
    // Clear demo state and storage
    setDemoState(initialDemoState);
    setDemoMode(false);
    localStorage.removeItem('demo-mode');
    localStorage.removeItem('demo-user-type');
    localStorage.removeItem('demo-state');
    sessionStorage.removeItem('demo-refreshed');
    // Navigate to landing page without reload to avoid loops
    window.location.href = '/';
  };

  const setPhase = (phase: DemoState['phase']) => {
    setDemoState(prev => {
      let newSteps: DemoStep[] = [];
      let totalSteps = 0;

      switch (phase) {
        case 'creator-tour':
          newSteps = [
            {
              id: 'dashboard-overview',
              title: 'Creator Dashboard',
              description: 'This is your main dashboard where you can see your performance metrics and recommended sponsors.',
              target: '[data-demo="dashboard"]',
              position: 'top'
            },
            {
              id: 'ai-profile-score',
              title: 'AI Profile Score',
              description: 'Your AI-powered profile score helps brands discover you. Keep improving to get better matches!',
              target: '[data-demo="ai-profile-score"]',
              position: 'right'
            },
            {
              id: 'ai-matches-button',
              title: 'AI Matches',
              description: 'Click here to discover brands that are perfectly matched to your content and audience. Go ahead and click it!',
              target: '[data-demo="ai-matches"]',
              position: 'right',
              action: 'navigate-to-matches'
            },
            {
              id: 'swipe-interaction',
              title: 'Swipe to Match',
              description: 'Now swipe right to like a sponsor or left to pass. Try swiping right on the first sponsor!',
              position: 'top',
              action: 'swipe-action'
            },
            {
              id: 'performance-growth',
              title: 'Performance Analytics - Growth',
              description: 'Track your growth metrics and performance over time in the Growth tab.',
              target: '[data-demo="performance-growth"]',
              position: 'top'
            },
            {
              id: 'recommended-sponsors',
              title: 'Recommended Sponsors',
              description: 'Browse through AI-curated sponsor recommendations and apply to partnerships.',
              target: '[data-demo="recommended-sponsors"]',
              position: 'top'
            },
            {
              id: 'apply-now-button',
              title: 'Apply to Partnerships',
              description: 'Use the Apply Now button to start collaborations with brands that match your style. Click it now!',
              target: '[data-demo="apply-now"]',
              position: 'left',
              action: 'open-modal'
            },
            {
              id: 'nav-campaigns',
              title: 'My Campaigns',
              description: 'Navigate to My Campaigns to manage your active collaborations. Click on it to see your campaigns.',
              target: '[data-demo="nav-campaigns"]',
              position: 'bottom',
              action: 'navigate-campaigns'
            },
            {
              id: 'campaigns-overview',
              title: 'Campaign Management',
              description: 'Here you can track all your active campaigns and their progress. Great! Now let\'s continue with the tour.',
              position: 'top'
            },
            {
              id: 'nav-messages',
              title: 'Messages',
              description: 'Stay connected with brands through our integrated messaging system.',
              target: '[data-demo="nav-messages"]',
              position: 'bottom'
            },
            {
              id: 'nav-analytics',
              title: 'Analytics',
              description: 'Access detailed analytics about your performance and engagement.',
              target: '[data-demo="nav-analytics"]',
              position: 'bottom'
            }
          ];
          totalSteps = 11;
          break;
        case 'transition':
          newSteps = [
            {
              id: 'sponsor-transition',
              title: 'Now Let\'s See the Sponsor Side',
              description: 'Experience how brands discover and collaborate with creators like you. Click "Sponsor / Brand" to continue.',
              position: 'top'
            }
          ];
          totalSteps = 1;
          break;
        case 'sponsor-tour':
          newSteps = [
            {
              id: 'sponsor-dashboard',
              title: 'Brand Dashboard',
              description: 'Brands can track their campaigns and discover new creators here.',
              target: '[data-demo="dashboard"]',
              position: 'top'
            },
            {
              id: 'sponsor-campaigns',
              title: 'Campaign Management',
              description: 'Create and manage your influencer marketing campaigns efficiently.',
              target: '[data-demo="nav-campaigns"]',
              position: 'right'
            },
            {
              id: 'sponsor-discovery',
              title: 'Creator Discovery',
              description: 'Find the perfect creators for your campaigns using advanced filters.',
              target: '[data-demo="nav-discover"]',
              position: 'right'
            },
            {
              id: 'sponsor-messages',
              title: 'Communication',
              description: 'Manage all your creator communications in one place.',
              target: '[data-demo="nav-messages"]',
              position: 'right'
            },
            {
              id: 'sponsor-analytics',
              title: 'Analytics & Reports',
              description: 'Track your campaign performance and ROI with detailed analytics.',
              target: '[data-demo="nav-analytics"]',
              position: 'right'
            }
          ];
          totalSteps = 5;
          break;
        case 'complete':
          newSteps = [
            {
              id: 'demo-complete',
              title: 'Demo Complete!',
              description: 'You\'ve seen how VibeMatch works for both creators and brands. Ready to get started for real?',
              position: 'top'
            }
          ];
          totalSteps = 1;
          break;
      }

      const newState = {
        ...prev,
        isActive: true, // Ensure demo is active when setting phase
        phase,
        steps: newSteps,
        totalSteps,
        currentStep: 0
      };
      
      // Save state to localStorage for persistence
      localStorage.setItem('demo-state', JSON.stringify(newState));
      return newState;
    });
  };

  const setDemoUser = (user: 'creator' | 'sponsor' | null) => {
    setDemoState(prev => ({
      ...prev,
      demoUser: user
    }));
  };

  return (
    <DemoContext.Provider value={{
      demoState,
      startDemo,
      nextStep,
      previousStep,
      skipStep,
      exitDemo,
      setPhase,
      setDemoUser
    }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}