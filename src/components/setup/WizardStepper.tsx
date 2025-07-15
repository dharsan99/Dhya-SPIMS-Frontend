import React from 'react';

interface WizardStepperProps {
  steps: { label: string }[];
  currentStep: number;
}

const WizardStepper: React.FC<WizardStepperProps> = ({ steps, currentStep }) => {
  const progress = (currentStep) / (steps.length - 1);
  return (
    <div className="w-full sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="relative flex items-center justify-between px-4 py-6 max-w-full">
        {/* Progress Bar */}
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 dark:bg-gray-800 rounded-full -z-10" style={{transform: 'translateY(-50%)'}} />
        <div className="absolute left-0 top-1/2 h-1 bg-blue-500 rounded-full -z-10 transition-all duration-500" style={{width: `${progress * 100}%`, transform: 'translateY(-50%)'}} />
        {steps.map((step, idx) => (
          <div key={step.label} className="flex flex-col items-center flex-1 min-w-0">
            <div className={`w-9 h-9 flex items-center justify-center rounded-full border-2 transition-all duration-300
              ${idx < currentStep ? 'bg-blue-500 border-blue-500 text-white' :
                idx === currentStep ? 'bg-white dark:bg-gray-900 border-blue-500 text-blue-600 dark:text-blue-300 shadow-lg' :
                'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-400'}`}
            >
              {idx < currentStep ? (
                <span className="text-xl font-bold">✓</span>
              ) : (
                <span className="text-lg font-bold">{idx + 1}</span>
              )}
            </div>
            <span className={`mt-2 text-xs font-medium text-center truncate max-w-[80px] transition-colors duration-300
              ${idx === currentStep ? 'text-blue-600 dark:text-blue-300' : 'text-gray-400'}`}>{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WizardStepper; 