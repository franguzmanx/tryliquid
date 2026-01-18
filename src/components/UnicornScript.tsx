"use client";

import Script from "next/script";
import { useEffect } from "react";

export default function UnicornScript() {
  useEffect(() => {
    // Re-init on mount and periodically to catch all elements
    const initUnicorn = () => {
      if ((window as unknown as { UnicornStudio?: { init: () => void } }).UnicornStudio) {
        (window as unknown as { UnicornStudio: { init: () => void } }).UnicornStudio.init();
      }
    };

    // Init immediately if script already loaded
    initUnicorn();

    // Re-init after various delays
    const timers = [100, 500, 1000, 2000, 3000].map((delay) =>
      setTimeout(initUnicorn, delay)
    );

    // Also init on scroll (once)
    let scrolled = false;
    const handleScroll = () => {
      if (!scrolled) {
        scrolled = true;
        initUnicorn();
        setTimeout(initUnicorn, 500);
      }
    };
    window.addEventListener("scroll", handleScroll, { once: true });

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Script
      src="https://cdn.unicorn.studio/v1.3.2/unicornStudio.umd.js"
      strategy="beforeInteractive"
      onLoad={() => {
        if ((window as unknown as { UnicornStudio?: { init: () => void } }).UnicornStudio) {
          (window as unknown as { UnicornStudio: { init: () => void } }).UnicornStudio.init();
        }
      }}
    />
  );
}
