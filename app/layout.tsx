import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { Noto_Sans, Noto_Serif } from "next/font/google";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});
const notoSerif = Noto_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "William Hao",
  description: "UT Austin '28, Computer Science + Mathematics",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#17191e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
