import { auth } from "@/lib/firebase";
import { Card } from "@nextui-org/react";
import { FormEvent, useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import Button from "../lib/Button";
import Input from "../lib/Input";
import Text from "../lib/Text";

export default function LoginCard({ className }: { className: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInWithEmailAndPassword, user, loading, error] =
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
      .then(() => {})
      .catch((err) => {
        // TODO: Handle error
        console.error(err.message);
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
        <Button size="sm" link onClick={() => {}}>
          forgot your password?
        </Button>
        <Button disabled={!canSubmit} loading={loading} type="submit" size="sm">
          continue
        </Button>
      </div>
    </Card>
  );
}
