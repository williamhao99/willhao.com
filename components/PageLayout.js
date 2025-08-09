import { NavigationBar, Footer } from "@/components";
import PdfViewer from "@/components/PdfViewer";

export default function PageLayout({ children, includePdfViewer = false }) {
  return (
    <div className="site">
      <NavigationBar />
      <main className="site-content">{children}</main>
      <Footer />
      {includePdfViewer && <PdfViewer />}
    </div>
  );
}
