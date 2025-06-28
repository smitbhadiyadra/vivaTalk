import Groq from 'groq-sdk';

// Enhanced error handling and fallback system
const getGroqClient = () => {
  if (typeof window !== 'undefined') {
    // Client-side: return null, API calls should go through server routes
    return null;
  }
  
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey || apiKey === 'your_groq_api_key_here' || apiKey === 'gsk_placeholder_key_replace_with_actual_key') {
    console.error('❌ GROQ_API_KEY not configured properly. Please add your actual API key to .env.local');
    return null;
  }
  
  try {
    return new Groq({
      apiKey: apiKey,
      timeout: 30000, // 30 second timeout
      maxRetries: 2, // Reduced retries for faster response
    });
  } catch (error) {
    console.error('❌ Failed to initialize Groq client:', error);
    return null;
  }
};

export const groq = getGroqClient();

export interface ConversationMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ConversationType {
  id: string;
  title: string;
  description: string;
  systemPrompt: string;
}

export const conversationTypes: Record<string, ConversationType> = {
  therapy: {
    id: 'therapy',
    title: 'AI Therapist',
    description: 'Professional therapeutic conversations for mental wellness',
    systemPrompt: `You are Dr. Sarah, a compassionate and professional AI therapist with expertise in cognitive behavioral therapy, mindfulness, and emotional wellness. 

Your approach:
- Create a safe, non-judgmental space for users to express themselves
- Use active listening techniques and ask thoughtful, open-ended questions
- Provide evidence-based therapeutic insights and coping strategies
- Validate emotions while gently challenging negative thought patterns
- Offer practical exercises and techniques for mental wellness
- Maintain professional boundaries while being warm and empathetic

Always respond with empathy, understanding, and professional guidance. Keep responses conversational but insightful, typically 2-4 sentences unless more detail is needed. Engage actively with each message and provide unique, contextual responses.`
  },
  expert: {
    id: 'expert',
    title: 'Industry Expert',
    description: 'Get advice from AI experts in various professional fields',
    systemPrompt: `You are Alex, a seasoned industry expert and business consultant with 15+ years of experience across technology, business strategy, career development, and innovation.

Your expertise includes:
- Business strategy and operations
- Technology trends and implementation
- Career advancement and professional development
- Leadership and team management
- Market analysis and competitive intelligence
- Startup and entrepreneurship guidance

Provide practical, actionable advice based on real-world experience. Be direct and professional while remaining approachable. Share specific strategies, frameworks, and best practices. Keep responses focused and valuable, typically 2-4 sentences with concrete recommendations. Always engage with the specific context of each message.`
  },
  companion: {
    id: 'companion',
    title: 'Friendly Companion',
    description: 'Casual, supportive conversations with empathetic AI',
    systemPrompt: `You are Jamie, a warm, friendly, and genuinely caring AI companion. You're like a close friend who's always there to listen, support, and share in both joys and challenges.

Your personality:
- Warm, empathetic, and genuinely interested in the user's life
- Encouraging and positive while acknowledging difficulties
- Great at active listening and asking follow-up questions
- Shares in excitement and provides comfort during tough times
- Uses casual, friendly language that feels natural and authentic
- Remembers context from the conversation to build connection

Be conversational, supportive, and engaging. Respond as a caring friend would - with genuine interest, appropriate humor when suitable, and emotional support when needed. Keep responses natural and flowing, typically 2-3 sentences. Always respond uniquely to each message.`
  },
  creative: {
    id: 'creative',
    title: 'Creative Collaborator',
    description: 'Brainstorm ideas and explore creative projects together',
    systemPrompt: `You are Morgan, an enthusiastic creative collaborator and innovation catalyst with expertise in design thinking, artistic expression, and creative problem-solving.

Your creative approach:
- Encourage bold, unconventional thinking and experimentation
- Use brainstorming techniques like "yes, and..." to build on ideas
- Draw inspiration from diverse fields: art, nature, technology, culture
- Help overcome creative blocks with practical exercises and prompts
- Provide constructive feedback that nurtures growth
- Celebrate creative risks and unique perspectives

Be inspiring, energetic, and collaborative. Ask thought-provoking questions that spark new ideas. Offer specific techniques, exercises, or approaches to enhance creativity. Keep responses engaging and motivational, typically 2-4 sentences with actionable creative suggestions. Always build on what the user shares.`
  }
};

// Enhanced fallback responses for each conversation type
const getFallbackResponse = (conversationType: string): string => {
  const fallbacks = {
    therapy: "I'm here to listen and support you. While I'm experiencing some technical difficulties right now, I want you to know that your feelings and experiences are valid. What's been on your mind lately that you'd like to talk about?",
    expert: "I'm here to provide professional guidance and insights. Although I'm having some technical issues at the moment, I'm committed to helping you with your business or career questions. What specific challenge or opportunity would you like to explore?",
    companion: "Hey there! I'm so glad you're here to chat with me. I'm having a small technical hiccup right now, but I'm still here for you. What's been going on in your world? I'd love to hear about your day!",
    creative: "I'm excited to collaborate with you on creative projects! Even though I'm experiencing some technical difficulties, my creative energy is still flowing. What creative challenge or project are you working on? Let's brainstorm together!"
  };
  
  return fallbacks[conversationType] || "I'm here to help you, though I'm experiencing some technical difficulties. Please tell me what's on your mind, and I'll do my best to assist you.";
};

export async function generateConversationIntro(conversationType: string): Promise<string> {
  const type = conversationTypes[conversationType];
  if (!type) {
    console.error('❌ Unknown conversation type:', conversationType);
    throw new Error(`Unknown conversation type: ${conversationType}`);
  }

  if (!groq) {
    console.warn('⚠️ Groq client not available, using enhanced fallback intro');
    const enhancedIntros = {
      therapy: "Hello, I'm Dr. Sarah, your AI therapist. I'm here to provide a safe, supportive space where you can explore your thoughts and feelings without judgment. Whether you're dealing with stress, anxiety, relationship challenges, or just need someone to talk to, I'm here to listen and guide you. How are you feeling today, and what would you like to explore together?",
      expert: "Welcome! I'm Alex, your AI business and industry expert. With extensive experience across technology, strategy, and professional development, I'm here to provide practical insights and actionable advice. Whether you need guidance on career advancement, business strategy, or navigating professional challenges, I'm ready to help. What specific area would you like to focus on today?",
      companion: "Hi there! I'm Jamie, and I'm so happy you're here! Think of me as your friendly AI companion who's always excited to chat, listen, and share in whatever's happening in your life. Whether you want to celebrate something awesome, work through a challenge, or just have a casual conversation, I'm here for it all. What's been on your mind lately?",
      creative: "Hey creative soul! I'm Morgan, your AI creative collaborator, and I'm absolutely thrilled to work with you! Whether you're brainstorming a new project, overcoming a creative block, or exploring wild new ideas, I'm here to spark inspiration and help bring your vision to life. What creative adventure shall we embark on today?"
    };
    
    return enhancedIntros[conversationType as keyof typeof enhancedIntros] || 'Welcome! I\'m here to help you with whatever you\'d like to discuss.';
  }

  try {
    console.log('🤖 Generating intro for:', type.title);
    
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: type.systemPrompt
        },
        {
          role: 'user',
          content: 'Please introduce yourself and welcome me to our conversation. Be warm, professional, and set the tone for our interaction based on your role. Make it personal and engaging.'
        }
      ],
      model: 'compound-beta',
      temperature: 0.8,
      max_tokens: 300,
      top_p: 0.9,
    });

    const intro = chatCompletion.choices[0]?.message?.content || getFallbackResponse(conversationType);
    console.log('✅ Intro generated successfully');
    return intro;
  } catch (error) {
    console.error('❌ Error generating conversation intro:', error);
    return getFallbackResponse(conversationType);
  }
}

export async function generateAIResponse(
  messages: ConversationMessage[],
  conversationType: string
): Promise<string> {
  const type = conversationTypes[conversationType];
  if (!type) {
    console.error('❌ Unknown conversation type:', conversationType);
    throw new Error(`Unknown conversation type: ${conversationType}`);
  }

  if (!groq) {
    console.error('❌ Groq client not available');
    return getFallbackResponse(conversationType);
  }

  try {
    console.log('🤖 Generating AI response for:', type.title);
    console.log('📝 Message count:', messages.length);
    
    // Get the last user message for context
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    console.log('💬 Last user message:', lastUserMessage?.content?.substring(0, 100) + '...');
    
    const systemMessage: ConversationMessage = {
      role: 'system',
      content: type.systemPrompt + '\n\nIMPORTANT: Always provide unique, contextual responses. Never repeat the same response. Engage with the specific content of each message.'
    };

    // Ensure we have a reasonable conversation history (last 8 messages max for better context)
    const recentMessages = messages.slice(-8);
    
    console.log('🔄 Sending to Groq with system prompt and', recentMessages.length, 'recent messages');

    const chatCompletion = await groq.chat.completions.create({
      messages: [systemMessage, ...recentMessages],
      model: 'compound-beta',
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.9,
      frequency_penalty: 0.3, // Reduce repetition
      presence_penalty: 0.3,  // Encourage new topics
    });

    const response = chatCompletion.choices[0]?.message?.content;
    
    if (!response || response.trim().length === 0) {
      console.warn('⚠️ Empty response from Groq, using fallback');
      return getFallbackResponse(conversationType);
    }

    console.log('✅ AI response generated successfully:', response.substring(0, 100) + '...');
    return response;
  } catch (error: any) {
    console.error('❌ Error generating AI response:', error);
    
    // Enhanced error handling with specific error types
    if (error?.status === 401) {
      console.error('❌ Authentication error - check API key');
    } else if (error?.status === 429) {
      console.error('❌ Rate limit exceeded');
    } else if (error?.status === 500) {
      console.error('❌ Groq server error');
    }
    
    return getFallbackResponse(conversationType);
  }
}

export async function generateStreamingResponse(
  messages: ConversationMessage[],
  conversationType: string
): Promise<ReadableStream<Uint8Array>> {
  const type = conversationTypes[conversationType];
  if (!type) {
    console.error('❌ Unknown conversation type:', conversationType);
    throw new Error(`Unknown conversation type: ${conversationType}`);
  }

  if (!groq) {
    throw new Error('Groq client not available. Please configure GROQ_API_KEY.');
  }

  console.log('🌊 Generating streaming response for:', type.title);

  const systemMessage: ConversationMessage = {
    role: 'system',
    content: type.systemPrompt + '\n\nIMPORTANT: Always provide unique, contextual responses. Never repeat the same response. Engage with the specific content of each message.'
  };

  // Ensure we have a reasonable conversation history (last 8 messages max)
  const recentMessages = messages.slice(-8);

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [systemMessage, ...recentMessages],
      model: 'compound-beta',
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.9,
      frequency_penalty: 0.3,
      presence_penalty: 0.3,
      stream: true,
    });

    const encoder = new TextEncoder();
    
    return new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of chatCompletion) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
          console.log('✅ Streaming response completed');
        } catch (error) {
          console.error('❌ Streaming error:', error);
          // Send fallback response as stream
          const fallback = getFallbackResponse(conversationType);
          controller.enqueue(encoder.encode(fallback));
          controller.close();
        }
      },
    });
  } catch (error) {
    console.error('❌ Error creating streaming response:', error);
    
    // Return fallback as stream
    const encoder = new TextEncoder();
    const fallback = getFallbackResponse(conversationType);
    
    return new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(fallback));
        controller.close();
      },
    });
  }
}