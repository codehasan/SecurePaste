import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { getFirebaseApp } from '../config';
import { User as Document } from '@/schema/ZodSchema';
import { User } from 'firebase/auth';

const app = getFirebaseApp();
const db = getFirestore(app);

const getUserDetails = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    console.log('No such user!');
    return null;
  }
};

const setUserDetails = async (user: User, data: Document) => {
  const userRef = doc(db, 'users', user.uid);

  await setDoc(
    userRef,
    {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    },
    { merge: true }
  );
};

export { getUserDetails };
