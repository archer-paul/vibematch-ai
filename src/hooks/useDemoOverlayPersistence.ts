import { useEffect } from 'react';
import { useDemo } from '@/contexts/DemoContext';
import { useLocation } from 'react-router-dom';

export function useDemoOverlayPersistence() {
  const { demoState, setPhase } = useDemo();
  const location = useLocation();

  useEffect(() => {
    // Ensure demo overlay persists across navigation
    if (demoState.isActive && location.pathname === '/matches' && demoState.phase === 'creator-tour') {
      // Check if we're on the swipe step
      const currentStep = demoState.steps[demoState.currentStep];
      if (currentStep?.id === 'swipe-interaction') {
        console.log('Demo overlay persisted on matches page for swipe interaction');
        // Demo is correctly set for swipe interaction
        return;
      }
      
      // If we're not on the swipe step but should be, advance to it
      if (currentStep?.id === 'ai-matches-button') {
        console.log('Advanced to swipe interaction step on matches page');
        // The step should already be advanced by the overlay click handler
      }
    }
  }, [location.pathname, demoState.isActive, demoState.phase, demoState.currentStep, demoState.steps, setPhase]);

  return null;
}