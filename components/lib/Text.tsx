/* eslint-disable react/jsx-props-no-spreading */
import { Text as NUIText, TextProps as NUITextProps } from "@nextui-org/react";

interface TextProps extends NUITextProps {
  /** Centers the text */
  center?: boolean;
}
/**
 * Typography. Currently a wrapper of NUI Text.
 */
export default function Text({
  children,
  center = false,
  css,
  ...props
}: TextProps) {
  const styles = {
    marginBottom: 0,
    ...(center && { textAlign: "center" }),
    ...css,
  };

  return (
    <NUIText css={styles} {...props}>
      {children}
    </NUIText>
  );
}
