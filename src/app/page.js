"use client";

import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      router.push("/dashboard");
    }
  }, [isLoaded, user, router]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

          {/* Diagonal Dot Grid Pattern - Primary - Made more transparent */}
          <div className="diagonal-dot-grid" style={{ opacity: 0.08 }}></div>

          {/* Diagonal Dot Grid Pattern - Secondary - Made more transparent */}
          <div
            className="diagonal-dot-grid-secondary"
            style={{ opacity: 0.05 }}
          ></div>

          {/* Floating Individual Dots - Reduced opacity */}
          <div className="floating-dots" style={{ opacity: 0.6 }}>
            <div
              className="floating-dot"
              style={{ top: "10%", left: "15%", animationDelay: "0s" }}
            ></div>
            <div
              className="floating-dot"
              style={{ top: "25%", left: "80%", animationDelay: "0.5s" }}
            ></div>
            <div
              className="floating-dot"
              style={{ top: "40%", left: "20%", animationDelay: "1s" }}
            ></div>
            <div
              className="floating-dot"
              style={{ top: "60%", left: "75%", animationDelay: "1.5s" }}
            ></div>
            <div
              className="floating-dot"
              style={{ top: "80%", left: "30%", animationDelay: "2s" }}
            ></div>
            <div
              className="floating-dot"
              style={{ top: "15%", left: "50%", animationDelay: "2.5s" }}
            ></div>
            <div
              className="floating-dot"
              style={{ top: "70%", left: "60%", animationDelay: "3s" }}
            ></div>
            <div
              className="floating-dot"
              style={{ top: "35%", left: "90%", animationDelay: "3.5s" }}
            ></div>
          </div>

          {/* Animated Mesh Gradient - Reduced opacity */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-amber-400/20 via-transparent to-yellow-400/20 animate-pulse"></div>
            <div
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-amber-300/15 to-transparent"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>

          {/* Gradient Overlay for Dot Grids - Top Right Corner - Reduced opacity */}
          <div className="absolute top-0 right-0 w-96 h-96 opacity-[0.04] pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-bl from-amber-300/40 to-transparent rounded-full blur-xl"></div>
            <div
              className="diagonal-dot-grid"
              style={{ transform: "rotate(30deg) scale(0.8)" }}
            ></div>
          </div>

          {/* Gradient Overlay for Dot Grids - Bottom Left Corner - Reduced opacity */}
          <div className="absolute bottom-0 left-0 w-80 h-80 opacity-[0.03] pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-300/30 to-transparent rounded-full blur-xl"></div>
            <div
              className="diagonal-dot-grid-secondary"
              style={{ transform: "rotate(-30deg) scale(0.6)" }}
            ></div>
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
                    <span className="block font-light text-gray-800 mb-2 tracking-wide">
                      New gen of
                    </span>
                    <span className="block font-black bg-gradient-to-r from-gray-900 via-amber-500 to-yellow-600 bg-clip-text text-transparent tracking-tight">
                      digital currency
                    </span>
                    <span className="block font-semibold text-4xl lg:text-6xl mt-4 text-gray-700 tracking-wide">
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

        {/* Enhanced Decorative Background Elements */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-amber-100/10 via-yellow-100/10 to-amber-100/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>

          {/* Additional Diagonal Dot Grids with Different Rotations - Reduced opacity */}
          <div className="absolute inset-0 opacity-[0.02]">
            <div
              className="diagonal-dot-grid"
              style={{
                transform: "rotate(15deg) scale(0.8)",
                animationDelay: "1s",
              }}
            ></div>
          </div>

          <div className="absolute inset-0 opacity-[0.02]">
            <div
              className="diagonal-dot-grid-secondary"
              style={{
                transform: "rotate(-60deg) scale(1.1)",
                animationDelay: "2s",
              }}
            ></div>
          </div>

          {/* Enhanced Floating Dots with Different Sizes - Reduced opacity */}
          <div className="floating-dots" style={{ opacity: 0.4 }}>
            <div
              className="floating-dot"
              style={{
                top: "12%",
                left: "25%",
                animationDelay: "0.2s",
                width: "4px",
                height: "4px",
              }}
            ></div>
            <div
              className="floating-dot"
              style={{
                top: "30%",
                left: "70%",
                animationDelay: "0.8s",
                width: "8px",
                height: "8px",
              }}
            ></div>
            <div
              className="floating-dot"
              style={{
                top: "50%",
                left: "10%",
                animationDelay: "1.2s",
                width: "3px",
                height: "3px",
              }}
            ></div>
            <div
              className="floating-dot"
              style={{
                top: "65%",
                left: "85%",
                animationDelay: "1.8s",
                width: "5px",
                height: "5px",
              }}
            ></div>
            <div
              className="floating-dot"
              style={{
                top: "85%",
                left: "40%",
                animationDelay: "2.2s",
                width: "7px",
                height: "7px",
              }}
            ></div>
            <div
              className="floating-dot"
              style={{
                top: "20%",
                left: "60%",
                animationDelay: "2.8s",
                width: "4px",
                height: "4px",
              }}
            ></div>
            <div
              className="floating-dot"
              style={{
                top: "75%",
                left: "15%",
                animationDelay: "3.2s",
                width: "6px",
                height: "6px",
              }}
            ></div>
            <div
              className="floating-dot"
              style={{
                top: "40%",
                left: "95%",
                animationDelay: "3.8s",
                width: "3px",
                height: "3px",
              }}
            ></div>
          </div>

          {/* Shimmer Lines - Reduced opacity */}
          <div
            className="shimmer-line"
            style={{ top: "20%", animationDelay: "0s", opacity: 0.3 }}
          ></div>
          <div
            className="shimmer-line"
            style={{ top: "60%", animationDelay: "1s", opacity: 0.3 }}
          ></div>
          <div
            className="shimmer-line"
            style={{ top: "80%", animationDelay: "2s", opacity: 0.3 }}
          ></div>

          {/* Sparkle Elements - Reduced opacity */}
          <div
            className="sparkle sparkle-small"
            style={{
              top: "15%",
              left: "10%",
              animationDelay: "0s",
              opacity: 0.5,
            }}
          ></div>
          <div
            className="sparkle"
            style={{
              top: "25%",
              left: "85%",
              animationDelay: "0.5s",
              opacity: 0.5,
            }}
          ></div>
          <div
            className="sparkle sparkle-large"
            style={{
              top: "45%",
              left: "15%",
              animationDelay: "1s",
              opacity: 0.5,
            }}
          ></div>
          <div
            className="sparkle sparkle-small"
            style={{
              top: "35%",
              left: "70%",
              animationDelay: "1.5s",
              opacity: 0.5,
            }}
          ></div>
          <div
            className="sparkle"
            style={{
              top: "65%",
              left: "90%",
              animationDelay: "2s",
              opacity: 0.5,
            }}
          ></div>
          <div
            className="sparkle sparkle-large"
            style={{
              top: "75%",
              left: "20%",
              animationDelay: "2.5s",
              opacity: 0.5,
            }}
          ></div>
          <div
            className="sparkle sparkle-small"
            style={{
              top: "85%",
              left: "60%",
              animationDelay: "3s",
              opacity: 0.5,
            }}
          ></div>
          <div
            className="sparkle"
            style={{
              top: "55%",
              left: "40%",
              animationDelay: "3.5s",
              opacity: 0.5,
            }}
          ></div>
          <div
            className="sparkle sparkle-small"
            style={{
              top: "15%",
              left: "45%",
              animationDelay: "4s",
              opacity: 0.5,
            }}
          ></div>
          <div
            className="sparkle sparkle-large"
            style={{
              top: "90%",
              left: "80%",
              animationDelay: "4.5s",
              opacity: 0.5,
            }}
          ></div>
          <div
            className="sparkle"
            style={{
              top: "30%",
              left: "25%",
              animationDelay: "5s",
              opacity: 0.5,
            }}
          ></div>
          <div
            className="sparkle sparkle-small"
            style={{
              top: "70%",
              left: "55%",
              animationDelay: "5.5s",
              opacity: 0.5,
            }}
          ></div>
        </div>
      </div>
    </>
  );
}
