"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function TestUnicorn() {
  useEffect(() => {
    // Initialize Unicorn Studio after component mounts
    const initUnicorn = () => {
      if (typeof window !== "undefined" && (window as any).UnicornStudio) {
        (window as any).UnicornStudio.init();
      }
    };

    // Try multiple times to ensure it initializes
    const timeout1 = setTimeout(initUnicorn, 500);
    const timeout2 = setTimeout(initUnicorn, 1500);
    const timeout3 = setTimeout(initUnicorn, 3000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, []);

  return (
    <>
      <Script
        src="https://cdn.unicorn.studio/v1.3.2/unicornStudio.umd.js"
        strategy="afterInteractive"
        onLoad={() => {
          if ((window as any).UnicornStudio) {
            (window as any).UnicornStudio.init();
          }
        }}
      />

      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <section className="relative h-screen bg-black">
          <h2 className="absolute top-4 left-4 text-white z-10">HERO: 5ZnTqqnrUWtHurlAQ3qH</h2>
          <div
            data-us-project="5ZnTqqnrUWtHurlAQ3qH"
            className="w-full h-full"
          />
        </section>

        {/* Footer Section */}
        <section className="relative h-screen bg-black">
          <h2 className="absolute top-4 left-4 text-white z-10">FOOTER: G0RtYVQ6drblW3LCkbKu</h2>
          <div
            data-us-project="G0RtYVQ6drblW3LCkbKu"
            className="w-full h-full"
          />
        </section>
      </div>
    </>
  );
}
