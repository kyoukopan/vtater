import useUser from '@/components/hooks/useCurrentUser';
import { Loading } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Profile() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace(`/profile/${user?.uid}`);
      return;
    }
    router.replace('/login');
  });
  return <Loading />;
}
