import { initializeApp } from '@react-native-firebase/app';
import { getFirestore } from '@react-native-firebase/firestore';

const app = initializeApp();
export const db = getFirestore(app);
