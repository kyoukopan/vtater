import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Link,
  Avatar as NUIAvatar,
  Navbar,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React, { Key } from 'react';
import { useSignOut } from 'react-firebase-hooks/auth';

import { auth } from '@/lib/common/firebase';

import useCurrentUser from '../lib/hooks/useCurrentUser';

export default function NavbarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [signOut, loading, error] = useSignOut(auth);
  const { userData } = useCurrentUser();
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
      case 'account':
        router.push('/account');
        break;
      case 'signOut':
        handleSignout();
        break;
    }
  }

  return (
    <>
      <Navbar>
        <NavbarContent className='mx-auto flex w-full max-w-6xl justify-evenly'>
          <NavbarItem isActive={activePage === '/feed'}>
            <Link href='/feed'>feed</Link>
          </NavbarItem>
          <NavbarItem isActive={activePage === '/community'}>
            <Link href='/community'>community</Link>
          </NavbarItem>
          <NavbarItem isActive={activePage === '/live'}>
            <Link href='/live'>
              <div className='mr-1 h-4 w-4 rounded-xl bg-red-500' /> live
            </Link>
          </NavbarItem>
        </NavbarContent>
        <div className='absolute right-16 top-8'>
          <Dropdown>
            <DropdownTrigger>
              <NUIAvatar
                size='lg'
                name={
                  userData?.displayName
                    ? userData.displayName.slice(0, 2)
                    : userData?.email?.slice(0, 2)
                }
                src={userData?.avatarURL || undefined}
                className='mr-4 inline-flex cursor-pointer hover:shadow-md'
              />
            </DropdownTrigger>
            <DropdownMenu onAction={handleDropdownSelect}>
              <DropdownItem key='profile' variant='light'>
                Profile
              </DropdownItem>
              <DropdownItem key='account' variant='light'>
                Account
              </DropdownItem>
              <DropdownItem
                key='signOut'
                showDivider
                variant='light'
                color='danger'
              >
                Sign Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </Navbar>
      {children}
    </>
  );
}
