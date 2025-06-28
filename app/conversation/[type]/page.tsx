'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Send, 
  ArrowLeft, 
  Loader2,
  Heart,
  BrainCircuit,
  Users,
  Sparkles,
  Mic,
  MicOff,
  Video,
  VideoOff,
  ExternalLink,
  Zap,
  Rocket
} from 'lucide-react';
import { conversationTypes } from '@/lib/groq';
import { getVideoErrorMessage } from '@/lib/tavus';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface VideoConversation {
  conversation_id: string;
  conversation_url: string;
  conversation_name: string;
  replica_name?: string;
  status: string;
  intro: string;
}

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

export default function ConversationPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const conversationType = params.type as string;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [videoConversation, setVideoConversation] = useState<VideoConversation | null>(null);
  const [showVideoOption, setShowVideoOption] = useState(true);
  const [isCreatingVideo, setIsCreatingVideo] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    // Validate conversation type
    if (!conversationType || !conversationTypes[conversationType]) {
      console.error('Invalid conversation type:', conversationType);
      router.push('/talk');
      return;
    }
    
    initializeConversation();
  }, [conversationType, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = (error: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', error);
        setIsListening(false);
        toast.error('Speech recognition failed. Please try again.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeConversation = async () => {
    setIsInitializing(true);
    console.log('🚀 Initializing conversation for type:', conversationType);
    
    try {
      const response = await fetch('/api/conversation/intro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversationType }),
      });

      console.log('📡 Intro API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Intro API error:', errorData);
        throw new Error(`Failed to initialize conversation: ${response.status}`);
      }

      const { intro } = await response.json();
      console.log('✅ Groq intro received:', intro);
      
      const welcomeMessage: Message = {
        id: '1',
        role: 'assistant',
        content: intro,
        timestamp: new Date(),
      };

      setMessages([welcomeMessage]);
      console.log('💬 Welcome message set');
    } catch (error) {
      console.error('❌ Error initializing conversation:', error);
      toast.error('Failed to initialize conversation');
      
      // Enhanced fallback message based on conversation type
      const fallbackMessages = {
        therapy: "Hello, I'm here to provide a safe, supportive space for our conversation. While I'm experiencing some technical difficulties, I'm still ready to listen and help. How are you feeling today?",
        expert: "Welcome! I'm your AI expert advisor, ready to provide professional guidance. Despite some technical issues, I'm here to help with your questions. What would you like to discuss?",
        companion: "Hi there! I'm so glad you're here to chat with me. Even though I'm having some technical hiccups, I'm excited to talk with you. What's on your mind?",
        creative: "Hey creative soul! I'm thrilled to collaborate with you on creative projects. While I'm experiencing some technical difficulties, my creative energy is flowing. What shall we create together?"
      };
      
      const fallbackMessage: Message = {
        id: '1',
        role: 'assistant',
        content: fallbackMessages[conversationType as keyof typeof fallbackMessages] || `Welcome! I'm your ${conversationTypes[conversationType]?.title || 'AI assistant'}. How can I help you today?`,
        timestamp: new Date(),
      };
      setMessages([fallbackMessage]);
    } finally {
      setIsInitializing(false);
    }
  };

  const createVideoConversation = async () => {
    setIsCreatingVideo(true);
    console.log('🎥 Creating video conversation for type:', conversationType);
    
    try {
      const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
      console.log('👤 User name for video:', userName);

      const response = await fetch('/api/conversation/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          conversationType,
          userName
        }),
      });

      console.log('📡 Video API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Video API error:', errorData);
        throw new Error(errorData.details || errorData.error || `Failed to create video conversation: ${response.status}`);
      }

      const videoData = await response.json();
      console.log('✅ Tavus video data received:', videoData);
      
      setVideoConversation(videoData);
      setShowVideoOption(false);
      
      toast.success('Video conversation created! Click the link to join.');
      
      // Auto-redirect to video call after a short delay
      setTimeout(() => {
        if (videoData.conversation_url) {
          window.open(videoData.conversation_url, '_blank', 'noopener,noreferrer');
        }
      }, 1500);
      
    } catch (error: any) {
      console.error('❌ Error creating video conversation:', error);
      const errorMessage = getVideoErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setIsCreatingVideo(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    console.log('📤 Sending message:', inputMessage.trim());

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const conversationMessages = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      console.log('💭 Conversation context:', conversationMessages.length, 'messages');
      console.log('🔄 Sending to Groq API with messages:', conversationMessages);

      const response = await fetch('/api/conversation/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: conversationMessages,
          conversationType,
        }),
      });

      console.log('📡 Chat API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Chat API error:', errorData);
        throw new Error(errorData.details || errorData.error || `Failed to get AI response: ${response.status}`);
      }

      const { response: aiResponse } = await response.json();
      console.log('✅ AI response received:', aiResponse.substring(0, 100) + '...');
      
      if (!aiResponse || aiResponse.trim().length === 0) {
        throw new Error('Empty response from AI');
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('❌ Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
      
      // Enhanced error message based on conversation type
      const errorMessages = {
        therapy: "I apologize for the technical difficulty. Your feelings and thoughts are important to me. Please try sending your message again, and I'll do my best to provide the support you need.",
        expert: "I'm experiencing some technical issues, but I'm committed to helping you. Please try again, and I'll provide the professional guidance you're looking for.",
        companion: "Oops! I'm having a little technical hiccup. Don't worry though - I'm still here for you! Please try sending your message again.",
        creative: "My creative circuits are having a moment! Please try again - I'm excited to continue our creative collaboration."
      };
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMessages[conversationType as keyof typeof errorMessages] || 'I apologize, but I\'m having trouble responding right now. Please try again in a moment.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Speech recognition start error:', error);
        toast.error('Failed to start speech recognition');
      }
    }
  };

  if (loading || isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-lg font-medium">
              {loading ? 'Loading...' : 'Preparing your conversation...'}
            </span>
          </div>
          <p className="text-muted-foreground">
            {isInitializing ? 'Setting up AI assistant...' : 'Please wait'}
          </p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const currentType = conversationTypes[conversationType];
  if (!currentType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Conversation Type</h1>
          <Button onClick={() => router.push('/talk')}>
            Back to Talk Page
          </Button>
        </div>
      </div>
    );
  }

  const Icon = typeIcons[conversationType as keyof typeof typeIcons];
  const colorClass = typeColors[conversationType as keyof typeof typeColors];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/talk')}
                className="hover:bg-muted"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${colorClass} rounded-xl blur-lg opacity-30`} />
                  <div className={`relative bg-gradient-to-r ${colorClass} w-12 h-12 rounded-xl flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{currentType.title}</h1>
                  <p className="text-muted-foreground">{currentType.description}</p>
                </div>
              </div>
            </div>

            {/* Enhanced Video Conversation Option */}
            {showVideoOption && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={createVideoConversation}
                    disabled={isCreatingVideo}
                    className={`bg-gradient-to-r ${colorClass} hover:opacity-90 text-white relative overflow-hidden group`}
                    size="lg"
                  >
                    <AnimatePresence mode="wait">
                      {isCreatingVideo ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center"
                        >
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Video...
                        </motion.div>
                      ) : (
                        <motion.div
                          key="default"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center"
                        >
                          <Video className="mr-2 h-4 w-4" />
                          Start Video Chat
                          <Rocket className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Animated background effect */}
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </motion.div>

          {/* Enhanced Video Conversation Link */}
          {videoConversation && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
              className="mt-4"
            >
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800 overflow-hidden relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-emerald-400/10"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <motion.div
                        className="bg-green-100 dark:bg-green-900/50 p-3 rounded-xl"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Video className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-green-800 dark:text-green-200 text-lg">
                          🎉 Video Conversation Ready!
                        </h3>
                        <p className="text-sm text-green-600 dark:text-green-300">
                          {videoConversation.replica_name ? `Chat with ${videoConversation.replica_name}` : videoConversation.conversation_name}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        asChild
                        className="bg-green-600 hover:bg-green-700 text-white relative overflow-hidden group"
                        size="lg"
                      >
                        <a 
                          href={videoConversation.conversation_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Join Video Call
                          <Zap className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                          
                          {/* Shine effect */}
                          <motion.div
                            className="absolute inset-0 bg-white/20"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '100%' }}
                            transition={{ duration: 0.6 }}
                          />
                        </a>
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Chat Container - Flexible height that fills remaining space */}
      <div className="flex-1 flex flex-col min-h-0 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex-1 flex flex-col min-h-0 max-w-4xl mx-auto w-full"
        >
          <Card className="flex-1 flex flex-col min-h-0 bg-card/80 backdrop-blur-sm border-0 shadow-xl">
            {/* Messages - Scrollable area with flexible height */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <CardContent 
                ref={messagesContainerRef}
                className="h-full overflow-y-auto p-6 space-y-4 scroll-smooth"
              >
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start space-x-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          {message.role === 'user' ? (
                            <AvatarImage src={user.user_metadata?.avatar_url} />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-r ${colorClass} flex items-center justify-center`}>
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                          )}
                          <AvatarFallback>
                            {message.role === 'user' 
                              ? user.email?.charAt(0).toUpperCase() 
                              : <Icon className="h-4 w-4" />
                            }
                          </AvatarFallback>
                        </Avatar>
                        
                        <motion.div 
                          className={`rounded-2xl px-4 py-3 ${
                            message.role === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {message.content}
                          </p>
                          <div className="text-xs opacity-70 mt-2">
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start space-x-3 max-w-[80%]">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <div className={`w-full h-full bg-gradient-to-r ${colorClass} flex items-center justify-center`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                      </Avatar>
                      <div className="bg-muted rounded-2xl px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Loader2 className="h-4 w-4" />
                          </motion.div>
                          <span className="text-sm">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </CardContent>
            </div>

            {/* Enhanced Input - Fixed at bottom */}
            <div className="flex-shrink-0 border-t border-border p-4">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="pr-12"
                  />
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={toggleSpeechRecognition}
                      className={`absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 ${
                        isListening ? 'text-red-500 animate-pulse' : 'text-muted-foreground'
                      }`}
                      disabled={isLoading}
                    >
                      {isListening ? (
                        <MicOff className="h-4 w-4" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </Button>
                  </motion.div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className={`bg-gradient-to-r ${colorClass} hover:opacity-90 relative overflow-hidden group`}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Loader2 className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <>
                        <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        {/* Shine effect */}
                        <motion.div
                          className="absolute inset-0 bg-white/20"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}