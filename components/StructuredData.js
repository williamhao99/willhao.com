export default function StructuredData() {
  const personSchema = {
    "@type": "Person",
    name: "Will Hao",
    alternateName: "William Hao",
    description:
      "Will Hao - UT Austin Class of 2028, Computer Science + Mathematics student. Portfolio showcasing academic work, blog posts, and more.",
    jobTitle: "Computer Science Student",
    url: "https://willhao.com",
    sameAs: [
      "https://www.linkedin.com/in/william-a-hao/",
      "https://github.com/williamhao99",
      "https://www.instagram.com/william.a.hao/",
    ],
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "University of Texas at Austin",
      url: "https://www.utexas.edu",
    },
    knowsAbout: [
      "Mathematics",
      "Computer Science",
      "Chess",
      "Finance",
      "Academic Research",
      "Fitness",
    ],
    image: "https://willhao.com/favicons/william-hao-banner.png",
  };

  const websiteSchema = {
    "@type": "WebSite",
    name: "Will Hao",
    url: "https://willhao.com",
    inLanguage: "en-US",
    author: {
      "@type": "Person",
      name: "Will Hao",
    },
    description:
      "Will Hao - UT Austin Class of 2028, Computer Science + Mathematics student. Portfolio showcasing academic work, blog posts, and more.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://willhao.com/?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  // Combine schemas under one context
  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [personSchema, websiteSchema],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(combinedSchema),
      }}
    />
  );
}
