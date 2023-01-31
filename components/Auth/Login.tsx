import { auth } from "@/lib/common/firebase";
import { Card, Modal } from "@nextui-org/react";
import { FormEvent, useEffect, useState } from "react";
import {
  useSendPasswordResetEmail,
  useSignInWithEmailAndPassword,
} from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import Button from "../lib/Button";
import Input from "../lib/Input";
import Text from "../lib/Text";

function PasswordResetLinkAndModal({
  email,
  setEmail,
}: {
  email: string;
  setEmail: (value: string) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);
  function handlePasswordReset(e: FormEvent) {
    if (!email || sending) return;
    e.preventDefault();
    sendPasswordResetEmail(email)
      .then((success) => {
        if (success) {
          toast.success("A password reset email has been sent");
          setModalOpen(false);
        }
      })
      .catch(() => {
        toast.error("Unable to send password reset email.");
        setEmail("");
      });
  }

  useEffect(() => {
    if (error)
      toast.error(
        "Unable to send password reset email. Please ensure email is the same one as on your account."
      );
    setEmail("");
  }, [error, setEmail]);

  return (
    <>
      <Button size="sm" link onPress={() => setModalOpen(true)}>
        forgot your password?
      </Button>
      <Modal
        closeButton
        blur
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={(e) => handlePasswordReset(e)}>
          <Modal.Header justify="flex-start">
            <Text h3>password reset</Text>
          </Modal.Header>
          <Modal.Body className="h-48 space-y-8" autoMargin={false}>
            <Text>
              Please enter the email associated with your account.
              <br />
              An email will be sent allowing you to reset your password.
            </Text>
            <Input
              required
              value={email}
              onChange={(e) => setEmail(e.target?.value)}
              aria-label="email-for-password-reset"
              placeholder="email"
              type="email"
              loading={sending}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button loading={sending} size="sm" type="submit" disabled={!email}>
              send email
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

export default function LoginCard({ className }: { className: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInWithEmailAndPassword, , loading] =
    useSignInWithEmailAndPassword(auth);

  const handleChange = (value: string, field: string) => {
    if (field === "email") {
      setEmail(value);
    } else {
      setPassword(value);
    }
  };

  const canSubmit = !!(email && password);

  const handleSubmit = (e: FormEvent<unknown>) => {
    e.preventDefault();
    if (!canSubmit) return;
    signInWithEmailAndPassword(email, password)
      .then((userResp) => {
        if (!userResp) toast.error("Unable to log in. Please try again.");
        setPassword("");
      })
      .catch(() => {
        toast.error("Unable to log in. Please try again.");
      });
  };

  return (
    <Card
      as="form"
      className={`space-y-4 py-8 px-8 ${className}`}
      onSubmit={(e) => handleSubmit(e)}
    >
      <Text h3 className="mb-4">
        sign in
      </Text>
      <Input
        aria-label="email"
        value={email}
        onChange={(e) => handleChange(e.target.value, "email")}
        required
        placeholder="email"
        type="email"
        loading={loading}
      />
      <Input
        password
        aria-label="password"
        value={password}
        valid={canSubmit}
        required
        onChange={(e) => handleChange(e.target.value, "password")}
        placeholder="password"
        loading={loading}
      />
      <div className="flex justify-between">
        <PasswordResetLinkAndModal email={email} setEmail={setEmail} />
        <Button disabled={!canSubmit} loading={loading} type="submit" size="sm">
          continue
        </Button>
      </div>
    </Card>
  );
}
