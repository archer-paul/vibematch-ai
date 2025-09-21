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
    if (window.location.pathname === '/matches' && 
        (currentStep?.action === 'swipe-action' || currentStep?.id === 'swipe-interaction')) {
      const handleSwipeDetection = () => {
        console.log('Demo swipe interaction detected');
        // Show "return to dashboard" message
        setTimeout(() => {
          const wrapper = document.createElement('div');
          wrapper.style.position = 'fixed';
          wrapper.style.top = '50%';
          wrapper.style.left = '50%';
          wrapper.style.transform = 'translate(-50%, -50%)';
          wrapper.style.background = 'white';
          wrapper.style.padding = '20px';
          wrapper.style.borderRadius = '8px';
          wrapper.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
          wrapper.style.zIndex = '10001';
          wrapper.style.textAlign = 'center';
          wrapper.style.maxWidth = '300px';

          const title = document.createElement('h3');
          title.textContent = 'Great Match!';
          title.style.margin = '0 0 10px 0';
          title.style.color = '#6b46c1';

          const msg = document.createElement('p');
          msg.textContent = "Now let's return to the dashboard to continue the tour.";
          msg.style.margin = '0 0 15px 0';
          msg.style.color = '#374151';

          const btn = document.createElement('button');
          btn.textContent = 'Return to Dashboard';
          btn.style.background = '#6b46c1';
          btn.style.color = 'white';
          btn.style.border = 'none';
          btn.style.padding = '8px 16px';
          btn.style.borderRadius = '6px';
          btn.style.cursor = 'pointer';
          btn.id = 'demo-return-btn';

          wrapper.appendChild(title);
          wrapper.appendChild(msg);
          wrapper.appendChild(btn);
          document.body.appendChild(wrapper);

          const cleanup = () => {
            wrapper.remove();
          };

          const handleReturn = () => {
            cleanup();
            navigate('/dashboard');
            setTimeout(() => nextStep(), 1000);
          };
          btn.addEventListener('click', handleReturn, { once: true });

          // Auto navigate after 3 seconds
          setTimeout(handleReturn, 3000);
        }, 1000);
      };

      // Listen for any swipe button clicks
      const swipeButtons = document.querySelectorAll('[data-testid="swipe-button"]');
      swipeButtons.forEach(button => {
        button.addEventListener('click', handleSwipeDetection);
      });

      // Listen for swipe gestures dispatched from SwipeCard
      const handleDemoSwipe = () => handleSwipeDetection();
      window.addEventListener('demo-swipe' as any, handleDemoSwipe as any);

      return () => {
        swipeButtons.forEach(button => {
          button.removeEventListener('click', handleSwipeDetection);
        });
        window.removeEventListener('demo-swipe' as any, handleDemoSwipe as any);
      };
    }

  }, [demoState.currentStep, demoState.isActive, nextStep, navigate]);

  return null;
}