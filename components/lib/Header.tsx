import {
  CSSProperties,
  DetailedHTMLProps,
  HTMLAttributes,
  createElement,
} from 'react';

interface HeaderProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  > {
  h: 1 | 2 | 3 | 4 | 5 | 6;
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
export default function Header({
  children,
  center = false,
  inline = false,
  ellipsis = false,
  style,
  h,
  as,
  ...props
}: HeaderProps) {
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

  return createElement(as || `h${h}`, { style: styles, ...props }, children);
}
