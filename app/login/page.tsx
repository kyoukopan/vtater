'use client';

import { useDisclosure } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import LoginCard from '@/components/Auth/Login';
import SignupModal from '@/components/Auth/Signup';
import BrandHeader from '@/components/lib/BrandHeader';
import Button from '@/components/lib/Button';
import { auth } from '@/lib/common/firebase';

export default function LoginPage() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  const { isOpen: signupVisible, onOpen, onOpenChange } = useDisclosure();
  useEffect(() => {
    if (loading || error) return;
    if (user && !signupVisible) {
      router.replace('/profile');
    }
  }, [error, loading, router, signupVisible, user]);

  return (
    <>
      <BrandHeader />
      <LoginCard className='my-8' />
      <Button color='primary' size='lg' className='mx-auto' onPress={onOpen}>
        No account? Join today!
      </Button>
      <SignupModal open={signupVisible} onOpenChange={onOpenChange} />
    </>
  );
}
