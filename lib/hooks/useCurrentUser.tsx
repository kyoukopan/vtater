import { auth, db } from '@/lib/common/firebase';
import { doc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';

/**
 * Hook to get the CURRENT user's auth object and data from DB
 */
export default function useCurrentUser() {
  const [user, userLoading] = useAuthState(auth);
  const [userData, userDataLoading] = useDocumentData(
    user && doc(db, 'users', user.uid)
  );
  return { user, userData, userLoading, userDataLoading };
}
