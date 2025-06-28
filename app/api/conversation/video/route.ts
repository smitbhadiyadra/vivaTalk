import { NextRequest, NextResponse } from 'next/server';
import { tavusAPI, generateConversationName, createConversationalContext, getVideoErrorMessage, getReplicaName } from '@/lib/tavus';
import { generateConversationIntro, conversationTypes } from '@/lib/groq';

export async function POST(request: NextRequest) {
  try {
    console.log('🎥 Video API called');
    
    const { conversationType, userName } = await request.json();
    console.log('📝 Video request:', { conversationType, userName });

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

    // Check if Tavus API is available
    if (!tavusAPI) {
      console.error('❌ Tavus API not configured');
      return NextResponse.json(
        { 
          error: 'Video conversations are not available',
          details: 'Tavus API key is not configured. Please add your TAVUS_API_KEY to the environment variables.'
        },
        { status: 503 }
      );
    }

    // Check if Tavus Replica ID is available
    const replicaId = process.env.TAVUS_REPLICA_ID;
    if (!replicaId) {
      console.error('❌ Tavus Replica ID not configured');
      return NextResponse.json(
        { 
          error: 'Video conversations are not available',
          details: 'Tavus Replica ID is not configured. Please add your TAVUS_REPLICA_ID to the environment variables.'
        },
        { status: 503 }
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
        max_call_duration: 3600, // 1 hour
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

    return NextResponse.json({
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
    
    return NextResponse.json(
      { 
        error: 'Failed to create video conversation',
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    );
  }
}