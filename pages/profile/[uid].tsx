import AuthWrapper from '@/components/Auth/AuthWrapper';
import useCurrentUser from '@/lib/hooks/useCurrentUser';
import useUser from '@/lib/hooks/useUser';
import Avatar from '@/components/lib/Avatar';
import Button from '@/components/lib/Button';
import { FieldRow } from '@/components/lib/Field';
import Text from '@/components/lib/Text';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Badge, Card, Container, Grid, Image } from '@nextui-org/react';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function UserProfile({ uid }: { uid: string }) {
  const router = useRouter();

  const { userData, userDataLoading } = useUser(uid as string);
  const { user: currentUser } = useCurrentUser();

  const [layout, setLayout] = useState(userData?.gallery?.layout || 'grid');

  useEffect(() => {
    if (userDataLoading) return;
    setLayout(userData?.gallery?.layout || 'grid');
  }, [userDataLoading]);

  console.log(uid);
  return (
    <AuthWrapper>
      <NavbarWrapper>
        <Container sm>
          <Card
            variant='bordered'
            className='my-8 min-h-[288px] space-y-2 py-8 px-16'
          >
            <div className='flex space-x-8'>
              <div>
                <Avatar
                  //@ts-ignore
                  size='huge'
                  uid={uid as string}
                />
              </div>
              <div className='relative top-4 mt-auto w-full'>
                {userData?.pronouns && <Text>{userData?.pronouns}</Text>}
                {userData?.ageRange && <Text>{userData?.ageRange}</Text>}
                {userData?.birthWeek && (
                  <FieldRow
                    label={'birth week'}
                    content={userData?.birthWeek}
                  />
                )}
              </div>
            </div>
            <Text h2 inline>
              {userData?.displayName}
            </Text>
          </Card>
          <h2>gallery</h2>
          {currentUser?.uid === uid && (
            <Button onPress={() => router.push('/gallery/edit')}>Update</Button>
          )}
          <div>
            {userData && !userDataLoading && (
              <Grid.Container gap={2} justify='center'>
                {userData?.galleryUrls?.map((src: string) => (
                  <Grid xs={layout === 'full-width' ? 12 : 4}>
                    <Image src={src} alt='sample image' />
                  </Grid>
                ))}
              </Grid.Container>
            )}
          </div>
        </Container>
      </NavbarWrapper>
    </AuthWrapper>
  );
}

export async function getServerSideProps(context: any) {
  const { uid } = context.params;
  return {
    props: { uid }, // will be passed to the page component as props
  };
}
