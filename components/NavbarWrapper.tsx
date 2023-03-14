import { Dropdown, Navbar, Avatar as NUIAvatar } from '@nextui-org/react';
import React, { Key } from 'react';
import { useAuthState, useSignOut } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/common/firebase';
import { useRouter } from 'next/router';

export default function NavbarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [signOut, loading, error] = useSignOut(auth);
  const [user] = useAuthState(auth);
  const router = useRouter();
  const activePage = router.pathname;

  function handleSignout() {
    if (loading || error) return;
    signOut()
      .then((success) => {
        if (success) {
          router.push('/login');
        }
      })
      .catch((err) => {
        // TODO: handle error
        console.error(err.message);
      });
  }

  function handleDropdownSelect(key: Key) {
    switch (key) {
      case 'profile':
        router.push('/profile');
        break;
      case 'signOut':
        handleSignout();
        break;
    }
  }

  return (
    <>
      <Navbar>
        <Navbar.Content className='mx-auto flex w-full max-w-6xl justify-evenly'>
          <Navbar.Link isActive={activePage === '/feed'} href='/feed'>
            feed
          </Navbar.Link>
          <Navbar.Link isActive={activePage === '/community'} href='/community'>
            community
          </Navbar.Link>
          <Navbar.Link isActive={activePage === '/live'} href='/live'>
            <div className='mr-1 h-4 w-4 rounded-xl bg-red-500' /> live
          </Navbar.Link>
        </Navbar.Content>
        <div className='absolute right-16 top-8'>
          <Dropdown placement='bottom-right'>
            <Dropdown.Trigger>
              <NUIAvatar
                size='xl'
                text={
                  user?.displayName
                    ? user.displayName.slice(0, 2)
                    : user?.email?.slice(0, 2)
                }
                src={user?.photoURL || undefined}
                className='mr-4 inline-flex hover:shadow-md'
                pointer
              />
            </Dropdown.Trigger>
            <Dropdown.Menu onAction={handleDropdownSelect}>
              <Dropdown.Item key='profile' variant='light'>
                Profile
              </Dropdown.Item>
              <Dropdown.Item
                key='signOut'
                withDivider
                variant='light'
                color='error'
              >
                Sign Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Navbar>
      {children}
    </>
  );
}
