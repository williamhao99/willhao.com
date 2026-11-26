import { getDb } from "@/lib/firebase";

export async function getViews(slug: string): Promise<number | null> {
  try {
    const db = getDb();
    if (!db) return null;

    const ref = db.ref("views/" + slug);
    const snapshot = await ref.get();

    if (snapshot.exists()) {
      return snapshot.val() as number;
    }
    return 0;
  } catch (error) {
    console.error("Error getting views for " + slug + ":", error);
    return null;
  }
}

export async function incrementViews(slug: string): Promise<number | null> {
  try {
    const db = getDb();
    if (!db) return null;

    const ref = db.ref("views/" + slug);
    let newCount = 0;

    await ref.transaction(function updateCount(currentValue) {
      if (currentValue === null) {
        newCount = 1;
        return 1;
      }
      newCount = currentValue + 1;
      return currentValue + 1;
    });

    return newCount;
  } catch (error) {
    console.error("Error incrementing views for " + slug + ":", error);
    return null;
  }
}
