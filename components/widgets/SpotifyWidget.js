import { useRef, useLayoutEffect } from "react";
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

  // Helper function to check if text contains Asian characters
  const containsAsianCharacters = (text) => {
    if (!text) return false;
    // Asian character ranges:
    // \u3040-\u309f: Hiragana
    // \u30a0-\u30ff: Katakana
    // \u3400-\u4dbf: CJK Extension A
    // \u4e00-\u9fff: CJK Unified Ideographs (Chinese, Japanese Kanji, Korean Hanja)
    // \uac00-\ud7af: Hangul (Korean)
    // \uf900-\ufaff: CJK Compatibility Ideographs
    // \u3000-\u303f: CJK Symbols and Punctuation
    return /[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uac00-\ud7af\uf900-\ufaff]/.test(
      text,
    );
  };

  // Check if text should scroll based on length and language
  const getScrollThreshold = (text) => {
    return containsAsianCharacters(text) ? 15 : 30;
  };

  const shouldTrackScroll =
    displayInfo.trackName &&
    displayInfo.trackName.length > getScrollThreshold(displayInfo.trackName);
  const shouldArtistScroll =
    displayInfo.artistName &&
    displayInfo.artistName.length > getScrollThreshold(displayInfo.artistName);

  // Dynamic calculation effect
  useLayoutEffect(() => {
    const calculateScroll = (textRef) => {
      if (textRef.current && containerRef.current) {
        const textWidth = textRef.current.scrollWidth;
        const containerWidth = containerRef.current.offsetWidth;

        // Only scroll if the text is wider than its container
        if (textWidth > containerWidth) {
          const scrollDistance = containerWidth - textWidth - 10; // Nudge the final resting position
          textRef.current.style.setProperty(
            "--scroll-end-x",
            `${scrollDistance}px`,
          );
        }
      }
    };

    if (shouldTrackScroll) calculateScroll(trackRef);
    if (shouldArtistScroll) calculateScroll(artistRef);
  }, [
    displayInfo.trackName,
    displayInfo.artistName,
    shouldTrackScroll,
    shouldArtistScroll,
  ]);

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
