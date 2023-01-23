import React, { useCallback, useState } from "react";

import { Container } from "@nextui-org/react";
import BrandHeader from "@/components/lib/BrandHeader";
import LoginCard from "@/components/Auth/Login";
import SignupModal from "@/components/Auth/Signup";
import Button from "@/components/lib/Button";

export default function LoginPage() {
  const [signupVisible, setSignupVisible] = useState(true);

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
