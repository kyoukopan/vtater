import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button as NUIButton,
  ButtonProps as NUIButtonProps,
  Spinner,
} from '@nextui-org/react';

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
  style,
  wide = false,
  link = false,
  loading = false,
  disabled = false,
  ...props
}: ButtonProps) {
  const styles = {
    minWidth: 0,
    width: wide ? '100%' : 'fit-content',
    paddingLeft: link ? 0 : 24,
    paddingRight: link ? 0 : 24,
    ...style,
  };
  return (
    <NUIButton
      disabled={loading || disabled}
      ripple={!link}
      css={styles}
      isDisabled={disabled}
      variant={link ? 'light' : 'solid'}
      {...props}
    >
      {loading ? <Spinner /> : children}
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
  'size' | 'icon'
>) {
  return (
    <Button
      style={{
        display: 'inline-flex',
        height: size,
        width: size,
        borderRadius: size * 0.4,
        padding: 0,
        ...(rotate && { transform: 'rotate(5deg)' }),
        fontSize: (size / 5) * 2,
      }}
      isIconOnly
      {...props}
    >
      <FontAwesomeIcon icon={icon} />
    </Button>
  );
}
