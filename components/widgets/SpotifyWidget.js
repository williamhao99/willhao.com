import { useRef, useLayoutEffect, useState } from "react";
import { useApiData } from "@/lib/hooks/useApiData";
import { SpotifyIcon } from "../index";

export default function SpotifyWidget() {
  const { data, loading, error } = useApiData("/api/spotify", {
    refetchInterval: 5 * 1000, // 5 seconds for more real-time music updates
  });

  // Refs to hold DOM elements
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const artistRef = useRef(null);

  const getDisplayInfo = () => {
    if (loading && !data) {
      return {
        statusLabel: "Fetching data",
        trackName: "Loading...",
        artistName: "",
        isPlaying: false,
      };
    }

    if (error || (data && !data.trackName && !data.isPlaying)) {
      return {
        statusLabel: "",
        trackName: "Unable to fetch Spotify data",
        artistName: "",
        isPlaying: false,
      };
    }

    if (data?.isPlaying && data?.trackName) {
      return {
        statusLabel: "Currently playing",
        trackName: data.trackName,
        artistName: data.artistName,
        isPlaying: true,
        trackUrl: data.trackUrl,
      };
    }

    if (data?.trackName) {
      const lastPlayedDate = data.lastPlayed ? new Date(data.lastPlayed) : null;
      const timeAgo = lastPlayedDate ? getTimeAgo(lastPlayedDate) : null;

      return {
        statusLabel: timeAgo ? `Last played ${timeAgo}` : "Last played",
        trackName: data.trackName,
        artistName: data.artistName,
        isPlaying: false,
        trackUrl: data.trackUrl,
      };
    }

    return {
      statusLabel: "No recent activity",
      trackName: "Spotify",
      artistName: "",
      isPlaying: false,
    };
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const displayInfo = getDisplayInfo();

  // Dynamic overflow detection (not hard-coded anymore)
  const [shouldTrackScroll, setShouldTrackScroll] = useState(false);
  const [shouldArtistScroll, setShouldArtistScroll] = useState(false);

  // Dynamic overflow detection and scroll calculation
  useLayoutEffect(() => {
    const checkOverflow = (textRef, setShouldScroll) => {
      if (textRef.current && containerRef.current) {
        const textWidth = textRef.current.scrollWidth;
        const containerWidth = containerRef.current.offsetWidth;
        const isOverflowing = textWidth > containerWidth;

        setShouldScroll(isOverflowing);

        // Set scroll distance if overflowing
        if (isOverflowing) {
          const scrollDistance = containerWidth - textWidth - 10; // Nudge the final resting position
          textRef.current.style.setProperty(
            "--scroll-end-x",
            `${scrollDistance}px`,
          );
        }
      }
    };

    // Check both track and artist for overflow
    if (displayInfo.trackName && trackRef.current) {
      checkOverflow(trackRef, setShouldTrackScroll);
    } else {
      setShouldTrackScroll(false);
    }

    if (displayInfo.artistName && artistRef.current) {
      checkOverflow(artistRef, setShouldArtistScroll);
    } else {
      setShouldArtistScroll(false);
    }
  }, [displayInfo.trackName, displayInfo.artistName]);

  const widgetClass = `spotify-widget ${
    displayInfo.isPlaying ? "playing" : "not-playing"
  } ${loading ? "loading" : ""} ${error ? "error" : ""}`;

  const content = (
    <>
      <div className="spotify-left-section">
        <SpotifyIcon size={28} />
      </div>
      <div className="spotify-info-centered" ref={containerRef}>
        <div className="spotify-status">
          <span
            className={`last-played ${loading && !data ? "loading-dots" : ""}`}
          >
            {displayInfo.statusLabel}
          </span>
        </div>
        <div className="spotify-track">
          <span
            ref={trackRef}
            className={`track-name ${
              loading && !data ? "loading-text" : ""
            } ${shouldTrackScroll ? "scrolling" : ""}`}
          >
            {displayInfo.trackName}
          </span>
          {displayInfo.artistName && (
            <span
              ref={artistRef}
              className={`artist-name ${shouldArtistScroll ? "scrolling" : ""}`}
            >
              {displayInfo.artistName}
            </span>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className={widgetClass}>
      {displayInfo.trackUrl ? (
        <a
          href={displayInfo.trackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="spotify-link"
          aria-label={`Listen to ${displayInfo.trackName} on Spotify`}
        >
          {content}
        </a>
      ) : (
        <a
          href="https://open.spotify.com/user/williamhao99?si=a55b81b68fab41dc"
          target="_blank"
          rel="noopener noreferrer"
          className="spotify-link"
          aria-label="View Spotify profile"
        >
          {content}
        </a>
      )}
    </div>
  );
}
