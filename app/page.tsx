'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '@/lib/common/firebase';

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/login');
    } else {
      router.replace('/profile');
    }
  }, [loading, router, user]);

  return <main>Redirecting...</main>;
}
