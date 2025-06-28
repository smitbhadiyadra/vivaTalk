'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, ArrowRight } from 'lucide-react';

export default function ConversationRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to talk page after a short delay
    const timer = setTimeout(() => {
      router.push('/talk');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

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
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-lg opacity-30 animate-pulse" />
                <div className="relative bg-gradient-to-r from-primary to-secondary p-3 rounded-full">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            </motion.div>
            
            <h1 className="text-2xl font-bold mb-4">Choose Your Conversation</h1>
            <p className="text-muted-foreground mb-6">
              Redirecting you to select a conversation type...
            </p>
            
            <Button 
              onClick={() => router.push('/talk')}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              Go to Conversations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}