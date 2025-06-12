export default function PageHeader({
  title,
  description,
  lastUpdated = null,
  className = "",
  isHero = false,
}) {
  return (
    <section
      className={`container medium ${isHero ? "section-hero" : ""} ${className}`}
    >
      <div className="hero-wrapper">
        <h1 className="h1">{title}</h1>
        {description && (
          <p className="body-1 hero-desc">
            {lastUpdated ? `Last updated: ${lastUpdated}` : description}
          </p>
        )}
      </div>
    </section>
  );
}
