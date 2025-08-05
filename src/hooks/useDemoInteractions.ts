import { useEffect } from 'react';
import { useDemo } from '@/contexts/DemoContext';
import { useNavigate } from 'react-router-dom';

export function useDemoInteractions() {
  const { demoState, nextStep, setPhase } = useDemo();
  const navigate = useNavigate();

  useEffect(() => {
    if (!demoState.isActive) return;

    const currentStep = demoState.steps[demoState.currentStep];
    
    // Handle swipe interactions on Matches page
    if (window.location.pathname === '/matches' && currentStep?.action === 'swipe-action') {
      const handleSwipeDetection = () => {
        console.log('Demo swipe interaction detected');
        // Return to dashboard after swipe
        setTimeout(() => {
          navigate('/dashboard');
          // Move to next step in demo
          setTimeout(() => nextStep(), 500);
        }, 1500);
      };

      // Listen for any swipe button clicks
      const swipeButtons = document.querySelectorAll('[data-testid="swipe-button"]');
      swipeButtons.forEach(button => {
        button.addEventListener('click', handleSwipeDetection);
      });

      return () => {
        swipeButtons.forEach(button => {
          button.removeEventListener('click', handleSwipeDetection);
        });
      };
    }

    // Handle Apply Now modal interactions
    if (currentStep?.action === 'open-modal') {
      // Watch for modal opening
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              // Check if a modal was opened
              if (element.querySelector('[role="dialog"]') || 
                  element.getAttribute('role') === 'dialog' ||
                  element.classList.contains('modal')) {
                console.log('Demo modal opened');
                // Auto-advance demo after modal opens
                setTimeout(() => {
                  nextStep();
                }, 2000);
              }
            }
          });
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      return () => observer.disconnect();
    }

  }, [demoState.currentStep, demoState.isActive, nextStep, navigate]);

  return null;
}