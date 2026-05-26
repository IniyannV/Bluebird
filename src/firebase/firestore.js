import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

function tabsDoc(userId) {
  return doc(db, "users", userId, "gpaData", "tabs");
}

export async function fetchUserTabs(userId) {
  const snapshot = await getDoc(tabsDoc(userId));
  if (!snapshot.exists()) return null;
  return snapshot.data().tabs || null;
}

export async function persistUserTabs(userId, tabs) {
  await setDoc(
    tabsDoc(userId),
    {
      tabs,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}
