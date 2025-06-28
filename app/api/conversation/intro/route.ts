import { NextRequest, NextResponse } from 'next/server';
import { generateConversationIntro, conversationTypes } from '@/lib/groq';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Intro API called');
    
    const { conversationType } = await request.json();
    console.log('📝 Conversation type:', conversationType);

    // Enhanced validation
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

    if (!conversationTypes[conversationType]) {
      console.error('❌ Invalid conversation type:', conversationType);
      return NextResponse.json(
        { 
          error: 'Invalid conversation type',
          details: `Supported types: ${Object.keys(conversationTypes).join(', ')}`
        },
        { status: 400 }
      );
    }

    console.log('🤖 Calling Groq API for intro...');
    const intro = await generateConversationIntro(conversationType);
    
    if (!intro || intro.trim().length === 0) {
      console.warn('⚠️ Empty intro from Groq');
      throw new Error('Received empty introduction from AI service');
    }
    
    console.log('✅ Groq intro generated:', intro.substring(0, 100) + '...');

    return NextResponse.json({ intro });
  } catch (error: any) {
    console.error('❌ Error in conversation intro API:', error);
    
    // Enhanced error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    // Determine error type and provide appropriate response
    let statusCode = 500;
    let errorMessage = 'Failed to generate conversation intro';
    let errorDetails = 'An unexpected error occurred while initializing the conversation';

    if (error.message?.includes('API key') || error.message?.includes('authentication')) {
      statusCode = 503;
      errorMessage = 'AI service temporarily unavailable';
      errorDetails = 'The AI service is not properly configured. Please try again later.';
    } else if (error.message?.includes('rate limit') || error.message?.includes('429')) {
      statusCode = 429;
      errorMessage = 'Too many requests';
      errorDetails = 'Please wait a moment before starting a new conversation.';
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