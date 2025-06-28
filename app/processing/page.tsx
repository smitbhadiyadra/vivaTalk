'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  MessageCircle, 
  Video, 
  CheckCircle, 
  AlertCircle,
  Heart,
  BrainCircuit,
  Users,
  Sparkles
} from 'lucide-react';

const typeIcons = {
  therapy: Heart,
  expert: BrainCircuit,
  companion: Users,
  creative: Sparkles,
};

const typeColors = {
  therapy: 'from-pink-500 to-rose-500',
  expert: 'from-blue-500 to-cyan-500',
  companion: 'from-green-500 to-emerald-500',
  creative: 'from-purple-500 to-violet-500',
};

const processingSteps = [
  { id: 1, text: 'Initializing AI assistant...', duration: 2000 },
  { id: 2, text: 'Generating conversation context...', duration: 3000 },
  { id: 3, text: 'Setting up video capabilities...', duration: 2500 },
  { id: 4, text: 'Preparing your experience...', duration: 1500 },
];

export default function ProcessingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationType = searchParams.get('type') || 'companion';
  const mode = searchParams.get('mode') || 'chat'; // 'chat' or 'video'
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const Icon = typeIcons[conversationType as keyof typeof typeIcons] || MessageCircle;
  const colorClass = typeColors[conversationType as keyof typeof typeColors] || 'from-primary to-secondary';

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const processSteps = async () => {
      try {
        for (let i = 0; i < processingSteps.length; i++) {
          setCurrentStep(i);
          await new Promise(resolve => {
            timeoutId = setTimeout(resolve, processingSteps[i].duration);
          });
        }
        
        setIsComplete(true);
        
        // Redirect after completion
        setTimeout(() => {
          if (mode === 'video') {
            router.push(`/conversation/${conversationType}?autoVideo=true`);
          } else {
            router.push(`/conversation/${conversationType}`);
          }
        }, 1000);
        
      } catch (err) {
        setError('Failed to initialize conversation. Please try again.');
      }
    };

    processSteps();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [conversationType, mode, router]);

  const handleRetry = () => {
    setError(null);
    setCurrentStep(0);
    setIsComplete(false);
    router.push(`/processing?type=${conversationType}&mode=${mode}`);
  };

  const handleGoBack = () => {
    router.push('/talk');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          <Card className="text-center bg-card/80 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="flex justify-center mb-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur-lg opacity-30" />
                  <div className="relative bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-full">
                    <AlertCircle className="h-8 w-8 text-white" />
                  </div>
                </div>
              </motion.div>
              
              <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
              <p className="text-muted-foreground mb-6">{error}</p>
              
              <div className="space-y-3">
                <Button onClick={handleRetry} className="w-full">
                  Try Again
                </Button>
                <Button variant="outline" onClick={handleGoBack} className="w-full">
                  Back to Talk Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <Card className="text-center bg-card/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-8">
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex justify-center mb-6"
            >
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${colorClass} rounded-full blur-lg opacity-30 animate-pulse`} />
                <div className={`relative bg-gradient-to-r ${colorClass} p-4 rounded-full`}>
                  {isComplete ? (
                    <CheckCircle className="h-10 w-10 text-white" />
                  ) : mode === 'video' ? (
                    <Video className="h-10 w-10 text-white" />
                  ) : (
                    <Icon className="h-10 w-10 text-white" />
                  )}
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <h1 className="text-2xl font-bold mb-2">
              {isComplete ? 'Ready!' : 'Setting up your conversation'}
            </h1>
            
            <p className="text-muted-foreground mb-8">
              {isComplete 
                ? 'Redirecting you to your conversation...' 
                : mode === 'video' 
                  ? 'Preparing your video conversation experience'
                  : 'Getting everything ready for you'
              }
            </p>

            {/* Progress Steps */}
            <div className="space-y-4">
              {processingSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: index <= currentStep ? 1 : 0.3,
                    x: 0 
                  }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    index < currentStep 
                      ? 'bg-green-500' 
                      : index === currentStep 
                        ? `bg-gradient-to-r ${colorClass}` 
                        : 'bg-muted'
                  }`}>
                    {index < currentStep ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : index === currentStep ? (
                      <Loader2 className="h-4 w-4 text-white animate-spin" />
                    ) : (
                      <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                    )}
                  </div>
                  <span className={`text-sm ${
                    index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="mt-8">
              <div className="w-full bg-muted rounded-full h-2">
                <motion.div
                  className={`bg-gradient-to-r ${colorClass} h-2 rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ 
                    width: isComplete 
                      ? '100%' 
                      : `${((currentStep + 1) / processingSteps.length) * 100}%` 
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {isComplete 
                  ? 'Complete!' 
                  : `Step ${currentStep + 1} of ${processingSteps.length}`
                }
              </div>
            </div>

            {/* Cancel Button */}
            {!isComplete && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="mt-6"
              >
                <Button variant="outline" onClick={handleGoBack} size="sm">
                  Cancel
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}