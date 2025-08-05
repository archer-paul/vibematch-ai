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
    console.log('Setting up demo creator - navigating to dashboard');
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

  // Handle demo transitions and brand demo setup
  useEffect(() => {
    if (!demoState.isActive) return;

    // Handle brand demo setup when coming back to landing page
    const isDemoMode = localStorage.getItem('demo-mode') === 'true';
    const demoUserType = localStorage.getItem('demo-user-type');
    
    if (isDemoMode && demoUserType === 'sponsor' && window.location.pathname === '/' && demoState.phase !== 'sponsor-tour') {
      console.log('Setting up brand demo on landing page');
      setTimeout(() => {
        setPhase('sponsor-tour');
        setDemoUser('sponsor');
      }, 500);
    }
  }, [demoState.phase, demoState.isActive, setPhase, setDemoUser]);

  return {
    isDemoMode: demoState.isActive,
    demoUser: demoState.demoUser
  };
}