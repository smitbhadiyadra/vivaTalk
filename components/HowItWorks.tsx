'use client';

import { motion } from 'framer-motion';
import { MessageCircleQuestion, Brain, Video } from 'lucide-react';

const steps = [
  {
    icon: MessageCircleQuestion,
    title: "Enter a Topic",
    description: "Share what's on your mind or choose from our suggested conversation starters."
  },
  {
    icon: Brain,
    title: "AI Understands Intent",
    description: "Groq's advanced AI analyzes your input to understand context and emotional needs."
  },
  {
    icon: Video,
    title: "Video Conversation",
    description: "Tavus creates a realistic video conversation tailored to your specific needs."
  }
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Three simple steps to start your AI-powered conversation journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold z-10">
                {index + 1}
              </div>

              {/* Card */}
              <motion.div 
                className="bg-card border border-border rounded-2xl p-8 text-center h-full hover:shadow-lg transition-all duration-300"
                whileHover={{ 
                  y: -5,
                  scale: 1.02
                }}
              >
                {/* Icon */}
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl mb-6"
                  whileHover={{ 
                    rotate: 360,
                    scale: 1.1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <step.icon className="h-8 w-8 text-primary" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </motion.div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-0.5 bg-gradient-to-r from-primary/50 to-secondary/50 transform -translate-y-1/2" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}