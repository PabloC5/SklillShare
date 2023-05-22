import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import {
  DocumentData,
  QuerySnapshot,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';

export type User = {
  id?: string;
  email: string;
  password: string;
};

/**
 * Hook to access and manage a firestore document.
 * @param collectionName Collection name in plural (e.g. 'users'). Can also be a path to subcollection.
 * @returns
 */
export default function useDocument<T extends { [x: string]: any }>(
  collectionName: string,
  realtime: boolean = true
) {
  const db = getFirestore();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T>();

  const collectionRef = collection(db, collectionName);

  const searchEmail = async (email: string) => {
    const queryRef = query(collectionRef, where('email', '==', email));
    const querySnapshot = await getDocs(queryRef);
    let result = false;
    querySnapshot.forEach((doc) => {
      const data = doc.data() as User;
      if (data.email !== '') {
        result = true;
      }
    });
    return result;
  };

  const getUsers = async () => {
    const querySnapshot = await getDocs(collectionRef);
    //console.log(querySnapshot);
    const users: { [key: string]: DocumentData } = {};
    querySnapshot.forEach((doc) => {
      users[doc.id] = doc.data();
    });
    return users;
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
      // ...
    } catch (error) {
      // Handle error
    }
  };

  /**
   * Refresh data, useful for non-realtime usage.
   * @returns updated data.
   */
  const refresh = async () => {
    setLoading(true);
    const docSnap = await getDoc(doc(collectionRef));
    const data = docSnap.data() as T;
    setData(data);
    setLoading(false);
    return data;
  };

  // Initial call to fill 'data' with the document when precache is active.
  useEffect(() => {
    refresh();

    const unsub = realtime
      ? onSnapshot(doc(collectionRef), (docSnap) => {
          const data = docSnap.data() as T;
          setData(data);
        })
      : () => {};

    return unsub;
    // eslint-disable-next-line
  }, []);

  return { data, loading, refresh, register, getUsers, searchEmail };
}
