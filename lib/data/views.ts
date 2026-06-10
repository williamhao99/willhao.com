import { getDb } from "@/lib/firebase";

export interface ViewsResponse {
  views: number;
}

// Get view count for a page; null means view counts are unavailable
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
    if (error instanceof Error) {
      console.error("Error getting views for " + slug + ":", error.message);
    }
    return 0;
  }
}

// Increment view count atomically
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
    if (error instanceof Error) {
      console.error(
        "Error incrementing views for " + slug + ":",
        error.message,
      );
    }
    return 0;
  }
}
