import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.min.css';
import type { AppProps } from 'next/app';
// eslint-disable-next-line import/no-extraneous-dependencies
import { NextUIProvider, createTheme } from '@nextui-org/react';
import { Slide, toast, ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import { auth, db } from '@/lib/common/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import useUser from '@/components/hooks/useCurrentUser';

const lightTheme = createTheme({
  type: 'light',
});
const darkTheme = createTheme({
  type: 'dark',
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const { userData } = useUser();

  const userConfig = userData?.config;

  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider
        theme={userConfig?.theme === 'dark' ? darkTheme : lightTheme}
      >
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
