'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  MessageCircle, 
  Clock, 
  Calendar,
  Heart,
  Brain,
  Smile,
  TrendingUp,
  Filter,
  Search
} from 'lucide-react';

// Mock journal entries
const journalEntries = [
  {
    id: '1',
    title: 'Conversation with AI Therapist',
    summary: 'Discussed work-life balance and stress management techniques. Learned about mindfulness practices.',
    type: 'therapy',
    date: '2024-01-15T10:30:00Z',
    duration: '32 minutes',
    mood: 'reflective',
    insights: ['Mindfulness helps reduce anxiety', 'Setting boundaries is important'],
    tags: ['stress', 'work-life-balance', 'mindfulness']
  },
  {
    id: '2',
    title: 'Career Guidance Session',
    summary: 'Explored career transition opportunities and discussed skill development strategies.',
    type: 'expert',
    date: '2024-01-12T14:15:00Z',
    duration: '28 minutes',
    mood: 'motivated',
    insights: ['Focus on transferable skills', 'Networking is crucial for career growth'],
    tags: ['career', 'skills', 'growth']
  },
  {
    id: '3',
    title: 'Creative Brainstorm',
    summary: 'Generated ideas for personal creative project and explored different artistic approaches.',
    type: 'creative',
    date: '2024-01-10T16:45:00Z',
    duration: '25 minutes',
    mood: 'inspired',
    insights: ['Embrace experimentation', 'Constraints can boost creativity'],
    tags: ['creativity', 'art', 'brainstorming']
  }
];

const typeConfig = {
  therapy: {
    icon: Heart,
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-100 dark:bg-pink-900/20',
    textColor: 'text-pink-700 dark:text-pink-300'
  },
  expert: {
    icon: Brain,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    textColor: 'text-blue-700 dark:text-blue-300'
  },
  creative: {
    icon: MessageCircle,
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    textColor: 'text-purple-700 dark:text-purple-300'
  }
};

const moodEmojis = {
  reflective: '🤔',
  motivated: '💪',
  inspired: '✨',
  happy: '😊',
  calm: '😌'
};

export default function JournalPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

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
            Your Journal
          </h1>
          <p className="text-xl text-muted-foreground">
            Insights and memories from your AI conversations
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <Card className="text-center bg-card/80 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">Total Entries</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-card/80 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <Clock className="h-8 w-8 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold">8.5h</div>
              <div className="text-sm text-muted-foreground">Total Time</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-card/80 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <TrendingUp className="h-8 w-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold">24</div>
              <div className="text-sm text-muted-foreground">Insights</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-card/80 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <Smile className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">85%</div>
              <div className="text-sm text-muted-foreground">Positive Mood</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <Button variant="outline" className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>Search entries</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filter by type</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Date range</span>
          </Button>
        </motion.div>

        {/* Journal Entries */}
        <div className="space-y-6">
          {journalEntries.map((entry, index) => {
            const config = typeConfig[entry.type as keyof typeof typeConfig];
            const Icon = config.icon;
            
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`relative`}>
                          <div className={`absolute inset-0 bg-gradient-to-r ${config.color} rounded-lg blur-lg opacity-30`} />
                          <div className={`relative bg-gradient-to-r ${config.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{entry.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(entry.date).toLocaleDateString()}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{entry.duration}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <span>{moodEmojis[entry.mood as keyof typeof moodEmojis]}</span>
                              <span className="capitalize">{entry.mood}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className={config.textColor}>
                        {entry.type}
                      </Badge>
                    </div>

                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {entry.summary}
                    </p>

                    {/* Insights */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Key Insights:</h4>
                      <ul className="space-y-1">
                        {entry.insights.map((insight, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start space-x-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Empty State or Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <Button variant="outline" size="lg">
            Load More Entries
          </Button>
        </motion.div>
      </div>
    </div>
  );
}