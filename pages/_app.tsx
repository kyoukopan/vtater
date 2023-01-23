import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.min.css";
import type { AppProps } from "next/app";
// eslint-disable-next-line import/no-extraneous-dependencies
import { NextUIProvider } from "@nextui-org/react";
import { Slide, toast, ToastContainer } from "react-toastify";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <ToastContainer
        style={{ zIndex: 10500 }}
        position={toast.POSITION.TOP_CENTER}
        transition={Slide}
      />
      <Component {...pageProps} />
    </NextUIProvider>
  );
}
