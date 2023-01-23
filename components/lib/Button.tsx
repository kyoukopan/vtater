/* eslint-disable react/jsx-props-no-spreading */
import {
  Button as NUIButton,
  ButtonProps as NUIButtonProps,
  Loading,
} from "@nextui-org/react";

interface ButtonProps extends NUIButtonProps {
  /** A button with 100% width */
  wide?: boolean;
  /** A text-only style button */
  link?: boolean;
  /** Display a loading state */
  loading?: boolean;
}
/**
 * A button.
 *
 * @param link Text-only link style
 */
export default function Button({
  children,
  css,
  wide = false,
  link = false,
  loading = false,
  disabled = false,
  ...props
}: ButtonProps) {
  const styles = {
    minWidth: 0,
    width: wide ? "100%" : "fit-content",
    paddingLeft: link ? 0 : 24,
    paddingRight: link ? 0 : 24,
    ...css,
  };
  return (
    <NUIButton disabled={loading || disabled} light={link} ripple={!link} css={styles} {...props}>
      {loading ? <Loading type="points" color="currentColor" /> : children}
    </NUIButton>
  );
}
