'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  UserCheck, 
  BrainCircuit, 
  Smile, 
  BookOpen, 
  Shield,
  Zap,
  Users
} from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: "Friendly Design",
    description: "Warm, approachable interface designed to make you feel comfortable and welcomed.",
    gradient: "from-pink-500 to-rose-500"
  },
  {
    icon: UserCheck,
    title: "AI Therapist",
    description: "Professional-grade therapeutic conversations with AI trained in counseling techniques.",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    icon: BrainCircuit,
    title: "Expert Advisors",
    description: "Access industry experts across various fields for professional guidance and insights.",
    gradient: "from-purple-500 to-violet-500"
  },
  {
    icon: Smile,
    title: "Emotion-Based Responses",
    description: "AI that understands and responds to your emotional state with appropriate guidance.",
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    icon: BookOpen,
    title: "Personal Memory Journal",
    description: "Automatic conversation summaries and insights stored in your private journal.",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "End-to-end encryption ensures your conversations remain completely confidential.",
    gradient: "from-gray-600 to-gray-800"
  },
  {
    icon: Zap,
    title: "Real-time Processing",
    description: "Lightning-fast AI responses powered by Groq's advanced language models.",
    gradient: "from-indigo-500 to-purple-500"
  },
  {
    icon: Users,
    title: "Multiple Personas",
    description: "Choose from various AI personalities tailored to different conversation styles.",
    gradient: "from-teal-500 to-cyan-500"
  }
];

export function Features() {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Features We Offer
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the powerful capabilities that make VivaTalk your perfect AI conversation partner
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-card to-muted/20 overflow-hidden">
                <CardContent className="p-6">
                  {/* Icon with animated background */}
                  <motion.div
                    className="relative mb-4"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
                    <div className={`relative bg-gradient-to-r ${feature.gradient} w-14 h-14 rounded-2xl flex items-center justify-center`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}