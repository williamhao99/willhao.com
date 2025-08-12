"use client";

import { useEffect } from "react";

// Create iframe wrapper for PDF display
const createPdfViewer = () => {
  const wrap = document.createElement("div");
  wrap.className = "pdf-viewer-wrap";
  const frame = document.createElement("iframe");
  frame.className = "pdf-viewer";
  frame.loading = "eager";
  wrap.appendChild(frame);
  return wrap;
};

// Global PDF viewer component that handles click/hover events
export default function PdfViewer() {
  useEffect(() => {
    const handlePdfPicker = (e) => {
      const btn = e.target.closest(".pdf-picker-btn");
      if (!btn) return;

      const picker = btn.closest(".pdf-picker");
      const src = `${encodeURI(btn.dataset.pdf)}#toolbar=0`;

      let wrap = picker.nextElementSibling;
      if (!wrap?.classList.contains("pdf-viewer-wrap")) {
        wrap = createPdfViewer();
        picker.after(wrap);
      }

      const frame = wrap.querySelector("iframe");
      const viewerOpen = getComputedStyle(wrap).display !== "none";

      if (btn.classList.contains("active") && viewerOpen) {
        wrap.style.display = "none";
        btn.classList.remove("active");
        return;
      }

      picker
        .querySelectorAll(".pdf-picker-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      if (frame.src !== src && frame.getAttribute("src") !== src) {
        frame.src = src;
      }
      wrap.style.display = "block";
      frame.focus();
    };

    // Prefetch PDFs on hover for faster loading
    const preloaded = new Set();
    const handlePdfHover = (e) => {
      const btn = e.target.closest(".pdf-picker-btn");
      if (!btn) return;

      const href = btn.dataset.pdf;
      if (!href || preloaded.has(href)) return;

      try {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.as = "document";
        link.href = href;
        document.head.appendChild(link);
        preloaded.add(href);
      } catch (error) {
        // Silently fail prefetch - non-critical optimization
      }
    };

    const handleClick = (e) => {
      handlePdfPicker(e);
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("mouseover", handlePdfHover, { passive: true });
    document.addEventListener("touchstart", handlePdfHover, { passive: true });

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("mouseover", handlePdfHover);
      document.removeEventListener("touchstart", handlePdfHover);
    };
  }, []);

  return null;
}
