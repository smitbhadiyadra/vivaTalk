export interface TavusConversationRequest {
  replica_id?: string;
  persona_id?: string;
  callback_url?: string;
  conversation_name: string;
  conversational_context: string;
  custom_greeting?: string;
  properties?: {
    max_call_duration?: number;
    participant_left_timeout?: number;
    participant_absent_timeout?: number;
    enable_recording?: boolean;
    enable_closed_captions?: boolean;
    apply_greenscreen?: boolean;
    language?: string;
    recording_s3_bucket_name?: string;
    recording_s3_bucket_region?: string;
    aws_assume_role_arn?: string;
  };
}

export interface TavusConversationResponse {
  conversation_id: string;
  conversation_name: string;
  status: string;
  conversation_url: string;
  replica_id?: string;
  persona_id?: string;
  created_at: string;
}

export class TavusAPI {
  private apiKey: string;
  private baseUrl = 'https://tavusapi.com/v2';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async createConversation(request: TavusConversationRequest): Promise<TavusConversationResponse> {
    console.log('🌐 Making Tavus API request to:', `${this.baseUrl}/conversations`);
    console.log('📋 Request payload:', {
      conversation_name: request.conversation_name,
      context_length: request.conversational_context.length,
      greeting_length: request.custom_greeting?.length || 0,
      replica_id: request.replica_id,
      properties: request.properties
    });

    try {
      const response = await fetch(`${this.baseUrl}/conversations`, {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      console.log('📡 Tavus API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Tavus API error response:', errorText);
        throw new Error(`Tavus API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Tavus API success:', {
        conversation_id: result.conversation_id,
        status: result.status,
        url: result.conversation_url
      });

      return result;
    } catch (error) {
      console.error('❌ Tavus API request failed:', error);
      throw error;
    }
  }

  async getConversation(conversationId: string): Promise<TavusConversationResponse> {
    console.log('🔍 Getting Tavus conversation:', conversationId);
    
    try {
      const response = await fetch(`${this.baseUrl}/conversations/${conversationId}`, {
        method: 'GET',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Tavus get response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Tavus get error:', errorText);
        throw new Error(`Tavus API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Tavus conversation retrieved');
      return result;
    } catch (error) {
      console.error('❌ Tavus get request failed:', error);
      throw error;
    }
  }

  async getReplica(replicaId: string): Promise<any> {
    console.log('🔍 Getting Tavus replica:', replicaId);
    
    try {
      const response = await fetch(`${this.baseUrl}/replicas/${replicaId}`, {
        method: 'GET',
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      console.log('📡 Tavus replica response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Tavus replica error:', errorText);
        throw new Error(`Tavus API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Tavus replica retrieved:', result.name || 'Unknown');
      return result;
    } catch (error) {
      console.error('❌ Tavus replica request failed:', error);
      throw error;
    }
  }
}

// Enhanced Tavus API client initialization with better error handling
const getTavusClient = () => {
  const apiKey = process.env.TAVUS_API_KEY;
  
  if (!apiKey || apiKey === 'your_tavus_api_key_here' || apiKey === 'your_actual_tavus_api_key_here') {
    console.error('❌ TAVUS_API_KEY environment variable is missing or not configured properly');
    console.error('💡 Please add your actual Tavus API key to .env.local');
    return null;
  }
  
  try {
    return new TavusAPI(apiKey);
  } catch (error) {
    console.error('❌ Failed to initialize Tavus client:', error);
    return null;
  }
};

export const tavusAPI = getTavusClient();

// Helper function to create conversation name based on type and user
export function generateConversationName(conversationType: string, userName?: string): string {
  const typeNames = {
    therapy: 'Therapy Session',
    expert: 'Expert Consultation',
    companion: 'Friendly Chat',
    creative: 'Creative Collaboration'
  };

  const typeName = typeNames[conversationType as keyof typeof typeNames] || 'AI Conversation';
  const userPart = userName ? ` with ${userName}` : '';
  const timestamp = new Date().toLocaleDateString();
  
  const name = `${typeName}${userPart} - ${timestamp}`;
  console.log('📝 Generated conversation name:', name);
  return name;
}

// Enhanced conversational context creation
export function createConversationalContext(conversationType: string, groqIntro: string): string {
  const baseContext = `This is a ${conversationType} conversation. ${groqIntro}`;
  
  // Add specific context based on conversation type with enhanced instructions
  const typeSpecificContext = {
    therapy: ` Please maintain a professional, empathetic, and supportive tone throughout the conversation. Focus on active listening, providing therapeutic guidance, and creating a safe space for emotional expression. Use evidence-based therapeutic techniques and validate the user's feelings.`,
    expert: ` Please provide professional, knowledgeable advice and insights based on industry expertise. Share practical strategies, frameworks, and best practices. Be direct and actionable while remaining approachable and professional.`,
    companion: ` Please be warm, friendly, and engaging throughout the conversation. Create a comfortable atmosphere for casual conversation and emotional support. Show genuine interest in the user's life and experiences. Be encouraging and positive while acknowledging any difficulties.`,
    creative: ` Please be inspiring, collaborative, and energetic throughout the conversation. Help brainstorm ideas, overcome creative blocks, and explore innovative solutions. Encourage experimentation and celebrate creative risks. Use techniques like "yes, and..." to build on ideas.`
  };

  const context = baseContext + (typeSpecificContext[conversationType as keyof typeof typeSpecificContext] || ' Please be helpful, professional, and engaging throughout the conversation.');
  console.log('📋 Generated conversational context length:', context.length);
  return context;
}

// Enhanced error handling for video conversation creation
export function getVideoErrorMessage(error: any): string {
  if (error.message?.includes('API key')) {
    return 'Video conversations are not available. Please configure your Tavus API key.';
  }
  
  if (error.message?.includes('network') || error.message?.includes('fetch')) {
    return 'Network error. Please check your internet connection and try again.';
  }
  
  if (error.message?.includes('rate limit') || error.message?.includes('429')) {
    return 'Too many requests. Please wait a moment before creating another video conversation.';
  }
  
  return 'Failed to create video conversation. Please try again or contact support if the issue persists.';
}

// Get replica name for display
export async function getReplicaName(replicaId: string): Promise<string> {
  if (!tavusAPI) {
    return 'AI Assistant';
  }

  try {
    const replica = await tavusAPI.getReplica(replicaId);
    return replica.name || 'AI Assistant';
  } catch (error) {
    console.error('Failed to get replica name:', error);
    return 'AI Assistant';
  }
}