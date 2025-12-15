'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { LineIcon } from './LineIcon';

interface LoginViewProps {
  error?: string;
}

function generateState() {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${value};path=/;max-age=${maxAge};samesite=lax${
    location.protocol === 'https:' ? ';secure' : ''
  }`;
}

export function LoginView({ error }: LoginViewProps) {
  const { toast } = useToast();
  const [loginUrl, setLoginUrl] = useState<string>('');

  useEffect(() => {
    const state = generateState();
    setCookie('line-oauth-state', state, 60 * 5); // 5 minutes

    const lineLoginUrl = new URL('https://access.line.me/oauth2/v2.1/authorize');
    
    const channelId = process.env.NEXT_PUBLIC_LINE_CHANNEL_ID || '2008685502';
    const redirectUri = process.env.NEXT_PUBLIC_LINE_REDIRECT_URI || `${window.location.origin}/api/auth/callback/line`;

    lineLoginUrl.searchParams.set('response_type', 'code');
    lineLoginUrl.searchParams.set('client_id', channelId);
    lineLoginUrl.searchParams.set('redirect_uri', redirectUri);
    lineLoginUrl.searchParams.set('state', state);
    lineLoginUrl.searchParams.set('scope', 'profile openid');
    lineLoginUrl.searchParams.set('bot_prompt', 'aggressive');

    setLoginUrl(lineLoginUrl.toString());
  }, []);

  useEffect(() => {
    if (error === 'login_failed') {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'An error occurred during authentication. Please try again.',
      });
    }
  }, [error, toast]);

  return (
    <Card className="w-full max-w-sm animate-in fade-in-50 zoom-in-95 duration-500">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline">
          Line Login Tester
        </CardTitle>
        <CardDescription>Click the button below to sign in.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg" disabled={!loginUrl}>
          <a href={loginUrl}>
            <LineIcon className="mr-2 h-6 w-6 text-white" />
            Login with Line
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
