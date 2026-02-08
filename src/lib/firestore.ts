import { app } from './firebase';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';

const db = getFirestore(app);

export { db, collection, doc, setDoc, getDoc, query, where, getDocs };