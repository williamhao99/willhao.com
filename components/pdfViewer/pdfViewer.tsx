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
      const segments = base.split("/").filter(Boolean);
      if (segments.some((seg) => seg === "." || seg === "..")) return false;

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

    const safeSrc = isSafePdf(currentTab.src) ? currentTab.src : null;

    let viewerStyle = {};
    if (customHeight) {
      viewerStyle = { height: customHeight };
    }

    return (
      <div
        className={styles.viewer}
        style={viewerStyle}
        id={"pdf-viewer-" + selectedIndex}
        role="region"
        aria-label={"PDF viewer: " + currentTab.label}
      >
        {safeSrc ? (
          <iframe
            src={safeSrc}
            className={styles.iframe}
            title={"PDF: " + currentTab.label}
          />
        ) : (
          <div
            style={{
              padding: "var(--space-1rem)",
              color: "var(--color-text-muted)",
            }}
          >
            Invalid PDF source.
          </div>
        )}
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
