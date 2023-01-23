import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

export default function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user || error) {
      router.replace("/login");
    }
  }, [error, loading, router, user]);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}
