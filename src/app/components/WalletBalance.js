"use client";

import { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";
import { Wallet, RefreshCw, Eye, EyeOff } from "lucide-react";
import { useTokenContext } from "../dashboard/page";

export default function WalletBalance() {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const { demoTokens } = useTokenContext();
  const [balance, setBalance] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [error, setError] = useState(null);

  const fetchBalance = async () => {
    if (!connected || !publicKey) {
      setBalance(null);
      setTokens([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get SOL balance
      const solBalance = await connection.getBalance(publicKey);
      setBalance(solBalance / LAMPORTS_PER_SOL);

      // Get token accounts from blockchain
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        {
          programId: new (
            await import("@solana/web3.js")
          ).PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
        }
      );

      const blockchainTokens = tokenAccounts.value
        .filter(
          (account) => account.account.data.parsed.info.tokenAmount.uiAmount > 0
        )
        .map((account) => ({
          mint: account.account.data.parsed.info.mint,
          amount: account.account.data.parsed.info.tokenAmount.uiAmount,
          decimals: account.account.data.parsed.info.tokenAmount.decimals,
          type: "blockchain",
        }));

      // Combine blockchain tokens with demo tokens
      const allTokens = [
        ...blockchainTokens,
        ...demoTokens.map((token) => ({
          mint: token.mintAddress,
          amount: token.balance,
          decimals: token.decimals || 9,
          type: "demo",
          name: token.name,
          symbol: token.symbol,
        })),
      ];

      setTokens(allTokens);
    } catch (err) {
      console.error("Error fetching balance:", err);
      setError("Failed to fetch balance");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [connected, publicKey, connection, demoTokens]);

  if (!connected) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Wallet className="w-5 h-5 mr-2 text-purple-400" />
          Wallet Balance
        </h3>
        <div className="text-center py-8">
          <Wallet className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">Connect your wallet to view balance</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Wallet className="w-5 h-5 mr-2 text-purple-400" />
          Wallet Balance
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {showBalance ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={fetchBalance}
            disabled={loading}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* SOL Balance */}
        <div className="bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">SOL</span>
              </div>
              <div>
                <p className="text-white font-medium">Solana</p>
                <p className="text-gray-400 text-sm">SOL</p>
              </div>
            </div>
            <div className="text-right">
              {loading ? (
                <div className="animate-pulse bg-gray-600 h-4 w-16 rounded"></div>
              ) : showBalance ? (
                <p className="text-white font-semibold">
                  {balance !== null ? balance.toFixed(4) : "0.0000"} SOL
                </p>
              ) : (
                <p className="text-white font-semibold">••••••</p>
              )}
            </div>
          </div>
        </div>

        {/* Token Balances */}
        {tokens.length > 0 && (
          <div className="space-y-2">
            <p className="text-gray-400 text-sm font-medium">Token Balances</p>
            {tokens.map((token, index) => (
              <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        token.type === "demo"
                          ? "bg-gradient-to-r from-green-500 to-emerald-500"
                          : "bg-gradient-to-r from-blue-500 to-cyan-500"
                      }`}
                    >
                      <span className="text-white text-xs font-bold">
                        {token.symbol ? token.symbol.charAt(0) : "T"}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-white font-medium">
                          {token.name || "Custom Token"}
                        </p>
                        {token.type === "demo" && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                            Demo
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-xs">
                        {token.symbol ||
                          `${token.mint.slice(0, 4)}...${token.mint.slice(-4)}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {showBalance ? (
                      <p className="text-white font-semibold">
                        {token.amount.toFixed(token.decimals)}{" "}
                        {token.symbol || ""}
                      </p>
                    ) : (
                      <p className="text-white font-semibold">••••••</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tokens.length === 0 && balance !== null && (
          <div className="text-center py-4">
            <p className="text-gray-400 text-sm">No tokens found</p>
            <p className="text-gray-500 text-xs mt-1">
              Create a token to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
