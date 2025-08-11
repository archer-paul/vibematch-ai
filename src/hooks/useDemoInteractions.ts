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

    // Handle message modal interaction step
    if (currentStep?.action === 'modal-interaction') {
      // Look for the modal and send button
      const modal = document.querySelector('[role="dialog"]');
      if (modal) {
        const sendButton = modal.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (sendButton && !sendButton.disabled) {
          console.log('Modal interaction: highlighting send button');
          sendButton.style.position = 'relative';
          sendButton.style.zIndex = '10001';
          sendButton.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.5), 0 0 0 8px rgba(139, 92, 246, 0.2)';
          sendButton.style.borderRadius = '8px';
          
          const handleSendClick = () => {
            console.log('Send button clicked during modal interaction demo');
            // Clean up highlighting
            sendButton.style.position = '';
            sendButton.style.zIndex = '';
            sendButton.style.boxShadow = '';
            sendButton.style.borderRadius = '';
            
            // Advance demo after a short delay to allow modal close
            setTimeout(() => {
              nextStep();
            }, 1000);
          };
          
          sendButton.addEventListener('click', handleSendClick, { once: true });
          
          return () => {
            sendButton.removeEventListener('click', handleSendClick);
            sendButton.style.position = '';
            sendButton.style.zIndex = '';
            sendButton.style.boxShadow = '';
            sendButton.style.borderRadius = '';
          };
        }
      }
      
      // If modal not found yet, try to find it with a delay
      const findModal = () => {
        const modal = document.querySelector('[role="dialog"]');
        if (modal) {
          const sendButton = modal.querySelector('button[type="submit"]') as HTMLButtonElement;
          if (sendButton && !sendButton.disabled) {
            console.log('Modal interaction: highlighting send button (delayed)');
            sendButton.style.position = 'relative';
            sendButton.style.zIndex = '10001';
            sendButton.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.5), 0 0 0 8px rgba(139, 92, 246, 0.2)';
            sendButton.style.borderRadius = '8px';
            
            const handleSendClick = () => {
              console.log('Send button clicked during modal interaction demo (delayed)');
              setTimeout(() => nextStep(), 1000);
            };
            
            sendButton.addEventListener('click', handleSendClick, { once: true });
          }
        }
      };
      
      setTimeout(findModal, 500);
      setTimeout(findModal, 1000);
    }

  }, [demoState.currentStep, demoState.isActive, nextStep, navigate]);

  return null;
}