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
  const signatureData = await readFile(
    join(process.cwd(), "public", "images", "opengraph-banner.svg"),
    "utf-8",
  );
  const signatureSrc =
    "data:image/svg+xml;base64," +
    Buffer.from(signatureData).toString("base64");

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
      }}
    >
      <img
        src={signatureSrc}
        width={1200}
        height={630}
        alt="Will Hao"
      />
    </div>,
    { ...size },
  );
}
