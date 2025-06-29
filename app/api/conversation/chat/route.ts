import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse, ConversationMessage } from '@/lib/groq';
import { 
  rateLimit, 
  getClientIdentifier, 
  validateOrigin, 
  sanitizeInput,
  createSecureResponse 
} from '@/lib/api-security';

// Rate limiting: 10 requests per minute per user
const chatRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10
});

export async function POST(request: NextRequest) {
  try {
    console.log('💬 Chat API called');
    
    // Security checks
    if (!validateOrigin(request)) {
      console.error('❌ Invalid origin');
      return createSecureResponse(
        { error: 'Forbidden', details: 'Invalid origin' },
        403
      );
    }

    // Rate limiting
    const clientId = getClientIdentifier(request);
    if (!chatRateLimit(clientId)) {
      console.error('❌ Rate limit exceeded for:', clientId);
      return createSecureResponse(
        { 
          error: 'Too many requests',
          details: 'Please wait before sending another message'
        },
        429
      );
    }

    const body = await request.json();
    const { messages, conversationType } = sanitizeInput(body);
    
    console.log('📝 Chat request:', { 
      messageCount: messages?.length, 
      conversationType,
      lastMessage: messages?.[messages.length - 1]?.content?.substring(0, 50) + '...'
    });

    // Enhanced validation
    if (!messages || !Array.isArray(messages)) {
      console.error('❌ Invalid messages array');
      return createSecureResponse(
        { 
          error: 'Messages array is required',
          details: 'Please provide a valid array of conversation messages'
        },
        400
      );
    }

    if (messages.length === 0) {
      console.error('❌ Empty messages array');
      return createSecureResponse(
        { 
          error: 'At least one message is required',
          details: 'The messages array cannot be empty'
        },
        400
      );
    }

    if (!conversationType) {
      console.error('❌ Missing conversation type');
      return createSecureResponse(
        { 
          error: 'Conversation type is required',
          details: 'Please specify the type of conversation (therapy, expert, companion, creative)'
        },
        400
      );
    }

    // Validate message format and content length
    const invalidMessage = messages.find((msg: any) => 
      !msg.role || !msg.content || 
      !['user', 'assistant', 'system'].includes(msg.role) ||
      typeof msg.content !== 'string' ||
      msg.content.length > 5000 // Limit message length
    );

    if (invalidMessage) {
      console.error('❌ Invalid message format:', invalidMessage);
      return createSecureResponse(
        { 
          error: 'Invalid message format',
          details: 'Each message must have a valid role and content (max 5000 characters)'
        },
        400
      );
    }

    // Limit conversation history to prevent abuse
    const limitedMessages = messages.slice(-20); // Only last 20 messages

    console.log('🤖 Calling Groq API for response...');
    
    const response = await generateAIResponse(limitedMessages as ConversationMessage[], conversationType);
    
    if (!response || response.trim().length === 0) {
      console.warn('⚠️ Empty response from Groq');
      throw new Error('Received empty response from AI service');
    }
    
    console.log('✅ Groq response generated:', response.substring(0, 100) + '...');

    return createSecureResponse({ response });
  } catch (error: any) {
    console.error('❌ Error in chat API:', error);
    
    // Enhanced error logging and handling
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    // Determine error type and provide appropriate response
    let statusCode = 500;
    let errorMessage = 'Failed to generate response';
    let errorDetails = 'An unexpected error occurred while processing your request';

    if (error.message?.includes('API key') || error.message?.includes('authentication')) {
      statusCode = 503;
      errorMessage = 'AI service temporarily unavailable';
      errorDetails = 'The AI service is not properly configured. Please try again later.';
    } else if (error.message?.includes('rate limit') || error.message?.includes('429')) {
      statusCode = 429;
      errorMessage = 'Too many requests';
      errorDetails = 'Please wait a moment before sending another message.';
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      statusCode = 503;
      errorMessage = 'Network error';
      errorDetails = 'Unable to connect to AI service. Please check your connection and try again.';
    } else if (error.message?.includes('timeout')) {
      statusCode = 504;
      errorMessage = 'Request timeout';
      errorDetails = 'The AI service took too long to respond. Please try again.';
    }
    
    return createSecureResponse(
      { 
        error: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString()
      },
      statusCode
    );
  }
}

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
        ? 'https://vivatalk.netlify.app' 
        : 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}