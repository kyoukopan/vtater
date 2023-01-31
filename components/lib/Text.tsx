/* eslint-disable react/jsx-props-no-spreading */
import { Text as NUIText, TextProps as NUITextProps } from "@nextui-org/react";

interface TextProps extends NUITextProps {
  /** Centers the text */
  center?: boolean;
  /** Inline text instead of block text */
  inline?: boolean;
  /** Display ellipsis if cut off */
  ellipsis?: boolean;
}
/**
 * Typography. Currently a wrapper of NUI Text.
 */
export default function Text({
  children,
  center = false,
  inline = false,
  ellipsis = false,
  css,
  ...props
}: TextProps) {
  const styles = {
    marginBottom: 0,
    ...(center && { textAlign: "center" }),
    ...(inline && { display: "inline-block" }),
    ...(ellipsis && {
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    }),
    ...css,
  };

  return (
    <NUIText css={styles} {...props}>
      {children}
    </NUIText>
  );
}
