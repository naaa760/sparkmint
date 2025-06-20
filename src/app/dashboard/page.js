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
import { Coins, Plus, Send, Wallet, History, BarChart3 } from "lucide-react";

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
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "create", label: "Create Token", icon: Plus },
    { id: "mint", label: "Mint Tokens", icon: Coins },
    { id: "send", label: "Send Tokens", icon: Send },
    { id: "history", label: "History", icon: History },
  ];

  return (
    <SolanaWalletProvider>
      <TokenProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          {/* Header */}
          <header className="border-b border-gray-800 bg-black/20 backdrop-blur-sm">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                    <Coins className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-white">
                    SparkMint
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <WalletConnection />
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            </div>
          </header>

          <div className="container mx-auto px-6 py-8">
            <div className="flex gap-8">
              {/* Sidebar */}
              <aside className="w-64 flex-shrink-0">
                <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
                  <div className="mb-6">
                    <p className="text-white text-sm font-medium">
                      Welcome back!
                    </p>
                    <p className="text-gray-400 text-sm">
                      {user?.firstName || "User"}
                    </p>
                  </div>

                  <nav className="space-y-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                          activeTab === tab.id
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                            : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                        }`}
                      >
                        <tab.icon className="w-5 h-5" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>

              {/* Main Content */}
              <main className="flex-1">
                <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden">
                  {activeTab === "overview" && (
                    <div className="p-6">
                      <h1 className="text-3xl font-bold text-white mb-8">
                        Dashboard Overview
                      </h1>

                      <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <WalletBalance />
                        <div className="bg-gray-800/50 rounded-xl p-6">
                          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                            <Wallet className="w-5 h-5 mr-2 text-purple-400" />
                            Quick Actions
                          </h3>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              onClick={() => setActiveTab("create")}
                              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 text-sm font-medium"
                            >
                              Create Token
                            </button>
                            <button
                              onClick={() => setActiveTab("mint")}
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 text-sm font-medium"
                            >
                              Mint Tokens
                            </button>
                            <button
                              onClick={() => setActiveTab("send")}
                              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 text-sm font-medium"
                            >
                              Send Tokens
                            </button>
                            <button
                              onClick={() => setActiveTab("history")}
                              className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 text-sm font-medium"
                            >
                              View History
                            </button>
                          </div>
                        </div>
                      </div>

                      <TransactionHistory limit={5} />
                    </div>
                  )}

                  {activeTab === "create" && (
                    <div className="p-6">
                      <h1 className="text-3xl font-bold text-white mb-8">
                        Create New Token
                      </h1>
                      <TokenCreator />
                    </div>
                  )}

                  {activeTab === "mint" && (
                    <div className="p-6">
                      <h1 className="text-3xl font-bold text-white mb-8">
                        Mint Tokens
                      </h1>
                      <TokenMinter />
                    </div>
                  )}

                  {activeTab === "send" && (
                    <div className="p-6">
                      <h1 className="text-3xl font-bold text-white mb-8">
                        Send Tokens
                      </h1>
                      <TokenSender />
                    </div>
                  )}

                  {activeTab === "history" && (
                    <div className="p-6">
                      <h1 className="text-3xl font-bold text-white mb-8">
                        Transaction History
                      </h1>
                      <TransactionHistory />
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
