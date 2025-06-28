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

## Tech Stack

- **Frontend**: Next.js 13, React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Groq (Llama 3.1 70B)
- **Video**: Tavus AI Video Conversations
- **Deployment**: Vercel/Netlify ready

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

# Supabase Configuration (get from https://supabase.com/dashboard)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
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

### Database Setup

The project includes Supabase migrations in the `supabase/migrations` directory. These will automatically create the necessary tables and security policies when you connect your Supabase project.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── conversation/      # Conversation pages
│   └── ...                # Other pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── contexts/             # React contexts
├── lib/                  # Utility libraries
│   ├── groq.ts          # Groq AI integration
│   ├── tavus.ts         # Tavus video integration
│   └── supabase.ts      # Supabase client
├── supabase/            # Database migrations
└── types/               # TypeScript type definitions
```

## Key Features

### AI Conversation Types

1. **Therapy**: Professional therapeutic conversations with empathetic AI
2. **Expert**: Industry expert advice across various professional fields
3. **Companion**: Friendly, casual conversations for emotional support
4. **Creative**: Collaborative brainstorming and creative problem-solving

### Video Conversations

- Powered by Tavus AI for realistic video interactions
- Seamless integration with text conversations
- Customizable conversation contexts based on AI personality

### User Management

- Secure authentication with email/password and Google OAuth
- Profile management with avatar uploads
- Conversation history and analytics
- Privacy-focused design with user data protection

## API Integration

### Groq AI
- Fast, reliable language model responses
- Multiple conversation personalities
- Streaming support for real-time responses

### Tavus Video
- AI-powered video conversations
- Realistic avatar interactions
- Customizable conversation contexts

### Supabase
- User authentication and management
- Real-time database with PostgreSQL
- File storage for user avatars
- Row-level security for data protection

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables in Netlify dashboard

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