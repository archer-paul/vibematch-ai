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
          const returnToDashboard = document.createElement('div');
          returnToDashboard.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background: white; padding: 20px; border-radius: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                        z-index: 10001; text-align: center; max-width: 300px;">
              <h3 style="margin: 0 0 10px 0; color: #6b46c1;">Great Match!</h3>
              <p style="margin: 0 0 15px 0; color: #374151;">Now let's return to the dashboard to continue the tour.</p>
              <button style="background: #6b46c1; color: white; border: none; padding: 8px 16px; 
                            border-radius: 6px; cursor: pointer;" onclick="this.parentElement.parentElement.remove(); window.location.href='/dashboard';">
                Return to Dashboard
              </button>
            </div>
          `;
          document.body.appendChild(returnToDashboard);
          
          // Auto navigate after 3 seconds
          setTimeout(() => {
            returnToDashboard.remove();
            navigate('/dashboard');
            // Wait longer for navigation to complete before advancing demo
            setTimeout(() => nextStep(), 1000);
          }, 3000);
        }, 1000);
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
                
                // Wait a bit for modal to fully render, then show message to click "Send Message"
                setTimeout(() => {
                  const sendButton = document.querySelector('button[type="submit"]') || 
                                   document.querySelector('button:contains("Send")') ||
                                   document.querySelector('button:contains("Message")');
                  
                  if (sendButton) {
                    // Add demo highlighting to send button
                    (sendButton as HTMLElement).style.position = 'relative';
                    (sendButton as HTMLElement).style.zIndex = '10001';
                    (sendButton as HTMLElement).style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.5)';
                    (sendButton as HTMLElement).style.borderRadius = '8px';
                    
                    // Add click handler
                    const handleSendClick = () => {
                      console.log('Demo send message clicked');
                      // Remove highlighting
                      (sendButton as HTMLElement).style.position = '';
                      (sendButton as HTMLElement).style.zIndex = '';
                      (sendButton as HTMLElement).style.boxShadow = '';
                      
                      // Close modal and advance demo
                      setTimeout(() => {
                        const closeButton = document.querySelector('[data-dismiss="modal"]') || 
                                          document.querySelector('button[aria-label="Close"]') ||
                                          element.querySelector('button:last-child');
                        if (closeButton) {
                          (closeButton as HTMLElement).click();
                        }
                        nextStep();
                      }, 1000);
                    };
                    
                    sendButton.addEventListener('click', handleSendClick);
                  }
                }, 1500);
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