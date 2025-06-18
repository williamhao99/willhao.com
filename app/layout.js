import { Noto_Sans, Noto_Serif } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import StructuredData from "@/components/StructuredData";

const noto_sans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-base",
  display: "swap",
});

const noto_serif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://willhao.com"),
  title: {
    template: "%s | Will Hao",
    default: "Will Hao - Portfolio",
  },
  description:
    "Will Hao - UT Austin Class of 2028, Mathematics + Plan II Honors student. Personal website showcasing academic work, chess achievements, and blog posts.",
  keywords: [
    "Will Hao",
    "William Hao",
    "UT Austin",
    "Mathematics",
    "Plan II",
    "Portfolio",
    "University of Texas",
    "Chess",
    "Student",
    "Academic",
  ],
  authors: [{ name: "Will Hao" }],
  creator: "Will Hao",
  openGraph: {
    title: "Will Hao - Personal Portfolio",
    description:
      "Will Hao - UT Austin Class of 2028, Mathematics + Plan II Honors student. Personal website showcasing academic work, chess achievements, and blog posts.",
    url: "https://willhao.com",
    siteName: "Will Hao",
    type: "website",
    images: [
      {
        url: "/favicons/William Hao-3-2.png",
        width: 512,
        height: 512,
        alt: "Will Hao",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Will Hao - Personal Portfolio",
    description:
      "Will Hao - UT Austin Class of 2028, Mathematics + Plan II Honors student. Personal website showcasing academic work, chess achievements, and blog posts.",
    images: ["/favicons/William Hao-3-2.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/favicons/favicon.ico",
    apple: "/favicons/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://willhao.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${noto_sans.variable} ${noto_serif.variable}`}>
      <head>
        <GoogleAnalytics />
        <StructuredData />
      </head>
      <body>{children}</body>
    </html>
  );
}
