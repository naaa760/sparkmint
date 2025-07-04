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
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
        {/* Enhanced gradient background with subtle patterns */}
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/40 relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          </div>

          {/* Sleek, compact navbar */}
          <nav className="fixed top-3 left-3 right-3 z-50 bg-white/70 backdrop-blur-2xl border border-white/60 rounded-2xl shadow-2xl shadow-blue-500/10">
            <div className="px-4 py-2.5">
              <div className="flex items-center justify-between">
                {/* Left side */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-1.5 hover:bg-blue-500/10 rounded-lg transition-all duration-200 hover:scale-105"
                  >
                    <Menu className="w-4 h-4 text-slate-700" />
                  </button>

                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/25">
                      <Building2 className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-base font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                      SparkMint
                    </span>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex items-center space-x-3">
                  <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-200/50 rounded-full">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-emerald-700">
                      Live
                    </span>
                  </div>

                  <WalletConnection />

                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox:
                          "w-7 h-7 rounded-lg ring-2 ring-blue-200/60 hover:ring-blue-300/80 transition-all hover:scale-105",
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </nav>

          <div className="flex pt-20">
            {/* Enhanced Sidebar */}
            <aside
              className={`fixed left-3 top-20 bottom-3 z-40 bg-white/75 backdrop-blur-2xl border border-white/60 rounded-2xl shadow-2xl shadow-blue-500/10 transition-all duration-300 ${
                sidebarOpen ? "w-72" : "w-14"
              }`}
            >
              <div className="p-3 h-full flex flex-col">
                {/* Sidebar Toggle */}
                <div className="flex justify-end mb-3">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-1.5 hover:bg-blue-500/10 rounded-lg transition-all duration-200 hover:scale-105"
                  >
                    {sidebarOpen ? (
                      <ChevronLeft className="w-3.5 h-3.5 text-slate-600" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    )}
                  </button>
                </div>

                {/* User Section */}
                {sidebarOpen && (
                  <div className="mb-6 text-center">
                    <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/30">
                      <span className="text-base font-bold text-white">
                        {user?.firstName?.charAt(0) || "U"}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm">
                      {user?.firstName || "User"}
                    </h3>
                    <p className="text-slate-500 text-xs">Token Manager</p>
                  </div>
                )}

                {/* Navigation */}
                <nav className="space-y-1.5 flex-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full rounded-xl transition-all duration-200 group ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 border border-blue-200/60 shadow-lg shadow-blue-500/10"
                          : "text-slate-600 hover:text-slate-800 hover:bg-slate-500/5 hover:scale-[1.02]"
                      } ${sidebarOpen ? "p-2.5" : "p-2"}`}
                      title={!sidebarOpen ? tab.label : ""}
                    >
                      <div
                        className={`flex items-center ${
                          sidebarOpen ? "space-x-3" : "justify-center"
                        }`}
                      >
                        <div
                          className={`${
                            activeTab === tab.id
                              ? "text-blue-600"
                              : "text-slate-500 group-hover:text-slate-700"
                          } transition-all duration-200`}
                        >
                          <tab.icon className="w-4 h-4" />
                        </div>
                        {sidebarOpen && (
                          <span className="font-medium text-sm">
                            {tab.label}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </nav>

                {/* Enhanced Stats Section */}
                {sidebarOpen && (
                  <div className="mt-4 p-3.5 bg-gradient-to-br from-slate-50/80 to-blue-50/60 rounded-xl border border-blue-100/60 shadow-lg shadow-blue-500/10">
                    <h4 className="text-xs font-semibold text-slate-800 mb-3 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-2 text-blue-600" />
                      Quick Stats
                    </h4>
                    <div className="space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 text-xs">
                          Active Tokens
                        </span>
                        <span className="font-bold text-slate-800 text-xs bg-blue-100/60 px-2 py-0.5 rounded-full">
                          3
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 text-xs">
                          Total Transactions
                        </span>
                        <span className="font-bold text-slate-800 text-xs bg-emerald-100/60 px-2 py-0.5 rounded-full">
                          12
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </aside>

            {/* Enhanced Main Content */}
            <main
              className={`flex-1 transition-all duration-300 ${
                sidebarOpen ? "ml-80" : "ml-20"
              } mr-3 mb-3`}
            >
              <div className="bg-white/75 backdrop-blur-2xl border border-white/60 rounded-2xl shadow-2xl shadow-blue-500/10 overflow-hidden">
                {activeTab === "overview" && (
                  <div className="p-6">
                    {/* Enhanced Header */}
                    <div className="mb-8 pb-4 border-b border-blue-100/60">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                        Dashboard Overview
                      </h1>
                      <p className="text-slate-500 text-sm">
                        Monitor and manage your token ecosystem
                      </p>
                    </div>

                    {/* Enhanced Grid Layout */}
                    <div className="grid lg:grid-cols-3 gap-6 mb-8">
                      {/* Wallet Balance */}
                      <div className="lg:col-span-2">
                        <WalletBalance />
                      </div>

                      {/* Enhanced Quick Actions */}
                      <div className="bg-gradient-to-br from-slate-50/80 to-blue-50/60 rounded-xl p-5 border border-blue-100/60 shadow-lg shadow-blue-500/10">
                        <h3 className="font-semibold text-slate-800 mb-4 flex items-center text-sm">
                          <Activity className="w-4 h-4 mr-2 text-blue-600" />
                          Quick Actions
                        </h3>
                        <div className="space-y-2.5">
                          {tabs.slice(1).map((tab) => (
                            <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className="w-full bg-white/90 text-slate-700 hover:text-slate-800 border border-blue-100/60 hover:border-blue-300/80 hover:bg-blue-50/50 p-2.5 rounded-lg transition-all duration-200 text-xs font-medium flex items-center justify-center space-x-2 shadow-sm hover:shadow-md hover:scale-[1.02]"
                            >
                              <tab.icon className="w-3.5 h-3.5" />
                              <span>{tab.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Recent Activity */}
                    <div className="bg-gradient-to-br from-slate-50/80 to-blue-50/60 rounded-xl p-6 border border-blue-100/60 shadow-lg shadow-blue-500/10">
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-blue-100/60">
                        <h3 className="font-semibold text-slate-800 flex items-center text-sm">
                          <History className="w-4 h-4 mr-2 text-blue-600" />
                          Recent Activity
                        </h3>
                        <button
                          onClick={() => setActiveTab("history")}
                          className="text-blue-700 hover:text-blue-800 font-medium text-xs hover:underline transition-all duration-200 hover:scale-105"
                        >
                          View All
                        </button>
                      </div>
                      <TransactionHistory limit={5} />
                    </div>
                  </div>
                )}

                {activeTab === "create" && (
                  <div className="p-6">
                    <div className="mb-8 pb-4 border-b border-blue-100/60">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                        Create New Token
                      </h1>
                      <p className="text-slate-500 text-sm">
                        Deploy a new token on the Solana blockchain
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50/80 to-blue-50/60 rounded-xl p-6 border border-blue-100/60 shadow-lg shadow-blue-500/10">
                      <TokenCreator />
                    </div>
                  </div>
                )}

                {activeTab === "mint" && (
                  <div className="p-6">
                    <div className="mb-8 pb-4 border-b border-blue-100/60">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                        Mint Tokens
                      </h1>
                      <p className="text-slate-500 text-sm">
                        Increase token supply for existing tokens
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50/80 to-blue-50/60 rounded-xl p-6 border border-blue-100/60 shadow-lg shadow-blue-500/10">
                      <TokenMinter />
                    </div>
                  </div>
                )}

                {activeTab === "send" && (
                  <div className="p-6">
                    <div className="mb-8 pb-4 border-b border-blue-100/60">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                        Send Tokens
                      </h1>
                      <p className="text-slate-500 text-sm">
                        Transfer tokens to other addresses securely
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50/80 to-blue-50/60 rounded-xl p-6 border border-blue-100/60 shadow-lg shadow-blue-500/10">
                      <TokenSender />
                    </div>
                  </div>
                )}

                {activeTab === "history" && (
                  <div className="p-6">
                    <div className="mb-8 pb-4 border-b border-blue-100/60">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
                        Transaction History
                      </h1>
                      <p className="text-slate-500 text-sm">
                        Complete record of all blockchain transactions
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-slate-50/80 to-blue-50/60 rounded-xl p-6 border border-blue-100/60 shadow-lg shadow-blue-500/10">
                      <TransactionHistory />
                    </div>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </TokenProvider>
    </SolanaWalletProvider>
  );
}
