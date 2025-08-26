import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
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
  description: "CS and Math '28 @ UT Austin",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a", // Matches --color-background in globals.css
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <body>
        <Header />
        <main className="main-content">
          <div className="container">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
