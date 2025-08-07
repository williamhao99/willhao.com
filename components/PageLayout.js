// components/PageLayout.js
import { NavigationBar, Footer } from "@/components";
import PdfViewer from "@/components/PdfViewer";

// Page shell
export default function PageLayout({ children, includePdfViewer = false }) {
  return (
    <div className="site">
      <NavigationBar />
      <main className="site-content">{children}</main>
      <Footer />
      {/* Show PDF viewer on works pages */}
      {includePdfViewer && <PdfViewer />}
    </div>
  );
}
