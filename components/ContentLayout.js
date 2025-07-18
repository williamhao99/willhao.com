// components/ContentLayout.js
export default function ContentLayout({ children, className = "" }) {
  return <div className={`page-content ${className}`}>{children}</div>;
}
