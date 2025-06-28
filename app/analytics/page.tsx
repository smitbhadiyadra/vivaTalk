'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  MessageCircle, 
  Clock, 
  Calendar,
  Heart,
  Brain,
  Smile,
  Target,
  Award,
  Zap
} from 'lucide-react';

// Mock data
const weeklyData = [
  { day: 'Mon', conversations: 2, duration: 45 },
  { day: 'Tue', conversations: 1, duration: 30 },
  { day: 'Wed', conversations: 3, duration: 75 },
  { day: 'Thu', conversations: 2, duration: 50 },
  { day: 'Fri', conversations: 1, duration: 25 },
  { day: 'Sat', conversations: 0, duration: 0 },
  { day: 'Sun', conversations: 2, duration: 60 },
];

const conversationTypes = [
  { name: 'Therapy', value: 45, color: '#ec4899' },
  { name: 'Expert', value: 30, color: '#3b82f6' },
  { name: 'Creative', value: 15, color: '#8b5cf6' },
  { name: 'Companion', value: 10, color: '#10b981' },
];

const moodTrends = [
  { week: 'Week 1', positive: 65, neutral: 25, negative: 10 },
  { week: 'Week 2', positive: 70, neutral: 20, negative: 10 },
  { week: 'Week 3', positive: 75, neutral: 18, negative: 7 },
  { week: 'Week 4', positive: 80, neutral: 15, negative: 5 },
];

const achievements = [
  {
    title: 'First Conversation',
    description: 'Completed your first AI conversation',
    icon: MessageCircle,
    unlocked: true,
    date: '2024-01-05'
  },
  {
    title: 'Deep Thinker',
    description: 'Had 5 therapy sessions',
    icon: Brain,
    unlocked: true,
    date: '2024-01-12'
  },
  {
    title: 'Consistent Communicator',
    description: 'Talked for 7 days straight',
    icon: Calendar,
    unlocked: false,
    progress: 60
  },
  {
    title: 'Positive Vibes',
    description: 'Maintained positive mood for a week',
    icon: Smile,
    unlocked: true,
    date: '2024-01-10'
  }
];

export default function AnalyticsPage() {
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
            Your Analytics
          </h1>
          <p className="text-xl text-muted-foreground">
            Insights into your conversation patterns and emotional growth
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <Card className="text-center bg-card/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-lg opacity-30" />
                <div className="relative bg-gradient-to-r from-primary to-secondary w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">24</div>
              <div className="text-sm text-muted-foreground">Total Conversations</div>
              <div className="text-xs text-green-600 mt-1">+3 this week</div>
            </CardContent>
          </Card>

          <Card className="text-center bg-card/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary to-accent rounded-full blur-lg opacity-30" />
                <div className="relative bg-gradient-to-r from-secondary to-accent w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">12.5h</div>
              <div className="text-sm text-muted-foreground">Total Time</div>
              <div className="text-xs text-green-600 mt-1">+2.5h this week</div>
            </CardContent>
          </Card>

          <Card className="text-center bg-card/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary rounded-full blur-lg opacity-30" />
                <div className="relative bg-gradient-to-r from-accent to-primary w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">78%</div>
              <div className="text-sm text-muted-foreground">Mood Improvement</div>
              <div className="text-xs text-green-600 mt-1">+5% vs last month</div>
            </CardContent>
          </Card>

          <Card className="text-center bg-card/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full blur-lg opacity-30" />
                <div className="relative bg-gradient-to-r from-pink-500 to-rose-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">4</div>
              <div className="text-sm text-muted-foreground">Goals Achieved</div>
              <div className="text-xs text-green-600 mt-1">2 in progress</div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Weekly Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Your conversation frequency and duration</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="conversations" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Conversation Types */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Conversation Types</CardTitle>
                <CardDescription>Distribution of your AI interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={conversationTypes}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {conversationTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Mood Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Mood Trends</CardTitle>
              <CardDescription>Track your emotional journey over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={moodTrends}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="positive" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.8} />
                  <Area type="monotone" dataKey="neutral" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.8} />
                  <Area type="monotone" dataKey="negative" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.8} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Your milestones and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      achievement.unlocked 
                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                        : 'border-muted bg-muted/20'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${
                        achievement.unlocked 
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <achievement.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold">{achievement.title}</h3>
                          {achievement.unlocked && (
                            <Award className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {achievement.description}
                        </p>
                        {achievement.unlocked ? (
                          <div className="text-xs text-green-600">
                            Unlocked on {new Date(achievement.date!).toLocaleDateString()}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>{achievement.progress}%</span>
                            </div>
                            <Progress value={achievement.progress} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}