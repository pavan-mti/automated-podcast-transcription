import { useState, useEffect } from 'react';
import { Check, Loader2, FileAudio, MessageSquare, Layers, FileText } from 'lucide-react';

const steps = [
  { id: 1, label: 'Audio Uploaded', icon: FileAudio, description: 'File received and validated' },
  { id: 2, label: 'Speech-to-Text', icon: MessageSquare, description: 'Converting audio to text' },
  { id: 3, label: 'Topic Segmentation', icon: Layers, description: 'Identifying topics and segments' },
  { id: 4, label: 'Summarization', icon: FileText, description: 'Generating summaries and keywords' },
];

const ProcessingSteps = ({ currentStep = 1, onComplete }) => {
  const [animatedStep, setAnimatedStep] = useState(0);

  useEffect(() => {
    // Auto-advance steps for demonstration
    const timer = setInterval(() => {
      setAnimatedStep((prev) => {
        if (prev >= steps.length) {
          clearInterval(timer);
          if (onComplete) {
            setTimeout(onComplete, 1000);
          }
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [onComplete]);

  const getStepStatus = (stepId) => {
    if (stepId < animatedStep) return 'completed';
    if (stepId === animatedStep) return 'processing';
    return 'pending';
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Processing Your Podcast
        </h2>
        <p className="text-muted-foreground">
          This may take a few minutes depending on the file size
        </p>
      </div>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border">
          <div 
            className="w-full bg-primary transition-all duration-500 ease-out"
            style={{ height: `${((animatedStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step) => {
            const status = getStepStatus(step.id);
            const Icon = step.icon;

            return (
              <div 
                key={step.id}
                className={`relative flex items-start gap-6 transition-all duration-500 ${
                  status === 'pending' ? 'opacity-40' : 'opacity-100'
                }`}
              >
                {/* Step Circle */}
                <div 
                  className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-2xl border-2 transition-all duration-500 ${
                    status === 'completed' 
                      ? 'bg-success border-success' 
                      : status === 'processing' 
                        ? 'bg-primary/10 border-primary' 
                        : 'bg-card border-border'
                  }`}
                >
                  {status === 'completed' ? (
                    <Check className="h-7 w-7 text-success-foreground" />
                  ) : status === 'processing' ? (
                    <Loader2 className="h-7 w-7 text-primary animate-spin" />
                  ) : (
                    <Icon className="h-7 w-7 text-muted-foreground" />
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 pt-3">
                  <h3 className={`text-lg font-medium transition-colors ${
                    status === 'completed' 
                      ? 'text-success' 
                      : status === 'processing' 
                        ? 'text-foreground' 
                        : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.description}
                  </p>
                  
                  {status === 'processing' && (
                    <div className="mt-3 h-1.5 w-full max-w-xs bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full animate-progress-fill" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProcessingSteps;
