export default function StructuredData() {
  const personSchema = {
    "@type": "Person",
    name: "Will Hao",
    alternateName: "William Hao",
    description:
      "Personal portfolio of Will Hao, UT Austin Mathematics and Plan II Honors student",
    jobTitle: "Mathematics Student",
    url: "https://willhao.com",
    sameAs: [
      "https://www.linkedin.com/in/william-a-hao/",
      "https://github.com/williamhao99",
      "https://www.instagram.com/william.a.hao/",
    ],
    studiesAt: {
      "@type": "CollegeOrUniversity",
      name: "University of Texas at Austin",
      url: "https://www.utexas.edu",
    },
    knowsAbout: [
      "Mathematics",
      "Chess",
      "Computer Science",
      "Finance",
      "Academic Research",
      "Fitness",
    ],
    image: "https://willhao.com/favicons/William Hao-3-2.png",
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
      "Personal portfolio of Will Hao, UT Austin Mathematics and Plan II Honors student",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://willhao.com/?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  // Combined schema with single context declaration
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
