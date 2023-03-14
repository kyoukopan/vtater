import React, { useCallback, useEffect, useState } from "react";

import { Container } from "@nextui-org/react";
import BrandHeader from "@/components/lib/BrandHeader";
import LoginCard from "@/components/Auth/Login";
import SignupModal from "@/components/Auth/Signup";
import Button from "@/components/lib/Button";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { auth } from "@/lib/common/firebase";

export default function LoginPage() {
  const [signupVisible, setSignupVisible] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (loading || error) return;
    if (user && !signupVisible) {
      router.replace("/profile");
    }
  }, [loading, router, user]);

  const handleClickJoin = useCallback(() => {
    setSignupVisible(true);
  }, []);
  const handleCloseSignup = useCallback(() => {
    setSignupVisible(false);
  }, []);

  return (
    <>
      <Container xs as="main" className="mt-32">
        <BrandHeader />
        <LoginCard className="my-8" />
        <Button
          rounded
          color="primary"
          size="lg"
          className="mx-auto"
          onClick={handleClickJoin}
        >
          No account? Join today!
        </Button>
      </Container>
      <SignupModal open={signupVisible} onClose={handleCloseSignup} />
    </>
  );
}
