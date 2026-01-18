import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Newsreader } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://willhao.com"),
  title: {
    template: "%s | Will Hao",
    default: "Will Hao's Portfolio",
  },
  description:
    "CS and Math student at UT Austin. Portfolio, projects, and blog.",
  openGraph: {
    title: "Will Hao's Portfolio",
    description:
      "CS and Math student at UT Austin. Portfolio, projects, and blog.",
    url: "https://willhao.com",
    siteName: "Will Hao's Portfolio",
    type: "website",
    images: [
      {
        url: "/images/william-hao-banner.png",
        width: 491,
        height: 119,
        alt: "Will Hao",
      },
    ],
  },
  icons: {
    icon: "/favicons/favicon.ico",
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
      className={spaceGrotesk.variable + " " + newsreader.variable}
    >
      <head>
        <GoogleAnalytics />
      </head>
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
