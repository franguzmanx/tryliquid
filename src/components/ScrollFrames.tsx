"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ScrollFramesProps {
  basePath: string;
  frameCount: number;
  scrollHeight?: number;
  backgroundColor?: string;
  children?: React.ReactNode;
  onProgress?: (progress: number) => void;
}

export default function ScrollFrames({
  basePath,
  frameCount,
  scrollHeight = 300,
  backgroundColor = "#FFFFFF",
  children,
  onProgress,
}: ScrollFramesProps) {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // Preload all images
  useEffect(() => {
    let loadedCount = 0;
    imagesRef.current = [];

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = `${basePath}${String(i).padStart(4, "0")}.jpg`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount >= frameCount * 0.5) { // Start when 50% loaded
          setImagesLoaded(true);
        }
      };
      imagesRef.current.push(img);
    }
  }, [frameCount, basePath]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!containerRef.current || !imagesLoaded) return;

    let trigger: ScrollTrigger | null = null;

    // Small delay after images loaded
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
          onProgress?.(self.progress);
        },
      });

      ScrollTrigger.refresh();
    }, 100);

    // Refresh on window load
    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', handleLoad);

    // Refresh on resize
    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(initTimeout);
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('resize', handleResize);
      if (trigger) trigger.kill();
    };
  }, [frameCount, imagesLoaded]);

  // Draw current frame on canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !imagesRef.current[currentFrame - 1]) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imagesRef.current[currentFrame - 1];
    if (img.complete && img.naturalWidth > 0) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
    }
  }, [currentFrame]);

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
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        {/* Overlay content */}
        {children && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
