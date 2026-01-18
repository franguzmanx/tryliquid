"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollFramesProps {
  basePath: string;
  frameCount: number;
  scrollHeight?: number;
  backgroundColor?: string;
}

export default function ScrollFrames({
  basePath,
  frameCount,
  scrollHeight = 300,
  backgroundColor = "#FFFFFF",
}: ScrollFramesProps) {
  const [currentFrame, setCurrentFrame] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const frameNum = String(Math.max(1, Math.min(currentFrame, frameCount))).padStart(4, "0");
  const imageSrc = `${basePath}${frameNum}.jpg`;

  useEffect(() => {
    // Preload first 10 frames
    for (let i = 1; i <= Math.min(10, frameCount); i++) {
      const img = new Image();
      img.src = `${basePath}${String(i).padStart(4, "0")}.jpg`;
    }
    // Preload rest in background
    setTimeout(() => {
      for (let i = 11; i <= frameCount; i++) {
        const img = new Image();
        img.src = `${basePath}${String(i).padStart(4, "0")}.jpg`;
      }
    }, 100);
  }, [frameCount, basePath]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Delay to ensure DOM is ready after hydration
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const frame = Math.round(self.progress * (frameCount - 1)) + 1;
        if (!isNaN(frame) && frame >= 1 && frame <= frameCount) {
          setCurrentFrame(frame);
        }
      },
    });

    // Refresh after images might have loaded
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(refreshTimeout);
      trigger.kill();
    };
  }, [frameCount]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: `${scrollHeight}vh`,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          backgroundColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          ref={imageRef}
          src={imageSrc}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  );
}
