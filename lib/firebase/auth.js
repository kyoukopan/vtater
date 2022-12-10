import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as _signOut
} from 'firebase/auth';
import { auth } from './init';

const provider = new GoogleAuthProvider();

/** ❀。• *₊°。 ❀°。
 * EMAIL AND PASSWORD
 ❀。• *₊°。 ❀°。 */

/**
 * Sign up a user using email and password.
 * @param {string} email
 * @param {string} password
 * @returns {object} User credentials; error if error
 */
export const signupEmail = async (email, password) => {
  try {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error) {
    return error;
  }
};

/**
 * Log in a user using email and password.
 * @param {string} email
 * @param {string} password
 * @returns {object} User credentials; error if error
 */
export const loginEmail = async (email, password) => {
  try {
    const user = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error) {
    return error;
  }
};

/** ❀。• *₊°。 ❀°。
 * GOOGLE SIGN IN
 ❀。• *₊°。 ❀°。 */

/**
 * Log in a user using Google Auth in a popup window.
 * @returns {object} User credentials; error if error
 */
export const loginGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    return error;
  }
};

/**
 * TODO: do we need this?
 */
export const onAuthChange = () => {
  onAuthStateChanged(auth, user => {
    if (user) {
      // user is signed in
      return user;
    }
    // user is signed out
    return null;
  });
};

/**
 * Signs out the authenticated user
 * @returns {boolean | object} True if successful, else error object
 */
export const signOut = async () => {
  try {
    await _signOut(auth);
    return true;
  } catch (error) {
    return error;
  }
}