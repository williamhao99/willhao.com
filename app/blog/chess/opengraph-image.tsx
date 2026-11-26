import { ImageResponse } from "next/og";
import { blogPosts } from "../blogs";

export const alt = "Chess | Will Hao";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const SLUG = "chess";

async function loadGoogleFont(
  family: string,
  weight: number,
  text: string,
): Promise<ArrayBuffer> {
  const url =
    "https://fonts.googleapis.com/css2?family=" +
    encodeURIComponent(family) +
    ":wght@" +
    weight +
    "&text=" +
    encodeURIComponent(text);
  const cssResponse = await fetch(url);
  if (!cssResponse.ok) {
    throw new Error("Failed to fetch Google Fonts CSS for " + family);
  }
  const css = await cssResponse.text();
  const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!match || !match[1]) {
    throw new Error("Failed to parse font URL for " + family);
  }
  const fontResponse = await fetch(match[1]);
  if (!fontResponse.ok) {
    throw new Error("Failed to fetch font data for " + family);
  }
  return fontResponse.arrayBuffer();
}

export default async function Image() {
  const post = blogPosts.find(function (p) {
    return p.slug === SLUG;
  });
  if (!post) {
    throw new Error("Blog post not found: " + SLUG);
  }

  const title = post.title;
  const date = post.date;
  const footer = "willhao.com";

  const [newsreader, spaceGrotesk] = await Promise.all([
    loadGoogleFont("Newsreader", 500, title),
    loadGoogleFont("Space Grotesk", 400, date + footer),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0f172a",
        padding: "96px 112px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "28px",
        }}
      >
        <div
          style={{
            fontFamily: "Newsreader",
            fontSize: 168,
            fontWeight: 500,
            color: "rgba(250, 250, 250, 0.95)",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "Space Grotesk",
            fontSize: 36,
            color: "rgba(250, 250, 250, 0.6)",
            letterSpacing: "0.02em",
          }}
        >
          {date}
        </div>
      </div>
      <div
        style={{
          fontFamily: "Space Grotesk",
          fontSize: 28,
          color: "rgba(250, 250, 250, 0.55)",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          display: "flex",
        }}
      >
        {footer}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Newsreader",
          data: newsreader,
          style: "normal",
          weight: 500,
        },
        {
          name: "Space Grotesk",
          data: spaceGrotesk,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
