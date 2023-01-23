import {
  Input as NUIInput,
  InputProps as NUIInputProps,
  styled,
} from "@nextui-org/react";

// ===========
// STYLES
// ===========

const TopInput = styled(NUIInput, {
  "& *": { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
});
const TopInputPassword = styled(NUIInput.Password, {
  "& *": { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 },
});
const BottomInput = styled(NUIInput, {
  "& *": { borderTopLeftRadius: 0, borderTopRightRadius: 0 },
});
const BottomInputPassword = styled(NUIInput.Password, {
  "& *": { borderTopLeftRadius: 0, borderTopRightRadius: 0 },
});

// =========
// CONSTS
// =========

const componentMap = {
  top: TopInput,
  bottom: BottomInput,
  topPassword: TopInputPassword,
  bottomPassword: BottomInputPassword,
};

type InputType =
  | typeof NUIInput
  | typeof NUIInput.Password
  | typeof TopInput
  | typeof TopInputPassword;

// =========
// MAIN
// =========

interface InputProps extends Partial<NUIInputProps> {
  /** A password field */
  password?: boolean;
  /** If stacking two inputs together, you can specify a top and bottom */
  side?: undefined | "top" | "bottom";
  /** For input validation */
  valid?: boolean;
  /** Triggers validation - useful when you don't want it to continuously display validation feedback */
  validateNow?: boolean;
  /** A hint to display - used for failed validation hints too */
  hint?: string | undefined;
  loading?: boolean;
}
/**
 * Input component
 */
export default function Input({
  clearable = true,
  password = false,
  side = undefined,
  valid = true,
  validateNow = false,
  hint = undefined,
  loading = false,
  disabled = false,
  ...props
}: InputProps) {
  let InputComponent: InputType = NUIInput;
  if (password) {
    InputComponent = NUIInput.Password;
    if (side) {
      InputComponent = componentMap[`${side}Password`];
    }
  } else if (side) {
    InputComponent = componentMap[side];
  }

  const color = !valid && validateNow ? "error" : "default";

  if (password) {
    return (
      <InputComponent
        bordered
        clearable={clearable}
        rounded={!side}
        animated={!side}
        type="password"
        status={color}
        color={color}
        helperColor={color}
        helperText={hint || undefined}
        disabled={loading || disabled}
        {...props}
      />
    );
  }
  return (
    <InputComponent
      bordered
      clearable={clearable}
      rounded={!side}
      animated={!side}
      disabled={loading || disabled}
      {...props}
    />
  );
}
