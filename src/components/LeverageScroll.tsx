"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function formatCurrency(n: number, currencySymbol = "$") {
  const rounded = Math.round(n);
  return (
    currencySymbol +
    rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  );
}

interface LeverageScrollProps {
  baseAmount?: number;
  maxAmount?: number;
  currencySymbol?: string;
  minLeverage?: number;
  maxLeverage?: number;
  scrollHeight?: number;
  backgroundColor?: string;
}

export default function LeverageScroll({
  baseAmount = 100,
  maxAmount = 5000,
  currencySymbol = "$",
  minLeverage = 1,
  maxLeverage = 50,
  scrollHeight = 300,
  backgroundColor = "#FFFFFF",
}: LeverageScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [amountText, setAmountText] = useState(formatCurrency(baseAmount, currencySymbol));

  const baseText = formatCurrency(baseAmount, currencySymbol);
  const titleSize = 64;
  const titlePrefix = "Your";
  const titleMiddle = "becomes";

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
          const progress = self.progress;
          const leverage = minLeverage + progress * (maxLeverage - minLeverage);
          const t = Math.max(0, Math.min(1, (leverage - minLeverage) / (maxLeverage - minLeverage)));
          const amount = baseAmount + t * (maxAmount - baseAmount);
          setAmountText(formatCurrency(amount, currencySymbol));
        },
      });

      ScrollTrigger.refresh();
    }, 300);

    // Refresh again after content loads
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
  }, [baseAmount, maxAmount, minLeverage, maxLeverage, currencySymbol]);

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
          background: backgroundColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 900,
            padding: 48,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: 32,
            alignItems: "center",
            fontFamily:
              'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji"',
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 8,
            }}
          >
            {/* Top line: "With leverage," */}
            <div
              style={{
                fontSize: titleSize,
                lineHeight: 1.06,
                fontWeight: 600,
                letterSpacing: "-0.07em",
                textAlign: "center",
                fontVariantNumeric: "tabular-nums",
                WebkitFontSmoothing: "antialiased",
                whiteSpace: "nowrap",
                opacity: 1,
                color: "#000",
              }}
            >
              With leverage,
            </div>

            {/* Bottom line */}
            <div
              style={{
                fontSize: titleSize,
                lineHeight: 1.06,
                fontWeight: 600,
                letterSpacing: "-0.07em",
                textAlign: "center",
                fontVariantNumeric: "tabular-nums",
                WebkitFontSmoothing: "antialiased",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ opacity: 0.5, color: "#000" }}>{titlePrefix} </span>
              <span style={{ opacity: 1, color: "#000" }}>{baseText} </span>
              <span style={{ opacity: 0.5, color: "#000" }}>{titleMiddle} </span>
              <span
                style={{
                  opacity: 1,
                  color: "#000",
                  display: "inline-block",
                  minWidth: "4ch",
                }}
              >
                {amountText}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
