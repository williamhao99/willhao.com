// components/SectionWrapper.js
export default function SectionWrapper({
  children,
  className = "",
  containerSize = "medium",
  as = "section",
}) {
  // Allow changing the HTML tag
  const Component = as;

  return (
    <Component className={`section-wrap ${className}`}>
      <div className={`container ${containerSize}`}>{children}</div>
    </Component>
  );
}
