import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Newsreader, JetBrains_Mono } from "next/font/google";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import GoogleAnalytics from "@/components/googleAnalytics/GoogleAnalytics";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});
const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://willhao.com"),
  title: {
    template: "%s - Will Hao",
    default: "Will Hao - Portfolio",
  },
  description:
    "CS and Math student at UT Austin. Portfolio, projects, and blog.",
  openGraph: {
    title: "Will Hao - Portfolio",
    description:
      "CS and Math student at UT Austin. Portfolio, projects, and blog.",
    url: "https://willhao.com",
    siteName: "Will Hao",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      { url: "/favicons/favicon.ico", sizes: "32x32" },
      {
        url: "/favicons/favicon-32x32.png",
        type: "image/png",
        sizes: "32x32",
      },
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
  width: "device-width",
  initialScale: 1,
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
        <Header />
        <main className="main-content">
          <div className="container">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
