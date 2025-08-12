export default function SectionWrapper({
  children,
  className = "",
  containerSize = "medium",
  as: Component = "section",
}) {
  return (
    <Component
      className={["section-wrap", className].filter(Boolean).join(" ")}
    >
      <div className={["container", containerSize].filter(Boolean).join(" ")}>
        {children}
      </div>
    </Component>
  );
}
