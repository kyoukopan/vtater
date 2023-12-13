import { ReactNode } from 'react';
import Text from './Text';

interface FieldRowProps {
  label: string;
  /** The value of the data - can be a string or a component */
  content?: string | ReactNode;
  /** The col span of the label section */
  labelSpan?: number;
  /** Whether to show null values (default true) */
  showNull?: boolean;
}
/**
 * Displays data fields with a label & contents in rows
 */
// eslint-disable-next-line import/prefer-default-export
export function FieldRow({
  label,
  content = '',
  labelSpan = 3,
  showNull = true,
}: FieldRowProps) {
  const contentExists = content !== '' && content != null;
  return (
    <div className='flex'>
      <div>
        <Text style={{ fontWeight: 'semibold' }}>{label}</Text>
      </div>
      <div>
        {!contentExists && showNull ? <Text color='$gray600'>n/a</Text> : ''}
        {contentExists &&
          (typeof content === 'string' ? (
            <Text ellipsis>{content}</Text>
          ) : (
            content
          ))}
      </div>
    </div>
  );
}
