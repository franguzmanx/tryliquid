"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
    gsap.registerPlugin(ScrollTrigger);

    if (!containerRef.current) return;

    let trigger: ScrollTrigger | null = null;

    // Wait for DOM to be fully ready
    const initTimeout = setTimeout(() => {
      if (!containerRef.current) return;

      trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const frame = Math.round(self.progress * (frameCount - 1)) + 1;
          if (!isNaN(frame) && frame >= 1 && frame <= frameCount) {
            setCurrentFrame(frame);
          }
        },
      });

      ScrollTrigger.refresh();
    }, 300);

    // Refresh again after images load
    const refreshTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1500);

    // Refresh on window load
    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', handleLoad);

    // Refresh on resize
    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(initTimeout);
      clearTimeout(refreshTimeout);
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('resize', handleResize);
      if (trigger) trigger.kill();
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
