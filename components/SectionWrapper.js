export default function SectionWrapper({
  children,
  className = "",
  containerSize = "medium",
  as: Component = "section",
}) {
  return (
    <Component className={`section-wrap ${className}`.trim()}>
      <div className={`container ${containerSize}`}>{children}</div>
    </Component>
  );
}
