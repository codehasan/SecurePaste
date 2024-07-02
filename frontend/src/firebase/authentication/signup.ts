import {
  createUserWithEmailAndPassword,
  getAuth,
  UserCredential,
} from 'firebase/auth';
import { getFirebaseApp } from '../config';
import { FirebaseError } from 'firebase/app';

const app = getFirebaseApp();
const auth = getAuth(app);

const signUpWithEmail = async (email: string, password: string) => {
  let credentials: UserCredential | null = null,
    error: FirebaseError | null = null;

  try {
    credentials = await createUserWithEmailAndPassword(auth, email, password);
  } catch (firebaseError) {
    error = firebaseError as FirebaseError;
  }

  return { credentials, error };
};

export { signUpWithEmail };
