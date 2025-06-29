import { NextRequest } from 'next/server';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

export function rateLimit(config: RateLimitConfig) {
  return (identifier: string): boolean => {
    const now = Date.now();
    const windowStart = now - config.windowMs;
    
    // Clean up old entries
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetTime < now) {
        rateLimitStore.delete(key);
      }
    }
    
    const current = rateLimitStore.get(identifier);
    
    if (!current || current.resetTime < now) {
      // New window
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return true;
    }
    
    if (current.count >= config.maxRequests) {
      return false; // Rate limit exceeded
    }
    
    current.count++;
    return true;
  };
}

export function getClientIdentifier(request: NextRequest): string {
  // Try to get user ID from auth header first
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    try {
      // Extract user ID from JWT token (simplified)
      const token = authHeader.replace('Bearer ', '');
      // In production, properly decode and verify the JWT
      return `user:${token.slice(-10)}`; // Use last 10 chars as identifier
    } catch (error) {
      // Fall back to IP if token is invalid
    }
  }
  
  // Fall back to IP address
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : 
             request.headers.get('x-real-ip') || 
             'unknown';
  
  return `ip:${ip}`;
}

export function validateApiKey(request: NextRequest): boolean {
  // For internal API calls, validate against environment
  const apiKey = request.headers.get('x-api-key');
  const validApiKey = process.env.INTERNAL_API_KEY;
  
  if (!validApiKey) {
    // If no internal API key is set, allow (for development)
    return process.env.NODE_ENV !== 'production';
  }
  
  return apiKey === validApiKey;
}

export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  
  const allowedOrigins = [
    'https://vivatalk.netlify.app',
    'https://vivatalk.com', // If you get a custom domain
    ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000'] : [])
  ];
  
  // Check origin header
  if (origin && !allowedOrigins.includes(origin)) {
    return false;
  }
  
  // Check referer as backup
  if (referer && !allowedOrigins.some(allowed => referer.startsWith(allowed))) {
    return false;
  }
  
  return true;
}

export function sanitizeInput(input: any): any {
  if (typeof input === 'string') {
    // Basic XSS protection
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
}

export function createSecureResponse(data: any, status: number = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
    },
  });
}