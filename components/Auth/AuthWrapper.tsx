'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '@/lib/common/firebase';

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user || error) {
      router.replace('/login');
    }
  }, [error, loading, router, user]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
