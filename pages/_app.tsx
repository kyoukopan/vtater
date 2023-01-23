import "@/styles/globals.css";
import type { AppProps } from "next/app";
// eslint-disable-next-line import/no-extraneous-dependencies
import { NextUIProvider } from "@nextui-org/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Component {...pageProps} />
    </NextUIProvider>
  );
}
