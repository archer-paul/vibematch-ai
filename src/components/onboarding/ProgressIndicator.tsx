import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: boolean[];
  stepTitles: string[];
}

export function ProgressIndicator({ 
  currentStep, 
  totalSteps, 
  completedSteps, 
  stepTitles 
}: ProgressIndicatorProps) {
  return (
    <div className="w-full mb-8">
      {/* Progress Bar */}
      <div className="relative mb-6">
        <div className="h-2 bg-muted rounded-full">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-center">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = completedSteps[index];
          const isCurrent = stepNumber === currentStep;
          const isPast = stepNumber < currentStep;

          return (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                  {
                    "bg-primary text-primary-foreground": isCurrent,
                    "bg-green-500 text-white": isCompleted || isPast,
                    "bg-muted text-muted-foreground": !isCurrent && !isCompleted && !isPast
                  }
                )}
              >
                {isCompleted || isPast ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  stepNumber
                )}
              </div>
              <span className={cn(
                "text-xs font-medium text-center max-w-20",
                {
                  "text-primary": isCurrent,
                  "text-green-600": isCompleted || isPast,
                  "text-muted-foreground": !isCurrent && !isCompleted && !isPast
                }
              )}>
                {stepTitles[index]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}