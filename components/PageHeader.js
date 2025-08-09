export default function PageHeader({
  title,
  description,
  lastUpdated = null,
  className = "",
  isHero = false,
}) {
  const classes = [`container medium`, isHero && "section-hero", className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes}>
      <h1 className="h1 page-header-title">{title}</h1>
      {description && (
        <p className="body-1 hero-desc">
          {lastUpdated ? `Last updated: ${lastUpdated}` : description}
        </p>
      )}
    </section>
  );
}
