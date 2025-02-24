import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useState } from 'react';

export type UserType = {
  id: string;
  name?: string;
  email: string;
  password?: string;
  bio?: string;
  zap?: string;
  link?: string;
  price?: string;
  skills?: string;
  favorites?: Array<string>;
};

/**
 * @param collectionName Collection name in plural (e.g. 'users'). Can also be a path to subcollection.
 * @returns
 */
export default function useDocument<T extends { [x: string]: any }>(
  collectionName: string,
  realtime: boolean = true
) {
  const db = getFirestore();
  const [loading, setLoading] = useState(true);
  const collectionRef = collection(db, collectionName);

  const searchEmail = async (email: string) => {
    const queryRef = query(collectionRef, where('email', '==', email));
    const querySnapshot = await getDocs(queryRef);
    return !querySnapshot.empty;
  };

  const register = async (email: string, password: string) => {
    try {
      const auth = getAuth();
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const uid = response.user.uid;
      const data = {
        id: uid,
        email,
      };

      const newDocRef = doc(collectionRef, uid);
      await setDoc(newDocRef, data);
      await updateDoc(newDocRef, {
        favorites: [],
      });
    } catch (error) {
      throw new Error('Ocorreu um erro ao fazer o cadastro');
    }
  };

  const getUserData = async (userId: string): Promise<UserType | null> => {
    try {
      setLoading(true);
      console.log('use doc id:', userId);

      const userDocRef = doc(collectionRef, userId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data() as UserType;
        return userData;
      }

      return null;
    } catch (error) {
      console.info('Erro ao obter os dados do usuário:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, register, searchEmail, getDoc, getUserData };
}
