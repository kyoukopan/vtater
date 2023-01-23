import { FormElement, Modal } from "@nextui-org/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Button from "../lib/Button";
import Input from "../lib/Input";
import Text from "../lib/Text";

interface SignupProps {
  /** Is the signup modal visible? */
  open: boolean;
  /** Called in order to close the modal */
  onClose: () => void;
}
export default function SignupModal({ open, onClose }: SignupProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const passwordFieldsValid = Boolean(
    password && passwordConfirm && password === passwordConfirm
  );
  const canSubmit = email && passwordFieldsValid;

  const handleChangeValue = (e: ChangeEvent<FormElement>, field: string) => {
    let set = setEmail;
    switch (field) {
      case "password":
        set = setPassword;
        break;
      case "passwordConfirm":
        set = setPasswordConfirm;
        break;
      default:
        break;
    }
    set(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<unknown>) => {
    e.preventDefault();
    if (!canSubmit) return;
    createUserWithEmailAndPassword(email, password)
      .then((userResp) => {
        if (!userResp) {
          toast.error("Unable to sign up. Please try again.");
          setPassword("");
          setPasswordConfirm("");
        } else {
          onClose();
          router.replace("/profile");
        }
      })
      .catch(() => {
        toast.error("Unable to sign up. Please try again.");
      });
  };

  const showPasswordDoesNotMatchHint = Boolean(
    email && password && passwordConfirm && !passwordFieldsValid
  );

  return (
    <Modal closeButton blur open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <Modal.Header justify="flex-start">
          <Text h3>sign up</Text>
        </Modal.Header>
        <Modal.Body className="h-48 space-y-8" autoMargin={false}>
          <Input
            required
            value={email}
            onChange={(e) => handleChangeValue(e, "email")}
            aria-label="email"
            placeholder="email"
            type="email"
            loading={loading}
          />
          <div>
            <Input
              required
              value={password}
              valid={passwordFieldsValid}
              validateNow={showPasswordDoesNotMatchHint}
              onChange={(e) => handleChangeValue(e, "password")}
              password
              side="top"
              aria-label="password"
              placeholder="password"
              fullWidth
              loading={loading}
            />
            <Input
              required
              value={passwordConfirm}
              valid={passwordFieldsValid}
              validateNow={showPasswordDoesNotMatchHint}
              hint={
                showPasswordDoesNotMatchHint
                  ? "Password confirmation does not match"
                  : undefined
              }
              onChange={(e) => handleChangeValue(e, "passwordConfirm")}
              password
              side="bottom"
              aria-label="password-confirmation"
              placeholder="confirm password"
              className="mt-[3px]"
              fullWidth
              loading={loading}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            loading={loading}
            size="sm"
            type="submit"
            disabled={!canSubmit}
          >
            submit
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
