"use client";

import { useEffect } from "react";

export default function PdfViewer() {
  useEffect(() => {
    // PDF toggle handler
    const handlePdfToggle = (e) => {
      const btn = e.target.closest(".pdf-toggle");
      if (!btn) return;

      const src = encodeURI(btn.dataset.pdf) + "#toolbar=0";

      // create viewer if needed
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
        // hide viewer
        frame.src = "about:blank";
        wrap.style.display = "none";
        btn.classList.remove("active");
      } else {
        // show viewer
        frame.src = src;
        wrap.style.display = "block";
        btn.classList.add("active");
        frame.focus();
      }
    };

    // PDF picker handler
    const handlePdfPicker = (e) => {
      const btn = e.target.closest(".pdf-picker-btn");
      if (!btn) return;

      const picker = btn.closest(".pdf-picker");
      const src = encodeURI(btn.dataset.pdf) + "#toolbar=0";

      // create shared viewer
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

      // toggle if active
      const viewerOpen = getComputedStyle(wrap).display !== "none";
      if (btn.classList.contains("active") && viewerOpen) {
        frame.src = "about:blank";
        wrap.style.display = "none";
        btn.classList.remove("active");
        return;
      }

      // set active & load
      picker
        .querySelectorAll(".pdf-picker-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      frame.src = src;
      wrap.style.display = "block";
      frame.focus();
    };

    // event listeners
    document.addEventListener("click", handlePdfToggle);
    document.addEventListener("click", handlePdfPicker);

    // cleanup
    return () => {
      document.removeEventListener("click", handlePdfToggle);
      document.removeEventListener("click", handlePdfPicker);
    };
  }, []);

  return null; // no render
}
