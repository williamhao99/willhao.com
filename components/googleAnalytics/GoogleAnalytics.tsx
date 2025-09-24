import Script from "next/script";

const GATag = process.env.GA_MEASUREMENT_ID;

export default function GoogleAnalytics() {
  if (!GATag) {
    console.warn(
      "Google Analytics: GA_MEASUREMENT_ID is not set in environment variables",
    );
    return null;
  }

  return (
    <>
      <Script
        src={"https://www.googletagmanager.com/gtag/js?id=" + GATag}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html:
            "window.dataLayer = window.dataLayer || [];" +
            "function gtag(){dataLayer.push(arguments);}" +
            "gtag('js', new Date());" +
            "gtag('config', '" +
            GATag +
            "');",
        }}
      />
    </>
  );
}
