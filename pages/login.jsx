import React, { useState } from 'react';
import { loginEmail, loginGoogle, signOut } from '../lib/firebase';

export default function Login() {
  return (
    <>
      <h1>Log In</h1>
      <GoogleLoginButton />
      <SignOutButton />
    </>
  );
}

function GoogleLoginButton() {
  return (
    <button onClick={loginGoogle} type="button">
      Sign in with Google
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
