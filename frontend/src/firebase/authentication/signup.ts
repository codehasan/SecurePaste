import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { getFirebaseApp } from '../config';

const app = getFirebaseApp();
const auth = getAuth(app);

const signUpWithEmail = async (email: string, password: string) => {
  let result = null,
    error = null;

  try {
    result = await createUserWithEmailAndPassword(auth, email, password);
  } catch (e) {
    error = e;
  }

  return { result, error };
};

export { signUpWithEmail };
