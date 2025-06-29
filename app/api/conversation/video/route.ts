import { NextRequest, NextResponse } from 'next/server';
import { tavusAPI, generateConversationName, createConversationalContext, getVideoErrorMessage, getReplicaName } from '@/lib/tavus';
import { generateConversationIntro, conversationTypes } from '@/lib/groq';
import { 
  rateLimit, 
  getClientIdentifier, 
  validateOrigin, 
  sanitizeInput,
  createSecureResponse 
} from '@/lib/api-security';

// Rate limiting: 2 video requests per 5 minutes per user (more restrictive due to cost)
const videoRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 2
});

export async function POST(request: NextRequest) {
  try {
    console.log('🎥 Video API called');
    
    // Security checks
    if (!validateOrigin(request)) {
      console.error('❌ Invalid origin');
      return createSecureResponse(
        { error: 'Forbidden', details: 'Invalid origin' },
        403
      );
    }

    // Rate limiting (more restrictive for video)
    const clientId = getClientIdentifier(request);
    if (!videoRateLimit(clientId)) {
      console.error('❌ Video rate limit exceeded for:', clientId);
      return createSecureResponse(
        { 
          error: 'Too many video requests',
          details: 'Please wait 5 minutes before creating another video conversation'
        },
        429
      );
    }

    const body = await request.json();
    const { conversationType, userName } = sanitizeInput(body);
    console.log('📝 Video request:', { conversationType, userName });

    // Enhanced validation
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

    if (!conversationTypes[conversationType]) {
      console.error('❌ Invalid conversation type:', conversationType);
      return createSecureResponse(
        { 
          error: 'Invalid conversation type',
          details: `Supported types: ${Object.keys(conversationTypes).join(', ')}`
        },
        400
      );
    }

    // Validate userName length
    if (userName && userName.length > 50) {
      return createSecureResponse(
        { 
          error: 'Invalid user name',
          details: 'User name must be less than 50 characters'
        },
        400
      );
    }

    // Check if Tavus API is available
    if (!tavusAPI) {
      console.error('❌ Tavus API not configured');
      return createSecureResponse(
        { 
          error: 'Video conversations are not available',
          details: 'Video service is not configured. Please try text chat instead.'
        },
        503
      );
    }

    // Check if Tavus Replica ID is available
    const replicaId = process.env.TAVUS_REPLICA_ID;
    if (!replicaId) {
      console.error('❌ Tavus Replica ID not configured');
      return createSecureResponse(
        { 
          error: 'Video conversations are not available',
          details: 'Video service is not properly configured. Please try text chat instead.'
        },
        503
      );
    }

    console.log('🤖 Generating Groq intro for video...');
    // Generate conversation intro using Groq
    const groqIntro = await generateConversationIntro(conversationType);
    
    if (!groqIntro || groqIntro.trim().length === 0) {
      console.warn('⚠️ Empty intro from Groq, using fallback');
      throw new Error('Failed to generate conversation introduction');
    }
    
    console.log('✅ Groq intro for video:', groqIntro.substring(0, 100) + '...');

    // Get replica name for better conversation naming
    let replicaName = 'AI Assistant';
    try {
      replicaName = await getReplicaName(replicaId);
    } catch (error) {
      console.warn('Could not get replica name, using default');
    }

    // Create Tavus conversation with enhanced configuration
    const conversationName = generateConversationName(conversationType, userName);
    const conversationalContext = createConversationalContext(conversationType, groqIntro);
    
    console.log('📋 Tavus request data:', {
      conversationName,
      contextLength: conversationalContext.length,
      greetingLength: groqIntro.length,
      replicaId,
      replicaName
    });

    const tavusRequest = {
      replica_id: replicaId,
      conversation_name: conversationName,
      conversational_context: conversationalContext,
      custom_greeting: groqIntro,
      properties: {
        max_call_duration: 1800, // 30 minutes (reduced from 1 hour)
        participant_left_timeout: 120, // 2 minutes
        participant_absent_timeout: 300, // 5 minutes
        enable_recording: false, // Disabled for privacy
        enable_closed_captions: true,
        apply_greenscreen: false,
        language: 'english'
      }
    };

    console.log('🌐 Calling Tavus API...');
    const tavusResponse = await tavusAPI.createConversation(tavusRequest);
    
    if (!tavusResponse || !tavusResponse.conversation_url) {
      console.error('❌ Invalid Tavus response:', tavusResponse);
      throw new Error('Invalid response from video service');
    }
    
    console.log('✅ Tavus response:', {
      conversation_id: tavusResponse.conversation_id,
      status: tavusResponse.status,
      url: tavusResponse.conversation_url
    });

    return createSecureResponse({
      conversation_id: tavusResponse.conversation_id,
      conversation_url: tavusResponse.conversation_url,
      conversation_name: tavusResponse.conversation_name,
      replica_name: replicaName,
      status: tavusResponse.status,
      intro: groqIntro
    });

  } catch (error: any) {
    console.error('❌ Error creating video conversation:', error);
    
    // Enhanced error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Use the enhanced error message function
    const errorMessage = getVideoErrorMessage(error);
    
    // Determine status code based on error type
    let statusCode = 500;
    if (error.message?.includes('API key') || error.message?.includes('authentication')) {
      statusCode = 503;
    } else if (error.message?.includes('rate limit') || error.message?.includes('429')) {
      statusCode = 429;
    } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
      statusCode = 503;
    } else if (error.message?.includes('timeout')) {
      statusCode = 504;
    }
    
    return createSecureResponse(
      { 
        error: 'Failed to create video conversation',
        details: errorMessage,
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