import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, SkipForward, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDemo } from '@/contexts/DemoContext';

export function DemoOverlay() {
  const { demoState, nextStep, previousStep, skipStep, exitDemo } = useDemo();
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [overlayPosition, setOverlayPosition] = useState({ x: 0, y: 0 });
  const [tooltipDimensions, setTooltipDimensions] = useState({ width: 400, height: 240 });

  const currentStep = demoState.steps[demoState.currentStep];

  useEffect(() => {
    if (!demoState.isActive || !currentStep) {
      setTargetElement(null);
      return;
    }

    // Handle special cases without targets (like transition steps)
    if (!currentStep.target) {
      // For sponsor transition, center the tooltip
      if (currentStep.id === 'sponsor-transition') {
        const tooltipWidth = 450;
        const tooltipHeight = 200;
        setTooltipDimensions({ width: tooltipWidth, height: tooltipHeight });
        setOverlayPosition({ 
          x: window.innerWidth / 2 - tooltipWidth / 2, 
          y: window.innerHeight / 2 - tooltipHeight / 2 
        });
      }
      return;
    }

    const findTarget = () => {
      const element = document.querySelector(currentStep.target!) as HTMLElement;
      if (element) {
        setTargetElement(element);
        
        // Add click event listeners for interactive elements
        if (currentStep.target === '[data-demo="creator-button"]' || 
            currentStep.target === '[data-demo="brand-button"]' ||
            currentStep.target === '[data-demo="ai-matches"]' ||
            currentStep.target === '[data-demo="apply-now"]' ||
            currentStep.target === '[data-demo="nav-campaigns"]') {
          const handleElementClick = (e: Event) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`${currentStep.target} clicked during demo`);
            
            // Handle specific actions
            if (currentStep.action === 'navigate-to-matches') {
              // Don't prevent default here - we want to advance the step first
              console.log('Navigating to matches - advancing demo step first');
              nextStep(); // Advance to swipe step first
              // Use setTimeout to allow state to update before navigation
              setTimeout(() => {
                window.location.href = '/matches';
              }, 100);
              return;
            } else if (currentStep.action === 'navigate-campaigns') {
              window.location.href = '/campaigns';
              return;
            } else if (currentStep.action === 'open-modal') {
              // Find and click the Apply Now button to open modal
              const applyButton = document.querySelector('[data-demo="apply-now"]');
              if (applyButton) {
                (applyButton as HTMLElement).click();
              }
            } else if (currentStep.target === '[data-demo="brand-button"]') {
              // Handle brand button click - setup sponsor demo
              console.log('Setting up sponsor demo');
              // Clear creator demo data and setup sponsor
              localStorage.setItem('demo-user-type', 'sponsor');
              // Navigate to auth to setup sponsor profile
              window.location.href = '/auth';
              return;
            }
            
            nextStep();
          };
          element.addEventListener('click', handleElementClick);
          element.dataset.demoClickHandler = 'true';
        }
        
        // Calculate position for the tooltip
        const rect = element.getBoundingClientRect();
        
        // Auto-scroll to element if not visible
        const viewportHeight = window.innerHeight;
        const elementBottom = rect.bottom;
        const elementTop = rect.top;
        
        if (elementBottom > viewportHeight - 100 || elementTop < 100) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center', 
            inline: 'nearest' 
          });
          // Wait for scroll to complete before positioning tooltip
          setTimeout(() => {
            const updatedRect = element.getBoundingClientRect();
            updateTooltipPosition(updatedRect);
          }, 500);
          return;
        }
        
        updateTooltipPosition(rect);
      }
    };

    const updateTooltipPosition = (rect: DOMRect) => {
      // Dynamic tooltip sizing based on content
      const baseWidth = 400;
      const baseHeight = 260;
      const contentLength = (currentStep.title + currentStep.description).length;
      const extraHeight = Math.max(0, (contentLength - 100) * 0.8);
      const tooltipWidth = Math.min(baseWidth + (contentLength > 150 ? 80 : 0), 500);
      const tooltipHeight = Math.min(baseHeight + extraHeight, 400);
      
      setTooltipDimensions({ width: tooltipWidth, height: tooltipHeight });
      
      let x = rect.left + rect.width / 2 - tooltipWidth / 2;
      let y = rect.bottom + 20;
      
      // Adjust position based on specified position
      switch (currentStep.position) {
        case 'top':
          y = rect.top - tooltipHeight - 20;
          break;
        case 'left':
          x = rect.left - tooltipWidth - 20;
          y = rect.top + rect.height / 2 - tooltipHeight / 2;
          break;
        case 'right':
          // For AI Matches button, position further right to avoid covering it
          if (currentStep.id === 'ai-matches-button') {
            x = rect.right + 30;
            y = rect.top - 50; // Position slightly above to avoid overlap
          } else {
            x = rect.right + 20;
            y = rect.top + rect.height / 2 - tooltipHeight / 2;
          }
          break;
        default: // bottom
          y = rect.bottom + 20;
          break;
      }
      
      // Keep tooltip in viewport
      x = Math.max(20, Math.min(x, window.innerWidth - tooltipWidth - 20));
      y = Math.max(20, Math.min(y, window.innerHeight - tooltipHeight - 20));
      
      setOverlayPosition({ x, y });
      
      // Highlight the target element (skip for special cases)
      if (currentStep.id !== 'sponsor-transition') {
        const element = document.querySelector(currentStep.target!) as HTMLElement;
        if (element) {
          element.style.position = 'relative';
          element.style.zIndex = '9999';
          element.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.5), 0 0 0 8px rgba(139, 92, 246, 0.2)';
          element.style.borderRadius = '8px';
        }
      }
    };

    // Try to find the target immediately
    findTarget();
    
    // If not found, try again after a short delay (for dynamic content)
    const timeout = setTimeout(findTarget, 100);
    
    return () => {
      clearTimeout(timeout);
      // Clean up highlighting and event listeners
      if (targetElement) {
        targetElement.style.position = '';
        targetElement.style.zIndex = '';
        targetElement.style.boxShadow = '';
        targetElement.style.borderRadius = '';
        
        // Remove click event listener if it was added
        if (targetElement.dataset.demoClickHandler) {
          targetElement.removeEventListener('click', () => {});
          delete targetElement.dataset.demoClickHandler;
        }
      }
    };
  }, [currentStep, demoState.currentStep]);

  // Clean up when demo ends
  useEffect(() => {
    return () => {
      if (targetElement) {
        targetElement.style.position = '';
        targetElement.style.zIndex = '';
        targetElement.style.boxShadow = '';
        targetElement.style.borderRadius = '';
      }
    };
  }, [targetElement]);

  if (!demoState.isActive || !currentStep) {
    return null;
  }

  const isFirstStep = demoState.currentStep === 0;
  const isLastStep = demoState.currentStep === demoState.totalSteps - 1;
  const isDemoComplete = demoState.phase === 'complete';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[10000] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Dark overlay with cutout for target element */}
        <div className="absolute inset-0">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <mask id="cutout-mask">
                <rect width="100%" height="100%" fill="white" />
                {targetElement && currentStep?.id !== 'sponsor-transition' && (
                  <rect
                    x={targetElement.getBoundingClientRect().left - 8}
                    y={targetElement.getBoundingClientRect().top - 8}
                    width={targetElement.getBoundingClientRect().width + 16}
                    height={targetElement.getBoundingClientRect().height + 16}
                    rx="12"
                    fill="black"
                  />
                )}
              </mask>
            </defs>
            <rect 
              width="100%" 
              height="100%" 
              fill="rgba(0, 0, 0, 0.7)" 
              mask={currentStep?.id === 'sponsor-transition' ? undefined : "url(#cutout-mask)"}
              style={{ backdropFilter: 'blur(2px)' }}
            />
          </svg>
        </div>
        
        {/* Demo tooltip */}
        <motion.div
          className="absolute pointer-events-auto"
          style={{
            left: overlayPosition.x,
            top: overlayPosition.y,
            width: tooltipDimensions.width,
            maxHeight: tooltipDimensions.height
          }}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Card className="bg-white/95 backdrop-blur-md border border-purple-200 shadow-2xl overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 pr-2">
                  <h3 className="text-base font-semibold text-gray-900 mb-2 leading-tight">
                    {currentStep.title}
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {currentStep.description}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={exitDemo}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {demoState.currentStep + 1} of {demoState.totalSteps}
                  </span>
                  <div className="flex gap-1">
                    {Array.from({ length: demoState.totalSteps }, (_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          i <= demoState.currentStep 
                            ? 'bg-purple-500' 
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {!isFirstStep && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={previousStep}
                      className="text-xs px-2"
                    >
                      <ArrowLeft className="h-3 w-3" />
                    </Button>
                  )}
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={exitDemo}
                    className="text-xs px-2"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  
                  {!isDemoComplete && (
                    <Button
                      size="sm"
                      onClick={nextStep}
                      className="text-xs bg-purple-600 hover:bg-purple-700 px-3"
                    >
                      {isLastStep && demoState.phase !== 'complete' ? 'Continue' : 'Next'}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Exit demo button */}
        <motion.div
          className="absolute top-4 right-4 pointer-events-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="secondary"
            onClick={exitDemo}
            className="bg-white/90 hover:bg-white text-gray-900 shadow-lg"
          >
            Exit Demo
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
