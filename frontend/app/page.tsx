'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] animate-gradient-x bg-[length:400%_400%] text-white">
      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-3xl border-white/20 bg-white/10 backdrop-blur-md text-white shadow-xl">
          <CardContent className="py-12 px-6 text-center">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to <span className="text-blue-400">NexTime</span>
            </h1>
            <p className="text-white/80 text-lg mb-8">
              NexTime is your AI-powered smart calendar that turns natural language into structured, actionable events.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link href="/login">
                <Button className="bg-blue-600 hover:bg-blue-700">Log In</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Register
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}