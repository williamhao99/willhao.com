"use client";

import Script from "next/script";

export default function GoogleAnalytics() {
  // Don't load analytics in development
  if (process.env.NODE_ENV === "development") {
    return null;
  }

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-TPCZYL7LZK"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-TPCZYL7LZK');
        `}
      </Script>
    </>
  );
}
