import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Newsreader, JetBrains_Mono } from "next/font/google";
import Footer from "@/components/footer/Footer";
import GoogleAnalytics from "@/components/googleAnalytics/GoogleAnalytics";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
});
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  preload: false,
});

// No description on purpose
export const metadata: Metadata = {
  metadataBase: new URL("https://willhao.com"),
  title: {
    template: "%s - Will Hao",
    default: "Will Hao",
  },
  openGraph: {
    url: "https://willhao.com",
    siteName: "Will Hao",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicons/favicon.ico", sizes: "32x32" },
      {
        url: "/favicons/android-chrome-192x192.png",
        type: "image/png",
        sizes: "192x192",
      },
    ],
    apple: "/favicons/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0b1224",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={
        spaceGrotesk.variable +
        " " +
        newsreader.variable +
        " " +
        jetbrainsMono.variable
      }
    >
      <head>
        <GoogleAnalytics />
      </head>
      <body suppressHydrationWarning>
        <div className="page">
          <main className="main">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
