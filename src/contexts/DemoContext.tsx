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
  const [demoState, setDemoState] = useState<DemoState>(initialDemoState);

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
            // Move to sponsor tour (skip sponsor auth)
            console.log('Moving to sponsor-tour phase');
            setTimeout(() => setPhase('sponsor-tour'), 100);
            break;
          case 'sponsor-tour':
            // Complete demo
            console.log('Demo completed');
            setTimeout(() => setPhase('complete'), 100);
            break;
        }
      }
      
      return {
        ...prev,
        currentStep: newStep
      };
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
    setDemoState(initialDemoState);
    // Redirect to main landing page
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
              id: 'matches-feature',
              title: 'Smart Matching',
              description: 'Discover brands that align with your content and audience using our AI matching system.',
              target: '[data-demo="matches"]',
              position: 'right'
            },
            {
              id: 'messages-center',
              title: 'Communication Hub',
              description: 'Manage all your brand communications in one centralized location.',
              target: '[data-demo="messages"]',
              position: 'right'
            },
            {
              id: 'profile-settings',
              title: 'Profile Management',
              description: 'Keep your profile updated to get better matching results.',
              target: '[data-demo="profile"]',
              position: 'right'
            }
          ];
          totalSteps = 4;
          break;
        case 'transition':
          newSteps = [
            {
              id: 'sponsor-transition',
              title: 'Now Let\'s See the Sponsor Side',
              description: 'Experience how brands discover and collaborate with creators like you.',
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
              target: '[data-demo="sponsor-dashboard"]',
              position: 'top'
            },
            {
              id: 'creator-discovery',
              title: 'Creator Discovery',
              description: 'Find the perfect creators for your campaigns using advanced filters.',
              target: '[data-demo="discovery"]',
              position: 'right'
            },
            {
              id: 'campaign-management',
              title: 'Campaign Tools',
              description: 'Create and manage your influencer marketing campaigns efficiently.',
              target: '[data-demo="campaigns"]',
              position: 'right'
            }
          ];
          totalSteps = 3;
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

      return {
        ...prev,
        phase,
        steps: newSteps,
        totalSteps,
        currentStep: 0
      };
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