import type { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth, adminDb } from '@/lib/backend/firebase';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { Timestamp } from 'firebase-admin/firestore';

type SignupReq = {
  email: string;
  password: string;
};
export type SignupResp = {
  success: boolean;
  user?: UserRecord;
  errMsg?: string;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignupResp>
) {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  const { email, password } = req.body as SignupReq;
  if (!email || !(password?.length >= 6)) {
    res.status(400).json({ success: false, errMsg: 'Invalid request' });
    return;
  }

  try {
    // Create new user
    const user = await adminAuth.createUser({
      email,
      password,
    });
    if (!user) {
      // unable to create user
      throw 'Unable to sign up';
    }

    const timestamp = Timestamp.now();
    // Create user DB record
    try {
      await adminDb.doc(`users/${user.uid}`).create({
        createdAt: timestamp,
        updatedAt: timestamp,
      });
    } catch (error) {
      console.log("Error creating user DB entry - deleting auth entry");
      await adminAuth.deleteUser(user.uid);
      throw error;
    }

    res.json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, errMsg: 'An error occurred' });
  }
}
