import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse, ConversationMessage } from '@/lib/groq';

export async function POST(request: NextRequest) {
  try {
    console.log('💬 Chat API called');
    
    const { messages, conversationType } = await request.json();
    console.log('📝 Chat request:', { 
      messageCount: messages?.length, 
      conversationType,
      lastMessage: messages?.[messages.length - 1]?.content?.substring(0, 50) + '...'
    });

    // Enhanced validation
    if (!messages || !Array.isArray(messages)) {
      console.error('❌ Invalid messages array');
      return NextResponse.json(
        { 
          error: 'Messages array is required',
          details: 'Please provide a valid array of conversation messages'
        },
        { status: 400 }
      );
    }

    if (messages.length === 0) {
      console.error('❌ Empty messages array');
      return NextResponse.json(
        { 
          error: 'At least one message is required',
          details: 'The messages array cannot be empty'
        },
        { status: 400 }
      );
    }

    if (!conversationType) {
      console.error('❌ Missing conversation type');
      return NextResponse.json(
        { 
          error: 'Conversation type is required',
          details: 'Please specify the type of conversation (therapy, expert, companion, creative)'
        },
        { status: 400 }
      );
    }

    // Validate message format
    const invalidMessage = messages.find((msg: any) => 
      !msg.role || !msg.content || 
      !['user', 'assistant', 'system'].includes(msg.role) ||
      typeof msg.content !== 'string'
    );

    if (invalidMessage) {
      console.error('❌ Invalid message format:', invalidMessage);
      return NextResponse.json(
        { 
          error: 'Invalid message format',
          details: 'Each message must have a valid role (user, assistant, system) and content (string)'
        },
        { status: 400 }
      );
    }

    console.log('🤖 Calling Groq API for response...');
    console.log('🔄 Full conversation context being sent:', messages.map(m => ({ role: m.role, content: m.content.substring(0, 50) + '...' })));
    
    const response = await generateAIResponse(messages as ConversationMessage[], conversationType);
    
    if (!response || response.trim().length === 0) {
      console.warn('⚠️ Empty response from Groq');
      throw new Error('Received empty response from AI service');
    }
    
    console.log('✅ Groq response generated:', response.substring(0, 100) + '...');

    return NextResponse.json({ response });
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
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails,
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    );
  }
}