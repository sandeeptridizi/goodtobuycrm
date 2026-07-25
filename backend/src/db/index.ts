import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query as firestoreQuery,
  where,
  orderBy,
  type WhereFilterOp,
  type QueryDocumentSnapshot,
  type DocumentSnapshot,
} from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error(
    'Missing Firebase configuration. Set FIREBASE_API_KEY, FIREBASE_PROJECT_ID (and the other FIREBASE_* vars) in backend/.env'
  );
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export type DocData = { id: string } & Record<string, any>;

function toDocData(snap: QueryDocumentSnapshot | DocumentSnapshot): DocData {
  return { id: snap.id, ...snap.data() };
}

// Firestore rejects `undefined` values, so map them to null (SQL-like behavior).
function sanitize(data: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    clean[key] = value === undefined ? null : value;
  }
  return clean;
}

export async function getAll(
  collectionName: string,
  orderField = 'created_at',
  direction: 'asc' | 'desc' = 'desc'
): Promise<DocData[]> {
  const q = firestoreQuery(collection(db, collectionName), orderBy(orderField, direction));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(toDocData);
}

export async function getWhere(
  collectionName: string,
  field: string,
  op: WhereFilterOp,
  value: unknown
): Promise<DocData[]> {
  const q = firestoreQuery(collection(db, collectionName), where(field, op, value));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(toDocData);
}

export async function getById(collectionName: string, id: string): Promise<DocData | null> {
  const snap = await getDoc(doc(db, collectionName, id));
  return snap.exists() ? toDocData(snap) : null;
}

export async function createDoc(
  collectionName: string,
  data: Record<string, unknown>
): Promise<DocData> {
  const now = new Date().toISOString();
  const payload = { ...sanitize(data), created_at: now, updated_at: now };
  const ref = await addDoc(collection(db, collectionName), payload);
  return { id: ref.id, ...payload };
}

export async function updateDocById(
  collectionName: string,
  id: string,
  data: Record<string, unknown>
): Promise<DocData | null> {
  const ref = doc(db, collectionName, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    return null;
  }
  const payload = { ...sanitize(data), updated_at: new Date().toISOString() };
  await updateDoc(ref, payload);
  return { id, ...snap.data(), ...payload };
}

export async function deleteDocById(collectionName: string, id: string): Promise<boolean> {
  const ref = doc(db, collectionName, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    return false;
  }
  await deleteDoc(ref);
  return true;
}
