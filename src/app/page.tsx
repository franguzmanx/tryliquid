"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { ProgressiveBlur } from "@/components/motion-primitives/progressive-blur";
import ScrollFrames from "@/components/ScrollFrames";
import UnicornScene from "unicornstudio-react";
import NumberFlow from "@number-flow/react";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}


// Logo SVG Component
const LiquidLogo = ({ dark = false }: { dark?: boolean }) => (
  <svg viewBox="0 0 93.602 28.172" className="h-7 w-auto transition-colors duration-300 ease-in-out">
    <g>
      <path
        d="M 2.254 28.172 C 1.009 28.172 0 27.163 0 25.918 L 0 2.254 C 0 1.009 1.009 0 2.254 0 L 25.918 0 C 27.163 0 28.172 1.009 28.172 2.254 L 28.172 25.918 C 28.172 27.163 27.163 28.172 25.918 28.172 Z"
        fill={dark ? "rgb(0,0,0)" : "rgb(255,255,255)"}
        className="transition-colors duration-300 ease-in-out"
      />
      <path
        d="M 14.201 4 C 15.057 4 15.469 4.475 15.941 5.195 C 17.979 8.295 19.268 10.241 19.809 11.033 C 20.716 12.361 21.258 13.291 21.435 13.826 C 21.801 14.93 21.952 15.991 21.885 17.009 C 21.629 21.064 18.262 24.22 14.199 24.214 C 10.136 24.218 6.771 21.061 6.515 17.006 C 6.449 15.989 6.599 14.929 6.965 13.824 C 7.143 13.29 7.685 12.359 8.593 11.032 C 9.133 10.24 10.423 8.294 12.461 5.195 C 12.934 4.475 13.346 4 14.201 4 Z"
        fill={dark ? "rgb(255,255,255)" : "rgb(0,0,0)"}
        className="transition-colors duration-300 ease-in-out"
      />
      <path
        d="M 39.108 6.5 L 39.108 20.105 L 46.912 20.105 L 46.912 22.891 L 36 22.891 L 36 6.5 Z M 50.638 9.47 L 47.783 9.47 L 47.783 6.752 L 50.638 6.752 L 50.638 9.468 Z M 50.662 22.891 L 47.762 22.891 L 47.762 11.011 L 50.662 11.011 Z M 60.872 12.669 L 60.872 11.012 L 63.681 11.012 L 63.681 27.403 L 60.781 27.403 L 60.781 21.348 C 59.928 22.568 58.708 23.168 57.12 23.168 C 53.505 23.168 51.779 20.29 51.779 16.951 C 51.779 13.591 53.482 10.736 57.119 10.736 C 58.754 10.736 59.997 11.38 60.872 12.669 Z M 54.749 17.043 C 54.749 19.046 55.554 20.773 57.787 20.773 C 60.067 20.773 60.849 18.954 60.849 16.951 C 60.849 14.465 59.699 13.13 57.787 13.13 C 55.923 13.13 54.749 14.557 54.749 17.043 Z M 73.113 17.665 L 73.113 11.012 L 76.013 11.012 L 76.013 22.891 L 73.205 22.891 L 73.205 21.164 C 72.307 22.5 71.064 23.167 69.475 23.167 C 66.966 23.167 65.332 21.647 65.332 18.885 L 65.332 11.012 L 68.232 11.012 L 68.232 18.402 C 68.232 19.898 68.969 20.658 70.466 20.658 C 71.87 20.658 73.113 19.622 73.113 17.665 Z M 80.558 9.469 L 77.704 9.469 L 77.704 6.753 L 80.558 6.753 Z M 80.582 22.891 L 77.682 22.891 L 77.682 11.011 L 80.582 11.011 Z M 90.702 12.554 L 90.702 6.501 L 93.602 6.501 L 93.602 22.891 L 90.792 22.891 L 90.792 21.233 C 89.918 22.523 88.674 23.167 87.04 23.167 C 83.425 23.167 81.699 20.29 81.699 16.951 C 81.699 13.591 83.402 10.736 87.039 10.736 C 88.629 10.736 89.849 11.334 90.7 12.554 Z M 84.67 17.044 C 84.67 19.046 85.475 20.773 87.708 20.773 C 89.988 20.773 90.77 18.954 90.77 16.951 C 90.77 14.465 89.62 13.13 87.708 13.13 C 85.844 13.13 84.67 14.557 84.67 17.043 Z"
        fill={dark ? "rgb(0,0,0)" : "rgb(255,255,255)"}
        className="transition-colors duration-300 ease-in-out"
      />
    </g>
  </svg>
);

// Social Icons
const ContraIcon = () => (
  <svg viewBox="0 0 18 18" className="w-[18px] h-[18px]" fill="currentColor">
    <path d="M 9.865 0.168 L 9.662 0.168 L 9.662 8.345 L 17.833 8.345 L 17.833 8.094 C 13.948 7.095 10.886 4.046 9.865 0.168" />
    <path d="M 17.833 8.512 L 9.661 8.512 C 9.568 8.512 9.493 8.437 9.493 8.344 L 9.493 0.168 C 9.493 0.075 9.568 0 9.661 0 L 9.865 0 C 9.941 0 10.007 0.052 10.027 0.125 C 11.036 3.955 14.042 6.946 17.875 7.931 C 17.949 7.951 18 8.018 18 8.094 L 18 8.345 C 18 8.437 17.925 8.513 17.832 8.512 Z M 17.833 9.859 C 13.958 10.881 10.91 13.945 9.912 17.832 L 9.662 17.832 L 9.662 9.656 L 17.833 9.656 Z" />
    <path d="M 9.661 18 C 9.568 18 9.493 17.925 9.493 17.832 L 9.493 9.655 C 9.493 9.563 9.568 9.488 9.661 9.488 L 17.833 9.488 C 17.925 9.488 18 9.563 18 9.655 L 18 9.859 C 18 9.935 17.949 10.002 17.876 10.021 C 14.045 11.034 11.061 14.037 10.074 17.874 C 10.055 17.948 9.988 18 9.912 18 Z M 8.136 17.833 C 7.115 13.954 4.053 10.906 0.168 9.907 L 0.168 9.656 L 8.34 9.656 L 8.34 17.832 L 8.136 17.832 Z" />
    <path d="M 8.136 18 C 8.06 18 7.993 17.948 7.974 17.875 C 6.965 14.045 3.958 11.054 0.126 10.069 C 0.052 10.05 0 9.983 0 9.906 L 0 9.656 C 0 9.563 0.075 9.488 0.168 9.488 L 8.339 9.488 C 8.432 9.488 8.507 9.563 8.507 9.656 L 8.507 17.832 C 8.507 17.925 8.432 18 8.339 18 Z M 0.168 8.141 C 4.044 7.119 7.091 4.055 8.089 0.168 L 8.34 0.168 L 8.34 8.344 L 0.168 8.344 Z" />
    <path d="M 8.339 8.512 C 8.432 8.512 8.506 8.437 8.507 8.345 L 8.507 0.168 C 8.507 0.075 8.432 0 8.339 0 L 8.088 0 C 8.012 0 7.945 0.052 7.926 0.126 C 6.939 3.963 3.955 6.966 0.125 7.979 C 0.051 7.998 0 8.065 0 8.141 L 0 8.344 C 0 8.437 0.075 8.512 0.168 8.512 Z" />
  </svg>
);

const MediumIcon = () => (
  <svg viewBox="0 0 30.857 18" className="w-[31px] h-[18px]" fill="currentColor">
    <path d="M 17.405 9 C 17.405 13.971 13.509 18 8.703 18 C 3.897 18 0 13.969 0 9 C 0 4.031 3.896 0 8.703 0 C 13.509 0 17.405 4.029 17.405 9 Z M 26.952 9 C 26.952 13.68 25.005 17.473 22.6 17.473 C 20.197 17.473 18.249 13.68 18.249 9 C 18.249 4.321 20.197 0.527 22.6 0.527 C 25.005 0.527 26.952 4.32 26.952 9 Z M 30.857 9 C 30.857 13.191 30.172 16.591 29.327 16.591 C 28.481 16.591 27.797 13.191 27.797 9 C 27.797 4.809 28.481 1.409 29.327 1.409 C 30.172 1.409 30.857 4.809 30.857 9 Z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 17.604 17.991" className="w-[18px] h-[18px]" fill="currentColor">
    <path d="M 10.477 7.618 L 17.03 0 L 15.477 0 L 9.787 6.614 L 5.242 0 L 0 0 L 6.873 10.002 L 0 17.991 L 1.553 17.991 L 7.562 11.006 L 12.362 17.991 L 17.604 17.991 L 10.476 7.618 Z M 8.35 10.09 L 7.653 9.094 L 2.113 1.169 L 4.498 1.169 L 8.969 7.565 L 9.666 8.561 L 15.478 16.875 L 13.093 16.875 L 8.35 10.091 Z" />
  </svg>
);

// Button with glow effect
const GlowButton = ({ children, className = "", dark = false, outline = false }: { children: React.ReactNode; className?: string; dark?: boolean; outline?: boolean }) => {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = () => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        boxShadow: dark
          ? "0 0 25px rgba(0,0,0,0.5), 0 0 50px rgba(0,0,0,0.25)"
          : "0 0 25px rgba(255,255,255,0.7), 0 0 50px rgba(255,255,255,0.35)",
        scale: 1.02,
        duration: 0.4,
        ease: "power2.out"
      });
    }
  };

  const handleMouseLeave = () => {
    if (buttonRef.current) {
      gsap.to(buttonRef.current, {
        boxShadow: "0 0 0px rgba(255,255,255,0), 0 0 0px rgba(255,255,255,0)",
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
      });
    }
  };

  const getButtonStyles = () => {
    if (outline) {
      return "bg-transparent border border-white/50 text-white hover:border-white hover:bg-white/10";
    }
    return dark ? "bg-[#141414] text-white" : "bg-[#f2f2f2] text-[#141414]";
  };

  return (
    <Link
      ref={buttonRef}
      href="#"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`${getButtonStyles()} px-7 py-3 rounded-full text-[15px] font-medium tracking-[-0.64px] transition-all duration-300 ease-in-out ${className}`}
    >
      {children}
    </Link>
  );
};

// Split text into chars for animation - text mask reveal from bottom
const SplitTextHeading = ({
  children,
  className = "",
  delay = 0,
  dimAfter = false,
  glowAfter = false
}: {
  children: string;
  className?: string;
  delay?: number;
  dimAfter?: boolean;
  glowAfter?: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (!containerRef.current || charsRef.current.length === 0) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });

    // Initial reveal animation
    tl.fromTo(
      charsRef.current,
      { yPercent: 100 },
      {
        yPercent: 0,
        duration: 0.8,
        stagger: 0.03,
        ease: "power3.out",
        delay
      }
    );

    // After animation effects
    if (dimAfter) {
      tl.to(containerRef.current, {
        opacity: 0.5,
        duration: 0.6,
        ease: "power2.out"
      }, "+=0.3");
    }

    if (glowAfter) {
      // Use filter drop-shadow for glow (doesn't get clipped)
      tl.to(containerRef.current, {
        filter: "drop-shadow(0 0 20px rgba(255,255,255,0.7)) drop-shadow(0 0 40px rgba(255,255,255,0.4))",
        duration: 0.6,
        ease: "power2.out"
      }, "+=0.3");

      // Start pulsating glow loop
      tl.add(() => {
        gsap.to(containerRef.current, {
          filter: "drop-shadow(0 0 30px rgba(255,255,255,0.9)) drop-shadow(0 0 60px rgba(255,255,255,0.5))",
          duration: 2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true
        });
      });
    }
  }, [delay, dimAfter, glowAfter]);

  const chars = children.split("");

  return (
    <div ref={containerRef} className={className}>
      {chars.map((char, index) => (
        <span
          key={index}
          className="inline-block overflow-hidden py-[0.1em] -my-[0.1em] px-[0.05em] -mx-[0.05em]"
        >
          <span
            ref={(el) => {
              if (el) charsRef.current[index] = el;
            }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </span>
        </span>
      ))}
    </div>
  );
};

// Animated Description Component
const AnimatedDescription = ({ children, className = "", immediate = false }: { children: React.ReactNode; className?: string; immediate?: boolean }) => {
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!descRef.current) return;

    if (immediate) {
      // Animate immediately with a small delay
      gsap.fromTo(
        descRef.current,
        {
          opacity: 0,
          filter: "blur(10px)",
          y: 20
        },
        {
          opacity: 0.8,
          filter: "blur(0px)",
          y: 0,
          duration: 0.8,
          delay: 0.5,
          ease: "power2.out"
        }
      );
    } else {
      gsap.fromTo(
        descRef.current,
        {
          opacity: 0,
          filter: "blur(10px)",
          y: 20
        },
        {
          opacity: 0.8,
          filter: "blur(0px)",
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: descRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    }
  }, [immediate]);

  return (
    <p ref={descRef} className={className}>
      {children}
    </p>
  );
};

// Animated Tagline Component with line growth
const AnimatedTagline = ({
  label,
  number,
  dark = false
}: {
  label: string;
  number: string;
  dark?: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelCharsRef = useRef<HTMLSpanElement[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);
  const numberCharsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });

    // 1. Label text animates in (character by character)
    if (labelCharsRef.current.length > 0) {
      tl.fromTo(
        labelCharsRef.current,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.6,
          stagger: 0.02,
          ease: "power3.out"
        }
      );
    }

    // 2. Line grows horizontally
    if (lineRef.current) {
      tl.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.5,
          ease: "power2.out"
        },
        "-=0.2"
      );
    }

    // 3. Number text animates in
    if (numberCharsRef.current.length > 0) {
      tl.fromTo(
        numberCharsRef.current,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.5,
          stagger: 0.03,
          ease: "power3.out"
        },
        "-=0.2"
      );
    }
  }, []);

  const labelChars = label.split("");
  const numberChars = number.split("");
  const textColor = dark ? "text-black/40" : "text-white/40";
  const lineColor = dark ? "bg-black/20" : "bg-white/20";

  return (
    <div ref={containerRef} className="flex items-center gap-3">
      {/* Label text */}
      <span className={`${textColor} text-[13.5px] tracking-[0.98px] font-normal`}>
        {labelChars.map((char, index) => (
          <span
            key={index}
            className="inline-block overflow-hidden"
          >
            <span
              ref={(el) => {
                if (el) labelCharsRef.current[index] = el;
              }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </span>
          </span>
        ))}
      </span>

      {/* Growing line */}
      <div
        ref={lineRef}
        className={`w-[34px] h-[2px] ${lineColor} origin-left`}
        style={{ transform: "scaleX(0)" }}
      />

      {/* Number text */}
      <span className={`${textColor} text-[14px] tracking-[0.98px] font-normal`}>
        {numberChars.map((char, index) => (
          <span
            key={index}
            className="inline-block overflow-hidden"
          >
            <span
              ref={(el) => {
                if (el) numberCharsRef.current[index] = el;
              }}
              className="inline-block"
            >
              {char}
            </span>
          </span>
        ))}
      </span>
    </div>
  );
};

// Leverage Text Overlay Component
const LeverageTextOverlay = ({ progress }: { progress: number }) => {
  const baseAmount = 100;
  const maxAmount = 5000;
  const amount = Math.round(baseAmount + progress * (maxAmount - baseAmount));

  // Fade in with blur during early scroll progress (0 to 0.15)
  const fadeProgress = Math.min(1, progress / 0.15);
  const containerOpacity = fadeProgress;
  const blur = 20 * (1 - fadeProgress);

  // Opacity swap: starts after fade-in (0.15), completes at ~$1000 mark (0.25)
  // Top text: 100% -> 50%, Bottom text: 50% -> 100%
  const swapProgress = Math.max(0, Math.min(1, (progress - 0.15) / 0.10));
  const topOpacity = 1 - (swapProgress * 0.5); // 1 -> 0.5
  const bottomOpacity = 0.5 + (swapProgress * 0.5); // 0.5 -> 1

  return (
    <div
      className="flex flex-col items-center gap-2 pb-[35vh]"
      style={{
        opacity: containerOpacity,
        filter: `blur(${blur}px)`,
        transition: "opacity 0.1s ease-out, filter 0.1s ease-out"
      }}
    >
      {/* Tagline */}
      <div className="mb-4">
        <AnimatedTagline label="SMALL TEXT" number="02" dark />
      </div>
      <div
        className="text-[77px] leading-[1.06] font-medium tracking-[-0.02em] text-center text-black"
        style={{ opacity: topOpacity, transition: "opacity 0.15s ease-out" }}
      >
        With leverage,
      </div>
      <div
        className="text-[77px] leading-[1.06] tracking-[-0.02em] whitespace-nowrap text-black flex items-baseline justify-center"
        style={{ opacity: bottomOpacity, transition: "opacity 0.15s ease-out" }}
      >
        <span className="font-normal">Your</span>
        <span className="font-medium mx-[0.2em]">$100</span>
        <span className="font-normal">becomes</span>
        <span className="font-medium w-[200px] ml-[0.2em]">
          <NumberFlow
            value={amount}
            format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
          />
        </span>
      </div>
    </div>
  );
};

// Feature Card Component - progress-based animation
const FeatureCard = ({
  icon,
  title,
  description,
  side,
  progress,
  showAt
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  side: "left" | "right";
  progress: number;
  showAt: number; // 0-1, when this card should start appearing
}) => {
  // Calculate card-specific progress (0 to 1 for this card's animation)
  const cardProgress = Math.max(0, Math.min(1, (progress - showAt) / 0.15));
  const opacity = cardProgress;
  const blur = 20 * (1 - cardProgress);
  const x = (side === "left" ? -40 : 40) * (1 - cardProgress);

  return (
    <div
      className="max-w-[320px] p-6"
      style={{
        opacity,
        filter: `blur(${blur}px)`,
        transform: `translateX(${x}px)`
      }}
    >
      <div className="text-black/40 mb-4">{icon}</div>
      <p className="text-black text-[15px] leading-[22px]">
        <span className="font-medium">{title}</span>{" "}
        <span className="text-black/50">{description}</span>
      </p>
    </div>
  );
};

// Feature Icons
const TradeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 13h18M3 13l4-4M3 13l4 4M21 11l-4-4M21 11l-4 4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChartIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 3v18h18M7 14l4-4 4 4 5-5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WalletIcon = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 12V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-5zm-8 1a1 1 0 100-2 1 1 0 000 2z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function Home() {
  const [isLightSection, setIsLightSection] = useState(false);
  const [leverageProgress, setLeverageProgress] = useState(0);
  const [glassProgress, setGlassProgress] = useState(0);
  const navRef = useRef<HTMLElement>(null);
  const heroUnicornRef = useRef<HTMLDivElement>(null);
  const lightSectionRef = useRef<HTMLDivElement>(null);
  const waterDropSectionRef = useRef<HTMLElement>(null);
  const glassSectionRef = useRef<HTMLElement>(null);
  const tradingUIRef = useRef<HTMLDivElement>(null);
  const footerContentRef = useRef<HTMLDivElement>(null);
  const footerUnicornRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Show scrollbar when scrolling, hide after idle
    let scrollTimeout: NodeJS.Timeout;
    lenis.on('scroll', () => {
      document.documentElement.classList.add('is-scrolling');
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        document.documentElement.classList.remove('is-scrolling');
      }, 1000);
    });

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Hero Unicorn fade-in animation
    if (heroUnicornRef.current) {
      gsap.fromTo(
        heroUnicornRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.5,
          delay: 0.2,
          ease: "power2.out"
        }
      );
    }

    // Navbar slide-in animation
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.15,
          ease: "power2.inOut"
        }
      );
    }

    // Light section detection for navbar color change
    if (lightSectionRef.current) {
      ScrollTrigger.create({
        trigger: lightSectionRef.current,
        start: "top 70px",
        end: "bottom 70px",
        onEnter: () => setIsLightSection(true),
        onLeave: () => setIsLightSection(false),
        onEnterBack: () => setIsLightSection(true),
        onLeaveBack: () => setIsLightSection(false)
      });
    }

    // Trading UI 3D tilt animation
    if (tradingUIRef.current) {
      gsap.fromTo(
        tradingUIRef.current,
        {
          rotateX: 25,
          opacity: 0.3,
          filter: "blur(10px)",
          scale: 0.95
        },
        {
          rotateX: 0,
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: tradingUIRef.current,
            start: "top 90%",
            end: "top 30%",
            scrub: 1
          }
        }
      );
    }

    // Water drop section fade-in animation
    if (waterDropSectionRef.current) {
      gsap.fromTo(
        waterDropSectionRef.current,
        {
          opacity: 0
        },
        {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: waterDropSectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    // Glass section fade-in animation
    if (glassSectionRef.current) {
      gsap.fromTo(
        glassSectionRef.current,
        {
          opacity: 0
        },
        {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: glassSectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    // Footer cascading blur animation
    if (footerContentRef.current) {
      const footerElements = footerContentRef.current.querySelectorAll('.footer-animate');
      gsap.fromTo(
        footerElements,
        {
          opacity: 0,
          filter: "blur(15px)",
          y: 20
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerContentRef.current,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    // Footer Unicorn scene fade-in animation
    if (footerUnicornRef.current) {
      gsap.fromTo(
        footerUnicornRef.current,
        {
          opacity: 0
        },
        {
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: footerUnicornRef.current,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      );
    }

    return () => {
      clearTimeout(scrollTimeout);
      document.documentElement.classList.remove('is-scrolling');
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="bg-white">
      {/* Navigation */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 h-[70px] transition-all duration-300 ease-in-out"
        style={{ opacity: 0 }}
      >
        {/* Progressive Blur Background */}
        <ProgressiveBlur
          className="absolute inset-x-0 top-0 h-[85px] pointer-events-none"
          direction="top"
          blurLayers={4}
          blurIntensity={2.5}
        />
        <div className="relative z-10 max-w-[1440px] mx-auto h-full px-5 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <LiquidLogo dark={isLightSection} />
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="https://docs.tryliquid.xyz/"
              className={`text-[15px] tracking-[-0.64px] font-medium opacity-50 hover:opacity-100 transition-all duration-300 ease-in-out ${
                isLightSection ? "text-black" : "text-white"
              }`}
            >
              Documentation
            </Link>
            <Link
              href="https://tryliquid.xyz/support"
              className={`text-[15px] tracking-[-0.64px] font-medium opacity-50 hover:opacity-100 transition-all duration-300 ease-in-out ${
                isLightSection ? "text-black" : "text-white"
              }`}
            >
              Support
            </Link>
          </div>

          {/* CTA Button */}
          <GlowButton dark={isLightSection} outline={!isLightSection}>
            Launch App
          </GlowButton>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-[100vh] min-h-[900px] bg-black overflow-hidden">
        {/* Unicorn Studio Background */}
        <div ref={heroUnicornRef} className="absolute inset-0 z-0 w-full h-full" style={{ opacity: 0 }}>
          <UnicornScene
            projectId="5ZnTqqnrUWtHurlAQ3qH?production=true"
            scale={1}
            dpi={1.5}
            lazyLoad={false}
          />
        </div>
        {/* Content */}
        <div className="relative z-10 h-full max-w-[1440px] mx-auto px-[35px] flex flex-col">
          {/* Main Title - Centered vertically, pushed down */}
          <div className="flex-1 flex items-center pt-[10vh]">
            <div>
              <SplitTextHeading
                className="text-white text-[94px] font-normal leading-[103px] tracking-[-0.06em]"
                dimAfter
              >
                Leverage
              </SplitTextHeading>
              <SplitTextHeading
                className="text-white text-[94px] font-normal leading-[103px] tracking-[-0.04em]"
                delay={0.1}
                glowAfter
              >
                Everything
              </SplitTextHeading>
            </div>
          </div>

          {/* Bottom Content */}
          <div className="flex items-end justify-between pb-[145px]">
            <AnimatedDescription className="text-white/95 text-[18px] font-normal leading-[25px] max-w-[380px]" immediate>
              Trade from anywhere and multiply your returns by up to 150x.
            </AnimatedDescription>
            <GlowButton>
              Launch App
            </GlowButton>
          </div>
        </div>
      </header>

      {/* Cut the Noise / Stay Liquid Section */}
      <section className="relative h-[900px] bg-black overflow-hidden">
        {/* Gradient mask top: black to transparent */}
        <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />

        {/* Unicorn Studio Background */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <div data-us-project="qo3w02bVxl3QFyjkSWtn" className="w-full h-full" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center">
          {/* Animated Tagline */}
          <div className="mb-4">
            <AnimatedTagline label="SMALL TEXT" number="01" />
          </div>

          {/* Titles */}
          <SplitTextHeading className="text-white/40 text-[94px] font-normal leading-[103px] tracking-[-3.76px] text-center">
            Cut the noise.
          </SplitTextHeading>
          <SplitTextHeading className="text-white text-[94px] font-normal leading-[103px] tracking-[-3.76px] text-center" delay={0.15}>
            Stay Liquid
          </SplitTextHeading>
        </div>

        {/* Gradient mask bottom: #F0F3F2 to transparent */}
        <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-[#F0F3F2] to-transparent pointer-events-none z-20" />
      </section>

      {/* White Sections Container */}
      <div ref={lightSectionRef}>
        {/* Water Drop Animation with Leverage Text - White Background */}
        <section ref={waterDropSectionRef} className="relative bg-white" style={{ opacity: 0 }}>
          {/* Gradient mask top: gray to transparent */}
          <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-[#F1F4F2] to-transparent pointer-events-none z-20" />
          <ScrollFrames
            basePath="/frames/frame_"
            frameCount={176}
            scrollHeight={300}
            backgroundColor="#FFFFFF"
            onProgress={setLeverageProgress}
          >
            <LeverageTextOverlay progress={leverageProgress} />
          </ScrollFrames>
          {/* Gradient mask bottom: white to transparent */}
          <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />
        </section>

        {/* Phone/Glass Animation with Feature Cards - White Background */}
        <section ref={glassSectionRef} className="relative bg-white" style={{ opacity: 0 }}>
          {/* Gradient mask top */}
          <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-white to-transparent pointer-events-none z-20" />

          <ScrollFrames
            basePath="/frames_glass/frame_"
            frameCount={301}
            scrollHeight={400}
            backgroundColor="#FFFFFF"
            onProgress={setGlassProgress}
          >
            {/* Feature Cards Overlay */}
            <div className="w-full h-full flex items-center justify-between px-8 lg:px-16">
              {/* Left Side Cards */}
              <div className="flex flex-col gap-8">
                <FeatureCard
                  icon={<TradeIcon />}
                  title="Instant Trading."
                  description="Execute trades in milliseconds with zero slippage on any asset pair."
                  side="left"
                  progress={glassProgress}
                  showAt={0.1}
                />
                <FeatureCard
                  icon={<ShieldIcon />}
                  title="Secure Custody."
                  description="Your assets are protected with institutional-grade security protocols."
                  side="left"
                  progress={glassProgress}
                  showAt={0.35}
                />
              </div>

              {/* Right Side Cards */}
              <div className="flex flex-col gap-8">
                <FeatureCard
                  icon={<ChartIcon />}
                  title="Advanced Analytics."
                  description="Real-time charts and insights to make informed trading decisions."
                  side="right"
                  progress={glassProgress}
                  showAt={0.5}
                />
                <FeatureCard
                  icon={<WalletIcon />}
                  title="Multi-Chain Support."
                  description="Trade across multiple blockchains from a single unified interface."
                  side="right"
                  progress={glassProgress}
                  showAt={0.7}
                />
              </div>
            </div>
          </ScrollFrames>
        </section>

        {/* White section above Earn While You Trade */}
        <div className="h-[200px] bg-white" />
      </div>

      {/* Earn While You Trade Section */}
      <section className="relative min-h-[1177.88px] bg-black overflow-hidden py-[100px]">
        {/* Gradient mask top: white to transparent */}
        <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-white to-transparent pointer-events-none z-20" />
        {/* Unicorn Studio Background */}
        <div className="absolute inset-0 z-0 w-full h-full">
          <div data-us-project="2SS4aNbbiBECE8sOv4g4" className="w-full h-full" />
        </div>

        {/* Content */}
        <div className="relative max-w-[1440px] mx-auto px-[100px]">
          {/* Animated Tagline */}
          <div className="flex justify-center">
            <AnimatedTagline label="SMALL TEXT" number="01" />
          </div>

          {/* Title */}
          <div className="flex items-baseline justify-center gap-4 mt-4 flex-wrap">
            <SplitTextHeading className="text-white/40 text-[83.9px] font-normal leading-[103.4px] tracking-[-3.76px]">
              Earn while you
            </SplitTextHeading>
            <SplitTextHeading className="text-white text-[80.6px] font-normal leading-[103.4px] tracking-[-3.76px]" delay={0.1}>
              trade.
            </SplitTextHeading>
          </div>

          {/* Description and CTA */}
          <div className="flex flex-col items-center mt-4">
            <AnimatedDescription className="text-white/60 text-[18px] font-normal leading-[28px] max-w-[520px] text-center">
              Earn yield on your collateral while maintaining full trading power. Your assets work for you, even when you&apos;re not actively trading.
            </AnimatedDescription>
            <div className="mt-8">
              <GlowButton>
                Launch App
              </GlowButton>
            </div>
          </div>

          {/* Trading UI Image */}
          <div className="relative mt-[60px] mx-auto max-w-[1050px] h-[675px]" style={{ perspective: "1200px" }}>
            <div
              ref={tradingUIRef}
              className="absolute inset-0 rounded-[20px] overflow-hidden border border-neutral-800"
              style={{ transformStyle: "preserve-3d", transformOrigin: "center bottom" }}
            >
              <Image
                src="/images/trading-ui.png"
                alt="Trading Interface"
                fill
                className="object-cover mix-blend-screen"
              />
              {/* Top border with rounded corners - on top of gray */}
              <div className="absolute inset-0 rounded-[20px] pointer-events-none z-20" style={{
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.6) 0%, transparent 3%, transparent 97%, rgba(255,255,255,0.6) 100%)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                padding: '1px'
              }} />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-black overflow-hidden flex flex-col">
        {/* Top - Content */}
        <div ref={footerContentRef} className="max-w-[1440px] mx-auto px-[120px] pt-[100px] pb-[50px] w-full">
          <div className="flex justify-between">
            {/* Logo and Links */}
            <div className="flex gap-[100px]">
              {/* Logo */}
              <div className="footer-animate">
                <LiquidLogo />
              </div>

              {/* Main Links */}
              <div className="flex flex-col gap-[16px]">
                <Link
                  href="https://docs.tryliquid.xyz/"
                  className="footer-animate text-white text-[15.3px] font-medium tracking-[-0.64px] leading-[22.4px] hover:opacity-80 transition-opacity"
                >
                  Docs
                </Link>
                <Link
                  href="https://tryliquid.xyz/support"
                  className="footer-animate text-white text-[15.3px] font-medium tracking-[-0.64px] leading-[22.4px] hover:opacity-80 transition-opacity"
                >
                  Support
                </Link>
                <Link
                  href="#"
                  className="footer-animate text-white text-[15.3px] font-medium tracking-[-0.64px] leading-[22.4px] hover:opacity-80 transition-opacity"
                >
                  About
                </Link>
              </div>

              {/* Legal Links */}
              <div className="flex flex-col gap-[16px]">
                <Link
                  href="https://tryliquid.xyz/termsofservice"
                  className="footer-animate text-white text-[15.1px] font-medium tracking-[-0.64px] leading-[22.4px] hover:opacity-80 transition-opacity"
                >
                  Terms of Service
                </Link>
                <Link
                  href="https://tryliquid.xyz/privacy"
                  className="footer-animate text-white text-[15.1px] font-medium tracking-[-0.64px] leading-[22.4px] hover:opacity-80 transition-opacity"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="https://tryliquid.xyz/brand"
                  className="footer-animate text-white text-[15.1px] font-medium tracking-[-0.64px] leading-[22.4px] hover:opacity-80 transition-opacity"
                >
                  Brand Kit
                </Link>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-start gap-6 pt-[78px]">
              <Link href="#" className="footer-animate text-white hover:opacity-80 transition-opacity">
                <ContraIcon />
              </Link>
              <Link href="#" className="footer-animate text-white hover:opacity-80 transition-opacity">
                <MediumIcon />
              </Link>
              <Link href="https://x.com/liquidtrading" className="footer-animate text-white hover:opacity-80 transition-opacity">
                <XIcon />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom - Unicorn Studio Background with mask */}
        <div
          ref={footerUnicornRef}
          className="relative w-full h-[712px]"
          style={{
            opacity: 0,
            mask: 'linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 7.63%, rgb(0, 0, 0) 86.96%, rgba(0, 0, 0, 0) 97.38%)',
            WebkitMask: 'linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 7.63%, rgb(0, 0, 0) 86.96%, rgba(0, 0, 0, 0) 97.38%)'
          }}
        >
          <UnicornScene
            projectId="G0RtYVQ6drblW3LCkbKu?production=true"
            scale={1}
            dpi={1.5}
            lazyLoad={true}
          />
        </div>
      </footer>
    </div>
  );
}
