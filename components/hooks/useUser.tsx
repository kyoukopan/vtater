import { auth, db } from '@/lib/common/firebase';
import { User } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';

/**
 * Hook to get a user's auth object and data from DB
 */
export default function useUser(uid: string | undefined) {
  console.log(uid);
  if (!uid) {
    return { userData: null, userDataLoading: true };
  }
  const [userData, userDataLoading] = useDocumentData(doc(db, '/users', uid));
  return { userData, userDataLoading };
}
