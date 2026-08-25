import { initializeApp, cert, getApps } from 'firebase-admin/app';
import {
  getFirestore,
  type WhereFilterOp,
  type QueryDocumentSnapshot,
  type DocumentSnapshot,
} from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const serviceAccountPath =
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH || path.resolve(__dirname, '../../serviceAccountKey.json');

if (!getApps().length) {
  let serviceAccount: Record<string, unknown>;
  try {
    serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf-8'));
  } catch (error) {
    throw new Error(
      `Could not read Firebase service account key at "${serviceAccountPath}". ` +
        'Generate one from Firebase Console > Project settings > Service accounts, ' +
        'save it there (or set FIREBASE_SERVICE_ACCOUNT_PATH in backend/.env to its location).'
    );
  }
  initializeApp({ credential: cert(serviceAccount) });
}

export const db = getFirestore();

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
  const snapshot = await db.collection(collectionName).orderBy(orderField, direction).get();
  return snapshot.docs.map(toDocData);
}

export async function getWhere(
  collectionName: string,
  field: string,
  op: WhereFilterOp,
  value: unknown
): Promise<DocData[]> {
  const snapshot = await db.collection(collectionName).where(field, op, value).get();
  return snapshot.docs.map(toDocData);
}

export async function getById(collectionName: string, id: string): Promise<DocData | null> {
  const snap = await db.collection(collectionName).doc(id).get();
  return snap.exists ? toDocData(snap) : null;
}

export async function createDoc(
  collectionName: string,
  data: Record<string, unknown>
): Promise<DocData> {
  const now = new Date().toISOString();
  const payload = { ...sanitize(data), created_at: now, updated_at: now };
  const ref = await db.collection(collectionName).add(payload);
  return { id: ref.id, ...payload };
}

export async function updateDocById(
  collectionName: string,
  id: string,
  data: Record<string, unknown>
): Promise<DocData | null> {
  const ref = db.collection(collectionName).doc(id);
  const snap = await ref.get();
  if (!snap.exists) {
    return null;
  }
  const payload = { ...sanitize(data), updated_at: new Date().toISOString() };
  await ref.update(payload);
  return { id, ...snap.data(), ...payload };
}

export async function deleteDocById(collectionName: string, id: string): Promise<boolean> {
  const ref = db.collection(collectionName).doc(id);
  const snap = await ref.get();
  if (!snap.exists) {
    return false;
  }
  await ref.delete();
  return true;
}
