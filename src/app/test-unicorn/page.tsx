"use client";

import UnicornScene from "unicornstudio-react";

export default function TestUnicorn() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-screen bg-black">
        <h2 className="absolute top-4 left-4 text-white z-10">HERO: 5ZnTqqnrUWtHurlAQ3qH</h2>
        <UnicornScene
          projectId="5ZnTqqnrUWtHurlAQ3qH?production=true"
          style={{ width: "100%", height: "100%" }}
          scale={1}
          dpi={1.5}
          lazyLoad={false}
        />
      </section>

      {/* Footer Section */}
      <section className="relative h-screen bg-black">
        <h2 className="absolute top-4 left-4 text-white z-10">FOOTER: G0RtYVQ6drblW3LCkbKu</h2>
        <UnicornScene
          projectId="G0RtYVQ6drblW3LCkbKu?production=true"
          style={{ width: "100%", height: "100%" }}
          scale={1}
          dpi={1.5}
          lazyLoad={false}
        />
      </section>
    </div>
  );
}
