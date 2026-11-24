import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Will Hao";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const knightData = await readFile(
    join(process.cwd(), "public", "favicons", "hero-knight-320x320.png"),
  );
  const knightSrc = "data:image/png;base64," + knightData.toString("base64");

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b1224",
      }}
    >
      <img
        src={knightSrc}
        width={320}
        height={320}
        alt="Will Hao"
      />
    </div>,
    { ...size },
  );
}
