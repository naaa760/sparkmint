"use client";

import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function LandingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [bubbles, setBubbles] = useState([]);
  const [waterBubbles, setWaterBubbles] = useState([]);

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
      `}</style>

      {/* Splash Screen */}
      {showSplash && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center splash-screen">
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

          {/* Coin Image */}
          <div className="coin-flip-animation">
            <Image
              src="/bbiit.png"
              alt="Coin"
              width={256}
              height={256}
              className="w-64 lg:w-80 h-auto object-contain drop-shadow-2xl"
            />
          </div>
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

        {/* Enhanced Sticky Navbar */}
        <nav
          className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-500 ${
            scrolled
              ? "bg-white/95 backdrop-blur-xl border-b border-amber-200/50 shadow-lg shadow-amber-100/20"
              : "bg-transparent"
          }`}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Enhanced Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 via-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-xl shadow-amber-200/50 transform hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-gray-800 text-2xl font-bold tracking-wide bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text">
                sparkmint
              </span>
            </div>

            {/* Enhanced Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-700 hover:text-amber-600 transition-all duration-300 font-medium relative group"
              >
                Token Creator
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a
                href="#about"
                className="text-gray-700 hover:text-amber-600 transition-all duration-300 font-medium relative group"
              >
                Wallet Integration
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>

            {/* Enhanced Auth Button */}
            <div className="flex items-center">
              <SignUpButton mode="modal">
                <button className="bg-gradient-to-r from-amber-500 via-yellow-500 to-yellow-600 hover:from-amber-600 hover:via-yellow-600 hover:to-yellow-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl shadow-amber-200/30 hover:shadow-2xl hover:shadow-amber-300/40">
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
                  <h1
                    className="text-5xl lg:text-7xl leading-tight mb-10 max-w-6xl mx-auto"
                    style={{
                      fontFamily: 'Georgia, "Times New Roman", Times, serif',
                    }}
                  >
                    <span
                      className="block mb-2"
                      style={{
                        fontWeight: "800",
                        letterSpacing: "-0.01em",
                        color: "#1a1a1a",
                        textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                        filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))",
                      }}
                    >
                      <span style={{ fontStyle: "italic", fontWeight: "300" }}>
                        New
                      </span>{" "}
                      <span style={{ fontWeight: "800" }}>gen</span>{" "}
                      <span style={{ fontStyle: "italic", fontWeight: "300" }}>
                        of
                      </span>
                    </span>
                    <span
                      className="block"
                      style={{
                        fontWeight: "800",
                        letterSpacing: "-0.01em",
                        color: "#2d1810",
                        textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                        filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))",
                      }}
                    >
                      <span style={{ fontStyle: "italic", fontWeight: "300" }}>
                        digital
                      </span>{" "}
                      <span style={{ fontWeight: "800" }}>currency</span>
                    </span>
                    <span
                      className="block text-3xl lg:text-5xl mt-4"
                      style={{
                        fontWeight: "800",
                        letterSpacing: "-0.01em",
                        color: "#4a2c1a",
                        textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                        filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))",
                      }}
                    >
                      <span style={{ fontWeight: "800" }}>creation</span>{" "}
                      <span style={{ fontStyle: "italic", fontWeight: "300" }}>
                        platform
                      </span>
                    </span>
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
                    <button className="bg-gradient-to-r from-amber-500 via-yellow-500 to-yellow-600 hover:from-amber-600 hover:via-yellow-600 hover:to-yellow-700 text-white px-4 py-2 md:px-8 md:py-4 lg:px-10 lg:py-5 rounded-xl md:rounded-2xl font-medium md:font-semibold text-sm md:text-base lg:text-lg transition-all duration-300 transform hover:scale-105 shadow-xl md:shadow-2xl shadow-amber-200/40 hover:shadow-2xl md:hover:shadow-3xl hover:shadow-amber-300/50 max-w-xs sm:max-w-none">
                      Start Creating Tokens
                    </button>
                  </SignUpButton>
                  <SignInButton mode="modal">
                    <button className="border-2 border-amber-300 text-gray-700 px-4 py-2 md:px-8 md:py-4 lg:px-10 lg:py-5 rounded-xl md:rounded-2xl font-medium md:font-semibold text-sm md:text-base lg:text-lg hover:border-amber-500 hover:bg-amber-50 transition-all duration-300 backdrop-blur-lg shadow-md md:shadow-lg hover:shadow-lg md:hover:shadow-xl transform hover:scale-105 max-w-xs sm:max-w-none">
                      Sign In
                    </button>
                  </SignInButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div id="features" className="relative z-10 py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-light text-gray-800 mb-6 tracking-wide drop-shadow-sm">
                Powerful Features for Token Creation
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light tracking-wide">
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
          </div>
        </div>
      </div>

      {/* Unlock Crypto Rails Section - Outside main container */}
      <div
        className="relative z-10 py-32 px-6 rounded-3xl mx-6 lg:mx-12"
        style={{
          background:
            "linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 15%, #2d1b1f 35%, #3d2b2f 55%, #4a2c2a 75%, #5d3a2f 90%, #6b4423 100%)",
        }}
      >
        {/* Smooth transition from previous section */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-gray-900/40 via-gray-800/30 to-transparent z-20 rounded-t-3xl"></div>

        {/* Smooth transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent via-amber-100/10 to-white/20 z-20 rounded-b-3xl"></div>

        {/* Star/sparkle decorations */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Corner decorative star elements - Now visible on all screen sizes */}

          {/* Top Left Corner Star Pattern */}
          <div className="absolute top-3 left-3 md:top-6 md:left-6 opacity-60 md:opacity-80">
            <div className="relative w-6 h-6 md:w-8 md:h-8">
              {/* Main star shape */}
              <div
                className="absolute inset-0 bg-white"
                style={{
                  clipPath:
                    "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                  filter:
                    "drop-shadow(0 0 4px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 6px rgba(255, 255, 255, 0.6))",
                }}
              ></div>
              {/* Sparkle rays */}
              <div className="absolute -top-1.5 md:-top-2 left-1/2 w-0.5 h-3 md:h-4 bg-white transform -translate-x-1/2 opacity-50 md:opacity-70"></div>
              <div className="absolute -bottom-1.5 md:-bottom-2 left-1/2 w-0.5 h-3 md:h-4 bg-white transform -translate-x-1/2 opacity-50 md:opacity-70"></div>
              <div className="absolute -left-1.5 md:-left-2 top-1/2 w-3 md:w-4 h-0.5 bg-white transform -translate-y-1/2 opacity-50 md:opacity-70"></div>
              <div className="absolute -right-1.5 md:-right-2 top-1/2 w-3 md:w-4 h-0.5 bg-white transform -translate-y-1/2 opacity-50 md:opacity-70"></div>
            </div>
          </div>

          {/* Top Right Corner Star Pattern */}
          <div className="absolute top-3 right-3 md:top-6 md:right-6 opacity-60 md:opacity-80">
            <div className="relative w-6 h-6 md:w-8 md:h-8">
              {/* Main star shape */}
              <div
                className="absolute inset-0 bg-white"
                style={{
                  clipPath:
                    "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                  filter:
                    "drop-shadow(0 0 4px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 6px rgba(255, 255, 255, 0.6))",
                }}
              ></div>
              {/* Sparkle rays */}
              <div className="absolute -top-1.5 md:-top-2 left-1/2 w-0.5 h-3 md:h-4 bg-white transform -translate-x-1/2 opacity-50 md:opacity-70"></div>
              <div className="absolute -bottom-1.5 md:-bottom-2 left-1/2 w-0.5 h-3 md:h-4 bg-white transform -translate-x-1/2 opacity-50 md:opacity-70"></div>
              <div className="absolute -left-1.5 md:-left-2 top-1/2 w-3 md:w-4 h-0.5 bg-white transform -translate-y-1/2 opacity-50 md:opacity-70"></div>
              <div className="absolute -right-1.5 md:-right-2 top-1/2 w-3 md:w-4 h-0.5 bg-white transform -translate-y-1/2 opacity-50 md:opacity-70"></div>
            </div>
          </div>

          {/* Bottom Left Corner Star Pattern */}
          <div className="absolute bottom-3 left-3 md:bottom-6 md:left-6 opacity-60 md:opacity-80">
            <div className="relative w-6 h-6 md:w-8 md:h-8">
              {/* Main star shape */}
              <div
                className="absolute inset-0 bg-white"
                style={{
                  clipPath:
                    "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                  filter:
                    "drop-shadow(0 0 4px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 6px rgba(255, 255, 255, 0.6))",
                }}
              ></div>
              {/* Sparkle rays */}
              <div className="absolute -top-1.5 md:-top-2 left-1/2 w-0.5 h-3 md:h-4 bg-white transform -translate-x-1/2 opacity-50 md:opacity-70"></div>
              <div className="absolute -bottom-1.5 md:-bottom-2 left-1/2 w-0.5 h-3 md:h-4 bg-white transform -translate-x-1/2 opacity-50 md:opacity-70"></div>
              <div className="absolute -left-1.5 md:-left-2 top-1/2 w-3 md:w-4 h-0.5 bg-white transform -translate-y-1/2 opacity-50 md:opacity-70"></div>
              <div className="absolute -right-1.5 md:-right-2 top-1/2 w-3 md:w-4 h-0.5 bg-white transform -translate-y-1/2 opacity-50 md:opacity-70"></div>
            </div>
          </div>

          {/* Bottom Right Corner Star Pattern */}
          <div className="absolute bottom-3 right-3 md:bottom-6 md:right-6 opacity-60 md:opacity-80">
            <div className="relative w-6 h-6 md:w-8 md:h-8">
              {/* Main star shape */}
              <div
                className="absolute inset-0 bg-white"
                style={{
                  clipPath:
                    "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                  filter:
                    "drop-shadow(0 0 4px rgba(255, 255, 255, 0.4)) drop-shadow(0 0 6px rgba(255, 255, 255, 0.6))",
                }}
              ></div>
              {/* Sparkle rays */}
              <div className="absolute -top-1.5 md:-top-2 left-1/2 w-0.5 h-3 md:h-4 bg-white transform -translate-x-1/2 opacity-50 md:opacity-70"></div>
              <div className="absolute -bottom-1.5 md:-bottom-2 left-1/2 w-0.5 h-3 md:h-4 bg-white transform -translate-x-1/2 opacity-50 md:opacity-70"></div>
              <div className="absolute -left-1.5 md:-left-2 top-1/2 w-3 md:w-4 h-0.5 bg-white transform -translate-y-1/2 opacity-50 md:opacity-70"></div>
              <div className="absolute -right-1.5 md:-right-2 top-1/2 w-3 md:w-4 h-0.5 bg-white transform -translate-y-1/2 opacity-50 md:opacity-70"></div>
            </div>
          </div>

          {/* Small additional sparkles between corners - Now responsive */}
          <div
            className="absolute top-8 left-8 md:top-16 md:left-16 w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full opacity-40 md:opacity-60"
            style={{
              boxShadow:
                "0 0 3px rgba(255, 255, 255, 0.2), 0 0 4px rgba(255, 255, 255, 0.3)",
            }}
          ></div>
          <div
            className="absolute top-8 right-8 md:top-16 md:right-16 w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full opacity-40 md:opacity-60"
            style={{
              boxShadow:
                "0 0 3px rgba(255, 255, 255, 0.2), 0 0 4px rgba(255, 255, 255, 0.3)",
            }}
          ></div>
          <div
            className="absolute bottom-8 left-8 md:bottom-16 md:left-16 w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full opacity-40 md:opacity-60"
            style={{
              boxShadow:
                "0 0 3px rgba(255, 255, 255, 0.2), 0 0 4px rgba(255, 255, 255, 0.3)",
            }}
          ></div>
          <div
            className="absolute bottom-8 right-8 md:bottom-16 md:right-16 w-1 h-1 md:w-1.5 md:h-1.5 bg-white rounded-full opacity-40 md:opacity-60"
            style={{
              boxShadow:
                "0 0 3px rgba(255, 255, 255, 0.2), 0 0 4px rgba(255, 255, 255, 0.3)",
            }}
          ></div>

          {/* A few scattered dots for subtle background texture - Mobile responsive */}
          <div className="absolute top-1/4 left-6 md:top-1/3 md:left-12 w-0.5 h-0.5 md:w-1 md:h-1 bg-white rounded-full opacity-30 md:opacity-40"></div>
          <div className="absolute top-1/4 right-6 md:top-1/3 md:right-12 w-0.5 h-0.5 md:w-1 md:h-1 bg-white rounded-full opacity-30 md:opacity-40"></div>
          <div className="absolute bottom-1/4 left-6 md:bottom-1/3 md:left-12 w-0.5 h-0.5 md:w-1 md:h-1 bg-white rounded-full opacity-30 md:opacity-40"></div>
          <div className="absolute bottom-1/4 right-6 md:bottom-1/3 md:right-12 w-0.5 h-0.5 md:w-1 md:h-1 bg-white rounded-full opacity-30 md:opacity-40"></div>
        </div>

        {/* Side decorative images for the entire section */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 hidden lg:block opacity-70">
          <Image
            src="/ssi.png"
            alt="Decorative element"
            width={144}
            height={384}
            className="w-36 h-96 object-cover rounded-lg"
            style={{
              filter: "brightness(1.3) contrast(1.1)",
            }}
          />
        </div>

        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 hidden lg:block opacity-70">
          <Image
            src="/ssi.png"
            alt="Decorative element"
            width={144}
            height={384}
            className="w-36 h-96 object-cover rounded-lg"
            style={{
              filter: "brightness(1.3) contrast(1.1)",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-light text-white mb-6 tracking-wide">
              Unlock crypto rails.
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto font-light tracking-wide leading-relaxed">
              Whether you&apos;re building in-app wallets or launching your own
              fleet, we help you meet users where they are.
            </p>
            <div className="mt-8">
              <button className="bg-transparent border border-gray-600 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 flex items-center gap-2 mx-auto">
                Get setup in 9 minutes
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M6 12L10 8L6 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Images Section with content overlaid - Responsive */}
          <div className="flex flex-col md:flex-row justify-center items-center md:items-end space-y-6 md:space-y-0 md:space-x-8 lg:space-x-12">
            {/* Secure by design */}
            <div className="relative w-64 h-48 sm:w-72 sm:h-52 md:w-48 md:h-48 lg:w-64 lg:h-64 transform hover:scale-105 transition-transform duration-300">
              <Image
                src="/11.png"
                alt="Secure by design"
                width={256}
                height={256}
                className="w-full h-full object-cover opacity-95 hover:opacity-100 transition-opacity duration-300 rounded-lg"
                style={{ backgroundColor: "transparent" }}
              />
              {/* Overlaid content - minimal opacity to show image clearly */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-lg flex flex-col justify-end p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 drop-shadow-xl">
                  Secure by design
                </h3>
                <p className="text-gray-100 text-xs sm:text-sm leading-relaxed drop-shadow-lg">
                  Privy combines key sharding and TEEs to secure every wallet.
                </p>
              </div>
            </div>

            {/* Whitelabel and modular - Taller on desktop, normal on mobile */}
            <div className="relative w-64 h-48 sm:w-72 sm:h-52 md:w-48 md:h-64 lg:w-64 lg:h-80 transform hover:scale-105 transition-transform duration-300">
              <Image
                src="/12.png"
                alt="Whitelabel and modular"
                width={256}
                height={320}
                className="w-full h-full object-cover opacity-95 hover:opacity-100 transition-opacity duration-300 rounded-lg"
              />
              {/* Overlaid content - minimal opacity to show image clearly */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-lg flex flex-col justify-end p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 drop-shadow-xl">
                  Whitelabel and modular
                </h3>
                <p className="text-gray-100 text-xs sm:text-sm leading-relaxed drop-shadow-lg">
                  From APIs to modular components, Privy lets you build your
                  way.
                </p>
              </div>
            </div>

            {/* Scales as you grow */}
            <div className="relative w-64 h-48 sm:w-72 sm:h-52 md:w-48 md:h-48 lg:w-64 lg:h-64 transform hover:scale-105 transition-transform duration-300">
              <Image
                src="/13.png"
                alt="Scales as you grow"
                width={256}
                height={256}
                className="w-full h-full object-cover opacity-95 hover:opacity-100 transition-opacity duration-300 rounded-lg"
              />
              {/* Overlaid content - minimal opacity to show image clearly */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-lg flex flex-col justify-end p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 drop-shadow-xl">
                  Scales as you grow
                </h3>
                <p className="text-gray-100 text-xs sm:text-sm leading-relaxed drop-shadow-lg">
                  The complete embedded wallet stack that grows with your
                  product.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Coverage List Section */}
      <div className="relative z-10 py-20 px-6 bg-white">
        {/* Smooth transition from previous section */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-amber-100/20 via-white/60 to-transparent z-20"></div>

        {/* Smooth transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-gray-50/30 to-gray-100/20 z-20"></div>

        <div className="max-w-7xl mx-auto">
          <div className="text-left mb-16">
            <h2 className="text-2xl lg:text-2xl font-bold text-gray-900 mb-4">
              Full coverage list
            </h2>
            <p className="text-xl text-gray-600 font-light">
              Available on all EVM Chains
            </p>
          </div>

          {/* Blockchain Logos Row */}
          <div className="relative overflow-hidden py-4">
            <div className="flex items-center animate-scroll-infinite min-w-max">
              {/* First set */}
              <div className="flex items-center px-3 md:px-6 lg:px-8">
                <Image
                  src="/l1.png"
                  alt="Blockchain 1"
                  width={40}
                  height={40}
                  className="h-6 md:h-8 lg:h-10 w-auto opacity-90 hover:opacity-100 transition-opacity duration-300 object-contain"
                />
              </div>

              <div className="flex items-center px-3 md:px-6 lg:px-8">
                <Image
                  src="/l2.png"
                  alt="Blockchain 2"
                  width={40}
                  height={40}
                  className="h-6 md:h-8 lg:h-10 w-auto opacity-90 hover:opacity-100 transition-opacity duration-300 object-contain"
                />
              </div>

              <div className="flex items-center px-3 md:px-6 lg:px-8">
                <Image
                  src="/l3.png"
                  alt="Blockchain 3"
                  width={40}
                  height={40}
                  className="h-6 md:h-8 lg:h-10 w-auto opacity-90 hover:opacity-100 transition-opacity duration-300 object-contain"
                />
              </div>

              <div className="flex items-center px-3 md:px-6 lg:px-8">
                <Image
                  src="/l4.png"
                  alt="Blockchain 4"
                  width={40}
                  height={40}
                  className="h-6 md:h-8 lg:h-10 w-auto opacity-90 hover:opacity-100 transition-opacity duration-300 object-contain"
                />
              </div>

              <div className="flex items-center px-3 md:px-6 lg:px-8">
                <Image
                  src="/l5.png"
                  alt="Blockchain 5"
                  width={40}
                  height={40}
                  className="h-6 md:h-8 lg:h-10 w-auto opacity-90 hover:opacity-100 transition-opacity duration-300 object-contain"
                />
              </div>

              {/* Duplicate set for seamless loop */}
              <div className="flex items-center px-3 md:px-6 lg:px-8">
                <Image
                  src="/l1.png"
                  alt="Blockchain 1"
                  width={40}
                  height={40}
                  className="h-6 md:h-8 lg:h-10 w-auto opacity-90 hover:opacity-100 transition-opacity duration-300 object-contain"
                />
              </div>

              <div className="flex items-center px-3 md:px-6 lg:px-8">
                <Image
                  src="/l2.png"
                  alt="Blockchain 2"
                  width={40}
                  height={40}
                  className="h-6 md:h-8 lg:h-10 w-auto opacity-90 hover:opacity-100 transition-opacity duration-300 object-contain"
                />
              </div>

              <div className="flex items-center px-3 md:px-6 lg:px-8">
                <Image
                  src="/l3.png"
                  alt="Blockchain 3"
                  width={40}
                  height={40}
                  className="h-6 md:h-8 lg:h-10 w-auto opacity-90 hover:opacity-100 transition-opacity duration-300 object-contain"
                />
              </div>

              <div className="flex items-center px-3 md:px-6 lg:px-8">
                <Image
                  src="/l4.png"
                  alt="Blockchain 4"
                  width={40}
                  height={40}
                  className="h-6 md:h-8 lg:h-10 w-auto opacity-90 hover:opacity-100 transition-opacity duration-300 object-contain"
                />
              </div>

              <div className="flex items-center px-3 md:px-6 lg:px-8">
                <Image
                  src="/l5.png"
                  alt="Blockchain 5"
                  width={40}
                  height={40}
                  className="h-6 md:h-8 lg:h-10 w-auto opacity-90 hover:opacity-100 transition-opacity duration-300 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI for investors Section */}
      <div className="relative z-10 py-20 px-6 bg-white overflow-hidden">
        {/* Smooth transition from previous section */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-100/20 via-white/40 to-transparent z-20"></div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20 md:opacity-30">
          {/* Curved Wave Pattern */}
          <div
            className="absolute inset-0 pattern-flow"
            style={{
              backgroundImage: [
                "radial-gradient(circle at 25% 25%, rgba(192, 192, 192, 0.4) 1px, transparent 1px)",
                "radial-gradient(circle at 75% 75%, rgba(192, 192, 192, 0.3) 1px, transparent 1px)",
                "radial-gradient(circle at 50% 50%, rgba(192, 192, 192, 0.2) 0.5px, transparent 0.5px)",
              ].join(", "),
              backgroundSize: "40px 40px, 60px 60px, 20px 20px",
            }}
          ></div>

          {/* Organic Flowing Lines - Hidden on mobile */}
          <div
            className="absolute inset-0 pattern-rotate hidden md:block"
            style={{
              backgroundImage: [
                "conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(192, 192, 192, 0.3) 45deg, transparent 90deg, rgba(192, 192, 192, 0.2) 135deg, transparent 180deg, rgba(192, 192, 192, 0.3) 225deg, transparent 270deg, rgba(192, 192, 192, 0.2) 315deg, transparent 360deg)",
              ],
              backgroundSize: "150px 150px",
            }}
          ></div>

          {/* Scattered Sparkle Dots */}
          <div
            className="absolute inset-0 pattern-float"
            style={{
              backgroundImage: [
                "radial-gradient(ellipse at 20% 80%, rgba(192, 192, 192, 0.4) 0.5px, transparent 1px)",
                "radial-gradient(ellipse at 80% 20%, rgba(192, 192, 192, 0.3) 1px, transparent 2px)",
                "radial-gradient(ellipse at 40% 40%, rgba(192, 192, 192, 0.3) 0.5px, transparent 1px)",
                "radial-gradient(ellipse at 60% 80%, rgba(192, 192, 192, 0.3) 0.5px, transparent 1px)",
                "radial-gradient(ellipse at 90% 60%, rgba(192, 192, 192, 0.2) 1px, transparent 2px)",
              ].join(", "),
              backgroundSize:
                "80px 80px, 100px 100px, 50px 50px, 90px 90px, 60px 60px",
            }}
          ></div>

          {/* Subtle Curved Lines - Responsive */}
          <svg
            className="absolute inset-0 w-full h-full pattern-flow hidden sm:block"
            style={{ opacity: 0.15 }}
          >
            <defs>
              <pattern
                id="curves"
                x="0"
                y="0"
                width="200"
                height="150"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 0 75 Q 50 40 100 75 T 200 75"
                  stroke="rgba(192, 192, 192, 0.4)"
                  strokeWidth="0.8"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 0 100 Q 75 80 150 100 Q 175 110 200 100"
                  stroke="rgba(192, 192, 192, 0.2)"
                  strokeWidth="1"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 0 40 Q 100 60 200 40"
                  stroke="rgba(192, 192, 192, 0.3)"
                  strokeWidth="0.6"
                  fill="none"
                  strokeLinecap="round"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#curves)" />
          </svg>

          {/* Brown Tint Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(160, 82, 45, 0.03) 0%, rgba(139, 69, 19, 0.01) 50%, transparent 100%)",
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Logo and title */}
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">α</span>
                </div>
                <span className="text-lg font-medium text-gray-900">alpha</span>
              </div>

              <div className="space-y-6">
                <h3
                  className="text-2xl lg:text-3xl font-normal text-black leading-tight"
                  style={{
                    fontFamily: 'Georgia, "Times New Roman", Times, serif',
                  }}
                >
                  Investment research and proactive insights
                </h3>
              </div>

              {/* Features list */}
              <div className="space-y-6 pt-8">
                <div className="flex items-start space-x-4">
                  <p className="text-lg text-gray-900 font-medium">
                    Ask any question about any stock.
                  </p>
                </div>

                <div className="flex items-start space-x-4">
                  <p className="text-lg text-gray-900 font-medium">
                    Receive earnings call breakdowns the minute they hang up.
                  </p>
                </div>

                <div className="flex items-start space-x-4">
                  <p className="text-lg text-gray-900 font-medium">
                    Know why a stock is moving—not just that it is.
                  </p>
                </div>
              </div>

              {/* Alpha Disclosures */}
              <div className="pt-8">
                <div className="flex items-center space-x-2 text-blue-600">
                  <div className="w-4 h-4 border border-blue-600 rounded-full flex items-center justify-center"></div>
                </div>
              </div>
            </div>

            {/* Right Content - Video */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                {/* Video Container */}
                <div className="w-80 h-96 rounded-3xl shadow-2xl">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-3xl"
                  >
                    <source src="/crypt.mp4" type="video/mp4" />
                  </video>
                </div>

                {/* Background decoration */}
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 blur-xl"></div>
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full opacity-20 blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple, fast & secure Section - NEW SECTION */}
      <div className="relative z-10 py-32 px-6 bg-gradient-to-br from-purple-50 via-white to-blue-50 overflow-hidden">
        {/* Smooth transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-purple-50/50 to-transparent opacity-60 z-20"></div>

        {/* Partial Grid Pattern Areas */}
        <div className="absolute inset-0">
          {/* Top Left Grid Area - Diagonal */}
          <div
            className="absolute top-0 left-0 w-80 h-80 opacity-30 transform rotate-45"
            style={{
              backgroundImage: `
                linear-gradient(rgba(192, 192, 192, 0.6) 1px, transparent 1px),
                linear-gradient(90deg, rgba(192, 192, 192, 0.6) 1px, transparent 1px)
              `,
              backgroundSize: "30px 30px",
              filter: "drop-shadow(0 0 2px rgba(255, 255, 255, 0.5))",
            }}
          ></div>

          {/* Top Right Grid Area - Diagonal */}
          <div
            className="absolute top-0 right-0 w-96 h-96 opacity-25 transform -rotate-45"
            style={{
              backgroundImage: `
                linear-gradient(rgba(169, 169, 169, 0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(169, 169, 169, 0.5) 1px, transparent 1px)
              `,
              backgroundSize: "25px 25px",
              filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.4))",
            }}
          ></div>

          {/* Bottom Center Grid Area - Diagonal */}
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-72 h-64 opacity-25 rotate-12"
            style={{
              backgroundImage: `
                linear-gradient(rgba(211, 211, 211, 0.6) 1px, transparent 1px),
                linear-gradient(90deg, rgba(211, 211, 211, 0.6) 1px, transparent 1px)
              `,
              backgroundSize: "35px 35px",
              filter: "drop-shadow(0 0 2px rgba(255, 255, 255, 0.6))",
            }}
          ></div>

          {/* Small Grid Pattern Behind Title - Diagonal */}
          <div
            className="absolute top-16 left-1/2 transform -translate-x-1/2 w-96 h-32 opacity-20 rotate-30"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(192, 192, 192, 0.5) 2px, transparent 2px)`,
              backgroundSize: "20px 20px",
              filter: "drop-shadow(0 0 1px rgba(255, 255, 255, 0.8))",
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Title */}
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-semibold text-gray-800 tracking-tight mb-4">
              Simple, fast & secure
            </h2>
          </div>

          {/* Three Cards Layout - Triangular arrangement */}
          <div className="relative">
            {/* Top Row - Two Cards */}
            <div className="grid md:grid-cols-2 gap-16 lg:gap-24 mb-20 lg:mb-32">
              {/* Card 1 - Secured and Decentralized */}
              <div className="text-center group">
                <div className="flex justify-center mb-8">
                  <div className="w-32 h-32 lg:w-40 lg:h-40 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src="/jk.png"
                      alt="Secured and Decentralized"
                      width={160}
                      height={160}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <h3 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-4">
                  Secured and Decentralized
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed max-w-sm mx-auto">
                  Experience full spectrum of blockchain features
                  <br />
                  with our non-custodial wallet.
                </p>
              </div>

              {/* Card 2 - We got you covered */}
              <div className="text-center group">
                <div className="flex justify-center mb-8">
                  <div className="w-32 h-32 lg:w-40 lg:h-40 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src="/jk1.png"
                      alt="We got you covered"
                      width={160}
                      height={160}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <h3 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-4">
                  We got you covered
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed max-w-sm mx-auto">
                  Both Mastercard and Visa cards are supported
                  <br />
                  to give you what you need.
                </p>
              </div>
            </div>

            {/* Bottom Row - One Card Centered */}
            <div className="flex justify-center">
              <div className="text-center group max-w-md">
                <div className="flex justify-center mb-8">
                  <div className="w-32 h-32 lg:w-40 lg:h-40 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src="/jk3.png"
                      alt="Optimize your cashflow"
                      width={160}
                      height={160}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <h3 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-4">
                  Optimize your cashflow
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Use our wallet to pay your bills, split bills, transfer and
                  more. All from one place.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VIP Program Section */}
      <div
        className="relative z-10 pt-32 px-6 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #f5f5dc 0%, #ddbf94 15%, #8b7355 35%, #654321 55%, #2c1810 75%, #1a1a1a 90%, #000000 100%)",
        }}
      >
        {/* Smooth transition from previous section */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-blue-50/30 via-purple-50/20 to-transparent z-20"></div>

        {/* Smooth transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent via-gray-900/20 to-gray-900/40 z-20"></div>

        {/* Beige Spike/Sleek Line Effects */}
        <div className="absolute inset-0">
          {/* Diagonal Spike Lines - Top Left */}
          <div className="absolute top-0 left-0 w-full h-full">
            <svg
              className="absolute top-0 left-0 w-full h-full"
              viewBox="0 0 1200 800"
            >
              {/* Sharp angular lines */}
              <path
                d="M 0 100 L 200 50 L 400 150 L 600 80 L 800 200 L 1000 120 L 1200 180"
                stroke="rgba(245, 245, 220, 0.25)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 0 200 L 300 120 L 500 250 L 700 180 L 900 320 L 1200 280"
                stroke="rgba(139, 69, 19, 0.2)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 0 350 L 250 280 L 450 400 L 650 320 L 850 450 L 1200 420"
                stroke="rgba(160, 82, 45, 0.15)"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Diagonal Spike Lines - Bottom Right */}
          <div className="absolute bottom-0 right-0 w-full h-full">
            <svg
              className="absolute bottom-0 right-0 w-full h-full transform rotate-180"
              viewBox="0 0 1200 800"
            >
              <path
                d="M 0 100 L 200 50 L 400 150 L 600 80 L 800 200 L 1000 120 L 1200 180"
                stroke="rgba(245, 245, 220, 0.18)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 0 200 L 300 120 L 500 250 L 700 180 L 900 320 L 1200 280"
                stroke="rgba(139, 69, 19, 0.12)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Scattered Beige Dots */}
          <div className="absolute inset-0">
            <div
              className="absolute top-20 left-20 w-2 h-2 bg-beige-200 rounded-full"
              style={{ backgroundColor: "rgba(245, 245, 220, 0.3)" }}
            ></div>
            <div
              className="absolute top-40 right-32 w-1 h-1 bg-beige-200 rounded-full"
              style={{ backgroundColor: "rgba(139, 69, 19, 0.25)" }}
            ></div>
            <div
              className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-beige-200 rounded-full"
              style={{ backgroundColor: "rgba(160, 82, 45, 0.28)" }}
            ></div>
            <div
              className="absolute bottom-20 right-20 w-2 h-2 bg-beige-200 rounded-full"
              style={{ backgroundColor: "rgba(245, 245, 220, 0.22)" }}
            ></div>
            <div
              className="absolute top-1/2 left-1/4 w-1 h-1 bg-beige-200 rounded-full"
              style={{ backgroundColor: "rgba(139, 69, 19, 0.2)" }}
            ></div>
            <div
              className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-beige-200 rounded-full"
              style={{ backgroundColor: "rgba(160, 82, 45, 0.24)" }}
            ></div>
          </div>

          {/* Subtle Gradient Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(245, 245, 220, 0.05) 0%, transparent 70%)",
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            {/* VIP Program Label */}
            <div className="mb-8">
              <span className="text-gray-300 text-lg font-medium tracking-wide">
                VIP program
              </span>
            </div>

            {/* Main Title */}
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight max-w-4xl mx-auto">
              When you need more than
              <br />
              just a crypto exchange
            </h2>

            {/* Subtitle */}
            <p className="text-gray-200 text-lg lg:text-xl mb-16 max-w-3xl mx-auto leading-relaxed">
              Access world-class APIs, a lower fee structure and a dedicated
              Account Manager.
            </p>

            {/* Three Features */}
          </div>
        </div>
      </div>

      {/* One-Click Agent Deployment Section */}
      <div className="relative z-10 py-32 px-6 bg-gray-50 overflow-hidden">
        {/* Limited Grid Background Pattern - Top Area Only */}
        <div
          className="absolute top-0 left-0 right-0 h-1/2 opacity-15"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 0, 0, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 0, 0, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: "100px 100px",
          }}
        ></div>

        {/* Secondary Grid Pattern - Bottom Right Corner */}
        <div
          className="absolute bottom-0 right-0 w-1/3 h-1/3 opacity-8"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 0, 0, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 0, 0, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: "200px 200px",
          }}
        ></div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Title */}
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl leading-tight text-black mb-6">
              <span className="font-light">One-Click Agent</span>
              <br />
              <span className="font-bold">Deployment</span>
            </h2>
          </div>

          {/* Three Features Grid */}
          <div className="grid md:grid-cols-3 gap-16 lg:gap-20 max-w-5xl mx-auto">
            {/* Instant Tokenization */}
            <div className="text-left">
              <div className="mb-6">
                <svg
                  className="w-8 h-8 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">
                Instant Tokenization
              </h3>
              <p className="text-gray-700 text-base leading-relaxed">
                Create your first tokenized agent in less than 5 minutes.
              </p>
            </div>

            {/* Fair Stealth Launch */}
            <div className="text-left">
              <div className="mb-6">
                <svg
                  className="w-8 h-8 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">
                Fair Stealth Launch
              </h3>
              <p className="text-gray-700 text-base leading-relaxed">
                Launch your token with a custom randomization algorithm for
                maximum launch protection.
              </p>
            </div>

            {/* Build Now, Tokenize Later */}
            <div className="text-left">
              <div className="mb-6">
                <svg
                  className="w-8 h-8 text-black"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 11l5-5m0 0l5 5m-5-5v12"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">
                Build Now, Tokenize Later
              </h3>
              <p className="text-gray-700 text-base leading-relaxed">
                Build your agent and prime its growth before releasing its
                native token.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bring AI to Solana Section */}
      <div
        className="relative z-10 py-32 px-6 overflow-hidden"
        style={{ backgroundColor: "#faf9ff" }}
      >
        <div className="max-w-5xl mx-auto text-center relative z-20">
          {/* Main Title */}
          <h2 className="text-6xl lg:text-7xl leading-tight text-black mb-6">
            <span className="font-normal">Bring AI to Solana</span>
            <br />
            <span className="font-light text-gray-600">for 1M+ users</span>
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
      </div>

      {/* SEDA Platform Section */}

      {/* Payment Website Recreation Section */}
      <div className="relative z-10 py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Header with Logo and Title */}
          <div className="text-center mb-32">
            {/* Blue Circle Logo */}
            <div className="flex justify-center mb-12">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">C</span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-6xl font-normal text-black leading-tight max-w-4xl mx-auto">
              Simplifying payments for
              <br />
              web3 businesses.
            </h1>
          </div>

          {/* Footer Links Section */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 lg:gap-16 text-sm">
            {/* Features Column */}
            <div>
              <h3 className="font-medium text-black mb-6">Features</h3>
              <ul className="space-y-4 text-gray-600">
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    Payment Links
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    Recurring Billing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            {/* Use-cases Column */}
            <div>
              <h3 className="font-medium text-black mb-6">Use-cases</h3>
              <ul className="space-y-4 text-gray-600">
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    E-Commerce
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    Donation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    Ticketing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    Send money to India
                  </a>
                </li>
              </ul>
            </div>

            {/* Developers Column */}
            <div>
              <h3 className="font-medium text-black mb-6">Developers</h3>
              <ul className="space-y-4 text-gray-600">
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    API Reference
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h3 className="font-medium text-black mb-6">Resources</h3>
              <ul className="space-y-4 text-gray-600">
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    Blogs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    Telegram community
                  </a>
                </li>
              </ul>
            </div>

            {/* About Column */}
            <div>
              <h3 className="font-medium text-black mb-6">About</h3>
              <ul className="space-y-4 text-gray-600">
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    Brand kit
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    Changelog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    Contact us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    Terms and condition
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    Privacy policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-black transition-colors">
                    Submit feedback
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
