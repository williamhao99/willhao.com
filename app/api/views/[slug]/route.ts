import { NextResponse } from "next/server";
import { getViews, incrementViews } from "../../../../lib/data/views";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// Valid slugs: home, about, works, blog, works-*, blog-*
const VALID_SLUG_PATTERN = /^(home|about|works|blog|works-[\w-]+|blog-[\w-]+)$/;

function isValidSlug(slug: string): boolean {
  return VALID_SLUG_PATTERN.test(slug);
}

// GET /api/views/[slug] - Returns view count
export async function GET(
  request: Request,
  context: RouteParams,
): Promise<NextResponse> {
  const params = await context.params;
  const slug = params.slug;

  if (!isValidSlug(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const views = await getViews(slug);

  return NextResponse.json({ views: views });
}

// POST /api/views/[slug] - Increments and returns view count
export async function POST(
  request: Request,
  context: RouteParams,
): Promise<NextResponse> {
  const params = await context.params;
  const slug = params.slug;

  if (!isValidSlug(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const views = await incrementViews(slug);

  return NextResponse.json({ views: views });
}
