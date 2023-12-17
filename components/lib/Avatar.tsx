import { faPen } from '@fortawesome/free-solid-svg-icons';
import { AvatarProps, Avatar as NUIAvatar } from '@nextui-org/react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth } from '@/lib/common/firebase';

import useUser from '../../lib/hooks/useUser';
import { IconButton } from './Button';

/**
 * A user avatar with optional edit button
 */
export default function Avatar({
  customSrc,
  editButton = false,
  size = 'lg',
  onPress = () => {},
  className = '',
  uid,
  ...props
}: {
  /** If null, uses current user's avatar */
  uid?: string;
  /** Override the image source */
  customSrc?: string;
  /** Show edit button */
  editButton?: boolean;
  /** For clicking avatar or the optional edit button */
  onPress?: () => void;
  size?: 'huge' | '2xl' | AvatarProps['size'];
  className?: string;
}) {
  const { userData: user } = useUser(uid);

  return (
    <>
      <NUIAvatar
        size='lg'
        name={
          user?.displayName
            ? user.displayName.slice(0, 2)
            : user?.email?.slice(0, 2)
        }
        src={customSrc || user?.avatarURL || undefined}
        className={`mr-4 inline-flex cursor-pointer hover:shadow-md ${
          size === 'huge' ? 'h-40 w-40' : size === '2xl' ? 'h-24 w-24' : ''
        } ${className}`}
        onClick={onPress}
        {...props}
      />
      {editButton && (
        <IconButton
          className='absolute bottom-0.5 right-4 z-[350]'
          size={20}
          type='button'
          icon={faPen}
          onPress={onPress}
        />
      )}
    </>
  );
}
