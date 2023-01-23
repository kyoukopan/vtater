import { Navbar } from "@nextui-org/react";
import React from "react";
import Button from "./lib/Button";
import { useSignOut } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/router";

export default function NavbarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [signOut, loading, error] = useSignOut(auth);
  const router = useRouter();

  function handleSignout() {
    if (loading || error) return;
    signOut()
      .then((success) => {
        if (success) {
          router.push("/login");
        }
      })
      .catch((err) => {
        // TODO: handle error
        console.error(err.message);
      });
  }

  return (
    <>
      <Navbar css={{ "& .nextui-navbar-container": { justifyContent: "end" } }}>
        <Navbar.Content>
          <Navbar.Item>
            <Button bordered rounded onPress={handleSignout}>
              Logout
            </Button>
          </Navbar.Item>
        </Navbar.Content>
      </Navbar>
      {children}
    </>
  );
}
