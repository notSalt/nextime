'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dotenv from 'dotenv';

dotenv.config();

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await fetch(`${process.env.API_URL}/auth/logout`, {
          method: 'POST',
          credentials: 'include',
        });
      } catch (err) {
        console.error('Logout failed:', err);
      } finally {
        router.push('/login');
      }
    };

    logout();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Logging out...</p>
    </div>
  );
}