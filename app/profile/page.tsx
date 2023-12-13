'use client';
import useUser from '@/lib/hooks/useCurrentUser';
import { Spinner } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

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
  }, [userLoading]);
  return <Spinner />;
}
