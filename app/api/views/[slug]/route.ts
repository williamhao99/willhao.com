import { NextResponse } from "next/server";
import { getViews, incrementViews } from "@/lib/data/views";
import { projects } from "@/app/projects/projects";
import { blogPosts } from "@/app/blog/blogs";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// Same keys as buildSlugMap() in ViewCounter.tsx
function buildValidSlugs(): Set<string> {
  const slugs = new Set<string>(["home", "projects", "blog"]);
  for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    if (!project) continue;
    if (project.link && project.link.startsWith("/projects/")) {
      slugs.add("projects-" + project.link.slice("/projects/".length));
    }
  }
  for (let i = 0; i < blogPosts.length; i++) {
    const post = blogPosts[i];
    if (!post) continue;
    slugs.add("blog-" + post.slug);
  }
  return slugs;
}

const VALID_SLUGS = buildValidSlugs();

export async function GET(
  request: Request,
  context: RouteParams,
): Promise<NextResponse> {
  const params = await context.params;
  const slug = params.slug;

  if (!VALID_SLUGS.has(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const views = await getViews(slug);
  if (views === null) {
    return new NextResponse(null, { status: 503 });
  }

  return NextResponse.json({ views: views });
}

export async function POST(
  request: Request,
  context: RouteParams,
): Promise<NextResponse> {
  const params = await context.params;
  const slug = params.slug;

  if (!VALID_SLUGS.has(slug)) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  if (process.env.NODE_ENV === "development") {
    return GET(request, context);
  }

  const views = await incrementViews(slug);
  if (views === null) {
    return new NextResponse(null, { status: 503 });
  }

  return NextResponse.json({ views: views });
}
