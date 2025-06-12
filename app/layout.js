import { Noto_Sans, Noto_Serif } from "next/font/google";
import "./globals.css";

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
  title: {
    template: "%s | Will Hao",
    default: "Will Hao - Portfolio",
  },
  description:
    "UT Austin Class of 2028, Mathematics + Plan II Honors. Personal website containing my work, blog, projects, and more.",
  keywords: ["Will Hao", "UT Austin", "Mathematics", "Plan II", "Portfolio"],
  authors: [{ name: "Will Hao" }],
  creator: "Will Hao",
  icons: {
    icon: "/favicons/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${noto_sans.variable} ${noto_serif.variable}`}>
      <head></head>
      <body>{children}</body>
    </html>
  );
}
