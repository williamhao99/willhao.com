import { useApiData } from "@/lib/hooks/useApiData";

export default function ChessWidget() {
  const { data, loading, error } = useApiData("/api/chess", {
    refetchInterval: 30 * 1000,
  });

  const uscfRating = 1815;
  const formatRating = (rating) => (rating ? Math.round(rating) : "—");

  const icon = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 290 400"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M225 273.7c-55.7-42.6-49.5-79.5-50.2-94.7h34c4-7.4 6-14.2 6-22.8l-38.5-25.4c13.4-9.7 22.1-25.5 22.1-43.3 0-22.4-13.8-41.7-33.4-49.6-6.2-2.5-49.8 141.1-49.8 141.1-.2 3.3-.2 7.6-.2 12.8 0 14.3 35 12.1 33.1 24.7-2.8 18.8-3.4 33.2-19.6 78.4-10.9 30.6-83.8 0-89 15-3.6 10.4-5.5 22.1-5.5 34.7 0 1.3 2.9 21.5 111 21.5s111-20.2 111-21.5c0-30.7-11.4-56-31-70.9z"
        fill="#5d9948"
      />
      <path
        d="M143 292.8c6-27.4 11.3-56.6 14.6-74.1 4-21.8-29-25.7-42.6-27.7-.6 18.6-5.8 48.9-50.1 82.7-11.9 9.1-20.8 22.1-26 37.9 12 5.8 27.9 9.3 52.5 9.3 15.8 0 45 1.9 51.6-28.1zM166.2 178.9c5.2-13.6 4.6-22.8 4.6-22.8L149 130.7c23.2-9.9 37.2-28.6 37.2-50.3 0-17.3-8.3-32.8-21-42.5-6.2-2.5-13-4-20.1-4-29.5 0-53.4 23.9-53.4 53.5 0 17.8 8.7 33.6 22.1 43.3l-38.5 25.4c0 8.5 2 15.4 6 22.8h84.9z"
        fill="#81b64c"
      />
      <path
        d="M142 44.9c30.8 4.8-14.2 40.6-28.4 38.9-13.5-1.7-.5-43.4 28.4-38.9z"
        fill="#b2e068"
      />
    </svg>
  );

  const renderRatingValue = (type) => {
    if (loading && !data)
      return <span className="rating-value loading-dots">...</span>;
    // Check for error state or if all ratings are null (indicating API failure)
    if (
      error ||
      (data &&
        !data.rapid?.rating &&
        !data.blitz?.rating &&
        !data.bullet?.rating)
    )
      return <span className="rating-value error-text">—</span>;
    if (type === "uscf")
      return <span className="rating-value">{uscfRating}</span>;
    return (
      <span className="rating-value">{formatRating(data?.[type]?.rating)}</span>
    );
  };

  return (
    <div
      className={`chess-widget ${loading ? "loading" : ""} ${error ? "error" : ""}`}
    >
      <a
        href="https://chess.com/member/javablob"
        target="_blank"
        rel="noopener noreferrer"
        className="chess-link"
        aria-label="View chess profile"
      >
        <div className="widget-row">
          <div className="chess-left-section">
            <div
              className={`chess-icon ${loading && !data ? "skeleton" : ""}`}
              aria-hidden="true"
            >
              {icon}
            </div>
            <div
              className={`widget-username ${loading && !data ? "loading-text" : ""}`}
            >
              javablob
            </div>
          </div>
          <div className="chess-info">
            <div className="chess-ratings">
              <div className="rating-row">
                <div className="rating-item">
                  <span className="rating-label">Rapid</span>
                  {renderRatingValue("rapid")}
                </div>
                <div className="rating-item">
                  <span className="rating-label">Blitz</span>
                  {renderRatingValue("blitz")}
                </div>
              </div>
              <div className="rating-row">
                <div className="rating-item">
                  <span className="rating-label">Bullet</span>
                  {renderRatingValue("bullet")}
                </div>
                <div className="rating-item">
                  <span className="rating-label">USCF</span>
                  {renderRatingValue("uscf")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
