import { doc, updateDoc } from 'firebase/firestore';
import { ref } from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useUploadFile } from 'react-firebase-hooks/storage';

import { db, storage } from '@/lib/common/firebase';

import useCurrentUser from './useCurrentUser';

/**
 * Hook to get a user's auth object and data from DB
 */
export default function useUser(uid: string | undefined) {
  if (!uid) {
    return { userData: null, userDataLoading: true };
  }
  const [userData, userDataLoading] = useDocumentData(doc(db, '/users', uid));
  return { userData, userDataLoading };
}

export function useUpdateUserGallery() {
  const { user, userData, userDataLoading } = useCurrentUser();
  const [upload] = useUploadFile();
  const [updating, setUpdating] = useState(false);
  const [existingUrls, setExistingUrls] = useState([]);
  useEffect(() => {
    if (userDataLoading) return;
    setExistingUrls(userData?.gallery?.urls);
  }, [userDataLoading]);
  async function uploadFile(file: any) {
    if (!user || userDataLoading) return null;
    const uploadDocRef = ref(
      storage,
      `users/uploads/${user?.uid}/${file.name}`,
    );
    setUpdating(true);
    try {
      const result = await upload(uploadDocRef, file);
      console.log(result);
      if (!result) {
        setUpdating(false);
        return null;
      }
      const url = `http://localhost:9199/${result.ref.bucket}/${result.ref?.fullPath}`;
      const dbDocRef = doc(db, '/users', user.uid);
      const newUrls = userData?.galleryUrls || [];
      newUrls.push(url);
      await updateDoc(dbDocRef, {
        galleryUrls: newUrls,
      });
      setUpdating(false);
      return url;
    } catch {
      setUpdating(false);
      return null;
    }
  }
  return { uploadFile, updating, loading: userDataLoading };
}
