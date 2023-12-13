'use client';
import Avatar from '@/components/lib/Avatar';
import Header from '@/components/lib/Header';
import NavbarWrapper from '@/components/NavbarWrapper';
import { db } from '@/lib/common/firebase';
import { Spinner } from '@nextui-org/react';
import { collection } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useCollection } from 'react-firebase-hooks/firestore';

export default function Community() {
  const [users, loading] = useCollection(collection(db, 'users'));
  const router = useRouter();
  return (
    <NavbarWrapper>
      {loading && <Spinner />}
      {!loading &&
        users?.docs?.length &&
        users?.docs?.map((user) => {
          return (
            <div
              className='flex cursor-pointer items-center space-x-3'
              onClick={() => router.push(`/profile/${user?.id}`)}
            >
              <Avatar uid={user?.id} key={user?.id} size='2xl' />
              <Header h={3}>{user?.get('displayName')}</Header>
            </div>
          );
        })}
    </NavbarWrapper>
  );
}
