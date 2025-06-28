'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          router.push('/auth?error=callback_failed');
          return;
        }

        if (data.session) {
          // Successfully authenticated, redirect to talk page
          router.push('/talk');
        } else {
          // No session found, redirect to auth page
          router.push('/auth');
        }
      } catch (error) {
        console.error('Auth callback catch error:', error);
        router.push('/auth?error=callback_failed');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center space-x-3">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-lg">Completing sign in...</span>
      </div>
    </div>
  );
}