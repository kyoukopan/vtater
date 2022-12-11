import React, { useState } from 'react';
import { loginEmail, loginGoogle, signOut } from '../lib/firebase';
import { Header } from '../components/ui/typography';
import googleSignin from '../public/img/google-signin/google-signin.png';
import googleSigninPress from '../public/img/google-signin/google-signin-press.png';
import Image from 'next/image';

export default function Login() {
  return <LoginForm />;
}

export function GoogleLoginText() {
  return (
    <>
      <h1>Log In</h1>
      <GoogleLoginButton />
      <SignOutButton />
    </>
  );
}

export function LoginForm() {
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-50">
        <body class="h-full">
        ```
      */}
      <div className="flex min-h-full items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md text-center">
          <div className="space-y-5">
            <h1>VTater</h1>
            <h2>Login</h2>
            <GoogleLoginButton />
          </div>
        </div>
      </div>
    </>
  );
}

function GoogleLoginButton() {
  const [press, setPress] = useState(false);
  return (
    <button
      type="button"
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      onMouseLeave={() => setPress(false)}
      onClick={loginGoogle}
    >
      <Image
        src={press ? googleSigninPress : googleSignin}
        className="pointer-events-none"
      />
    </button>
  );
}

function SignOutButton() {
  return (
    <button onClick={signOut} type="button">
      Sign Out
    </button>
  );
}
