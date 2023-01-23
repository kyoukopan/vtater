import { Card } from "@nextui-org/react";
import { FormEvent, useCallback, useState } from "react";
import Button from "../lib/Button";
import Input from "../lib/Input";
import Text from "../lib/Text";

export default function LoginCard({ className }: { className: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
      />
      <Input
        password
        aria-label="password"
        value={password}
        valid={canSubmit}
        required
        onChange={(e) => handleChange(e.target.value, "password")}
        placeholder="password"
      />
      <div className="flex justify-between">
        <Button size="sm" link onClick={() => {}}>
          forgot your password?
        </Button>
        <Button disabled={!canSubmit} type="submit" size="sm">
          continue
        </Button>
      </div>
    </Card>
  );
}
