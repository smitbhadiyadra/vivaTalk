import { NextRequest } from 'next/server';
import { generateStreamingResponse, ConversationMessage } from '@/lib/groq';

export async function POST(request: NextRequest) {
  try {
    const { messages, conversationType } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response('Messages array is required', { status: 400 });
    }

    if (!conversationType) {
      return new Response('Conversation type is required', { status: 400 });
    }

    const stream = await generateStreamingResponse(messages as ConversationMessage[], conversationType);

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error in streaming API:', error);
    return new Response('Failed to generate streaming response', { status: 500 });
  }
}