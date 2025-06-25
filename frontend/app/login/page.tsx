'use client';

import axios from 'axios';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          withCredentials: true,
        });
        router.push("/calendar");
      } catch (_) { }
    };

    checkAuth();
  }, [router]);

  const handleLogin = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push('/calendar');
    } else {
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-animated-gradient px-4">
      <Card className="w-full max-w-md shadow-lg border border-white/20 bg-white/10 backdrop-blur-md text-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button className="w-full" onClick={handleLogin}>
            Log In
          </Button>

          <p className="text-sm text-center text-muted-foreground mt-2">
            Don&apos;t have an account?{' '}
            <a href="/register" className="underline text-white hover:text-blue-300">
              Register here
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}