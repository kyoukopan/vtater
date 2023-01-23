import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    } else {
      router.replace("/profile");
    }
  }, [loading, router, user]);

  return <main>Redirecting...</main>;
}
