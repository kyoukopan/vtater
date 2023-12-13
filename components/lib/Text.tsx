import {
  CSSProperties,
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
  createElement,
} from 'react';

interface TextProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  > {
  /** Centers the text */
  center?: boolean;
  /** Inline text instead of block text */
  inline?: boolean;
  /** Display ellipsis if cut off */
  ellipsis?: boolean;
  as?: keyof HTMLElementTagNameMap;
}
/**
 * Typography
 */
export default function Text({
  children,
  center = false,
  inline = false,
  ellipsis = false,
  style,
  as = 'p',
  ...props
}: TextProps) {
  const styles: CSSProperties = {
    marginBottom: 0,
    ...(center && { textAlign: 'center' }),
    ...(inline && { display: 'inline-block' }),
    ...(ellipsis && {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    }),
    ...style,
  };

  return createElement(as, { style: styles, ...props }, children);
}
