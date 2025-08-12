"use client";

import { useRef, useEffect, useState } from "react";
import { useApiData } from "@/lib/hooks/useApiData";
import { SpotifyIcon } from "@/components/icons/SpotifyIcon";
import styles from "@/components/widgets/SpotifyWidget.module.css";

// Constants for time calculations
const TIME_CONSTANTS = {
  MINUTE_MS: 60000,
  HOUR_MS: 3600000,
  DAY_MS: 86400000,
};

// Format timestamp into human-readable "time ago" string
const getTimeAgo = (date) => {
  const diffMs = Date.now() - date;
  const mins = Math.floor(diffMs / TIME_CONSTANTS.MINUTE_MS);
  const hours = Math.floor(diffMs / TIME_CONSTANTS.HOUR_MS);
  const days = Math.floor(diffMs / TIME_CONSTANTS.DAY_MS);

  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export default function SpotifyWidget() {
  const { data, loading, error } = useApiData("/api/spotify", {
    refetchInterval: 3000,
  });

  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const artistRef = useRef(null);
  const [shouldTrackScroll, setShouldTrackScroll] = useState(false);
  const [shouldArtistScroll, setShouldArtistScroll] = useState(false);

  const displayInfo = (() => {
    // Loading state
    if (loading && !data) {
      return {
        statusLabel: "Fetching data",
        trackName: "Loading...",
        artistName: "",
        isPlaying: false,
      };
    }

    // Error state
    if (error) {
      return {
        statusLabel: "",
        trackName: "Unable to fetch Spotify data",
        artistName: "",
        isPlaying: false,
      };
    }

    // No data available
    if (!data?.trackName) {
      return {
        statusLabel: "No recent activity",
        trackName: "Spotify",
        artistName: "",
        isPlaying: false,
      };
    }

    // Currently playing
    if (data.isPlaying) {
      return {
        statusLabel: "Currently playing",
        trackName: data.trackName,
        artistName: data.artistName,
        isPlaying: true,
        trackUrl: data.trackUrl,
      };
    }

    // Last played track
    const timeAgo = data.lastPlayed
      ? getTimeAgo(new Date(data.lastPlayed))
      : null;

    return {
      statusLabel: timeAgo ? `Last played ${timeAgo}` : "Last played",
      trackName: data.trackName,
      artistName: data.artistName,
      isPlaying: false,
      trackUrl: data.trackUrl,
    };
  })();

  // Handle text scrolling animation for overflowing content
  useEffect(() => {
    const checkOverflow = (textRef, setShouldScroll) => {
      if (!textRef.current || !containerRef.current) return;

      const textWidth = textRef.current.scrollWidth;
      const containerWidth = containerRef.current.offsetWidth;
      const isOverflowing = textWidth > containerWidth;

      setShouldScroll(isOverflowing);
      if (isOverflowing) {
        textRef.current.style.setProperty(
          "--scroll-end-x",
          `${containerWidth - textWidth - 10}px`,
        );
      }
    };

    // Check track name overflow
    if (displayInfo.trackName) {
      checkOverflow(trackRef, setShouldTrackScroll);
    } else {
      setShouldTrackScroll(false);
    }

    // Check artist name overflow
    if (displayInfo.artistName) {
      checkOverflow(artistRef, setShouldArtistScroll);
    } else {
      setShouldArtistScroll(false);
    }
  }, [displayInfo.trackName, displayInfo.artistName]);

  const widgetClass = [
    styles.spotifyWidget,
    displayInfo.isPlaying ? styles.playing : styles.notPlaying,
    loading && styles.loading,
    error && styles.error,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <div className={styles.leftSection}>
        <SpotifyIcon size={28} />
      </div>
      <div className={styles.infoCentered} ref={containerRef}>
        <span
          className={[styles.lastPlayed, loading && !data && styles.loadingDots]
            .filter(Boolean)
            .join(" ")}
        >
          {displayInfo.statusLabel}
        </span>
        <span
          ref={trackRef}
          className={[
            styles.trackName,
            loading && !data && styles.loadingText,
            shouldTrackScroll && styles.scrolling,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {displayInfo.trackName}
        </span>
        {displayInfo.artistName && (
          <span
            ref={artistRef}
            className={[
              styles.artistName,
              shouldArtistScroll && styles.scrolling,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {displayInfo.artistName}
          </span>
        )}
      </div>
    </>
  );

  const linkProps = displayInfo.trackUrl
    ? {
        href: displayInfo.trackUrl,
        "aria-label": `Listen to ${displayInfo.trackName} on Spotify`,
      }
    : {
        href: "https://open.spotify.com/user/williamhao99?si=a55b81b68fab41dc",
        "aria-label": "View Spotify profile",
      };

  return (
    <div className={widgetClass}>
      <a
        {...linkProps}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.spotifyLink}
      >
        {content}
      </a>
    </div>
  );
}
