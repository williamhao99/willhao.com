"use client";

import { useState } from "react";
import styles from "./pdfViewer.module.css";

interface PdfTab {
  label: string;
  src: string;
}

interface PdfViewerProps {
  tabs: PdfTab[];
  customHeight?: string;
}

export default function PdfViewer({ tabs, customHeight }: PdfViewerProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  function checkIfMobile() {
    if (typeof window === "undefined") return false;
    const userAgent = navigator.userAgent;
    const mobilePatterns = ["iPad", "iPhone", "iPod", "Android"];
    for (let i = 0; i < mobilePatterns.length; i++) {
      const pattern = mobilePatterns[i];
      if (!pattern) continue;
      if (userAgent.indexOf(pattern) !== -1) {
        return true;
      }
    }
    if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) {
      return true;
    }
    return false;
  }

  function isSafePdf(src: string): boolean {
    // Security feature
    try {
      // Block protocol-relative or full URLs
      if (
        src.startsWith("http://") ||
        src.startsWith("https://") ||
        src.startsWith("//")
      )
        return false;

      // Strip query/hash
      const base = src.split(/[?#]/)[0];
      if (!base) return false;

      // Must be routed file under /documents/
      if (!base.startsWith("/documents/")) return false;

      // Disallow path traversal
      const segments = base.split("/");
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        if (!seg) continue;
        if (seg === "." || seg === "..") return false;
      }

      return base.toLowerCase().endsWith(".pdf");
    } catch {
      return false;
    }
  }

  function handleTabClick(index: number) {
    if (selectedIndex === index) {
      setSelectedIndex(null);
    } else {
      setSelectedIndex(index);
    }
  }

  function renderTabs() {
    const tabElements = [];
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      if (!tab) continue;

      let className = styles.tab;
      if (i === selectedIndex) {
        className = className + " " + styles.active;
      }

      tabElements.push(
        <button
          key={i}
          className={className}
          onClick={function () {
            handleTabClick(i);
          }}
          aria-label={"View PDF: " + tab.label}
          aria-expanded={i === selectedIndex}
          aria-controls={"pdf-viewer-" + i}
        >
          {tab.label}
        </button>,
      );
    }
    return tabElements;
  }

  function renderViewer() {
    if (selectedIndex === null) {
      return null;
    }

    const currentTab = tabs[selectedIndex];
    if (!currentTab) {
      return null;
    }

    let safeSrc = null;
    if (isSafePdf(currentTab.src)) {
      safeSrc = currentTab.src;
    }

    let viewerStyle = {};
    if (customHeight) {
      viewerStyle = { height: customHeight };
    }

    const isMobile = checkIfMobile();

    return (
      <div
        className={styles.viewer}
        style={viewerStyle}
        id={"pdf-viewer-" + selectedIndex}
        role="region"
        aria-label={"PDF viewer: " + currentTab.label}
      >
        {(function () {
          if (!safeSrc) {
            return (
              <div className={styles.errorMessage}>Invalid PDF source.</div>
            );
          }

          if (isMobile) {
            return (
              <div className={styles.mobileViewer}>
                <p>PDF viewing works best in this device's native viewer</p>
                <a
                  href={safeSrc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.openButton}
                >
                  Open PDF: {currentTab.label} →
                </a>
              </div>
            );
          } else {
            return (
              <iframe
                src={safeSrc}
                className={styles.iframe}
                title={"PDF: " + currentTab.label}
                loading="lazy"
              />
            );
          }
        })()}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>{renderTabs()}</div>
      {renderViewer()}
    </div>
  );
}
