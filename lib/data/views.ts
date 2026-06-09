import { getDb } from "@/lib/firebase";

export interface ViewsResponse {
  views: number;
}

// Get view count for a page
export async function getViews(slug: string): Promise<number> {
  try {
    const db = getDb();
    if (!db) return 0;

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
export async function incrementViews(slug: string): Promise<number> {
  try {
    const db = getDb();
    if (!db) return 0;

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

// Get multiple view counts at once (for listing pages)
export async function getMultipleViews(
  slugs: string[],
): Promise<Record<string, number>> {
  const result: Record<string, number> = {};

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    if (!slug) continue;
    result[slug] = await getViews(slug);
  }

  return result;
}
