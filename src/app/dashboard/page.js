"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useUser, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SolanaWalletProvider } from "../components/SolanaWalletProvider";
import WalletConnection from "../components/WalletConnection";
import TokenCreator from "../components/TokenCreator";
import TokenMinter from "../components/TokenMinter";
import TokenSender from "../components/TokenSender";
import WalletBalance from "../components/WalletBalance";
import TransactionHistory from "../components/TransactionHistory";
import {
  Coins,
  Plus,
  Send,
  Wallet,
  History,
  BarChart3,
  TrendingUp,
  Activity,
  Users,
  Building2,
} from "lucide-react";

// Create context for managing demo tokens
const TokenContext = createContext();

export const useTokenContext = () => {
  const context = useContext(TokenContext);
  if (!context) {
    throw new Error("useTokenContext must be used within a TokenProvider");
  }
  return context;
};

const TokenProvider = ({ children }) => {
  const [demoTokens, setDemoTokens] = useState([]);
  const [demoTransactions, setDemoTransactions] = useState([]);

  const addDemoToken = (tokenData) => {
    const newToken = {
      ...tokenData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      balance: tokenData.initialSupply || 0,
    };
    setDemoTokens((prev) => [...prev, newToken]);

    // Add transaction record
    const transaction = {
      id: Date.now().toString(),
      type: "Token Creation",
      signature: `demo_${Date.now()}`,
      status: "success",
      timestamp: new Date().toISOString(),
      tokenData: newToken,
    };
    setDemoTransactions((prev) => [transaction, ...prev]);
  };

  const addDemoTransaction = (transactionData) => {
    const transaction = {
      ...transactionData,
      id: Date.now().toString(),
      signature: `demo_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setDemoTransactions((prev) => [transaction, ...prev]);
  };

  const updateTokenBalance = (mintAddress, newBalance) => {
    setDemoTokens((prev) =>
      prev.map((token) =>
        token.mintAddress === mintAddress
          ? { ...token, balance: newBalance }
          : token
      )
    );
  };

  return (
    <TokenContext.Provider
      value={{
        demoTokens,
        demoTransactions,
        addDemoToken,
        addDemoTransaction,
        updateTokenBalance,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export default function Dashboard() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn, router]);

  if (!isSignedIn) {
    return null;
  }

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
    },
    {
      id: "create",
      label: "Create Token",
      icon: Plus,
    },
    {
      id: "mint",
      label: "Mint Tokens",
      icon: Coins,
    },
    {
      id: "send",
      label: "Send Tokens",
      icon: Send,
    },
    {
      id: "history",
      label: "History",
      icon: History,
    },
  ];

  return (
    <SolanaWalletProvider>
      <TokenProvider>
        {/* Professional background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20"></div>
          {/* Subtle decorative elements */}
          <div className="absolute top-20 left-20 w-1 h-1 bg-amber-800/10 rounded-full"></div>
          <div className="absolute top-40 right-32 w-1.5 h-1.5 bg-stone-400/15 rounded-full"></div>
          <div className="absolute bottom-32 left-1/4 w-1 h-1 bg-amber-600/10 rounded-full"></div>
          <div className="absolute bottom-20 right-1/3 w-1.5 h-1.5 bg-stone-500/10 rounded-full"></div>
        </div>

        <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-orange-50/20 relative">
          {/* Professional Header */}
          <header className="bg-white/95 backdrop-blur-sm border-b border-stone-200 shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg flex items-center justify-center shadow-md">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-stone-800">
                      SparkMint
                    </span>
                    <p className="text-xs text-stone-600 font-medium">
                      Professional Token Platform
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="hidden md:flex items-center space-x-4 px-4 py-2 bg-stone-100 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-sm font-medium text-stone-700">
                        Connected
                      </span>
                    </div>
                  </div>
                  <WalletConnection />
                  <div className="relative">
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox:
                            "w-10 h-10 rounded-lg ring-2 ring-stone-200 hover:ring-stone-300 transition-all",
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-6 py-8">
            <div className="flex gap-8">
              {/* Professional Sidebar */}
              <aside className="w-80 flex-shrink-0">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-stone-200 shadow-lg p-8 sticky top-24">
                  {/* User Welcome Section */}
                  <div className="mb-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-stone-600 to-stone-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
                      <span className="text-2xl font-bold text-white">
                        {user?.firstName?.charAt(0) || "U"}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-stone-800">
                      Welcome, {user?.firstName || "User"}
                    </h3>
                    <p className="text-stone-600 text-sm">
                      Manage your token portfolio
                    </p>
                  </div>

                  {/* Navigation */}
                  <nav className="space-y-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full group rounded-lg transition-all duration-200 ${
                          activeTab === tab.id
                            ? "bg-amber-100 text-amber-800 border border-amber-200 shadow-sm"
                            : "text-stone-600 hover:text-stone-800 hover:bg-stone-50 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center space-x-3 px-4 py-3">
                          <div
                            className={`p-2 rounded-md ${
                              activeTab === tab.id
                                ? "bg-amber-200 text-amber-700"
                                : "bg-stone-100 text-stone-600 group-hover:bg-stone-200"
                            } transition-all duration-200`}
                          >
                            <tab.icon className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-left">
                            {tab.label}
                          </span>
                        </div>
                      </button>
                    ))}
                  </nav>

                  {/* Stats Section */}
                  <div className="mt-8 p-6 bg-stone-50 rounded-xl border border-stone-200">
                    <h4 className="text-sm font-semibold text-stone-800 mb-4 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-amber-600" />
                      Account Summary
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-stone-600 text-sm">
                          Total Tokens
                        </span>
                        <span className="font-semibold text-stone-800">3</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-600 text-sm">
                          Transactions
                        </span>
                        <span className="font-semibold text-stone-800">12</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-stone-600 text-sm">Status</span>
                        <span className="font-semibold text-green-700">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Professional Main Content */}
              <main className="flex-1">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-stone-200 shadow-lg overflow-hidden">
                  {activeTab === "overview" && (
                    <div className="p-8">
                      {/* Professional Header */}
                      <div className="mb-10 pb-6 border-b border-stone-200">
                        <h1 className="text-3xl font-bold text-stone-800 mb-2">
                          Dashboard Overview
                        </h1>
                        <p className="text-stone-600">
                          Monitor and manage your token operations
                        </p>
                      </div>

                      {/* Professional Grid Layout */}
                      <div className="grid lg:grid-cols-3 gap-8 mb-10">
                        {/* Wallet Balance Card */}
                        <div className="lg:col-span-2">
                          <WalletBalance />
                        </div>

                        {/* Quick Actions Card */}
                        <div className="bg-stone-50 rounded-xl p-6 border border-stone-200">
                          <h3 className="text-lg font-semibold text-stone-800 mb-6 flex items-center">
                            <Activity className="w-5 h-5 mr-2 text-amber-600" />
                            Quick Actions
                          </h3>
                          <div className="space-y-3">
                            {tabs.slice(1).map((tab) => (
                              <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className="w-full bg-white text-stone-700 hover:text-stone-800 border border-stone-200 hover:border-amber-300 hover:bg-amber-50 p-3 rounded-lg transition-all duration-200 text-sm font-medium flex items-center justify-center space-x-2 shadow-sm"
                              >
                                <tab.icon className="w-4 h-4" />
                                <span>{tab.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div className="bg-stone-50 rounded-xl p-8 border border-stone-200">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200">
                          <h3 className="text-lg font-semibold text-stone-800 flex items-center">
                            <History className="w-5 h-5 mr-2 text-amber-600" />
                            Recent Activity
                          </h3>
                          <button
                            onClick={() => setActiveTab("history")}
                            className="text-amber-700 hover:text-amber-800 font-medium text-sm hover:underline"
                          >
                            View All Transactions
                          </button>
                        </div>
                        <TransactionHistory limit={5} />
                      </div>
                    </div>
                  )}

                  {activeTab === "create" && (
                    <div className="p-8">
                      <div className="mb-10 pb-6 border-b border-stone-200">
                        <h1 className="text-3xl font-bold text-stone-800 mb-2">
                          Create New Token
                        </h1>
                        <p className="text-stone-600">
                          Deploy a new token on the blockchain
                        </p>
                      </div>
                      <div className="bg-stone-50 rounded-xl p-8 border border-stone-200">
                        <TokenCreator />
                      </div>
                    </div>
                  )}

                  {activeTab === "mint" && (
                    <div className="p-8">
                      <div className="mb-10 pb-6 border-b border-stone-200">
                        <h1 className="text-3xl font-bold text-stone-800 mb-2">
                          Mint Tokens
                        </h1>
                        <p className="text-stone-600">
                          Increase token supply for existing tokens
                        </p>
                      </div>
                      <div className="bg-stone-50 rounded-xl p-8 border border-stone-200">
                        <TokenMinter />
                      </div>
                    </div>
                  )}

                  {activeTab === "send" && (
                    <div className="p-8">
                      <div className="mb-10 pb-6 border-b border-stone-200">
                        <h1 className="text-3xl font-bold text-stone-800 mb-2">
                          Send Tokens
                        </h1>
                        <p className="text-stone-600">
                          Transfer tokens to other addresses
                        </p>
                      </div>
                      <div className="bg-stone-50 rounded-xl p-8 border border-stone-200">
                        <TokenSender />
                      </div>
                    </div>
                  )}

                  {activeTab === "history" && (
                    <div className="p-8">
                      <div className="mb-10 pb-6 border-b border-stone-200">
                        <h1 className="text-3xl font-bold text-stone-800 mb-2">
                          Transaction History
                        </h1>
                        <p className="text-stone-600">
                          Complete record of all blockchain transactions
                        </p>
                      </div>
                      <div className="bg-stone-50 rounded-xl p-8 border border-stone-200">
                        <TransactionHistory />
                      </div>
                    </div>
                  )}
                </div>
              </main>
            </div>
          </div>
        </div>
      </TokenProvider>
    </SolanaWalletProvider>
  );
}
