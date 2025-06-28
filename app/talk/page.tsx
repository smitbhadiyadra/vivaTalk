'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Video, 
  Heart, 
  BrainCircuit, 
  Users, 
  Sparkles,
  Play,
  Clock,
  Star
} from 'lucide-react';

const conversationTypes = [
  {
    id: 'therapy',
    title: 'AI Therapist',
    description: 'Professional therapeutic conversations for mental wellness',
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    duration: '30-45 min',
    rating: 4.9,
    category: 'Wellness'
  },
  {
    id: 'expert',
    title: 'Industry Expert',
    description: 'Get advice from AI experts in various professional fields',
    icon: BrainCircuit,
    color: 'from-blue-500 to-cyan-500',
    duration: '20-30 min',
    rating: 4.8,
    category: 'Professional'
  },
  {
    id: 'companion',
    title: 'Friendly Companion',
    description: 'Casual, supportive conversations with empathetic AI',
    icon: Users,
    color: 'from-green-500 to-emerald-500',
    duration: '15-60 min',
    rating: 4.9,
    category: 'Social'
  },
  {
    id: 'creative',
    title: 'Creative Collaborator',
    description: 'Brainstorm ideas and explore creative projects together',
    icon: Sparkles,
    color: 'from-purple-500 to-violet-500',
    duration: '20-40 min',
    rating: 4.7,
    category: 'Creative'
  }
];

export default function TalkPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  const handleStartConversation = (typeId: string) => {
    router.push(`/conversation/${typeId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
            Start Your Conversation
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the type of AI companion you'd like to talk with. Each conversation is tailored to your needs and powered by advanced AI with optional video chat.
          </p>
        </motion.div>

        {/* Conversation Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {conversationTypes.map((type, index) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm overflow-hidden group cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Icon */}
                      <motion.div
                        className="relative"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-r ${type.color} rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300`} />
                        <div className={`relative bg-gradient-to-r ${type.color} w-12 h-12 rounded-xl flex items-center justify-center`}>
                          <type.icon className="h-6 w-6 text-white" />
                        </div>
                      </motion.div>
                      
                      <div>
                        <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">
                          {type.title}
                        </CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {type.category}
                        </Badge>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{type.rating}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <CardDescription className="text-base mb-4 leading-relaxed">
                    {type.description}
                  </CardDescription>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between mb-6 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{type.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Video className="h-4 w-4" />
                      <span>Video Available</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      className={`w-full bg-gradient-to-r ${type.color} hover:opacity-90 transition-all duration-200 text-white`}
                      size="lg"
                      onClick={() => handleStartConversation(type.id)}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Start Conversation
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Start Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-0">
            <CardContent className="p-8">
              <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-4">New to VivaTalk?</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Each AI companion offers both text and video conversation options. Start with text chat and upgrade to video when you're ready for a more immersive experience.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="outline">Powered by Groq AI</Badge>
                <Badge variant="outline">Video by Tavus</Badge>
                <Badge variant="outline">Real-time Responses</Badge>
                <Badge variant="outline">Privacy Focused</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}