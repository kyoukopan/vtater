/* eslint-disable react/jsx-props-no-spreading */
import {
  Button as NUIButton,
  ButtonProps as NUIButtonProps,
  Loading,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

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
    <NUIButton
      disabled={loading || disabled}
      light={link}
      ripple={!link}
      css={styles}
      {...props}
    >
      {loading ? <Loading type="points" color="currentColor" /> : children}
    </NUIButton>
  );
}

export function IconButton({
  size = 40,
  icon,
  rotate = true,
  ...props
}: { size?: number; icon: IconDefinition; rotate?: boolean } & Omit<
  ButtonProps,
  "size" | "icon"
>) {
  return (
    <Button
      css={{
        display: "inline-flex",
        height: size,
        width: size,
        borderRadius: size * 0.4,
        padding: 0,
        ...(rotate && { transform: "rotate(5deg)" }),
        fontSize: (size / 5) * 2,
      }}
      icon={<FontAwesomeIcon icon={icon} />}
      {...props}
    />
  );
}
