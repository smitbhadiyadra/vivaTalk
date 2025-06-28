import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { Features } from '@/components/Features';
import { Footer } from '@/components/Footer';
import { OAuthHandler } from '@/components/OAuthHandler';

export default function Home() {
  return (
    <>
      <OAuthHandler />
      <Hero />
      <HowItWorks />
      <Features />
      <Footer />
    </>
  );
}