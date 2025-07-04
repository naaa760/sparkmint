"use client";

import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [bubbles, setBubbles] = useState([]);
  const [waterBubbles, setWaterBubbles] = useState([]);
  const [shouldFlip, setShouldFlip] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      router.push("/dashboard");
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
      setScrollY(window.scrollY);

      // Generate bubbles based on scroll position
      const scrollProgress =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
      const shouldCreateBubble = Math.random() < 0.3 && window.scrollY > 50;

      if (shouldCreateBubble) {
        const newBubble = {
          id: Date.now() + Math.random(),
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + 50,
          size: Math.random() * 30 + 10,
          speed: Math.random() * 2 + 1,
          opacity: Math.random() * 0.7 + 0.3,
          drift: (Math.random() - 0.5) * 2,
        };

        setBubbles((prev) => [...prev.slice(-20), newBubble]); // Keep only last 20 bubbles
      }
    };

    // Intersection Observer for scroll-triggered sections
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -200px 0px",
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        const section = entry.target;
        const image = section.querySelector(".scroll-reveal-image");
        const sectionNumber = section.getAttribute("data-section");

        if (entry.isIntersecting) {
          // Show current section
          section.classList.add("revealed");
          if (image) {
            setTimeout(() => {
              image.classList.remove("opacity-0", "translate-y-12");
              image.classList.add("opacity-100", "translate-y-0");
            }, 100);
          }

          // Hide other sections
          const allSections = document.querySelectorAll(
            ".scroll-reveal-section"
          );
          allSections.forEach((otherSection) => {
            const otherSectionNumber =
              otherSection.getAttribute("data-section");
            const otherImage = otherSection.querySelector(
              ".scroll-reveal-image"
            );

            if (otherSectionNumber !== sectionNumber) {
              otherSection.classList.remove("revealed");
              if (otherImage) {
                otherImage.classList.remove("opacity-100", "translate-y-0");
                otherImage.classList.add("opacity-0", "translate-y-12");
              }
            }
          });
        }
      });
    };

    const observer = new IntersectionObserver(
      handleIntersection,
      observerOptions
    );

    // Observe all scroll reveal sections
    const sections = document.querySelectorAll(".scroll-reveal-section");
    sections.forEach((section) => observer.observe(section));

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  // Update bubble positions
  useEffect(() => {
    const animateBubbles = () => {
      setBubbles((prev) =>
        prev
          .map((bubble) => ({
            ...bubble,
            y: bubble.y - bubble.speed,
            x: bubble.x + bubble.drift * 0.5,
            opacity: bubble.y < -100 ? 0 : bubble.opacity,
          }))
          .filter((bubble) => bubble.y > -100 && bubble.opacity > 0)
      );
    };

    const interval = setInterval(animateBubbles, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Hide splash screen after animation completes
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000); // 2s flip + 1.5s fade out + 0.5s buffer

    return () => clearTimeout(timer);
  }, []);

  // Generate water bubbles
  useEffect(() => {
    if (showSplash) {
      const bubblePieces = [];
      for (let i = 0; i < 30; i++) {
        bubblePieces.push({
          id: i,
          left: Math.random() * 100,
          animationDelay: Math.random() * 4,
          size: Math.random() * 15 + 5, // 5px to 20px
          opacity: Math.random() * 0.5 + 0.3, // 0.3 to 0.8
          duration: Math.random() * 2 + 3, // 3s to 5s
        });
      }
      setWaterBubbles(bubblePieces);
    }
  }, [showSplash]);

  // Add intersection observer for flip animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldFlip(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    const nftSection = document.getElementById("nft-artistry");
    if (nftSection) {
      observer.observe(nftSection);
    }

    return () => observer.disconnect();
  }, []);

  // Helper to render animated letters
  const renderAnimatedText = (text, startDelay = 0) =>
    [...text].map((char, idx) => (
      <span
        key={`${text}-${idx}`}
        className="letter-reveal"
        style={{ "--delay": `${(startDelay + idx * 0.05).toFixed(2)}s` }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  return (
    <>
      <style jsx>{`
        @keyframes coinFlip {
          0% {
            transform: rotateY(0deg) scale(1);
          }
          50% {
            transform: rotateY(180deg) scale(1.1);
          }
          100% {
            transform: rotateY(360deg) scale(1);
          }
        }

        @keyframes fadeOut {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            visibility: hidden;
          }
        }

        @keyframes gradient-shine {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes sparkle {
          0%,
          100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes gridPulse {
          0%,
          100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.4;
          }
        }

        @keyframes dotFloat {
          0%,
          100% {
            transform: translateY(0px) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-10px) scale(1.2);
            opacity: 0.8;
          }
        }

        @keyframes waterDropletFloat {
          0%,
          100% {
            transform: translateY(0px) scale(1) rotate(0deg);
            opacity: 0.4;
          }
          25% {
            transform: translateY(-5px) scale(1.1) rotate(2deg);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-12px) scale(1.2) rotate(0deg);
            opacity: 0.9;
          }
          75% {
            transform: translateY(-5px) scale(1.1) rotate(-2deg);
            opacity: 0.7;
          }
        }

        @keyframes crystalShimmer {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(0.8) rotate(0deg);
            filter: hue-rotate(0deg);
          }
          25% {
            opacity: 0.6;
            transform: scale(1.1) rotate(45deg);
            filter: hue-rotate(90deg);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.3) rotate(90deg);
            filter: hue-rotate(180deg);
          }
          75% {
            opacity: 0.4;
            transform: scale(0.9) rotate(135deg);
            filter: hue-rotate(270deg);
          }
        }

        @keyframes dropletRipple {
          0% {
            transform: scale(0.8);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.3;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes bubbleFloat {
          0% {
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            transform: translateY(-20px) translateX(10px) scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: translateY(-40px) translateX(-5px) scale(0.9);
            opacity: 0;
          }
        }

        @keyframes bubbleShimmer {
          0%,
          100% {
            background: radial-gradient(
              circle at 30% 30%,
              rgba(255, 255, 255, 0.8) 0%,
              rgba(59, 130, 246, 0.3) 30%,
              rgba(147, 197, 253, 0.2) 60%,
              rgba(219, 234, 254, 0.1) 80%,
              transparent 100%
            );
          }
          25% {
            background: radial-gradient(
              circle at 40% 20%,
              rgba(255, 255, 255, 0.9) 0%,
              rgba(34, 197, 94, 0.3) 30%,
              rgba(134, 239, 172, 0.2) 60%,
              rgba(187, 247, 208, 0.1) 80%,
              transparent 100%
            );
          }
          50% {
            background: radial-gradient(
              circle at 60% 40%,
              rgba(255, 255, 255, 0.8) 0%,
              rgba(168, 85, 247, 0.3) 30%,
              rgba(196, 181, 253, 0.2) 60%,
              rgba(233, 213, 255, 0.1) 80%,
              transparent 100%
            );
          }
          75% {
            background: radial-gradient(
              circle at 20% 60%,
              rgba(255, 255, 255, 0.9) 0%,
              rgba(245, 158, 11, 0.3) 30%,
              rgba(251, 191, 36, 0.2) 60%,
              rgba(254, 240, 138, 0.1) 80%,
              transparent 100%
            );
          }
        }

        @keyframes bubblePop {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.7;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes diagonalDotPulse {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(0.8);
          }
          25% {
            opacity: 0.6;
            transform: scale(1.1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.3);
          }
          75% {
            opacity: 0.4;
            transform: scale(0.9);
          }
        }

        @keyframes sunRayRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes sunRayPulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes lightRay1 {
          0% {
            transform: translateX(-100%) translateY(-50%) rotate(45deg);
            opacity: 0;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: translateX(100vw) translateY(-50%) rotate(45deg);
            opacity: 0;
          }
        }

        @keyframes lightRay2 {
          0% {
            transform: translateX(-100%) translateY(-50%) rotate(-30deg);
            opacity: 0;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            transform: translateX(100vw) translateY(-50%) rotate(-30deg);
            opacity: 0;
          }
        }

        @keyframes lightRay3 {
          0% {
            transform: translateX(-100%) translateY(-50%) rotate(60deg);
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateX(100vw) translateY(-50%) rotate(60deg);
            opacity: 0;
          }
        }

        @keyframes continuousFlow {
          0% {
            transform: translateX(0px) translateY(0px);
          }
          25% {
            transform: translateX(5px) translateY(-2px);
          }
          50% {
            transform: translateX(0px) translateY(-5px);
          }
          75% {
            transform: translateX(-5px) translateY(-2px);
          }
          100% {
            transform: translateX(0px) translateY(0px);
          }
        }

        @keyframes rotatePattern {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes floatPattern {
          0% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-4px) scale(1.02);
          }
          100% {
            transform: translateY(0px) scale(1);
          }
        }

        @keyframes waterBubbleFloat {
          0% {
            transform: translateY(-20vh) translateX(0px) scale(0.3);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            transform: translateY(50vh) translateX(10px) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translateY(120vh) translateX(-5px) scale(0.5);
            opacity: 0;
          }
        }

        .coin-flip-animation {
          animation: coinFlip 2s ease-in-out;
          transform-style: preserve-3d;
        }

        .splash-screen {
          animation: fadeOut 1.5s ease-out 2.5s forwards;
        }

        .light-ray {
          position: absolute;
          width: 200px;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            #84cc16,
            #c0c0c0,
            #84cc16,
            transparent
          );
          filter: blur(1px);
        }

        .light-ray-1 {
          top: 20%;
          animation: lightRay1 8s ease-in-out infinite;
          animation-delay: 0s;
        }

        .light-ray-2 {
          top: 50%;
          animation: lightRay2 10s ease-in-out infinite;
          animation-delay: 2s;
        }

        .light-ray-3 {
          top: 80%;
          animation: lightRay3 12s ease-in-out infinite;
          animation-delay: 4s;
        }

        .sun-rays {
          position: absolute;
          top: 30%;
          right: 20%;
          width: 400px;
          height: 400px;
          animation: sunRayRotate 20s linear infinite;
        }

        .sun-ray {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200px;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            #84cc16,
            #c0c0c0,
            transparent
          );
          transform-origin: 0 50%;
          filter: blur(0.5px);
          animation: sunRayPulse 3s ease-in-out infinite;
        }

        .sun-ray:nth-child(1) {
          transform: rotate(0deg);
          animation-delay: 0s;
        }
        .sun-ray:nth-child(2) {
          transform: rotate(30deg);
          animation-delay: 0.5s;
        }
        .sun-ray:nth-child(3) {
          transform: rotate(60deg);
          animation-delay: 1s;
        }
        .sun-ray:nth-child(4) {
          transform: rotate(90deg);
          animation-delay: 1.5s;
        }
        .sun-ray:nth-child(5) {
          transform: rotate(120deg);
          animation-delay: 2s;
        }
        .sun-ray:nth-child(6) {
          transform: rotate(150deg);
          animation-delay: 2.5s;
        }
        .sun-ray:nth-child(7) {
          transform: rotate(180deg);
          animation-delay: 3s;
        }
        .sun-ray:nth-child(8) {
          transform: rotate(210deg);
          animation-delay: 3.5s;
        }
        .sun-ray:nth-child(9) {
          transform: rotate(240deg);
          animation-delay: 4s;
        }
        .sun-ray:nth-child(10) {
          transform: rotate(270deg);
          animation-delay: 4.5s;
        }
        .sun-ray:nth-child(11) {
          transform: rotate(300deg);
          animation-delay: 5s;
        }
        .sun-ray:nth-child(12) {
          transform: rotate(330deg);
          animation-delay: 5.5s;
        }

        .sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, #fbbf24, transparent);
          border-radius: 50%;
          animation: sparkle 2s ease-in-out infinite;
        }

        .sparkle-small {
          width: 2px;
          height: 2px;
          background: radial-gradient(circle, #f59e0b, transparent);
        }

        .sparkle-large {
          width: 6px;
          height: 6px;
          background: radial-gradient(circle, #d97706, transparent);
        }

        .shimmer-line {
          position: absolute;
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #fbbf24, transparent);
          animation: shimmer 3s ease-in-out infinite;
        }

        .diagonal-dot-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(
              circle at center,
              #f59e0b 1.5px,
              transparent 1.5px
            ),
            radial-gradient(circle at center, #fbbf24 1px, transparent 1px),
            radial-gradient(circle at center, #d97706 2px, transparent 2px);
          background-size: 80px 80px, 120px 120px, 160px 160px;
          background-position: 0 0, 40px 40px, 80px 80px;
          transform: rotate(45deg) scale(1.4);
          animation: diagonalDotPulse 8s ease-in-out infinite;
          opacity: 0.15;
        }

        .diagonal-dot-grid-secondary {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(
              circle at center,
              #92400e 0.8px,
              transparent 0.8px
            ),
            radial-gradient(circle at center, #b45309 1.2px, transparent 1.2px);
          background-size: 60px 60px, 100px 100px;
          background-position: 20px 20px, 50px 50px;
          transform: rotate(-45deg) scale(1.2);
          animation: diagonalDotPulse 10s ease-in-out infinite reverse;
          opacity: 0.1;
        }

        .water-droplet-crystal-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(
              ellipse 8px 12px at center,
              rgba(59, 130, 246, 0.3) 0%,
              rgba(147, 197, 253, 0.4) 30%,
              rgba(219, 234, 254, 0.2) 60%,
              transparent 80%
            ),
            radial-gradient(
              ellipse 6px 9px at center,
              rgba(34, 197, 94, 0.2) 0%,
              rgba(134, 239, 172, 0.3) 40%,
              transparent 70%
            ),
            radial-gradient(
              ellipse 10px 15px at center,
              rgba(168, 85, 247, 0.2) 0%,
              rgba(196, 181, 253, 0.3) 50%,
              transparent 80%
            );
          background-size: 100px 120px, 140px 160px, 180px 200px;
          background-position: 0 0, 50px 60px, 100px 80px;
          transform: rotate(30deg) scale(1.2);
          animation: crystalShimmer 12s ease-in-out infinite;
          filter: blur(0.5px);
        }

        .water-droplet-crystal-grid-secondary {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(
              ellipse 5px 8px at center,
              rgba(245, 158, 11, 0.3) 0%,
              rgba(251, 191, 36, 0.2) 40%,
              transparent 70%
            ),
            radial-gradient(
              ellipse 7px 11px at center,
              rgba(14, 165, 233, 0.25) 0%,
              rgba(125, 211, 252, 0.2) 50%,
              transparent 80%
            );
          background-size: 80px 100px, 120px 140px;
          background-position: 40px 20px, 80px 70px;
          transform: rotate(-45deg) scale(1.1);
          animation: crystalShimmer 15s ease-in-out infinite reverse;
          filter: blur(0.3px);
        }

        .floating-dots {
          position: absolute;
          inset: 0;
        }

        .floating-dot {
          position: absolute;
          width: 6px;
          height: 6px;
          background: radial-gradient(circle, #fbbf24, #f59e0b, transparent);
          border-radius: 50%;
          animation: dotFloat 3s ease-in-out infinite;
        }

        .water-droplet {
          position: absolute;
          border-radius: 50% 50% 50% 0;
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.4) 0%,
            rgba(147, 197, 253, 0.3) 30%,
            rgba(219, 234, 254, 0.2) 60%,
            rgba(255, 255, 255, 0.1) 80%,
            transparent 100%
          );
          box-shadow: inset 2px 2px 4px rgba(255, 255, 255, 0.3),
            inset -1px -1px 2px rgba(59, 130, 246, 0.2),
            0 2px 8px rgba(59, 130, 246, 0.1);
          animation: waterDropletFloat 4s ease-in-out infinite;
          filter: blur(0.2px);
        }

        .water-droplet::before {
          content: "";
          position: absolute;
          top: 20%;
          left: 30%;
          width: 25%;
          height: 25%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.6) 0%,
            rgba(255, 255, 255, 0.2) 60%,
            transparent 100%
          );
          border-radius: 50%;
          filter: blur(0.5px);
        }

        .crystal-fragment {
          position: absolute;
          background: linear-gradient(
            45deg,
            rgba(168, 85, 247, 0.3) 0%,
            rgba(196, 181, 253, 0.2) 30%,
            rgba(233, 213, 255, 0.1) 60%,
            transparent 100%
          );
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          animation: crystalShimmer 6s ease-in-out infinite;
          filter: blur(0.3px);
        }

        .droplet-ripple {
          position: absolute;
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 50%;
          animation: dropletRipple 3s ease-out infinite;
        }

        .scroll-bubble {
          position: fixed;
          border-radius: 50%;
          pointer-events: none;
          z-index: 5;
          animation: bubbleShimmer 4s ease-in-out infinite;
          box-shadow: inset -2px -2px 6px rgba(255, 255, 255, 0.3),
            inset 2px 2px 6px rgba(0, 0, 0, 0.1),
            0 4px 15px rgba(59, 130, 246, 0.2);
          backdrop-filter: blur(2px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .scroll-bubble::before {
          content: "";
          position: absolute;
          top: 15%;
          left: 20%;
          width: 30%;
          height: 30%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.8) 0%,
            rgba(255, 255, 255, 0.4) 60%,
            transparent 100%
          );
          border-radius: 50%;
          filter: blur(1px);
        }

        .scroll-bubble::after {
          content: "";
          position: absolute;
          top: 60%;
          right: 25%;
          width: 15%;
          height: 15%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.6) 0%,
            rgba(255, 255, 255, 0.2) 60%,
            transparent 100%
          );
          border-radius: 50%;
          filter: blur(0.5px);
        }

        .bubble-pop {
          animation: bubblePop 0.6s ease-out forwards;
        }

        @keyframes spiralLineGrow {
          0% {
            transform: scale(0);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes shiningGradient {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes metallicShine {
          0%,
          100% {
            filter: brightness(1) contrast(1);
          }
          50% {
            filter: brightness(1.3) contrast(1.2);
          }
        }

        @keyframes scroll-infinite {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes moving3DShadow {
          0% {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6),
              0 25px 50px -12px rgba(59, 130, 246, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.1);
            transform: translateX(0px);
          }
          25% {
            box-shadow: -30px 25px 60px -12px rgba(0, 0, 0, 0.7),
              -30px 25px 60px -12px rgba(59, 130, 246, 0.5),
              0 0 0 1px rgba(255, 255, 255, 0.1);
            transform: translateX(-8px);
          }
          50% {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6),
              0 25px 50px -12px rgba(59, 130, 246, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.1);
            transform: translateX(0px);
          }
          75% {
            box-shadow: 30px 25px 60px -12px rgba(0, 0, 0, 0.7),
              30px 25px 60px -12px rgba(59, 130, 246, 0.5),
              0 0 0 1px rgba(255, 255, 255, 0.1);
            transform: translateX(8px);
          }
          100% {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6),
              0 25px 50px -12px rgba(59, 130, 246, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.1);
            transform: translateX(0px);
          }
        }

        .animate-scroll-infinite {
          animation: scroll-infinite 30s linear infinite;
        }

        .animate-scroll-infinite:hover {
          animation-play-state: paused;
        }

        .animate-moving-3d-shadow {
          animation: moving3DShadow 6s ease-in-out infinite;
        }

        .pattern-flow {
          animation: continuousFlow 12s ease-in-out infinite;
        }

        @media (min-width: 768px) {
          .pattern-flow {
            animation: continuousFlow 8s ease-in-out infinite;
          }
        }

        .pattern-rotate {
          animation: rotatePattern 40s linear infinite;
        }

        @media (min-width: 768px) {
          .pattern-rotate {
            animation: rotatePattern 20s linear infinite;
          }
        }

        .pattern-float {
          animation: floatPattern 10s ease-in-out infinite;
        }

        @media (min-width: 768px) {
          .pattern-float {
            animation: floatPattern 6s ease-in-out infinite;
          }
        }

        /* Corner frame accents */
        .corner-frame .corner {
          position: absolute;
          width: 18px;
          height: 18px;
          pointer-events: none;
        }
        .corner-tl {
          top: -2px;
          left: -2px;
          border-top: 2px solid #000;
          border-left: 2px solid #000;
        }
        .corner-tr {
          top: -2px;
          right: -2px;
          border-top: 2px solid #000;
          border-right: 2px solid #000;
        }
        .corner-bl {
          bottom: -2px;
          left: -2px;
          border-bottom: 2px solid #000;
          border-left: 2px solid #000;
        }
        .corner-br {
          bottom: -2px;
          right: -2px;
          border-bottom: 2px solid #000;
          border-right: 2px solid #000;
        }

        .water-bubble {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(
            circle at 30% 30%,
            rgba(173, 216, 230, 0.8) 0%,
            rgba(135, 206, 235, 0.6) 30%,
            rgba(70, 130, 180, 0.4) 60%,
            rgba(25, 25, 112, 0.2) 100%
          );
          box-shadow: inset -3px -3px 8px rgba(255, 255, 255, 0.6),
            inset 3px 3px 8px rgba(0, 0, 0, 0.1),
            0 4px 15px rgba(70, 130, 180, 0.3);
          backdrop-filter: blur(1px);
          border: 1px solid rgba(173, 216, 230, 0.4);
          animation: waterBubbleFloat ease-out infinite;
        }

        .water-bubble::before {
          content: "";
          position: absolute;
          top: 20%;
          left: 25%;
          width: 30%;
          height: 30%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(255, 255, 255, 0.4) 70%,
            transparent 100%
          );
          border-radius: 50%;
          filter: blur(1px);
        }

        @keyframes floatUp {
          0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-10px) rotate(180deg);
            opacity: 0.7;
          }
          100% {
            transform: translateY(-20px) rotate(360deg);
            opacity: 0.3;
          }
        }

        @keyframes pulseGlow {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        @keyframes neuralPulse {
          0%,
          100% {
            stroke-dashoffset: 0;
            opacity: 0.3;
          }
          50% {
            stroke-dashoffset: 10;
            opacity: 0.8;
          }
        }

        @keyframes dataFlow {
          0% {
            transform: translateX(-100px) translateY(0px);
            opacity: 0;
          }
          25% {
            opacity: 0.8;
          }
          75% {
            opacity: 0.8;
          }
          100% {
            transform: translateX(100px) translateY(-10px);
            opacity: 0;
          }
        }

        @keyframes techGlow {
          0%,
          100% {
            box-shadow: 0 0 5px rgba(99, 102, 241, 0.3);
            filter: brightness(1);
          }
          50% {
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.6);
            filter: brightness(1.3);
          }
        }

        .animate-float-up {
          animation: floatUp 8s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulseGlow 3s ease-in-out infinite;
        }

        .animate-neural-pulse {
          animation: neuralPulse 4s ease-in-out infinite;
        }

        .animate-data-flow {
          animation: dataFlow 6s ease-in-out infinite;
        }

        .animate-tech-glow {
          animation: techGlow 4s ease-in-out infinite;
        }

        /* Hide all bubbles (water & scroll) */
        .water-bubble,
        .scroll-bubble {
          display: none !important;
        }

        /* Word-by-word headline reveal */
        @keyframes wordAppear {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .word-reveal {
          opacity: 0;
          display: inline-block;
          animation: wordAppear 0.6s ease-out forwards;
          animation-delay: var(--delay, 0s);
        }

        .main-gradient {
          background: linear-gradient(
            to bottom,
            rgb(32, 32, 32) 0%,
            rgb(64, 64, 64) 25%,
            rgb(169, 169, 169) 50%,
            rgb(64, 64, 64) 75%,
            rgb(32, 32, 32) 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2),
            0px 0px 10px rgba(192, 192, 192, 0.1);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", Arial, sans-serif;
          letter-spacing: -0.02em;
          position: relative;
        }

        .main-gradient::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            45deg,
            transparent 0%,
            rgba(192, 192, 192, 0.1) 45%,
            rgba(211, 211, 211, 0.2) 50%,
            rgba(192, 192, 192, 0.1) 55%,
            transparent 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: silverShine 3s ease-in-out infinite;
        }

        @keyframes silverShine {
          0%,
          100% {
            opacity: 0;
            transform: translateX(-100%);
          }
          50% {
            opacity: 1;
            transform: translateX(100%);
          }
        }

        /* Add the cursive gradient style */
        .cursive-gradient {
          background: linear-gradient(
            to bottom,
            rgb(32, 32, 32) 0%,
            rgb(64, 64, 64) 25%,
            rgb(169, 169, 169) 50%,
            rgb(64, 64, 64) 75%,
            rgb(32, 32, 32) 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2),
            0px 0px 10px rgba(192, 192, 192, 0.1);
          font-family: "Playfair Display", "Crimson Text", serif;
          font-style: italic;
          letter-spacing: -0.02em;
        }

        .water-bubble {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(
            circle at 30% 30%,
            rgba(173, 216, 230, 0.8) 0%,
            rgba(135, 206, 235, 0.6) 30%,
            rgba(70, 130, 180, 0.4) 60%,
            rgba(25, 25, 112, 0.2) 100%
          );
          box-shadow: inset -3px -3px 8px rgba(255, 255, 255, 0.6),
            inset 3px 3px 8px rgba(0, 0, 0, 0.1),
            0 4px 15px rgba(70, 130, 180, 0.3);
          backdrop-filter: blur(1px);
          border: 1px solid rgba(173, 216, 230, 0.4);
          animation: waterBubbleFloat ease-out infinite;
        }

        .water-bubble::before {
          content: "";
          position: absolute;
          top: 20%;
          left: 25%;
          width: 30%;
          height: 30%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(255, 255, 255, 0.4) 70%,
            transparent 100%
          );
          border-radius: 50%;
          filter: blur(1px);
        }

        @keyframes floatUp {
          0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-10px) rotate(180deg);
            opacity: 0.7;
          }
          100% {
            transform: translateY(-20px) rotate(360deg);
            opacity: 0.3;
          }
        }

        @keyframes pulseGlow {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        @keyframes neuralPulse {
          0%,
          100% {
            stroke-dashoffset: 0;
            opacity: 0.3;
          }
          50% {
            stroke-dashoffset: 10;
            opacity: 0.8;
          }
        }

        @keyframes dataFlow {
          0% {
            transform: translateX(-100px) translateY(0px);
            opacity: 0;
          }
          25% {
            opacity: 0.8;
          }
          75% {
            opacity: 0.8;
          }
          100% {
            transform: translateX(100px) translateY(-10px);
            opacity: 0;
          }
        }

        @keyframes techGlow {
          0%,
          100% {
            box-shadow: 0 0 5px rgba(99, 102, 241, 0.3);
            filter: brightness(1);
          }
          50% {
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.6);
            filter: brightness(1.3);
          }
        }

        .animate-float-up {
          animation: floatUp 8s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulseGlow 3s ease-in-out infinite;
        }

        .animate-neural-pulse {
          animation: neuralPulse 4s ease-in-out infinite;
        }

        .animate-data-flow {
          animation: dataFlow 6s ease-in-out infinite;
        }

        .animate-tech-glow {
          animation: techGlow 4s ease-in-out infinite;
        }

        /* Hide all bubbles (water & scroll) */
        .water-bubble,
        .scroll-bubble {
          display: none !important;
        }

        /* Word-by-word headline reveal */
        @keyframes wordAppear {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .word-reveal {
          opacity: 0;
          display: inline-block;
          animation: wordAppear 0.6s ease-out forwards;
          animation-delay: var(--delay, 0s);
        }

        .main-gradient {
          background: linear-gradient(
            to bottom,
            rgb(32, 32, 32) 0%,
            rgb(64, 64, 64) 25%,
            rgb(169, 169, 169) 50%,
            rgb(64, 64, 64) 75%,
            rgb(32, 32, 32) 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2),
            0px 0px 10px rgba(192, 192, 192, 0.1);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", Arial, sans-serif;
          letter-spacing: -0.02em;
          position: relative;
        }

        .main-gradient::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            45deg,
            transparent 0%,
            rgba(192, 192, 192, 0.1) 45%,
            rgba(211, 211, 211, 0.2) 50%,
            rgba(192, 192, 192, 0.1) 55%,
            transparent 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: silverShine 3s ease-in-out infinite;
        }

        @keyframes silverShine {
          0%,
          100% {
            opacity: 0;
            transform: translateX(-100%);
          }
          50% {
            opacity: 1;
            transform: translateX(100%);
          }
        }

        /* Add the cursive gradient style */
        .cursive-gradient {
          background: linear-gradient(
            to bottom,
            rgb(32, 32, 32) 0%,
            rgb(64, 64, 64) 25%,
            rgb(169, 169, 169) 50%,
            rgb(64, 64, 64) 75%,
            rgb(32, 32, 32) 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2),
            0px 0px 10px rgba(192, 192, 192, 0.1);
          font-family: "Playfair Display", "Crimson Text", serif;
          font-style: italic;
          letter-spacing: -0.02em;
        }

        .wave-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.8) 2px,
            transparent 2px
          );
          background-size: 60px 60px;
          opacity: 0.4;
          animation: waveShift 30s linear infinite;
          pointer-events: none;
        }
      `}</style>

      {/* Splash Screen */}
      {showSplash && (
        <div className="fixed inset-0 z-[100] overflow-hidden splash-screen">
          {/* Fullscreen Background Video */}
          <video
            src="/bicr.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Water Bubbles */}
          {waterBubbles.map((bubble) => (
            <div
              key={bubble.id}
              className="water-bubble"
              style={{
                left: `${bubble.left}%`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                opacity: bubble.opacity,
                animationDelay: `${bubble.animationDelay}s`,
                animationDuration: `${bubble.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-white via-amber-50 to-yellow-100">
        {/* Scroll-Triggered Bubbles */}
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="scroll-bubble"
            style={{
              left: `${bubble.x}px`,
              top: `${bubble.y}px`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              opacity: bubble.opacity,
              transform: `translateY(0px)`,
              transition: "all 0.1s ease-out",
            }}
            onClick={() => {
              // Add pop effect on click
              setBubbles((prev) =>
                prev.map((b) => (b.id === bubble.id ? { ...b, opacity: 0 } : b))
              );
            }}
          />
        ))}

        {/* Enhanced Background Elements */}
        <div className="absolute inset-0 w-full h-full">
          {/* Panda Video Background */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/pandaaa.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Enhanced Gradient Overlay - Made more transparent to show video */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-amber-50/30 to-yellow-100/35"></div>

          {/* Spiral Pattern Elements - Left Side Only, No Animations */}
          {/* Top Left Flower Shape */}
          <div
            className="spiral-container"
            style={{
              top: "10%",
              left: "2%",
              opacity: 1,
              width: "120px",
              height: "120px",
            }}
          >
            <svg
              className="spiral-line-svg"
              viewBox="0 0 200 200"
              style={{ filter: "drop-shadow(0 0 3px rgba(139, 69, 19, 0.3))" }}
            >
              {/* Flower petals */}
              <path
                d="M100,100 Q80,60 60,80 Q80,100 100,80 Q120,60 140,80 Q120,100 100,120 Q80,140 60,120 Q80,100 100,100"
                fill="none"
                stroke="url(#flower-gradient1)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Inner petals */}
              <path
                d="M100,100 Q90,85 85,90 Q95,100 100,95 Q110,85 115,90 Q105,100 100,105 Q90,115 85,110 Q95,100 100,100"
                fill="none"
                stroke="url(#flower-gradient1)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Center */}
              <circle cx="100" cy="100" r="4" fill="url(#flower-gradient1)" />
              <defs>
                <linearGradient
                  id="flower-gradient1"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#3e2723" stopOpacity="1" />
                  <stop offset="15%" stopColor="#5d4037" stopOpacity="1" />
                  <stop offset="30%" stopColor="#8d6e63" stopOpacity="1" />
                  <stop offset="45%" stopColor="#f5f5dc" stopOpacity="1" />
                  <stop offset="60%" stopColor="#fff8dc" stopOpacity="1" />
                  <stop offset="75%" stopColor="#d2b48c" stopOpacity="1" />
                  <stop offset="90%" stopColor="#8b4513" stopOpacity="1" />
                  <stop offset="100%" stopColor="#654321" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Middle Left Daisy Shape */}
          <div
            className="spiral-grid"
            style={{
              top: "40%",
              left: "2%",
              width: "150px",
              height: "120px",
              opacity: 1,
            }}
          >
            <svg
              width="200"
              height="120"
              viewBox="0 0 200 120"
              style={{ filter: "drop-shadow(0 0 3px rgba(160, 82, 45, 0.4))" }}
            >
              {/* Daisy petals */}
              <path
                d="M100,60 Q80,40 70,50 Q90,60 100,50 Q120,40 130,50 Q110,60 100,70 Q80,80 70,70 Q90,60 100,60"
                fill="none"
                stroke="url(#daisy-gradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Additional petals */}
              <path
                d="M60,60 Q40,50 35,55 Q55,65 60,60 M140,60 Q160,50 165,55 Q145,65 140,60"
                fill="none"
                stroke="url(#daisy-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Stem */}
              <path
                d="M100,70 Q105,90 100,110"
                fill="none"
                stroke="url(#daisy-gradient)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="daisy-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#8b4513" stopOpacity="1" />
                  <stop offset="20%" stopColor="#a0522d" stopOpacity="1" />
                  <stop offset="40%" stopColor="#ddbf94" stopOpacity="1" />
                  <stop offset="60%" stopColor="#f5deb3" stopOpacity="1" />
                  <stop offset="80%" stopColor="#d2b48c" stopOpacity="1" />
                  <stop offset="100%" stopColor="#654321" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Bottom Left Cherry Blossom */}
          <div
            style={{
              bottom: "20%",
              left: "8%",
              position: "absolute",
              opacity: 1,
              width: "80px",
              height: "60px",
            }}
          >
            <svg
              width="120"
              height="80"
              viewBox="0 0 120 80"
              style={{ filter: "drop-shadow(0 0 2px rgba(139, 69, 19, 0.4))" }}
            >
              {/* Small cherry blossom */}
              <path
                d="M60,40 Q50,30 45,35 Q55,45 60,40 Q70,30 75,35 Q65,45 60,50 Q50,50 45,45 Q55,35 60,40"
                fill="none"
                stroke="url(#cherry-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="60" cy="40" r="3" fill="url(#cherry-gradient)" />
              <defs>
                <linearGradient
                  id="cherry-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#d2b48c" stopOpacity="1" />
                  <stop offset="50%" stopColor="#f5deb3" stopOpacity="1" />
                  <stop offset="100%" stopColor="#8b4513" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Small Left Side Accent Flowers */}
          <div
            style={{
              top: "25%",
              left: "5%",
              position: "absolute",
              opacity: 0.7,
              width: "35px",
              height: "35px",
            }}
          >
            <svg
              width="35"
              height="35"
              viewBox="0 0 35 35"
              style={{
                filter: "drop-shadow(0 0 1px rgba(210, 180, 140, 0.3))",
              }}
            >
              <path
                d="M17,17 Q12,10 10,12 Q15,20 17,17 Q22,10 25,12 Q20,20 17,22 Q12,22 10,20 Q15,12 17,17"
                fill="none"
                stroke="url(#micro-flower2)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="micro-flower2"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#d2b48c" stopOpacity="1" />
                  <stop offset="50%" stopColor="#fff8dc" stopOpacity="1" />
                  <stop offset="100%" stopColor="#8d6e63" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div
            style={{
              top: "65%",
              left: "12%",
              position: "absolute",
              opacity: 0.8,
              width: "45px",
              height: "45px",
            }}
          >
            <svg
              width="45"
              height="45"
              viewBox="0 0 45 45"
              style={{
                filter: "drop-shadow(0 0 1px rgba(139, 69, 19, 0.3))",
              }}
            >
              <path
                d="M22,22 Q17,13 15,15 Q20,25 22,22 Q27,13 30,15 Q25,25 22,28 Q17,28 15,25 Q20,17 22,22"
                fill="none"
                stroke="url(#micro-flower3)"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle cx="22" cy="22" r="2.5" fill="url(#micro-flower3)" />
              <defs>
                <linearGradient
                  id="micro-flower3"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#5d4037" stopOpacity="1" />
                  <stop offset="50%" stopColor="#ddbf94" stopOpacity="1" />
                  <stop offset="100%" stopColor="#654321" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Right Side Flower Patterns - Mirror of Left Side */}
          {/* Top Right Rose Shape */}
          <div
            style={{
              top: "10%",
              right: "2%",
              opacity: 1,
              width: "120px",
              height: "120px",
              position: "absolute",
            }}
          >
            <svg
              width="150"
              height="150"
              viewBox="0 0 150 150"
              style={{
                filter: "drop-shadow(0 0 4px rgba(210, 180, 140, 0.4))",
              }}
            >
              {/* Outer rose petals */}
              <path
                d="M75,75 Q50,40 30,60 Q40,80 60,70 Q75,50 90,70 Q110,80 120,60 Q100,40 75,75 Q50,110 30,90 Q40,70 60,80 Q75,100 90,80 Q110,70 120,90 Q100,110 75,75"
                fill="none"
                stroke="url(#rose-gradient2)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              {/* Inner rose petals */}
              <path
                d="M75,75 Q65,60 60,65 Q70,75 75,70 Q85,60 90,65 Q80,75 75,80 Q65,90 60,85 Q70,75 75,75"
                fill="none"
                stroke="url(#rose-gradient2)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="rose-gradient2"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#ffeaa7" stopOpacity="1" />
                  <stop offset="20%" stopColor="#fdcb6e" stopOpacity="1" />
                  <stop offset="40%" stopColor="#e17055" stopOpacity="1" />
                  <stop offset="60%" stopColor="#8b4513" stopOpacity="1" />
                  <stop offset="80%" stopColor="#5d4037" stopOpacity="1" />
                  <stop offset="100%" stopColor="#3e2723" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Middle Right Lotus Flower */}
          <div
            style={{
              top: "40%",
              right: "2%",
              width: "150px",
              height: "120px",
              opacity: 1,
              position: "absolute",
            }}
          >
            <svg
              className="spiral-fibonacci-svg"
              viewBox="0 0 300 300"
              style={{ filter: "drop-shadow(0 0 5px rgba(139, 69, 19, 0.5))" }}
            >
              {/* Outer lotus petals */}
              <path
                d="M150,150 Q100,80 80,120 Q120,140 140,110 Q150,80 160,110 Q180,140 220,120 Q200,80 150,150 Q100,220 80,180 Q120,160 140,190 Q150,220 160,190 Q180,160 220,180 Q200,220 150,150"
                fill="none"
                stroke="url(#lotus-gradient)"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Middle lotus petals */}
              <path
                d="M150,150 Q120,120 110,130 Q130,140 140,130 Q150,120 160,130 Q170,140 180,130 Q170,120 150,150 Q120,180 110,170 Q130,160 140,170 Q150,180 160,170 Q170,160 180,170 Q170,180 150,150"
                fill="none"
                stroke="url(#lotus-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Center */}
              <circle cx="150" cy="150" r="6" fill="url(#lotus-gradient)" />
              <defs>
                <linearGradient
                  id="lotus-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#2c1810" stopOpacity="1" />
                  <stop offset="12%" stopColor="#3e2723" stopOpacity="1" />
                  <stop offset="25%" stopColor="#5d4037" stopOpacity="1" />
                  <stop offset="37%" stopColor="#8d6e63" stopOpacity="1" />
                  <stop offset="50%" stopColor="#f5deb3" stopOpacity="1" />
                  <stop offset="62%" stopColor="#fff8dc" stopOpacity="1" />
                  <stop offset="75%" stopColor="#ddbf94" stopOpacity="1" />
                  <stop offset="87%" stopColor="#a0522d" stopOpacity="1" />
                  <stop offset="100%" stopColor="#654321" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Bottom Right Sunflower */}
          <div
            style={{
              bottom: "20%",
              right: "8%",
              position: "absolute",
              opacity: 1,
              width: "80px",
              height: "60px",
            }}
          >
            <svg
              width="120"
              height="80"
              viewBox="0 0 120 80"
              style={{ filter: "drop-shadow(0 0 2px rgba(139, 69, 19, 0.4))" }}
            >
              {/* Sunflower petals */}
              <path
                d="M60,40 Q50,30 45,35 Q55,45 60,40 Q70,30 75,35 Q65,45 60,50 Q50,50 45,45 Q55,35 60,40"
                fill="none"
                stroke="url(#sunflower-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="60" cy="40" r="3" fill="url(#sunflower-gradient)" />
              <defs>
                <linearGradient
                  id="sunflower-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#fff8dc" stopOpacity="1" />
                  <stop offset="25%" stopColor="#f5deb3" stopOpacity="1" />
                  <stop offset="50%" stopColor="#daa520" stopOpacity="1" />
                  <stop offset="75%" stopColor="#8b4513" stopOpacity="1" />
                  <stop offset="100%" stopColor="#5d4037" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Small Right Side Accent Flowers */}
          <div
            style={{
              top: "25%",
              right: "5%",
              position: "absolute",
              opacity: 0.7,
              width: "35px",
              height: "35px",
            }}
          >
            <svg
              width="35"
              height="35"
              viewBox="0 0 35 35"
              style={{
                filter: "drop-shadow(0 0 1px rgba(210, 180, 140, 0.3))",
              }}
            >
              <path
                d="M17,17 Q12,10 10,12 Q15,20 17,17 Q22,10 25,12 Q20,20 17,22 Q12,22 10,20 Q15,12 17,17"
                fill="none"
                stroke="url(#micro-flower4)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient
                  id="micro-flower4"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#ffeaa7" stopOpacity="1" />
                  <stop offset="50%" stopColor="#e17055" stopOpacity="1" />
                  <stop offset="100%" stopColor="#3e2723" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div
            style={{
              top: "65%",
              right: "12%",
              position: "absolute",
              opacity: 0.8,
              width: "45px",
              height: "45px",
            }}
          >
            <svg
              width="45"
              height="45"
              viewBox="0 0 45 45"
              style={{
                filter: "drop-shadow(0 0 1px rgba(139, 69, 19, 0.3))",
              }}
            >
              <path
                d="M22,22 Q17,13 15,15 Q20,25 22,22 Q27,13 30,15 Q25,25 22,28 Q17,28 15,25 Q20,17 22,22"
                fill="none"
                stroke="url(#micro-flower5)"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle cx="22" cy="22" r="2.5" fill="url(#micro-flower5)" />
              <defs>
                <linearGradient
                  id="micro-flower5"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#a0522d" stopOpacity="1" />
                  <stop offset="50%" stopColor="#f5deb3" stopOpacity="1" />
                  <stop offset="100%" stopColor="#654321" stopOpacity="1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Bottom fade overlay for smooth section transition */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-[#fdf5d5]/50 to-[#fdf5d5]"></div>

        {/* Enhanced Sticky Navbar */}
        <nav
          className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[80%] max-w-3xl px-4 py-3 rounded-xl transition-all duration-500 ${
            scrolled
              ? "bg-white/95 backdrop-blur-xl border border-amber-200/50 shadow-md shadow-amber-100/20"
              : "bg-transparent"
          }`}
        >
          <div className="max-w-full mx-auto flex items-center justify-between text-sm lg:text-base">
            {/* Enhanced Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 bg-gradient-to-br from-amber-500 via-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-sm shadow-amber-200/40 transform hover:scale-105 transition-transform duration-300">
                <span className="text-white font-bold text-base">S</span>
              </div>
              <span className="text-gray-800 text-lg font-semibold tracking-wide bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text">
                sparkmint
              </span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <a
                href="#features"
                className="text-gray-700 hover:text-amber-600 transition-all duration-300 font-medium text-sm relative group"
              >
                Token Creator
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a
                href="#about"
                className="text-gray-700 hover:text-amber-600 transition-all duration-300 font-medium text-sm relative group"
              >
                Wallet Integration
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>

            {/* Enhanced Auth Button */}
            <div className="flex items-center">
              <SignUpButton mode="modal">
                <button className="bg-gradient-to-r from-amber-500 via-yellow-500 to-yellow-600 hover:from-amber-600 hover:via-yellow-600 hover:to-yellow-700 text-white px-5 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 shadow-sm shadow-amber-200/30 hover:shadow-md hover:shadow-amber-300/40 w-auto">
                  Get Started
                </button>
              </SignUpButton>
            </div>
          </div>
        </nav>

        {/* Enhanced Main Content */}
        <div className="relative z-10 pt-32 pb-12 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              {/* Enhanced Left Content */}
              <div className="space-y-10 relative lg:col-span-2 text-center">
                <div className="space-y-10 relative max-w-6xl mx-auto">
                  <h1 className="font-normal main-gradient text-3xl sm:text-4xl lg:text-5xl xl:text-6xl tracking-normal leading-tight">
                    <span className="block mb-4">New gen of</span>
                    <span className="block mb-4">digital currency</span>
                    <span className="block">creation platform</span>
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-normal tracking-wide">
                    Experience secure and efficient token creation, minting, and
                    transfers on Solana with our cutting-edge solutions designed
                    for the future.
                  </p>
                </div>

                {/* Enhanced CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 pt-6 justify-center items-center">
                  <SignUpButton mode="modal">
                    <button className="bg-gradient-to-r from-amber-500 via-yellow-500 to-yellow-600 hover:from-amber-600 hover:via-yellow-600 hover:to-yellow-700 text-white px-4 py-1 rounded-md font-medium text-xs transition-all duration-300 transform hover:scale-105 shadow-sm shadow-amber-200/30 hover:shadow-md hover:shadow-amber-300/40 w-auto">
                      Start Creating Tokens
                    </button>
                  </SignUpButton>
                  <SignInButton mode="modal">
                    <button className="border-2 border-amber-300 text-gray-700 px-3 py-2 sm:px-3 sm:py-2 md:px-4 md:py-2 lg:px-5 lg:py-2 rounded-lg font-medium text-sm hover:border-amber-500 hover:bg-amber-50 transition-all duration-300 backdrop-blur-lg shadow-sm hover:shadow-md transform hover:scale-105 w-auto">
                      Sign In
                    </button>
                  </SignInButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div id="features" className="relative z-10 py-32 px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-light text-gray-800 mb-6 tracking-wide drop-shadow-sm">
                Powerful Features for Token Creation
              </h2>
              <p class="jsx-fbc85c9f3a8a5e03 text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-normal tracking-wide italic">
                Everything you need to create, mint, and manage tokens on Solana
                blockchain with enterprise-grade security
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {[].map((feature, index) => (
                <div
                  key={index}
                  className="group bg-white/95 backdrop-blur-xl border border-amber-200/70 rounded-3xl p-10 hover:bg-white hover:shadow-2xl hover:shadow-amber-200/30 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2"
                >
                  <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4 tracking-wide">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 font-light tracking-wide leading-relaxed">
                    {feature.description}
                  </p>
                  <div
                    className={`w-full h-1 bg-gradient-to-r ${feature.gradient} rounded-full mt-6 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}
                  ></div>
                </div>
              ))}
            </div>

            {/* Bottom gradient fade */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-b from-transparent via-[#fdf5d5]/60 to-[#fdf5d5]"></div>
          </div>
        </div>
      </div>

      {/* NFT Artistry Showcase Section */}
      <section
        id="nft-artistry"
        className="relative min-h-screen bg-gradient-to-b from-amber-100 via-yellow-100 to-amber-50 text-black overflow-hidden"
      >
        {/* Navigation */}
        <nav className="relative z-20 flex flex-col md:flex-row items-center justify-between px-4 md:px-8 py-4 space-y-4 md:space-y-0">
          <div className="text-xl font-bold tracking-[0.15em]">DANKETSU</div>
          <div className="flex space-x-4 md:space-x-8 text-sm tracking-[0.15em]">
            <a href="#" className="hover:text-gray-300 transition-colors">
              HOME
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              ABOUT US
            </a>
          </div>
        </nav>

        {/* Main Content */}
        <div className="relative z-10 px-4 md:px-6 pt-8 md:pt-12">
          <div className="max-w-6xl mx-auto text-center">
            <h2
              className="cursive-gradient text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 md:mb-6"
              style={{
                opacity: 1,
                filter: "blur(0px)",
                transform: "none",
              }}
            >
              <span className="block">Your secure foundation for</span>
              <span className="block">effortless secrets</span>
              <span className="block">management</span>
            </h2>
            <p className="text-xs md:text-sm text-gray-600 tracking-[0.15em] leading-relaxed mb-8 md:mb-16 opacity-80">
              Secure, scalable, and easy-to-use secrets management for your
              entire organization
            </p>

            {/* NFT Cards */}
            <div className="relative flex justify-center items-center mt-10 md:mt-20 mb-16 md:mb-32">
              <div className="flex flex-wrap md:flex-nowrap items-center justify-center gap-6 md:gap-4">
                {[
                  {
                    src: "/c1.jpg",
                    rotation: "-rotate-12",
                    translate: "-translate-y-4",
                    zIndex: "z-10",
                    animationDelay: "0ms",
                    flipClass: shouldFlip ? "flip-neg12" : "",
                  },
                  {
                    src: "/c2.jpg",
                    rotation: "-rotate-6",
                    translate: "-translate-y-2",
                    zIndex: "z-20",
                    animationDelay: "150ms",
                    flipClass: shouldFlip ? "flip-neg6" : "",
                  },
                  {
                    src: "/c3.jpg",
                    rotation: "rotate-0",
                    translate: "translate-y-0",
                    zIndex: "z-30",
                    featured: true,
                    animationDelay: "300ms",
                    flipClass: shouldFlip ? "flip-0" : "",
                  },
                  {
                    src: "/c4.jpg",
                    rotation: "rotate-6",
                    translate: "-translate-y-2",
                    zIndex: "z-20",
                    animationDelay: "450ms",
                    flipClass: shouldFlip ? "flip-6" : "",
                  },
                  {
                    src: "/c5.jpg",
                    rotation: "rotate-12",
                    translate: "-translate-y-4",
                    zIndex: "z-10",
                    animationDelay: "600ms",
                    flipClass: shouldFlip ? "flip-12" : "",
                  },
                ].map((card, idx) => (
                  <div
                    key={card.src}
                    className={`relative transform ${card.rotation} ${card.translate} ${card.zIndex} transition-all duration-300 ${card.flipClass} card-perspective`}
                    style={{
                      animationDelay: card.animationDelay,
                    }}
                  >
                    <div
                      className={`relative overflow-hidden rounded-xl backdrop-blur-sm ${
                        card.featured
                          ? "ring-[3px] ring-[#4fa3d9]/40 shadow-[0_0_30px_rgba(79,163,217,0.2)]"
                          : "ring-1 ring-white/10"
                      }`}
                      style={{
                        width: card.featured ? "280px" : "220px",
                        height: card.featured ? "350px" : "280px",
                        background:
                          "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                      }}
                    >
                      {/* Card Border Glow Effect */}
                      <div
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: card.featured
                            ? "linear-gradient(145deg, rgba(79,163,217,0.2) 0%, rgba(79,163,217,0.05) 100%)"
                            : "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)",
                          filter: "blur(4px)",
                        }}
                      />

                      {/* Image Container */}
                      <div className="relative z-10 w-full h-full rounded-xl overflow-hidden">
                        <div
                          className="absolute inset-0 z-10"
                          style={{
                            background:
                              "linear-gradient(145deg, rgba(255,255,255,0.1) 0%, transparent 100%)",
                            mixBlendMode: "overlay",
                          }}
                        />
                        <img
                          src={card.src}
                          alt={`NFT ${idx + 1}`}
                          className="w-full h-full object-cover opacity-90"
                          style={{
                            filter: "contrast(1.1) brightness(1.05)",
                          }}
                        />
                      </div>

                      {card.featured && (
                        <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/95 via-black/70 to-transparent pt-12 pb-4 px-4">
                          <div className="relative">
                            {/* Decorative line */}
                            <div
                              className="absolute -top-6 left-0 right-0 h-px"
                              style={{
                                background:
                                  "linear-gradient(90deg, transparent 0%, rgba(79,163,217,0.5) 50%, transparent 100%)",
                              }}
                            />
                            <h3 className="text-white font-semibold text-lg mb-1">
                              Danketsu #1078
                            </h3>
                            <p className="text-gray-400 text-xs leading-snug">
                              Danketsu is a lore-based Gamified Multimedia
                              experience bridging multiple blockchains and the
                              worldly storm.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Top highlight */}
                      <div
                        className="absolute top-0 left-0 right-0 h-px"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
                        }}
                      />

                      {/* Side highlights */}
                      <div
                        className="absolute top-0 bottom-0 left-0 w-px"
                        style={{
                          background:
                            "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
                        }}
                      />
                      <div
                        className="absolute top-0 bottom-0 right-0 w-px"
                        style={{
                          background:
                            "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple, fast & secure Section - NEW SECTION */}
      <div className="relative z-10 py-32 px-6 bg-gradient-to-br from-yellow-100 via-amber-100 to-white overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white via-white/50 to-transparent z-[5]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/50 to-transparent z-[5]"></div>
        {/* Smooth transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-purple-50/50 to-transparent opacity-60 z-20"></div>

        {/* Enhanced Partial Grid Pattern Areas with Animation */}
        <div className="absolute inset-0">
          {/* Top Left Grid Area - Diagonal with floating effect */}
          <div
            className="absolute top-0 left-0 w-80 h-80 opacity-25 transform rotate-45 animate-pulse"
            style={{
              backgroundImage: `
                linear-gradient(rgba(147, 51, 234, 0.4) 1px, transparent 1px),
                linear-gradient(90deg, rgba(147, 51, 234, 0.4) 1px, transparent 1px),
                radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 2px, transparent 2px)
              `,
              backgroundSize: "30px 30px, 30px 30px, 60px 60px",
              filter: "drop-shadow(0 0 3px rgba(147, 51, 234, 0.3))",
              animationDelay: "0s",
            }}
          ></div>

          {/* Top Right Grid Area - Diagonal with enhanced colors */}
          <div
            className="absolute top-0 right-0 w-96 h-96 opacity-30 transform -rotate-45 animate-pulse"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px),
                radial-gradient(circle at center, rgba(139, 92, 246, 0.2) 1.5px, transparent 1.5px)
              `,
              backgroundSize: "25px 25px, 25px 25px, 50px 50px",
              filter: "drop-shadow(0 0 4px rgba(59, 130, 246, 0.3))",
              animationDelay: "1s",
            }}
          ></div>

          {/* Bottom Center Grid Area with enhanced animation */}
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-72 h-64 opacity-20 rotate-12 animate-pulse"
            style={{
              backgroundImage: `
                linear-gradient(rgba(99, 102, 241, 0.6) 1px, transparent 1px),
                linear-gradient(90deg, rgba(99, 102, 241, 0.6) 1px, transparent 1px),
                radial-gradient(circle at center, rgba(147, 51, 234, 0.25) 3px, transparent 3px)
              `,
              backgroundSize: "35px 35px, 35px 35px, 70px 70px",
              filter: "drop-shadow(0 0 2px rgba(99, 102, 241, 0.4))",
              animationDelay: "2s",
            }}
          ></div>

          {/* Enhanced Small Grid Pattern Behind Title */}
          <div
            className="absolute top-16 left-1/2 transform -translate-x-1/2 w-96 h-32 opacity-15 rotate-30 animate-pulse"
            style={{
              backgroundImage: `
                radial-gradient(circle, rgba(139, 92, 246, 0.4) 2px, transparent 2px),
                radial-gradient(circle, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px, 40px 40px",
              backgroundPosition: "0 0, 10px 10px",
              filter: "drop-shadow(0 0 1px rgba(139, 92, 246, 0.6))",
              animationDelay: "0.5s",
            }}
          ></div>
        </div>

        {/* Enhanced Floating Particles */}
        <div className="absolute inset-0 opacity-25">
          {/* Sophisticated particle system */}
          <div
            className="absolute top-20 left-20 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="absolute top-32 left-40 w-2 h-2 bg-blue-500 rounded-full animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
          <div
            className="absolute top-44 left-60 w-1 h-1 bg-indigo-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.8s" }}
          ></div>
          <div
            className="absolute top-56 left-80 w-2.5 h-2.5 bg-violet-500 rounded-full animate-pulse"
            style={{ animationDelay: "1.2s" }}
          ></div>
          <div
            className="absolute top-68 left-100 w-1 h-1 bg-purple-600 rounded-full animate-pulse"
            style={{ animationDelay: "1.6s" }}
          ></div>

          <div
            className="absolute top-24 right-24 w-2 h-2 bg-blue-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="absolute top-36 right-44 w-1 h-1 bg-purple-500 rounded-full animate-pulse"
            style={{ animationDelay: "0.6s" }}
          ></div>
          <div
            className="absolute top-48 right-64 w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-60 right-84 w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse"
            style={{ animationDelay: "1.4s" }}
          ></div>
          <div
            className="absolute top-72 right-104 w-2 h-2 bg-blue-600 rounded-full animate-pulse"
            style={{ animationDelay: "1.8s" }}
          ></div>

          <div
            className="absolute bottom-20 left-28 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute bottom-32 left-48 w-2 h-2 bg-blue-500 rounded-full animate-pulse"
            style={{ animationDelay: "0.9s" }}
          ></div>
          <div
            className="absolute bottom-44 left-68 w-1 h-1 bg-indigo-400 rounded-full animate-pulse"
            style={{ animationDelay: "1.3s" }}
          ></div>
          <div
            className="absolute bottom-56 left-88 w-2.5 h-2.5 bg-violet-500 rounded-full animate-pulse"
            style={{ animationDelay: "1.7s" }}
          ></div>

          <div
            className="absolute bottom-24 right-32 w-2 h-2 bg-blue-400 rounded-full animate-pulse"
            style={{ animationDelay: "0.3s" }}
          ></div>
          <div
            className="absolute bottom-36 right-52 w-1 h-1 bg-purple-500 rounded-full animate-pulse"
            style={{ animationDelay: "0.7s" }}
          ></div>
          <div
            className="absolute bottom-48 right-72 w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse"
            style={{ animationDelay: "1.1s" }}
          ></div>
          <div
            className="absolute bottom-60 right-92 w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse"
            style={{ animationDelay: "1.5s" }}
          ></div>

          {/* Central area particles for depth */}
          <div
            className="absolute top-1/4 left-1/3 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/4 w-2 h-2 bg-blue-300 rounded-full animate-pulse"
            style={{ animationDelay: "2.4s" }}
          ></div>
          <div
            className="absolute top-3/4 left-1/2 w-1 h-1 bg-indigo-300 rounded-full animate-pulse"
            style={{ animationDelay: "2.8s" }}
          ></div>
          <div
            className="absolute top-1/3 right-1/3 w-2.5 h-2.5 bg-violet-300 rounded-full animate-pulse"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="absolute top-2/3 right-1/4 w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"
            style={{ animationDelay: "0.9s" }}
          ></div>
          <div
            className="absolute top-1/2 right-1/2 w-2 h-2 bg-blue-500 rounded-full animate-pulse"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>

        {/* Enhanced Geometric Shapes */}
        <div className="absolute inset-0 opacity-12">
          <div
            className="absolute top-32 left-1/5 w-12 h-12 border-2 border-purple-400 transform rotate-45 animate-pulse"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="absolute top-48 right-1/5 w-8 h-8 border-2 border-blue-500 rounded-full animate-pulse"
            style={{ animationDelay: "0.8s" }}
          ></div>
          <div
            className="absolute bottom-32 left-1/4 w-16 h-4 border-2 border-indigo-400 animate-pulse"
            style={{ animationDelay: "1.6s" }}
          ></div>
          <div
            className="absolute bottom-48 right-1/4 w-10 h-10 border-2 border-violet-500 transform rotate-12 animate-pulse"
            style={{ animationDelay: "2.4s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/6 w-6 h-14 border-2 border-purple-300 animate-pulse"
            style={{ animationDelay: "3.2s" }}
          ></div>
          <div
            className="absolute top-2/3 right-1/6 w-14 h-6 border-2 border-blue-400 transform rotate-30 animate-pulse"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>

        {/* Layered gradient effects for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-transparent to-blue-100/25"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-indigo-50/20 to-violet-50/15"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-violet-50/25 via-transparent to-purple-50/25"></div>

        {/* Subtle mesh overlay for texture */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.3) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>

        <div className="max-w-5xl mx-auto text-center relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
            <div>
              {/* Main Title */}
              <h2 className="cursive-gradient text-3xl sm:text-4xl lg:text-4xl xl:text-5xl mb-6">
                <span className="block">Bring AI to Solana</span>
                <span className="block">for 1M+ users</span>
              </h2>

              {/* Subtitle */}
              <p className="text-xl text-gray-600 mb-12 font-normal">
                Build, scale, and adopt AI with Tars today.
              </p>

              {/* CTA Button */}
              <button className="bg-gray-900 hover:bg-black text-white px-10 py-4 rounded-xl font-medium text-lg transition-all duration-300 inline-flex items-center gap-3 shadow-lg">
                Adopt now
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>

            <div className="flex justify-center">
              <Image
                src="/il1.png"
                alt="AI on Solana Illustration"
                width={300}
                height={220}
                className="object-contain max-w-[80%]"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────── On-Chain Activations ─────────────────────────────── */}
      <section className="relative from-white via-amber-200 to-yellow-200 text-gray-900 py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Left – Card Showcase */}
          <div className="relative flex justify-center">
            {/* Decorative icon above cards */}
            <Image
              src="/lk.svg"
              alt="Decoration"
              width={300}
              height={300}
              className="absolute -top-25 left-1/2 -translate-x-1/2"
              priority
            />

            {/* Square canvas with faint grid lines */}
            <div
              className="relative w-[420px] h-[420px] rounded-md overflow-hidden border border-gray-200 bg-[#fafafa] corner-frame"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, rgba(0,0,0,0.04) 0 1px, transparent 1px 80px)",
              }}
            >
              {/* Decorative corner accents */}
              <span className="corner corner-tl"></span>
              <span className="corner corner-tr"></span>
              <span className="corner corner-bl"></span>
              <span className="corner corner-br"></span>
              {/* Card 1 – Aptos (rear) */}
              <div
                className="absolute w-[260px] rounded-lg bg-white border border-gray-200/40 hover:border-gray-300/60 transition-colors text-sm p-6 shadow-lg"
                style={{
                  bottom: "30px",
                  left: "15px",
                  transform: "scale(0.94)",
                  zIndex: 10,
                }}
              >
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                  <img src="/co.png" alt="Aptos" className="w-4 h-4" />
                  <span className="text-xs text-gray-700">Aptos</span>
                </div>
                {/* Body */}
                <h3 className="text-base font-medium mb-6 leading-tight">
                  Use APT to mint
                </h3>
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-6 text-[10px]">
                  <span className="px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded">
                    defi
                  </span>
                  <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                    Ready to start
                  </span>
                </div>
                {/* Footer */}
                <button className="mt-auto w-full flex items-center justify-between px-4 py-3 bg-gray-100 text-gray-800 rounded-md text-xs hover:bg-gray-200 transition-colors">
                  Start Quest
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Card 2 – Near (middle) */}
              <div
                className="absolute w-[260px] rounded-lg bg-white border border-gray-200/40 hover:border-gray-300/60 transition-colors text-sm p-6 shadow-xl"
                style={{
                  bottom: "95px",
                  left: "85px",
                  transform: "scale(0.97)",
                  zIndex: 20,
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <img src="/co.png" alt="Near" className="w-4 h-4" />
                  <span className="text-xs text-gray-700">Near</span>
                </div>
                <h3 className="text-base font-medium mb-6 leading-tight">
                  Stake $BRRR Rewards
                </h3>
                <div className="flex flex-wrap gap-1 mb-6 text-[10px]">
                  <span className="px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded">
                    liquid staking
                  </span>
                  <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                    Ready to start
                  </span>
                </div>
                <button className="mt-auto w-full flex items-center justify-between px-4 py-3 bg-gray-100 text-gray-800 rounded-md text-xs hover:bg-gray-200 transition-colors">
                  Start Quest
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Card 3 – Avalanche (front) */}
              <div
                className="absolute w-[260px] rounded-lg bg-white border border-gray-200/40 hover:border-gray-300/60 transition-colors text-sm p-6 shadow-2xl"
                style={{ top: "60px", left: "150px", zIndex: 30 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <img src="/co.png" alt="Avalanche" className="w-4 h-4" />
                    <span className="text-xs text-gray-700">Avalanche</span>
                  </div>
                  <span className="text-[10px] bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded">
                    Up to 0.2 AVAX
                  </span>
                </div>
                <h3 className="text-base font-medium mb-4 leading-tight">
                  Liquid Staking with GoGo Pool
                </h3>
                <div className="flex flex-wrap gap-1 mb-6 text-[10px]">
                  <span className="px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded">
                    liquid staking
                  </span>
                  <span className="px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded">
                    defi
                  </span>
                  <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                    Ready to start
                  </span>
                </div>
                <button className="mt-auto w-full flex items-center justify-between px-4 py-3 bg-gray-100 text-gray-800 rounded-md text-xs hover:bg-gray-200 transition-colors">
                  Start Quest
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right – Textual Content */}
          <div>
            <div className="flex items-center gap-2 mb-5 text-xs font-semibold tracking-[.15em] uppercase text-gray-500">
              <span className="inline-block w-2 h-2 bg-gray-200 rounded-sm"></span>
              Onchain Activations
            </div>
            <p className="italic font-serif text-lg md:text-xl lg:text-2xl leading-snug mb-8 text-gray-800 max-w-xl">
              Activate top wallet segments through reward-optimized
              journeys—staking, swapping, and lending flows tailored to behavior
              and timing.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-800 hover:text-gray-500 transition-colors"
            >
              View Flipside Journeys
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative from-amber-200 via-amber-700 to-amber-100">
        {/* Remove gradient background and pattern */}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            {/* Logo and Description */}
            <div className="md:w-1/3 space-y-4">
              <p className="text-gray-600 text-xs leading-relaxed">
                Empowering the future of blockchain analytics with cutting-edge
                tools and insights.
              </p>
              {/* Newsletter Signup */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-gray-900 text-sm font-medium mb-2">
                  Stay Updated
                </h3>
                <p className="text-gray-600 text-xs mb-3">
                  Get the latest insights delivered to your inbox.
                </p>
                <form className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-white border border-gray-200 rounded px-3 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="bg-black hover:bg-black text-white rounded px-3 py-1.5 text-xs transition-colors duration-200">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 md:w-2/3">
              {/* Products Column */}
              <div className="space-y-3">
                <h3 className="text-black text-xs font-bold uppercase tracking-wider">
                  Products
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/claude-mcp"
                      className="text-gray-600 hover:text-black text-xs transition-colors duration-200"
                    >
                      Flipside Claude MCP
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Learn Column */}
              <div className="space-y-3">
                <h3 className="text-black text-xs font-bold uppercase tracking-wider">
                  Learn
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/idg-playbook"
                      className="text-gray-600 hover:black-emerald-600 text-xs transition-colors duration-200"
                    >
                      IDG Playbook
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/case-studies"
                      className="text-gray-600 hover:black-emerald-600 text-xs transition-colors duration-200"
                    >
                      Case Studies
                    </Link>
                  </li>
                </ul>
              </div>

              {/* About Column */}
              <div className="space-y-3">
                <h3 className="text-black text-xs font-bold uppercase tracking-wider">
                  About
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/company"
                      className="text-gray-600 hover:black text-xs transition-colors duration-200"
                    >
                      Company
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/resources"
                      className="text-gray-600 hover:text-black text-xs transition-colors duration-200"
                    >
                      Resources
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/documentation"
                      className="text-gray-600 hover:text-black text-xs transition-colors duration-200"
                    >
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/careers"
                      className="text-gray-600 hover:text-black text-xs transition-colors duration-200"
                    >
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Earn Column */}
              <div className="space-y-3">
                <h3 className="text-black text-xs font-bold uppercase tracking-wider">
                  Earn
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/journeys"
                      className="text-gray-600 hover:text-black text-xs transition-colors duration-200"
                    >
                      Journeys
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center space-x-2">
                <Link
                  href="https://twitter.com/flipsidecrypto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="w-5 h-5 text-gray-400 hover:text-black transition-colors duration-200"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link
                  href="https://discord.gg/flipside"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <span className="sr-only">Discord</span>
                  <svg
                    className="w-5 h-5 text-gray-400 hover:text-indigo-500 transition-colors duration-200"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </Link>
                <Link
                  href="https://www.linkedin.com/company/flipsidecrypto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="w-5 h-5 text-gray-400 hover:text-black transition-colors duration-200"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
