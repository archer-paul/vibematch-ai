import { useEffect } from 'react';
import { useDemo } from '@/contexts/DemoContext';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getDemoProfile, setDemoMode } from '@/data/demoData';

export function useDemoAuth() {
  const { demoState, setPhase, setDemoUser } = useDemo();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!demoState.isActive) return;

    console.log('Demo auth phase changed to:', demoState.phase);

  // Handle demo navigation phases
  if (demoState.phase === 'creator-tour') {
    console.log('Setting up demo creator - navigating as needed');
    const path = window.location.pathname;
    const step = demoState.steps[demoState.currentStep];
    const isSwipeFlow = path === '/matches' && (step?.id === 'swipe-interaction' || step?.action === 'swipe-action');
    if (path !== '/dashboard' && !isSwipeFlow) {
      navigate('/dashboard');
      const hasRefreshed = sessionStorage.getItem('demo-refreshed');
      if (!hasRefreshed) {
        sessionStorage.setItem('demo-refreshed', 'true');
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    }
  }
  
  if (demoState.phase === 'sponsor-tour') {
    console.log('Setting up demo sponsor - navigating to dashboard');
    // Only navigate if not already on dashboard  
    if (window.location.pathname !== '/dashboard') {
      navigate('/dashboard');
      // Single refresh needed for demo mode to load properly
      const hasRefreshed = sessionStorage.getItem('demo-refreshed');
      if (!hasRefreshed) {
        sessionStorage.setItem('demo-refreshed', 'true');
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    }
  }

  // Ensure we go through landing during transition and switch to sponsor profile
  if (demoState.phase === 'transition') {
    console.log('Transition phase: navigating to landing and switching to sponsor demo user');
    try {
      localStorage.setItem('demo-user-type', 'sponsor');
      window.dispatchEvent(new CustomEvent('demo-user-changed', { detail: { userType: 'sponsor' } }));
    } catch (e) {
      // ignore
    }
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  }

  // Handle special demo pages
  if (window.location.pathname === '/matches' && demoState.phase === 'creator-tour') {
    // Add swipe detection for demo
    const handleSwipeAction = () => {
      console.log('Swipe action detected during demo');
      setTimeout(() => {
        navigate('/dashboard');
        setTimeout(() => setPhase('creator-tour'), 100);
      }, 1000);
    };

    // Listen for swipe actions
    const swipeButtons = document.querySelectorAll('[data-testid="swipe-button"]');
    swipeButtons.forEach(button => {
      button.addEventListener('click', handleSwipeAction);
    });

    return () => {
      swipeButtons.forEach(button => {
        button.removeEventListener('click', handleSwipeAction);
      });
    };
  }

  if (window.location.pathname === '/campaigns' && demoState.phase === 'creator-tour') {
    // Quick return to dashboard after viewing campaigns
    setTimeout(() => {
      navigate('/dashboard');
      setTimeout(() => setPhase('creator-tour'), 500);
    }, 2000);
  }
  }, [demoState.phase, demoState.isActive, navigate, setPhase]);

  // Handle demo transitions and brand demo setup (disabled to avoid conflicts)
  useEffect(() => {
    if (!demoState.isActive) return;

    // Do not auto-switch phases on landing; the overlay drives the transition.
    // This prevents loops where phase toggles between transition and sponsor-tour.
    // Intentionally left blank.
  }, [demoState.isActive]);

  return {
    isDemoMode: demoState.isActive,
    demoUser: demoState.demoUser
  };
}