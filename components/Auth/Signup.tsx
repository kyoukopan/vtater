import { FormElement, Modal } from "@nextui-org/react";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";
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

  const passwordFieldsValid = password === passwordConfirm;
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

  const handleSubmit = (e: FormEvent<unknown>) => {
    e.preventDefault();
    if (!canSubmit) return;
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
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button size="sm" type="submit" disabled={!canSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
