import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NextUIProvider } from '@nextui-org/react';
import { Slide, ToastContainer, toast } from 'react-toastify';
import AuthWrapper from '@/components/Auth/AuthWrapper';
import { useRouter } from 'next/navigation';

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider navigate={router.push}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <ToastContainer
          style={{ zIndex: 10500 }}
          position={toast.POSITION.TOP_CENTER}
          transition={Slide}
        />
        <AuthWrapper>{children}</AuthWrapper>
      </NextUIProvider>
    </QueryClientProvider>
  );
}
