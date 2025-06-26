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
        {/* Beautiful gradient background */}
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
          {/* Transparent Navbar with rounded corners */}
          <nav className="fixed top-4 left-4 right-4 z-50 bg-white/85 backdrop-blur-xl border border-blue-200/60 rounded-2xl shadow-xl shadow-blue-100/20">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                {/* Left side */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 hover:bg-blue-100/80 rounded-xl transition-colors"
                  >
                    <Menu className="w-5 h-5 text-blue-700" />
                  </button>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                      <Building2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-slate-800">
                      SparkMint
                    </span>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex items-center space-x-4">
                  <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 bg-emerald-100/80 rounded-full">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                    <span className="text-xs font-medium text-emerald-700">
                      Connected
                    </span>
                  </div>

                  <WalletConnection />

                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox:
                          "w-8 h-8 rounded-xl ring-2 ring-blue-200 hover:ring-blue-300 transition-all",
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </nav>

          <div className="flex pt-28">
            {/* Collapsible Sidebar */}
            <aside
              className={`fixed left-4 top-32 bottom-4 z-40 bg-white/90 backdrop-blur-xl border border-blue-200/60 rounded-2xl shadow-xl shadow-blue-100/20 transition-all duration-300 ${
                sidebarOpen ? "w-72" : "w-16"
              }`}
            >
              <div className="p-4 h-full flex flex-col">
                {/* Sidebar Toggle */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 hover:bg-blue-100/80 rounded-xl transition-colors"
                  >
                    {sidebarOpen ? (
                      <ChevronLeft className="w-4 h-4 text-blue-600" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-blue-600" />
                    )}
                  </button>
                </div>

                {/* User Section */}
                {sidebarOpen && (
                  <div className="mb-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <span className="text-lg font-bold text-white">
                        {user?.firstName?.charAt(0) || "U"}
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-800 text-sm">
                      {user?.firstName || "User"}
                    </h3>
                    <p className="text-slate-600 text-xs">Token Manager</p>
                  </div>
                )}

                {/* Navigation */}
                <nav className="space-y-2 flex-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full rounded-xl transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200 shadow-sm"
                          : "text-slate-600 hover:text-slate-800 hover:bg-blue-50/80"
                      } ${sidebarOpen ? "p-3" : "p-2"}`}
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
                              : "text-slate-500"
                          } transition-colors`}
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

                {/* Stats Section */}
                {sidebarOpen && (
                  <div className="mt-4 p-4 bg-gradient-to-br from-blue-50/80 to-cyan-50/80 rounded-xl border border-blue-200/50 shadow-sm">
                    <h4 className="text-xs font-semibold text-slate-800 mb-3 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-2 text-blue-600" />
                      Summary
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 text-xs">Tokens</span>
                        <span className="font-semibold text-slate-800 text-xs">
                          3
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 text-xs">
                          Transactions
                        </span>
                        <span className="font-semibold text-slate-800 text-xs">
                          12
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </aside>

            {/* Main Content */}
            <main
              className={`flex-1 transition-all duration-300 ${
                sidebarOpen ? "ml-80" : "ml-24"
              } mr-4 mb-4`}
            >
              <div className="bg-white/90 backdrop-blur-xl border border-blue-200/60 rounded-2xl shadow-xl shadow-blue-100/20 overflow-hidden">
                {activeTab === "overview" && (
                  <div className="p-6">
                    {/* Header */}
                    <div className="mb-8 pb-4 border-b border-blue-200">
                      <h1 className="text-2xl font-bold text-slate-800 mb-1">
                        Dashboard Overview
                      </h1>
                      <p className="text-slate-600 text-sm">
                        Monitor and manage your tokens
                      </p>
                    </div>

                    {/* Grid Layout */}
                    <div className="grid lg:grid-cols-3 gap-6 mb-8">
                      {/* Wallet Balance */}
                      <div className="lg:col-span-2">
                        <WalletBalance />
                      </div>

                      {/* Quick Actions */}
                      <div className="bg-gradient-to-br from-blue-50/80 to-cyan-50/80 rounded-xl p-4 border border-blue-200/50 shadow-sm">
                        <h3 className="font-semibold text-slate-800 mb-4 flex items-center text-sm">
                          <Activity className="w-4 h-4 mr-2 text-blue-600" />
                          Quick Actions
                        </h3>
                        <div className="space-y-2">
                          {tabs.slice(1).map((tab) => (
                            <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className="w-full bg-white/80 text-slate-700 hover:text-slate-800 border border-blue-200 hover:border-blue-400 hover:bg-blue-50/80 p-2 rounded-lg transition-all duration-200 text-xs font-medium flex items-center justify-center space-x-2 shadow-sm"
                            >
                              <tab.icon className="w-3 h-3" />
                              <span>{tab.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-gradient-to-br from-blue-50/80 to-cyan-50/80 rounded-xl p-6 border border-blue-200/50 shadow-sm">
                      <div className="flex items-center justify-between mb-4 pb-3 border-b border-blue-200">
                        <h3 className="font-semibold text-slate-800 flex items-center text-sm">
                          <History className="w-4 h-4 mr-2 text-blue-600" />
                          Recent Activity
                        </h3>
                        <button
                          onClick={() => setActiveTab("history")}
                          className="text-blue-700 hover:text-blue-800 font-medium text-xs hover:underline"
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
                    <div className="mb-8 pb-4 border-b border-blue-200">
                      <h1 className="text-2xl font-bold text-slate-800 mb-1">
                        Create New Token
                      </h1>
                      <p className="text-slate-600 text-sm">
                        Deploy a new token on the blockchain
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50/80 to-cyan-50/80 rounded-xl p-6 border border-blue-200/50 shadow-sm">
                      <TokenCreator />
                    </div>
                  </div>
                )}

                {activeTab === "mint" && (
                  <div className="p-6">
                    <div className="mb-8 pb-4 border-b border-blue-200">
                      <h1 className="text-2xl font-bold text-slate-800 mb-1">
                        Mint Tokens
                      </h1>
                      <p className="text-slate-600 text-sm">
                        Increase token supply for existing tokens
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50/80 to-cyan-50/80 rounded-xl p-6 border border-blue-200/50 shadow-sm">
                      <TokenMinter />
                    </div>
                  </div>
                )}

                {activeTab === "send" && (
                  <div className="p-6">
                    <div className="mb-8 pb-4 border-b border-blue-200">
                      <h1 className="text-2xl font-bold text-slate-800 mb-1">
                        Send Tokens
                      </h1>
                      <p className="text-slate-600 text-sm">
                        Transfer tokens to other addresses
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50/80 to-cyan-50/80 rounded-xl p-6 border border-blue-200/50 shadow-sm">
                      <TokenSender />
                    </div>
                  </div>
                )}

                {activeTab === "history" && (
                  <div className="p-6">
                    <div className="mb-8 pb-4 border-b border-blue-200">
                      <h1 className="text-2xl font-bold text-slate-800 mb-1">
                        Transaction History
                      </h1>
                      <p className="text-slate-600 text-sm">
                        Complete record of all blockchain transactions
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50/80 to-cyan-50/80 rounded-xl p-6 border border-blue-200/50 shadow-sm">
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
