import { useCallback, useState } from "react";
import { fetchUserTabs, persistUserTabs } from "../firebase/firestore";

export function useFirestore(user) {
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);

  const loadTabs = useCallback(async () => {
    if (!user) return null;
    return fetchUserTabs(user.uid);
  }, [user?.uid]);

  const saveTabs = useCallback(
    async (tabs) => {
      if (!user) return;
      setSaving(true);
      try {
        await persistUserTabs(user.uid, tabs);
        setLastSavedAt(Date.now());
      } finally {
        setSaving(false);
      }
    },
    [user?.uid]
  );

  return { loadTabs, saveTabs, saving, lastSavedAt };
}
