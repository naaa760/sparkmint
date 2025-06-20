"use client";

import { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import {
  History,
  Loader2,
  TrendingUp,
  TrendingDown,
  Coins,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { useTokenContext } from "../dashboard/page";

export default function TransactionHistory({ limit = null }) {
  const { connected, publicKey } = useWallet();
  const { connection } = useConnection();
  const { demoTransactions } = useTokenContext();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchTransactions = async (pageNum = 1, isLoadMore = false) => {
    if (!connected || !publicKey) {
      setTransactions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching blockchain transactions...");

      // Get recent transactions from blockchain
      const signatures = await connection.getSignaturesForAddress(publicKey, {
        limit: limit || 20,
        before:
          pageNum > 1
            ? transactions[transactions.length - 1]?.signature
            : undefined,
      });

      console.log(`Found ${signatures.length} signature(s)`);

      if (signatures.length === 0) {
        if (!isLoadMore) {
          setTransactions([]);
        }
        setHasMore(false);
        return;
      }

      // Get detailed transaction information
      const txPromises = signatures.map(async (sigInfo) => {
        try {
          const tx = await connection.getParsedTransaction(sigInfo.signature, {
            maxSupportedTransactionVersion: 0,
          });

          if (!tx) return null;

          // Extract token transfers
          const tokenTransfers = [];
          if (tx.meta?.preTokenBalances && tx.meta?.postTokenBalances) {
            const preBalances = tx.meta.preTokenBalances;
            const postBalances = tx.meta.postTokenBalances;

            for (const postBalance of postBalances) {
              const preBalance = preBalances.find(
                (pre) =>
                  pre.accountIndex === postBalance.accountIndex &&
                  pre.mint === postBalance.mint
              );

              if (
                preBalance &&
                postBalance.uiTokenAmount.amount !==
                  preBalance.uiTokenAmount.amount
              ) {
                const preAmount = parseFloat(preBalance.uiTokenAmount.amount);
                const postAmount = parseFloat(postBalance.uiTokenAmount.amount);
                const difference = postAmount - preAmount;

                if (difference !== 0) {
                  tokenTransfers.push({
                    type: difference > 0 ? "received" : "sent",
                    mint: postBalance.mint,
                    amount: Math.abs(difference),
                    uiAmount:
                      Math.abs(difference) /
                      Math.pow(10, postBalance.uiTokenAmount.decimals),
                    decimals: postBalance.uiTokenAmount.decimals,
                    accountIndex: postBalance.accountIndex,
                  });
                }
              }
            }
          }

          // Check for SPL token program instructions
          if (tx.transaction?.message?.instructions) {
            for (const instruction of tx.transaction.message.instructions) {
              if (
                instruction.programId?.equals(
                  new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
                )
              ) {
                // This is a token program instruction
                if (instruction.parsed) {
                  const info = instruction.parsed.info;
                  switch (instruction.parsed.type) {
                    case "mintTo":
                      tokenTransfers.push({
                        type: "mintTo",
                        mint: info.mint,
                        amount: info.amount,
                        uiAmount:
                          parseFloat(info.amount) /
                          Math.pow(10, info.decimals || 9),
                        destination: info.account,
                      });
                      break;
                    case "transfer":
                      tokenTransfers.push({
                        type: "transfer",
                        mint: info.mint,
                        amount: info.amount,
                        uiAmount:
                          parseFloat(info.amount) /
                          Math.pow(10, info.decimals || 9),
                        source: info.source,
                        destination: info.destination,
                      });
                      break;
                  }
                }
              }
            }
          }

          return {
            signature: sigInfo.signature,
            blockTime: sigInfo.blockTime || tx.blockTime,
            status: sigInfo.err ? "failed" : "success",
            fee: tx.meta?.fee || 0,
            tokenTransfers,
            type: "blockchain",
          };
        } catch (error) {
          console.error(
            `Error fetching transaction ${sigInfo.signature}:`,
            error
          );
          return null;
        }
      });

      const txDetails = await Promise.allSettled(txPromises);

      const validTransactions = txDetails
        .filter((result) => result.status === "fulfilled" && result.value)
        .map((result) => result.value);

      // Combine blockchain transactions with demo transactions
      let allTransactions;
      if (pageNum === 1) {
        // For first page, combine demo transactions with blockchain transactions
        const demoTxs = demoTransactions.map((demoTx) => ({
          signature: demoTx.signature || `demo_${demoTx.id}`,
          blockTime: Math.floor(new Date(demoTx.timestamp).getTime() / 1000),
          status: demoTx.status || "success",
          fee: 0,
          tokenTransfers: [],
          type: "demo",
          demoData: demoTx,
        }));

        allTransactions = [...demoTxs, ...validTransactions];

        // Sort by timestamp (most recent first)
        allTransactions.sort((a, b) => (b.blockTime || 0) - (a.blockTime || 0));

        if (limit) {
          allTransactions = allTransactions.slice(0, limit);
        }
      } else {
        // For subsequent pages, only add blockchain transactions
        allTransactions = validTransactions;
      }

      if (isLoadMore) {
        setTransactions((prev) => [...prev, ...allTransactions]);
      } else {
        setTransactions(allTransactions);
      }

      setHasMore(signatures.length === (limit || 20));
    } catch (err) {
      console.error("Error fetching transactions:", err);

      // On error, show demo transactions if it's the first page
      if (pageNum === 1) {
        const demoTxs = demoTransactions.map((demoTx) => ({
          signature: demoTx.signature || `demo_${demoTx.id}`,
          blockTime: Math.floor(new Date(demoTx.timestamp).getTime() / 1000),
          status: demoTx.status || "success",
          fee: 0,
          tokenTransfers: [],
          type: "demo",
          demoData: demoTx,
        }));

        if (!isLoadMore) {
          setTransactions(demoTxs.slice(0, limit || demoTxs.length));
        }
      }

      setError("Failed to fetch some transaction history");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
      fetchTransactions(page + 1, true);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown";
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatAddress = (address) => {
    if (!address) return "Unknown";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const getTransactionTypeIcon = (tx) => {
    if (tx.type === "demo") {
      const demoType = tx.demoData?.type;
      if (demoType === "Token Creation")
        return <Coins className="w-4 h-4 text-purple-400" />;
      if (demoType === "Token Mint")
        return <TrendingUp className="w-4 h-4 text-blue-400" />;
      if (demoType === "Token Transfer")
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      return <Coins className="w-4 h-4" />;
    }

    const transfers = tx.tokenTransfers || [];
    if (transfers.length === 0) return <Coins className="w-4 h-4" />;

    const hasIncoming = transfers.some(
      (t) =>
        t.type === "transfer" &&
        t.destination &&
        new PublicKey(t.destination).equals(publicKey)
    );
    const hasOutgoing = transfers.some(
      (t) =>
        t.type === "transfer" &&
        t.source &&
        new PublicKey(t.source).equals(publicKey)
    );
    const hasMinting = transfers.some((t) => t.type === "mintTo");

    if (hasMinting) return <TrendingUp className="w-4 h-4 text-blue-400" />;
    if (hasIncoming && !hasOutgoing)
      return <TrendingDown className="w-4 h-4 text-green-400" />;
    if (hasOutgoing && !hasIncoming)
      return <TrendingUp className="w-4 h-4 text-red-400" />;
    return <Coins className="w-4 h-4" />;
  };

  const getTransactionType = (tx) => {
    if (tx.type === "demo") {
      return tx.demoData?.type || "Demo Transaction";
    }

    const transfers = tx.tokenTransfers || [];
    if (transfers.length === 0) return "Transaction";

    const hasIncoming = transfers.some(
      (t) =>
        t.type === "transfer" &&
        t.destination &&
        new PublicKey(t.destination).equals(publicKey)
    );
    const hasOutgoing = transfers.some(
      (t) =>
        t.type === "transfer" &&
        t.source &&
        new PublicKey(t.source).equals(publicKey)
    );
    const hasMinting = transfers.some((t) => t.type === "mintTo");

    if (hasMinting) return "Token Mint";
    if (hasIncoming && !hasOutgoing) return "Received";
    if (hasOutgoing && !hasIncoming) return "Sent";
    if (hasIncoming && hasOutgoing) return "Swap/Exchange";
    return "Token Operation";
  };

  useEffect(() => {
    fetchTransactions();
    setPage(1);
    setHasMore(true);
  }, [connected, publicKey, demoTransactions]);

  if (!connected) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <History className="w-5 h-5 mr-2 text-purple-400" />
          Transaction History
        </h3>
        <div className="text-center py-8">
          <History className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">
            Connect your wallet to view transaction history
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <History className="w-5 h-5 mr-2 text-purple-400" />
          Transaction History
          {transactions.length > 0 && (
            <span className="ml-2 text-sm text-gray-400">
              ({transactions.length})
            </span>
          )}
        </h3>
        <button
          onClick={() => fetchTransactions()}
          disabled={loading}
          className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
        >
          <Loader2 className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {error && (
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 mb-4 flex items-start space-x-3">
          <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
          <p className="text-yellow-400 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        {loading && transactions.length === 0 ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 text-gray-500 mx-auto mb-4 animate-spin" />
            <p className="text-gray-400">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <History className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No transactions found</p>
          </div>
        ) : (
          <>
            {transactions.map((tx, index) => (
              <div
                key={`${tx.signature}-${index}`}
                className="bg-gray-700/50 rounded-lg p-4 border border-gray-600"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getTransactionTypeIcon(tx)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="text-white font-medium">
                          {getTransactionType(tx)}
                        </p>
                        {tx.type === "demo" && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                            Demo
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm">
                        {formatDate(tx.blockTime)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="text-right">
                      <p
                        className={`text-sm font-medium ${
                          tx.status === "success"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {tx.status === "success" ? "Success" : "Failed"}
                      </p>
                      <p className="text-gray-400 text-xs">
                        Fee: {(tx.fee / 1000000000).toFixed(6)} SOL
                      </p>
                    </div>
                    {tx.type === "blockchain" && (
                      <a
                        href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Demo Transaction Details */}
                {tx.type === "demo" && tx.demoData?.details && (
                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <div className="space-y-1 text-sm">
                      {tx.demoData.details.amount && (
                        <p className="text-gray-300">
                          <span className="text-gray-400">Amount:</span>{" "}
                          {tx.demoData.details.amount} tokens
                        </p>
                      )}
                      {tx.demoData.details.mint && (
                        <p className="text-gray-300">
                          <span className="text-gray-400">Token:</span>{" "}
                          {formatAddress(tx.demoData.details.mint)}
                        </p>
                      )}
                      {tx.demoData.details.recipient && (
                        <p className="text-gray-300">
                          <span className="text-gray-400">Recipient:</span>{" "}
                          {formatAddress(tx.demoData.details.recipient)}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Token Transfer Details */}
                {tx.tokenTransfers && tx.tokenTransfers.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-600">
                    <div className="space-y-2">
                      {tx.tokenTransfers.map((transfer, i) => (
                        <div key={i} className="text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 capitalize">
                              {transfer.type}:
                            </span>
                            <span className="text-white">
                              {transfer.uiAmount?.toFixed(
                                transfer.decimals || 6
                              ) ||
                                transfer.amount ||
                                "Unknown"}{" "}
                              tokens
                            </span>
                          </div>
                          {transfer.mint && (
                            <p className="text-gray-500 text-xs">
                              Token: {formatAddress(transfer.mint)}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-2 text-xs text-gray-500">
                  Signature: {formatAddress(tx.signature)}
                </div>
              </div>
            ))}

            {!limit && hasMore && (
              <button
                onClick={loadMore}
                disabled={loading}
                className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
