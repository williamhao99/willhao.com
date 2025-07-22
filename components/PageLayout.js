// components/PageLayout.js
import { NavigationBar, Footer } from "@/components";
import PdfViewer from "@/components/PdfViewer";

// main layout wrapper
export default function PageLayout({ children, includePdfViewer = false }) {
  return (
    <div className="site">
      <NavigationBar />
      <main className="site-content">{children}</main>
      <Footer />
      {/* pdf viewer for works pages */}
      {includePdfViewer && <PdfViewer />}
    </div>
  );
}
