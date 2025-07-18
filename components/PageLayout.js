// components/PageLayout.js
import { NavigationBar, Footer } from "@/components";
import PdfViewer from "@/components/PdfViewer";

export default function PageLayout({ children, includePdfViewer = false }) {
  return (
    <div className="site">
      <NavigationBar />
      <div className="site-content">
        <main className="site-main">{children}</main>
      </div>
      <Footer />
      {includePdfViewer && <PdfViewer />}
    </div>
  );
}
