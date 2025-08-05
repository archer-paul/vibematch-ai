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

    // Handle demo authentication phases
    if (demoState.phase === 'creator-auth') {
      console.log('Setting up demo creator - navigating immediately');
      // Navigate to dashboard immediately - demo mode already set in DemoContext
      navigate('/dashboard');
      setPhase('creator-tour');
    }
    
    if (demoState.phase === 'sponsor-tour') {
      console.log('Setting up demo sponsor - navigating immediately');
      // Navigate to sponsor dashboard immediately
      navigate('/dashboard');
    }
  }, [demoState.phase, demoState.isActive, navigate, setPhase]);

  // Handle demo transitions
  useEffect(() => {
    if (!demoState.isActive) return;

    if (demoState.phase === 'transition') {
      console.log('Demo transition phase - switching to sponsor');
      // Brief pause before switching to sponsor
      setTimeout(() => {
        setPhase('sponsor-tour');
      }, 2000);
    }
  }, [demoState.phase, demoState.isActive, setPhase]);

  return {
    isDemoMode: demoState.isActive,
    demoUser: demoState.demoUser
  };
}