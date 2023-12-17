'use client';

import { NextUIProvider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Slide, ToastContainer, toast } from 'react-toastify';

import AuthWrapper from '@/components/Auth/AuthWrapper';

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  return (
    <NextUIProvider navigate={router.push}>
      <QueryClientProvider client={queryClient}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <AuthWrapper>
          <ToastContainer
            position={toast.POSITION.TOP_CENTER}
            transition={Slide}
          />
          {children}
        </AuthWrapper>
      </QueryClientProvider>
    </NextUIProvider>
  );
}
