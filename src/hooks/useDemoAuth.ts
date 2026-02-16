import { useEffect } from 'react';
import { useDemo } from '@/contexts/DemoContext';

/**
 * Minimal demo auth hook.
 * All navigation and profile-switching is now handled by DemoOverlay's handleNext.
 * This hook only resumes a demo tour after a hard page refresh.
 */
export function useDemoAuth() {
  const { demoState, setPhase } = useDemo();

  useEffect(() => {
    // Resume demo after a page refresh if demo-mode flag is still set
    const isDemoMode = localStorage.getItem('demo-mode') === 'true';
    const demoUserType = localStorage.getItem('demo-user-type') as 'creator' | 'sponsor' | null;

    if (isDemoMode && demoUserType && !demoState.isActive) {
      if (demoUserType === 'creator') {
        setPhase('creator-tour');
      } else {
        setPhase('sponsor-tour');
      }
    }
  }, [demoState.isActive, setPhase]);

  return {
    isDemoMode: demoState.isActive,
    demoUser: demoState.demoUser,
  };
}
