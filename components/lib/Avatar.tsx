import { auth } from '@/lib/common/firebase';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { Avatar as NUIAvatar, AvatarProps } from '@nextui-org/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import useUser from '../hooks/useUser';
import { IconButton } from './Button';

/**
 * A user avatar with optional edit button
 */
export default function Avatar({
  customSrc,
  editButton = false,
  size = 'xl',
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
  size?: 'huge' | AvatarProps['size'];
  className?: string;
} & Partial<AvatarProps>) {
  const { userData: user } = useUser(uid);

  return (
    <>
      <NUIAvatar
        size='xl'
        text={
          user?.displayName
            ? user.displayName.slice(0, 2)
            : user?.email?.slice(0, 2)
        }
        src={customSrc || user?.avatarURL || undefined}
        className={`mr-4 inline-flex hover:shadow-md ${
          size === 'huge' ? 'h-40 w-40' : ''
        } ${className}`}
        css={
          size === 'huge'
            ? { '.nextui-avatar-text': { fontSize: 64 } }
            : undefined
        }
        onClick={onPress}
        pointer
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
