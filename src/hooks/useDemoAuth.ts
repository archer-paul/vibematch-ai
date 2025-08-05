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

    // Handle demo authentication phases
    if (demoState.phase === 'creator-auth') {
      // Simulate auto-login for creator
      setDemoMode(true);
      setDemoUser('creator');
      localStorage.setItem('demo-user-type', 'creator');
      
      // Navigate to dashboard after short delay
      setTimeout(() => {
        navigate('/dashboard');
        setPhase('creator-tour');
      }, 1500);
    }
    
    if (demoState.phase === 'sponsor-tour') {
      // Switch to sponsor demo user
      setDemoUser('sponsor');
      localStorage.setItem('demo-user-type', 'sponsor');
      
      // Navigate to sponsor dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    }
  }, [demoState.phase, demoState.isActive, navigate, setPhase, setDemoUser]);

  // Auto-navigate for demo phases
  useEffect(() => {
    if (!demoState.isActive) return;

    switch (demoState.phase) {
      case 'creator-auth':
        navigate('/auth');
        break;
      case 'transition':
        // Brief pause before switching to sponsor
        setTimeout(() => {
          setPhase('sponsor-tour');
        }, 2000);
        break;
    }
  }, [demoState.phase, demoState.isActive, navigate, setPhase]);

  return {
    isDemoMode: demoState.isActive,
    demoUser: demoState.demoUser
  };
}