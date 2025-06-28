'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TypewriterText } from '@/components/TypewriterText';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { MessageCircle, Sparkles, Video } from 'lucide-react';

export function Hero() {
  const { user } = useAuth();

  const typewriterTexts = [
    "Hi, I'm Echo...",
    "Here to listen, guide, and reflect.",
    "Let's talk about anything you want.",
    "Your AI companion awaits."
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      
      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 text-primary/20"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0] 
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      >
        <MessageCircle size={60} />
      </motion.div>
      
      <motion.div
        className="absolute top-40 right-20 text-secondary/20"
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -5, 0] 
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1 
        }}
      >
        <Video size={40} />
      </motion.div>
      
      <motion.div
        className="absolute bottom-40 left-20 text-accent/20"
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 10, 0] 
        }}
        transition={{ 
          duration: 7, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2 
        }}
      >
        <Sparkles size={35} />
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Logo Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              delay: 0.5 
            }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-xl opacity-30 animate-pulse-soft" />
              <div className="relative bg-gradient-to-r from-primary to-secondary p-6 rounded-full">
                <MessageCircle className="h-16 w-16 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Main Heading with Typewriter */}
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <div className="mb-4">Welcome to VivaTalk</div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-medium text-foreground/80 h-16 flex items-center justify-center">
              <TypewriterText texts={typewriterTexts} />
            </div>
          </motion.h1>

          {/* Description */}
          <motion.p 
            className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            Experience AI-powered video conversations with industry experts and friendly companions. 
            Share your thoughts, get guidance, and explore ideas through realistic video interactions.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            {user ? (
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transform hover:scale-105 transition-all duration-200 shadow-lg"
                asChild
              >
                <Link href="/talk">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Start Talking
                </Link>
              </Button>
            ) : (
              <>
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  asChild
                >
                  <Link href="/auth?mode=signup">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Start Talking
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6 rounded-full border-2 hover:bg-muted transform hover:scale-105 transition-all duration-200"
                  asChild
                >
                  <Link href="#features">
                    Learn More
                  </Link>
                </Button>
              </>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10k+</div>
              <div className="text-muted-foreground">Conversations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-secondary mb-2">50+</div>
              <div className="text-muted-foreground">AI Experts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">24/7</div>
              <div className="text-muted-foreground">Available</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}