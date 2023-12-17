'use client';

import { Card, Image } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import NavbarWrapper from '@/components/NavbarWrapper';
import Avatar from '@/components/lib/Avatar';
import Button from '@/components/lib/Button';
import { FieldRow } from '@/components/lib/Field';
import Header from '@/components/lib/Header';
import Text from '@/components/lib/Text';
import useCurrentUser from '@/lib/hooks/useCurrentUser';
import useUser from '@/lib/hooks/useUser';

export default function UserProfile({
  params: { uid },
}: {
  params: { uid: string };
}) {
  const router = useRouter();

  const { userData, userDataLoading } = useUser(uid as string);
  const { user: currentUser } = useCurrentUser();

  const [layout, setLayout] = useState(userData?.gallery?.layout || 'grid');

  useEffect(() => {
    if (userDataLoading) return;
    setLayout(userData?.gallery?.layout || 'grid');
  }, [userData?.gallery?.layout, userDataLoading]);

  console.log(uid);
  return (
    <NavbarWrapper>
      <main>
        <Card shadow='none' className='my-8 min-h-[288px] space-y-2 py-8 px-16'>
          <div className='flex space-x-8'>
            <div>
              <Avatar size='huge' uid={uid as string} />
            </div>
            <div className='relative top-4 mt-auto w-full'>
              {userData?.pronouns && <Text>{userData?.pronouns}</Text>}
              {userData?.ageRange && <Text>{userData?.ageRange}</Text>}
              {userData?.birthWeek && (
                <FieldRow label='birth week' content={userData?.birthWeek} />
              )}
            </div>
          </div>
          <Header h={2} inline>
            {userData?.displayName}
          </Header>
        </Card>
        <h2>gallery</h2>
        {currentUser?.uid === uid && (
          <Button onPress={() => router.push('/gallery/edit')}>Update</Button>
        )}
        <div className='pt-8'>
          {userData && !userDataLoading && (
            <>
              <div className='gap-2'>
                {userData?.galleryUrls?.map((src: string) => (
                  <div
                    className={
                      layout === 'full-width' ? 'h-[420px] w-full' : 'h-72'
                    }
                  >
                    <Image
                      src={src}
                      alt='sample image'
                      width='100%'
                      className='object-cover'
                    />
                  </div>
                ))}
              </div>
              {!userData?.galleryUrls?.length && (
                <div className='mt-4 flex w-48 justify-center rounded-xl bg-gray-200 py-1.5 px-10'>
                  <Text>no uploads yet</Text>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </NavbarWrapper>
  );
}
