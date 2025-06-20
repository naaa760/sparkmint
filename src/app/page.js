"use client";

import { SignInButton, SignUpButton, useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  ArrowRight,
  Wallet,
  Coins,
  Send,
  BarChart3,
  Shield,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="relative z-10">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">SparkMint</span>
            </div>

            <div className="flex items-center space-x-4">
              {isSignedIn ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <>
                  <SignInButton mode="modal">
                    <button className="text-white hover:text-purple-300 transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105">
                      Get Started
                    </button>
                  </SignUpButton>
                </>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl blur-3xl opacity-20"></div>
            <div className="relative">
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Create & Mint
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Solana Tokens
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                The most intuitive platform to create, mint, and manage SPL
                tokens on Solana. Connect your wallet and start building the
                future of decentralized finance.
              </p>

              {!isSignedIn && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <SignUpButton mode="modal">
                    <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2">
                      <span>Start Creating</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </SignUpButton>
                  <SignInButton mode="modal">
                    <button className="border-2 border-purple-400 text-purple-400 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-purple-400 hover:text-white transition-all duration-200">
                      Sign In
                    </button>
                  </SignInButton>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Wallet className="w-8 h-8" />}
            title="Wallet Integration"
            description="Seamlessly connect with Phantom, Solflare, and other Solana wallets"
          />
          <FeatureCard
            icon={<Coins className="w-8 h-8" />}
            title="Token Creation"
            description="Create custom SPL tokens with metadata and supply controls"
          />
          <FeatureCard
            icon={<Send className="w-8 h-8" />}
            title="Token Management"
            description="Mint, transfer, and manage your tokens with ease"
          />
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8" />}
            title="Real-time Data"
            description="View balances, transaction history, and market data live"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Secure & Safe"
            description="Built with security best practices for peace of mind"
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="Lightning Fast"
            description="Powered by Solana's high-speed blockchain network"
          />
        </div>

        {/* CTA Section */}
        {!isSignedIn && (
          <div className="mt-32 text-center">
            <div className="bg-gradient-to-r from-purple-800/50 to-pink-800/50 backdrop-blur-sm rounded-3xl p-12 border border-purple-500/20">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of developers and creators building the next
                generation of digital assets on Solana.
              </p>
              <SignUpButton mode="modal">
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-10 py-4 rounded-xl text-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105">
                  Create Your First Token
                </button>
              </SignUpButton>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200 group">
      <div className="text-purple-400 mb-4 group-hover:text-pink-400 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
}
