"use client";

import { useEffect } from "react";

export default function PdfViewer() {
  useEffect(() => {
    // PDF toggle functionality
    const handlePdfToggle = (e) => {
      const btn = e.target.closest(".pdf-toggle");
      if (!btn) return;

      const src = encodeURI(btn.dataset.pdf) + "#toolbar=0";

      // look for or create a viewer right after the button
      let wrap = btn.nextElementSibling;
      if (!wrap || !wrap.classList.contains("pdf-viewer-wrap")) {
        wrap = document.createElement("div");
        wrap.className = "pdf-viewer-wrap";
        const frame = document.createElement("iframe");
        frame.className = "pdf-viewer";
        frame.loading = "lazy";
        wrap.appendChild(frame);
        btn.after(wrap);
      }

      const frame = wrap.querySelector("iframe");
      const open = getComputedStyle(wrap).display !== "none";

      if (open) {
        // hide
        frame.src = "about:blank";
        wrap.style.display = "none";
        btn.classList.remove("active");
      } else {
        // show
        frame.src = src;
        wrap.style.display = "block";
        btn.classList.add("active");
        frame.focus();
      }
    };

    // PDF picker functionality
    const handlePdfPicker = (e) => {
      const btn = e.target.closest(".pdf-picker-btn");
      if (!btn) return;

      const picker = btn.closest(".pdf-picker");
      const src = encodeURI(btn.dataset.pdf) + "#toolbar=0";

      // create or reuse the shared viewer after the picker section
      let wrap = picker.nextElementSibling;
      if (!wrap || !wrap.classList.contains("pdf-viewer-wrap")) {
        wrap = document.createElement("div");
        wrap.className = "pdf-viewer-wrap";
        const frame = document.createElement("iframe");
        frame.className = "pdf-viewer";
        frame.loading = "lazy";
        wrap.appendChild(frame);
        picker.after(wrap);
      }

      const frame = wrap.querySelector("iframe");

      // collapse if this button is already active
      const viewerOpen = getComputedStyle(wrap).display !== "none";
      if (btn.classList.contains("active") && viewerOpen) {
        frame.src = "about:blank";
        wrap.style.display = "none";
        btn.classList.remove("active");
        return;
      }

      // highlight active button & load PDF
      picker
        .querySelectorAll(".pdf-picker-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      frame.src = src;
      wrap.style.display = "block";
      frame.focus();
    };

    // Add event listeners
    document.addEventListener("click", handlePdfToggle);
    document.addEventListener("click", handlePdfPicker);

    // Cleanup
    return () => {
      document.removeEventListener("click", handlePdfToggle);
      document.removeEventListener("click", handlePdfPicker);
    };
  }, []);

  return null; // This component doesn't render anything
}
