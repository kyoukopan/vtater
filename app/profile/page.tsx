'use client';

import { Spinner } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import useUser from '@/lib/hooks/useCurrentUser';

export default function Profile() {
  const { user, userLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (userLoading) return;
    if (user) {
      router.replace(`/profile/${user?.uid}`);
      return;
    }
    router.replace('/login');
  }, [router, user, userLoading]);
  return <Spinner />;
}
