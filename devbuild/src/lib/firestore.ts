import { getFirebase } from "@/lib/firebase";
import { addDoc, collection, doc, getDoc, getDocs, limit, query, serverTimestamp, setDoc, where } from "firebase/firestore";

export type SubmissionDoc = {
  userId: string;
  taskId: string;
  files: Record<string, string>;
  checks: { name: string; passed: boolean }[];
  score: number;
  createdAt: unknown;
};

export async function ensureUserDoc(userId: string, data?: Partial<{ displayName: string; email: string }>) {
  const { db } = getFirebase();
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      xp: 0,
      level: 1,
      streak: 0,
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

export async function saveSubmission(input: Omit<SubmissionDoc, "createdAt">) {
  const { db } = getFirebase();
  const ref = collection(db, "submissions");
  await addDoc(ref, { ...input, createdAt: serverTimestamp() });
}

export async function incrementUserXp(userId: string, delta: number) {
  const { db } = getFirebase();
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);
  const prev = snap.exists() ? (snap.data() as any) : { xp: 0, level: 1 };
  const xp = (prev.xp ?? 0) + delta;
  const level = 1 + Math.floor(xp / 500);
  await setDoc(ref, { ...prev, xp, level, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getRecentSubmissions(userId: string, count = 5) {
  const { db } = getFirebase();
  // Avoid composite index requirement by sorting client-side
  const q = query(collection(db, "submissions"), where("userId", "==", userId), limit(50));
  const snap = await getDocs(q);
  const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  rows.sort((a: any, b: any) => {
    const ta = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
    const tb = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
    return tb - ta;
  });
  return rows.slice(0, count);
}


