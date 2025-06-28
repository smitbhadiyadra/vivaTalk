'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { 
  MessageCircle, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle,
  RefreshCw,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

type AuthMode = 'signin' | 'signup' | 'forgot-password' | 'resend-confirmation';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signIn, signUp, signInWithGoogle, resetPassword, resendConfirmation, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlMode = searchParams.get('mode');
    const error = searchParams.get('error');
    
    if (urlMode === 'signup') {
      setMode('signup');
    }
    
    if (error === 'callback_failed') {
      toast.error('Authentication failed. Please try again.');
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      router.push('/talk');
    }
  }, [user, router]);

  // Client-side validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation (for signin and signup)
    if ((mode === 'signin' || mode === 'signup') && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (mode === 'signup' && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    // Name validation (for signup only)
    if (mode === 'signup') {
      if (!formData.name.trim()) {
        newErrors.name = 'Full name is required';
      } else if (formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters long';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      switch (mode) {
        case 'signin': {
          const { error } = await signIn(formData.email, formData.password);
          if (error) {
            if (error.code === 'EMAIL_NOT_CONFIRMED') {
              setMode('resend-confirmation');
              toast.error(error.message);
            } else {
              toast.error(error.message);
            }
          } else {
            toast.success('Welcome back!');
            router.push('/talk');
          }
          break;
        }
        
        case 'signup': {
          const { error } = await signUp(formData.email, formData.password, formData.name);
          if (error) {
            if (error.code === 'EMAIL_CONFIRMATION_REQUIRED') {
              setMode('resend-confirmation');
              toast.success('Account created! Please check your email for verification.');
            } else if (error.code === 'USER_ALREADY_EXISTS') {
              setMode('signin');
              toast.error(error.message);
            } else {
              toast.error(error.message);
            }
          } else {
            toast.success('Account created successfully! Welcome to VivaTalk!');
            router.push('/talk');
          }
          break;
        }
        
        case 'forgot-password': {
          const { error } = await resetPassword(formData.email);
          if (error) {
            toast.error(error.message);
          } else {
            toast.success('Password reset email sent! Check your inbox.');
            setMode('signin');
          }
          break;
        }
        
        case 'resend-confirmation': {
          const { error } = await resendConfirmation(formData.email);
          if (error) {
            toast.error(error.message);
          } else {
            toast.success('Confirmation email sent! Check your inbox.');
          }
          break;
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        console.error('Google sign-in error:', error);
        if (error.message.includes('popup')) {
          toast.error('Please allow popups for Google sign-in or try again.');
        } else {
          toast.error('Google sign-in failed. Please try again or use email/password.');
        }
        setLoading(false);
      }
      // Note: Don't show success message here as the redirect will happen automatically
    } catch (error) {
      console.error('Google sign-in catch:', error);
      toast.error('Google sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'signin': return 'Welcome back';
      case 'signup': return 'Create your account';
      case 'forgot-password': return 'Reset your password';
      case 'resend-confirmation': return 'Resend confirmation';
      default: return 'Welcome back';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case 'signin': return 'Sign in to continue your conversations';
      case 'signup': return 'Join VivaTalk and start your AI conversation journey';
      case 'forgot-password': return 'Enter your email to receive a password reset link';
      case 'resend-confirmation': return 'Resend the email confirmation link';
      default: return 'Sign in to continue your conversations';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex justify-center mb-4"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-lg opacity-30" />
                <div className="relative bg-gradient-to-r from-primary to-secondary p-3 rounded-full">
                  <MessageCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-bold">
              {getTitle()}
            </CardTitle>
            <CardDescription>
              {getDescription()}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Back button for non-signin modes */}
            {mode !== 'signin' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMode('signin')}
                className="mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to sign in
              </Button>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name field for signup */}
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`pl-10 ${errors.name ? 'border-destructive' : ''}`}
                      required
                    />
                  </div>
                  {errors.name && (
                    <p className="text-sm text-destructive flex items-center">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      {errors.name}
                    </p>
                  )}
                </div>
              )}

              {/* Email field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive flex items-center">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password field for signin and signup */}
              {(mode === 'signin' || mode === 'signup') && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive flex items-center">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      {errors.password}
                    </p>
                  )}
                  {mode === 'signup' && !errors.password && (
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 6 characters long
                    </p>
                  )}
                </div>
              )}

              {/* Forgot password link for signin */}
              {mode === 'signin' && (
                <div className="text-right">
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={() => setMode('forgot-password')}
                    className="p-0 h-auto text-sm"
                  >
                    Forgot your password?
                  </Button>
                </div>
              )}

              {/* Submit button */}
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>
                      {mode === 'signin' && 'Signing in...'}
                      {mode === 'signup' && 'Creating account...'}
                      {mode === 'forgot-password' && 'Sending email...'}
                      {mode === 'resend-confirmation' && 'Sending email...'}
                    </span>
                  </div>
                ) : (
                  <>
                    {mode === 'signin' && 'Sign In'}
                    {mode === 'signup' && 'Create Account'}
                    {mode === 'forgot-password' && 'Send Reset Email'}
                    {mode === 'resend-confirmation' && (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Resend Confirmation
                      </>
                    )}
                  </>
                )}
              </Button>
            </form>

            {/* Google sign in - only for signin and signup */}
            {(mode === 'signin' || mode === 'signup') && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </>
            )}

            {/* Confirmation email info */}
            {mode === 'resend-confirmation' && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  We'll send a confirmation link to your email address. Click the link to activate your account.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="text-center">
            {mode === 'signin' && (
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal text-primary"
                  onClick={() => setMode('signup')}
                >
                  Sign up
                </Button>
              </p>
            )}
            {mode === 'signup' && (
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-normal text-primary"
                  onClick={() => setMode('signin')}
                >
                  Sign in
                </Button>
              </p>
            )}
          </CardFooter>
        </Card>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6"
        >
          <Link 
            href="/" 
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to VivaTalk
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}