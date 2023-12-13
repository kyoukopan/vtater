'use server';
import { adminAuth, adminDb } from '@/lib/backend/firebase';
import { apiResponse } from '@/lib/backend/utils';
import { Timestamp } from 'firebase-admin/firestore';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { NextRequest, NextResponse } from 'next/server';

type SignupReq = {
  email: string;
  password: string;
};
export type SignupResp = NextResponse<{
  success: boolean;
  user?: UserRecord;
  errMsg?: string;
}>;
export async function POST(
  req: NextRequest,
  context: { params: string }
): Promise<SignupResp> {
  const { email, password } = (await req.json()) as SignupReq;
  if (!email || !(password?.length >= 6)) {
    return apiResponse({ success: false, errMsg: 'Invalid request' }, 400);
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
      console.log('Error creating user DB entry - deleting auth entry');
      await adminAuth.deleteUser(user.uid);
      throw error;
    }

    return apiResponse({ success: true, user });
  } catch (error) {
    console.log(error);
    return apiResponse({ success: false, errMsg: 'An error occurred' }, 500);
  }
}
