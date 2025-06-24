"use client";

import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [bubbles, setBubbles] = useState([]);

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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    }, 4500); // 3s flip + 1.5s fade out

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style jsx>{`
        @keyframes phoneFlip {
          0% {
            transform: rotateY(0deg) scale(1);
          }
          16.66% {
            transform: rotateY(180deg) scale(1.1);
          }
          33.33% {
            transform: rotateY(360deg) scale(1);
          }
          50% {
            transform: rotateY(540deg) scale(1.1);
          }
          66.66% {
            transform: rotateY(720deg) scale(1);
          }
          83.33% {
            transform: rotateY(900deg) scale(1.1);
          }
          100% {
            transform: rotateY(1080deg) scale(1);
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

        .phone-flip-animation {
          animation: phoneFlip 3s ease-in-out;
          transform-style: preserve-3d;
        }

        .splash-screen {
          animation: fadeOut 1.5s ease-out 3s forwards;
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
      `}</style>

      {/* Splash Screen */}
      {showSplash && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center splash-screen">
          <div className="phone-flip-animation">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-64 lg:w-80 h-auto object-contain drop-shadow-2xl rounded-2xl"
            >
              <source src="/pandaaa.mp4" type="video/mp4" />
            </video>
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

          {/* Spiral Pattern Elements */}
          {/* Top Left Flowing Curves */}
          <div
            className="spiral-container"
            style={{ top: "10%", left: "5%", opacity: 0.8 }}
          >
            <svg
              className="spiral-line-svg"
              viewBox="0 0 200 200"
              style={{ filter: "drop-shadow(0 0 3px rgba(139, 69, 19, 0.3))" }}
            >
              <path
                d="M20,20 Q60,40 100,20 Q140,0 180,40 Q220,80 180,120 Q140,160 100,140 Q60,120 20,160"
                fill="none"
                stroke="url(#shining-brown-gradient1)"
                strokeWidth="1.2"
                strokeLinecap="round"
                style={{
                  animation:
                    "spiralLineGrow 8s ease-in-out infinite, metallicShine 3s ease-in-out infinite",
                }}
              />
              <path
                d="M30,180 Q70,160 110,180 Q150,200 190,160"
                fill="none"
                stroke="url(#shining-brown-gradient1)"
                strokeWidth="1"
                strokeLinecap="round"
                style={{
                  animation:
                    "spiralLineGrow 10s ease-in-out infinite, metallicShine 4s ease-in-out infinite",
                  animationDelay: "2s, 1s",
                }}
              />
              <defs>
                <linearGradient
                  id="shining-brown-gradient1"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#3e2723" stopOpacity="0.9" />
                  <stop offset="15%" stopColor="#5d4037" stopOpacity="1" />
                  <stop offset="30%" stopColor="#8d6e63" stopOpacity="1" />
                  <stop offset="45%" stopColor="#f5f5dc" stopOpacity="1" />
                  <stop offset="60%" stopColor="#fff8dc" stopOpacity="1" />
                  <stop offset="75%" stopColor="#d2b48c" stopOpacity="1" />
                  <stop offset="90%" stopColor="#8b4513" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#654321" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Top Right Flowing Curves */}
          <div
            className="spiral-dot-container"
            style={{ top: "15%", right: "8%", opacity: 0.8 }}
          >
            <svg
              width="150"
              height="150"
              viewBox="0 0 150 150"
              style={{
                filter: "drop-shadow(0 0 4px rgba(210, 180, 140, 0.4))",
              }}
            >
              <path
                d="M10,75 Q40,20 75,50 Q110,80 140,30"
                fill="none"
                stroke="url(#shining-brown-gradient2)"
                strokeWidth="1.4"
                strokeLinecap="round"
                style={{
                  animation:
                    "spiralLineGrow 6s ease-in-out infinite, metallicShine 2.5s ease-in-out infinite",
                }}
              />
              <path
                d="M20,120 Q50,90 80,120 Q110,150 140,120"
                fill="none"
                stroke="url(#shining-brown-gradient2)"
                strokeWidth="1.1"
                strokeLinecap="round"
                style={{
                  animation:
                    "spiralLineGrow 8s ease-in-out infinite, metallicShine 3.5s ease-in-out infinite",
                  animationDelay: "1s, 0.5s",
                }}
              />
              <defs>
                <linearGradient
                  id="shining-brown-gradient2"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#ffeaa7" stopOpacity="1" />
                  <stop offset="20%" stopColor="#fdcb6e" stopOpacity="1" />
                  <stop offset="40%" stopColor="#e17055" stopOpacity="1" />
                  <stop offset="60%" stopColor="#8b4513" stopOpacity="1" />
                  <stop offset="80%" stopColor="#5d4037" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#3e2723" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Center Large Flowing Curve */}
          <div
            className="spiral-fibonacci"
            style={{ top: "40%", left: "65%", opacity: 0.7 }}
          >
            <svg
              className="spiral-fibonacci-svg"
              viewBox="0 0 300 300"
              style={{ filter: "drop-shadow(0 0 5px rgba(139, 69, 19, 0.5))" }}
            >
              <path
                d="M50,150 Q100,50 150,100 Q200,150 250,100 Q300,50 350,150 Q300,250 250,200 Q200,150 150,200 Q100,250 50,150"
                fill="none"
                stroke="url(#large-shining-brown-gradient)"
                strokeWidth="1.8"
                strokeLinecap="round"
                style={{
                  animation:
                    "spiralLineGrow 12s ease-in-out infinite, metallicShine 4s ease-in-out infinite",
                }}
              />
              <path
                d="M80,150 Q120,80 150,120 Q180,160 220,130"
                fill="none"
                stroke="url(#large-shining-brown-gradient)"
                strokeWidth="1.2"
                strokeLinecap="round"
                style={{
                  animation:
                    "spiralLineGrow 10s ease-in-out infinite, metallicShine 5s ease-in-out infinite",
                  animationDelay: "3s, 1.5s",
                }}
              />
              <defs>
                <linearGradient
                  id="large-shining-brown-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#2c1810" stopOpacity="0.9" />
                  <stop offset="12%" stopColor="#3e2723" stopOpacity="1" />
                  <stop offset="25%" stopColor="#5d4037" stopOpacity="1" />
                  <stop offset="37%" stopColor="#8d6e63" stopOpacity="1" />
                  <stop offset="50%" stopColor="#f5deb3" stopOpacity="1" />
                  <stop offset="62%" stopColor="#fff8dc" stopOpacity="1" />
                  <stop offset="75%" stopColor="#ddbf94" stopOpacity="1" />
                  <stop offset="87%" stopColor="#a0522d" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#654321" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Bottom Left Flowing Lines */}
          <div
            className="spiral-grid"
            style={{
              bottom: "20%",
              left: "10%",
              width: "200px",
              height: "120px",
              opacity: 0.7,
            }}
          >
            <svg
              width="200"
              height="120"
              viewBox="0 0 200 120"
              style={{ filter: "drop-shadow(0 0 3px rgba(160, 82, 45, 0.4))" }}
            >
              <path
                d="M0,60 Q50,20 100,60 Q150,100 200,60"
                fill="none"
                stroke="url(#bottom-shining-brown-gradient)"
                strokeWidth="1.2"
                strokeLinecap="round"
                style={{
                  animation:
                    "spiralLineGrow 7s ease-in-out infinite, metallicShine 3s ease-in-out infinite",
                }}
              />
              <path
                d="M0,80 Q50,40 100,80 Q150,120 200,80"
                fill="none"
                stroke="url(#bottom-shining-brown-gradient)"
                strokeWidth="1"
                strokeLinecap="round"
                style={{
                  animation:
                    "spiralLineGrow 9s ease-in-out infinite, metallicShine 4s ease-in-out infinite",
                  animationDelay: "1.5s, 0.8s",
                }}
              />
              <path
                d="M0,40 Q50,0 100,40 Q150,80 200,40"
                fill="none"
                stroke="url(#bottom-shining-brown-gradient)"
                strokeWidth="0.8"
                strokeLinecap="round"
                style={{
                  animation:
                    "spiralLineGrow 11s ease-in-out infinite, metallicShine 3.5s ease-in-out infinite",
                  animationDelay: "3s, 1.2s",
                }}
              />
              <defs>
                <linearGradient
                  id="bottom-shining-brown-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#8b4513" stopOpacity="0.8" />
                  <stop offset="20%" stopColor="#a0522d" stopOpacity="0.9" />
                  <stop offset="40%" stopColor="#ddbf94" stopOpacity="1" />
                  <stop offset="60%" stopColor="#f5deb3" stopOpacity="1" />
                  <stop offset="80%" stopColor="#d2b48c" stopOpacity="1" />
                  <stop offset="100%" stopColor="#654321" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Bottom Right Flowing Curves */}
          <div
            className="spiral-wave-line"
            style={{ bottom: "15%", right: "15%", opacity: 0.7 }}
          >
            <svg
              className="spiral-line-svg"
              viewBox="0 0 250 200"
              style={{ filter: "drop-shadow(0 0 4px rgba(139, 69, 19, 0.3))" }}
            >
              <path
                d="M0,100 Q60,40 120,100 Q180,160 250,100"
                fill="none"
                stroke="url(#wave-shining-brown-gradient)"
                strokeWidth="1.4"
                strokeLinecap="round"
                style={{
                  animation:
                    "spiralLineGrow 10s ease-in-out infinite, metallicShine 3.5s ease-in-out infinite",
                }}
              />
              <path
                d="M20,150 Q80,90 140,150 Q200,210 250,150"
                fill="none"
                stroke="url(#wave-shining-brown-gradient)"
                strokeWidth="1.2"
                strokeLinecap="round"
                style={{
                  animation:
                    "spiralLineGrow 8s ease-in-out infinite, metallicShine 4s ease-in-out infinite",
                  animationDelay: "2s, 1s",
                }}
              />
              <path
                d="M10,50 Q70,10 130,50 Q190,90 250,50"
                fill="none"
                stroke="url(#wave-shining-brown-gradient)"
                strokeWidth="1"
                strokeLinecap="round"
                style={{
                  animation:
                    "spiralLineGrow 12s ease-in-out infinite, metallicShine 2.8s ease-in-out infinite",
                  animationDelay: "4s, 0.5s",
                }}
              />
              <defs>
                <linearGradient
                  id="wave-shining-brown-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#fff8dc" stopOpacity="1" />
                  <stop offset="25%" stopColor="#f5deb3" stopOpacity="1" />
                  <stop offset="50%" stopColor="#daa520" stopOpacity="1" />
                  <stop offset="75%" stopColor="#8b4513" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#5d4037" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Additional Small Flowing Elements */}
          <div
            style={{
              top: "60%",
              left: "25%",
              position: "absolute",
              opacity: 0.6,
              width: "120px",
              height: "80px",
            }}
          >
            <svg
              width="120"
              height="80"
              viewBox="0 0 120 80"
              style={{ filter: "drop-shadow(0 0 2px rgba(139, 69, 19, 0.4))" }}
            >
              <path
                d="M0,40 Q30,10 60,40 Q90,70 120,40"
                fill="none"
                stroke="url(#small-shining-brown-gradient)"
                strokeWidth="1"
                strokeLinecap="round"
                style={{
                  animation:
                    "spiralLineGrow 6s ease-in-out infinite, metallicShine 2.5s ease-in-out infinite",
                }}
              />
              <defs>
                <linearGradient
                  id="small-shining-brown-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#d2b48c" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#f5deb3" stopOpacity="1" />
                  <stop offset="100%" stopColor="#8b4513" stopOpacity="0.8" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div
            style={{
              top: "75%",
              right: "40%",
              position: "absolute",
              opacity: 0.65,
              width: "100px",
              height: "60px",
            }}
          >
            <svg
              width="100"
              height="60"
              viewBox="0 0 100 60"
              style={{ filter: "drop-shadow(0 0 2px rgba(160, 82, 45, 0.3))" }}
            >
              <path
                d="M0,30 Q25,5 50,30 Q75,55 100,30"
                fill="none"
                stroke="url(#tiny-shining-brown-gradient)"
                strokeWidth="1.1"
                strokeLinecap="round"
                style={{
                  animation:
                    "spiralLineGrow 8s ease-in-out infinite, metallicShine 3s ease-in-out infinite",
                  animationDelay: "1s, 0.8s",
                }}
              />
              <defs>
                <linearGradient
                  id="tiny-shining-brown-gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#654321" stopOpacity="0.9" />
                  <stop offset="50%" stopColor="#ddbf94" stopOpacity="1" />
                  <stop offset="100%" stopColor="#a0522d" stopOpacity="0.8" />
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
                  <h1 className="text-6xl lg:text-8xl font-extrabold text-gray-900 leading-tight tracking-tight mb-10 max-w-6xl mx-auto">
                    <span
                      className="block font-light text-gray-800 mb-2 tracking-wide"
                      style={{
                        fontFamily: 'Georgia, "Times New Roman", Times, serif',
                        fontStyle: "italic",
                        fontWeight: "300",
                        letterSpacing: "0.02em",
                      }}
                    >
                      New gen of
                    </span>
                    <span
                      className="block font-black bg-gradient-to-r from-gray-900 via-amber-500 to-yellow-600 bg-clip-text text-transparent tracking-tight"
                      style={{
                        fontFamily: 'Georgia, "Times New Roman", Times, serif',
                        fontStyle: "italic",
                        fontWeight: "400",
                        letterSpacing: "0.01em",
                      }}
                    >
                      digital currency
                    </span>
                    <span
                      className="block font-semibold text-4xl lg:text-6xl mt-4 text-gray-700 tracking-wide"
                      style={{
                        fontFamily: 'Georgia, "Times New Roman", Times, serif',
                        fontStyle: "italic",
                        fontWeight: "300",
                        letterSpacing: "0.02em",
                      }}
                    >
                      creation platform
                    </span>
                  </h1>

                  <p className="text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-normal tracking-wide">
                    Experience secure and efficient token creation, minting, and
                    transfers on Solana with our cutting-edge solutions designed
                    for the future.
                  </p>
                </div>

                {/* Enhanced CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-5 pt-6 justify-center">
                  <SignUpButton mode="modal">
                    <button className="bg-gradient-to-r from-amber-500 via-yellow-500 to-yellow-600 hover:from-amber-600 hover:via-yellow-600 hover:to-yellow-700 text-white px-10 py-5 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl shadow-amber-200/40 hover:shadow-3xl hover:shadow-amber-300/50">
                      Start Creating Tokens
                    </button>
                  </SignUpButton>
                  <SignInButton mode="modal">
                    <button className="border-2 border-amber-300 text-gray-700 px-10 py-5 rounded-2xl font-semibold text-lg hover:border-amber-500 hover:bg-amber-50 transition-all duration-300 backdrop-blur-lg shadow-lg hover:shadow-xl transform hover:scale-105">
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
              {[
                {
                  icon: "🚀",
                  title: "Instant Creation",
                  description:
                    "Create custom SPL tokens in seconds with our intuitive interface and advanced automation",
                  gradient: "from-amber-500 to-yellow-500",
                },
                {
                  icon: "⚡",
                  title: "Fast Minting",
                  description:
                    "Mint tokens instantly with ultra-low fees on Solana's high-performance network",
                  gradient: "from-yellow-500 to-emerald-500",
                },
                {
                  icon: "🔐",
                  title: "Secure Transfers",
                  description:
                    "Send tokens securely with military-grade encryption and built-in wallet integration",
                  gradient: "from-emerald-500 to-teal-500",
                },
              ].map((feature, index) => (
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
    </>
  );
}
