# VivaTalk - AI-Powered Video Conversations

VivaTalk is a modern web application that enables meaningful AI-powered conversations through both text and video interfaces. Built with Next.js, Supabase, Groq AI, and Tavus video technology.

## Features

- **Multiple AI Personalities**: Choose from therapy, expert, companion, or creative conversation types
- **Text & Video Conversations**: Seamless switching between text chat and video calls
- **Real-time AI Responses**: Powered by Groq's fast language models
- **User Authentication**: Secure sign-up/sign-in with Supabase Auth
- **Profile Management**: Customizable user profiles with avatar uploads
- **Conversation Analytics**: Track your conversation patterns and insights
- **Speech Recognition**: Voice input support for hands-free interaction
- **Responsive Design**: Beautiful UI that works on all devices
- **Enterprise Security**: Rate limiting, input validation, and secure API endpoints

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Framer Motion
- **Backend**: Next.js API Routes with security middleware
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Groq (Llama 3.1 70B)
- **Video**: Tavus AI Video Conversations
- **Deployment**: Netlify with serverless functions

## Security Features

- **Rate Limiting**: Prevents API abuse with configurable limits
- **Input Validation**: Sanitizes all user inputs to prevent XSS
- **Origin Validation**: Ensures requests come from authorized domains
- **CORS Protection**: Properly configured cross-origin resource sharing
- **Security Headers**: Comprehensive security headers for all responses
- **Content Length Limits**: Prevents oversized payloads
- **Error Handling**: Secure error responses without sensitive information

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- Groq API key
- Tavus API key (for video features)

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Groq AI API Key (get from https://console.groq.com/)
GROQ_API_KEY=your_groq_api_key_here

# Tavus Video API Key (get from https://tavusapi.com/)
TAVUS_API_KEY=your_tavus_api_key_here

# Tavus Replica ID (get from your Tavus dashboard)
TAVUS_REPLICA_ID=your_replica_id_here

# Supabase Configuration (get from https://supabase.com/dashboard)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Internal API Security (generate a random string)
INTERNAL_API_KEY=your_secure_random_string_here

# Production Environment
NODE_ENV=production
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/smitbhadiyadra/vivaTalk.git
cd vivatalk
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables (see above)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Production Deployment

#### Netlify Deployment

1. **Build Configuration**: The project is configured for Netlify with serverless functions
2. **Environment Variables**: Add all required environment variables in Netlify dashboard
3. **Security**: Production deployment includes rate limiting and security headers
4. **API Protection**: All API routes are protected with origin validation and rate limiting

#### Security Checklist for Production

- [ ] Set strong `INTERNAL_API_KEY` environment variable
- [ ] Configure proper CORS origins in `next.config.js`
- [ ] Enable rate limiting for all API endpoints
- [ ] Set up monitoring for API usage and errors
- [ ] Configure proper DNS and SSL certificates
- [ ] Review and test all security headers

## API Security

### Rate Limiting

- **Chat API**: 10 requests per minute per user
- **Intro API**: 5 requests per minute per user  
- **Video API**: 2 requests per 5 minutes per user

### Input Validation

- Message content limited to 5000 characters
- Conversation history limited to last 20 messages
- User names limited to 50 characters
- XSS protection on all text inputs

### Error Handling

- No sensitive information in error responses
- Proper HTTP status codes
- Detailed logging for debugging (server-side only)

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # Secure API routes with middleware
│   ├── auth/              # Authentication pages
│   ├── conversation/      # Conversation pages
│   └── ...                # Other pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── contexts/             # React contexts
├── lib/                  # Utility libraries
│   ├── api-security.ts   # Security middleware and utilities
│   ├── groq.ts          # Groq AI integration
│   ├── tavus.ts         # Tavus video integration
│   └── supabase.ts      # Supabase client
├── supabase/            # Database migrations
└── types/               # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@vivatalk.com or open an issue on GitHub.

## Acknowledgments

- Built for the Bolt Hackathon
- Powered by Bolt.new, Groq, Tavus, and Supabase
- UI components from shadcn/ui
- Icons from Lucide React