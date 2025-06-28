'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export function OAuthHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Check if we have OAuth tokens in the URL hash
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      if (accessToken && refreshToken) {
        try {
          // Set the session using the tokens from the hash
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error('Error setting session:', error);
            // Clean the URL and stay on home page
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
          }

          if (data.session) {
            // Clean the URL hash
            window.history.replaceState({}, document.title, window.location.pathname);
            
            // Redirect to talk page
            router.push('/talk');
          }
        } catch (error) {
          console.error('OAuth callback error:', error);
          // Clean the URL and stay on home page
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };

    // Only run on client side
    if (typeof window !== 'undefined') {
      handleOAuthCallback();
    }
  }, [router]);

  return null; // This component doesn't render anything
}