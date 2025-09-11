import PdfViewer from "@/components/pdfViewer/pdfViewer";

export default function UTMathDRPPage() {
  return (
    <>
      <h1>UT Math Directed Reading Program</h1>

      <PdfViewer
        tabs={[
          {
            label: "Presentation",
            src: "/documents/Benford's Law - From Logarithms to Dynamical Systems.pdf",
          },
        ]}
      />

      <h2>Weekly Notes</h2>
      <PdfViewer
        tabs={[
          { label: "DRP notes 2-17", src: "/documents/DRP notes 2-17.pdf" },
          { label: "DRP notes 2-24", src: "/documents/DRP notes 2-24.pdf" },
          { label: "DRP notes 3-3", src: "/documents/DRP notes 3-3.pdf" },
          { label: "DRP notes 3-10", src: "/documents/DRP notes 3-10.pdf" },
          { label: "DRP notes 3-24", src: "/documents/DRP notes 3-24.pdf" },
          { label: "DRP notes 4-7", src: "/documents/DRP notes 4-7.pdf" },
        ]}
      />
    </>
  );
}
