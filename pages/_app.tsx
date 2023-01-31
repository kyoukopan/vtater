import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.min.css';
import type { AppProps } from 'next/app';
// eslint-disable-next-line import/no-extraneous-dependencies
import { NextUIProvider } from '@nextui-org/react';
import { Slide, toast, ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <ToastContainer
          style={{ zIndex: 10500 }}
          position={toast.POSITION.TOP_CENTER}
          transition={Slide}
        />
        <Component {...pageProps} />
      </NextUIProvider>
    </QueryClientProvider>
  );
}
