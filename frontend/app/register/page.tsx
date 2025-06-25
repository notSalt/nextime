'use client';

import axios from 'axios';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dotenv from 'dotenv';

dotenv.config();

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get(`/api/auth/me`, {
          withCredentials: true,
        });
        router.push("/calendar");
      } catch (_) {
      }
    };

    checkAuth();
  }, [router]);

  const handleRegister = async () => {
    if (password !== repeatPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    const res = await fetch(`/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);
    if (res.ok) {
      router.push('/calendar');
    } else {
      toast.error('Registration failed. Try again later.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-animated-gradient px-4">
      <Card className="w-full max-w-md shadow-lg border border-white/20 bg-white/10 backdrop-blur-md text-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Create Account</CardTitle>
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
              className="bg-white/10 text-white placeholder:text-white/60"
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
              className="bg-white/10 text-white placeholder:text-white/60"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="repeatPassword">Repeat Password</Label>
            <Input
              id="repeatPassword"
              type="password"
              placeholder="••••••••"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              className="bg-white/10 text-white placeholder:text-white/60"
            />
          </div>

          <Button className="w-full" onClick={handleRegister} disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </Button>

          <p className="text-sm text-center text-muted-foreground mt-2">
            Already have an account?{' '}
            <a href="/login" className="underline text-white hover:text-blue-300">
              Log in
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}