import AuthWrapper from '@/components/Auth/AuthWrapper';
import useUser from '@/components/hooks/useUser';
import Avatar from '@/components/lib/Avatar';
import { FieldRow } from '@/components/lib/Field';
import Text from '@/components/lib/Text';
import NavbarWrapper from '@/components/NavbarWrapper';
import { Badge, Card, Container } from '@nextui-org/react';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';

export default function UserProfile() {
  const router = useRouter();

  const { uid } = router.query;
  const { userData } = useUser(uid as string);

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
        </Container>
      </NavbarWrapper>
    </AuthWrapper>
  );
}
