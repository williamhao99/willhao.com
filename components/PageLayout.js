import NavigationBar from "@/components/NavigationBar";
import Footer from "@/components/Footer";
import PdfViewer from "@/components/PdfViewer";

export default function PageLayout({ children }) {
  return (
    <div className="site">
      <NavigationBar />
      <main className="site-content">{children}</main>
      <Footer />
      <PdfViewer />
    </div>
  );
}
