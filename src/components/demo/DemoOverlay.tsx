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

  const currentStep = demoState.steps[demoState.currentStep];

  useEffect(() => {
    if (!demoState.isActive || !currentStep?.target) {
      setTargetElement(null);
      return;
    }

    const findTarget = () => {
      const element = document.querySelector(currentStep.target!) as HTMLElement;
      if (element) {
        setTargetElement(element);
        
        // Calculate position for the tooltip
        const rect = element.getBoundingClientRect();
        const tooltipWidth = 350;
        const tooltipHeight = 200;
        
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
            x = rect.right + 20;
            y = rect.top + rect.height / 2 - tooltipHeight / 2;
            break;
          default: // bottom
            y = rect.bottom + 20;
            break;
        }
        
        // Keep tooltip in viewport
        x = Math.max(20, Math.min(x, window.innerWidth - tooltipWidth - 20));
        y = Math.max(20, Math.min(y, window.innerHeight - tooltipHeight - 20));
        
        setOverlayPosition({ x, y });
        
        // Highlight the target element
        element.style.position = 'relative';
        element.style.zIndex = '9999';
        element.style.boxShadow = '0 0 0 4px rgba(139, 92, 246, 0.5), 0 0 0 8px rgba(139, 92, 246, 0.2)';
        element.style.borderRadius = '8px';
      }
    };

    // Try to find the target immediately
    findTarget();
    
    // If not found, try again after a short delay (for dynamic content)
    const timeout = setTimeout(findTarget, 100);
    
    return () => {
      clearTimeout(timeout);
      // Clean up highlighting
      if (targetElement) {
        targetElement.style.position = '';
        targetElement.style.zIndex = '';
        targetElement.style.boxShadow = '';
        targetElement.style.borderRadius = '';
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

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[10000] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        
        {/* Demo tooltip */}
        <motion.div
          className="absolute pointer-events-auto"
          style={{
            left: overlayPosition.x,
            top: overlayPosition.y,
            width: 350
          }}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Card className="bg-white/95 backdrop-blur-md border border-purple-200 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
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
                      className="text-xs"
                    >
                      <ArrowLeft className="h-3 w-3 mr-1" />
                      Back
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={skipStep}
                    className="text-xs text-gray-600"
                  >
                    <SkipForward className="h-3 w-3 mr-1" />
                    Skip
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={nextStep}
                    className="text-xs bg-purple-600 hover:bg-purple-700"
                  >
                    {isLastStep ? (
                      <>
                        <Play className="h-3 w-3 mr-1" />
                        Continue
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </>
                    )}
                  </Button>
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
