import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

export async function hasAcceptedTerms(userId) {
  const snapshot = await getDoc(doc(db, "users", userId, "meta", "agreements"));
  return snapshot.exists() && snapshot.data().acceptedAt != null;
}

export async function recordTermsAcceptance(userId) {
  await setDoc(doc(db, "users", userId, "meta", "agreements"), {
    acceptedAt: serverTimestamp(),
    version: "2025-06"
  });
}
