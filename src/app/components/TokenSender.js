"use client";

import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  transfer,
  getAccount,
} from "@solana/spl-token";
import { Send, Loader2, Check, AlertCircle } from "lucide-react";
import { useTokenContext } from "../dashboard/page";

export default function TokenSender() {
  const { connected, publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const { demoTokens, updateTokenBalance, addDemoTransaction } =
    useTokenContext();

  const [formData, setFormData] = useState({
    tokenMint: "",
    recipientAddress: "",
    amount: "",
  });

  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const sendTokens = async (e) => {
    e.preventDefault();

    if (!connected || !publicKey || !signTransaction) {
      setError("Please connect your wallet first");
      return;
    }

    if (!formData.tokenMint || !formData.recipientAddress || !formData.amount) {
      setError("All fields are required");
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    // Basic validation
    let mintPublicKey, recipientPublicKey;
    try {
      mintPublicKey = new PublicKey(formData.tokenMint);
      recipientPublicKey = new PublicKey(formData.recipientAddress);
    } catch {
      setError("Invalid address format");
      return;
    }

    setSending(true);
    setError(null);
    setSuccess(null);

    try {
      console.log("Starting transfer process...");
      console.log("Token mint:", mintPublicKey.toString());
      console.log("Recipient:", recipientPublicKey.toString());
      console.log("Amount:", amount);

      // Get mint info to determine decimals
      const mintInfo = await connection.getParsedAccountInfo(mintPublicKey);
      if (!mintInfo.value) {
        throw new Error("Invalid token mint address - mint account not found");
      }

      const mintData = mintInfo.value.data;
      if (!mintData || typeof mintData === "string") {
        throw new Error("Unable to parse mint account data");
      }

      const decimals = mintData.parsed.info.decimals;

      // Calculate transfer amount with decimals
      const transferAmount = Math.floor(amount * Math.pow(10, decimals));

      // Get sender's token account
      const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        {
          publicKey,
          signTransaction,
        },
        mintPublicKey,
        publicKey
      );

      console.log(
        "Sender token account:",
        senderTokenAccount.address.toString()
      );

      // Check sender's balance
      const senderAccountInfo = await getAccount(
        connection,
        senderTokenAccount.address
      );
      const senderBalance =
        Number(senderAccountInfo.amount) / Math.pow(10, decimals);

      if (senderBalance < amount) {
        throw new Error(
          `Insufficient token balance. You have ${senderBalance.toFixed(
            decimals
          )} tokens, but trying to send ${amount}`
        );
      }

      // Get or create recipient's token account
      const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        {
          publicKey,
          signTransaction,
        },
        mintPublicKey,
        recipientPublicKey
      );

      console.log(
        "Recipient token account:",
        recipientTokenAccount.address.toString()
      );

      // Transfer tokens
      const signature = await transfer(
        connection,
        {
          publicKey,
          signTransaction,
        },
        senderTokenAccount.address,
        recipientTokenAccount.address,
        publicKey, // owner of sender account
        transferAmount
      );

      console.log("Transfer successful, signature:", signature);

      // Update local token balance if it's a demo token
      const demoToken = demoTokens.find(
        (token) => token.mintAddress === formData.tokenMint
      );
      if (demoToken) {
        updateTokenBalance(formData.tokenMint, demoToken.balance - amount);
      }

      // Add transaction record
      addDemoTransaction({
        type: "Token Transfer",
        status: "success",
        details: {
          mint: formData.tokenMint,
          sender: publicKey.toString(),
          recipient: formData.recipientAddress,
          amount: amount,
          signature: signature,
        },
      });

      setSuccess({
        message: "Tokens sent successfully on blockchain!",
        amount: amount,
        recipient: formData.recipientAddress,
        senderAccount: senderTokenAccount.address.toString(),
        recipientAccount: recipientTokenAccount.address.toString(),
        signature: signature,
        explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
        note: "Transaction completed on Solana Devnet blockchain",
      });

      // Reset form
      setFormData({
        tokenMint: "",
        recipientAddress: "",
        amount: "",
      });
    } catch (err) {
      console.error("Error sending tokens:", err);
      let errorMessage = "Failed to send tokens";

      if (err.message.includes("User rejected")) {
        errorMessage = "Transaction was rejected by user";
      } else if (err.message.includes("insufficient funds")) {
        errorMessage = "Insufficient SOL balance for transaction fees";
      } else if (err.message.includes("Insufficient token balance")) {
        errorMessage = err.message;
      } else if (err.message.includes("Invalid token mint address")) {
        errorMessage = "Invalid or non-existent token mint address";
      } else if (err.message.includes("blockhash")) {
        errorMessage =
          "Transaction failed due to network issues. Please try again.";
      } else {
        errorMessage = `Failed to send tokens: ${err.message}`;
      }

      setError(errorMessage);
    } finally {
      setSending(false);
    }
  };

  if (!connected) {
    return (
      <div className="text-center py-12">
        <Send className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-gray-400">
          You need to connect your wallet to send tokens
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Available Tokens */}
      {demoTokens.length > 0 && (
        <div className="mb-6 bg-gray-800/30 rounded-xl p-4">
          <h4 className="text-white font-medium mb-3">Your Available Tokens</h4>
          <div className="space-y-2">
            {demoTokens.map((token, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {token.symbol.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{token.name}</p>
                    <p className="text-gray-400 text-xs">{token.symbol}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-sm">{token.balance}</span>
                  <button
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        tokenMint: token.mintAddress,
                        amount: token.balance.toString(),
                      }))
                    }
                    className="text-purple-400 hover:text-purple-300 text-xs px-2 py-1 bg-purple-500/20 rounded"
                  >
                    MAX
                  </button>
                  <button
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        tokenMint: token.mintAddress,
                      }))
                    }
                    className="text-purple-400 hover:text-purple-300 text-sm"
                  >
                    Use
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={sendTokens} className="space-y-6">
        {/* Token Mint Address */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Token Mint Address *
          </label>
          <input
            type="text"
            name="tokenMint"
            value={formData.tokenMint}
            onChange={handleInputChange}
            placeholder="Enter token mint address"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            The mint address of the token you want to send
          </p>
        </div>

        {/* Recipient Address */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Recipient Address *
          </label>
          <input
            type="text"
            name="recipientAddress"
            value={formData.recipientAddress}
            onChange={handleInputChange}
            placeholder="Enter recipient wallet address"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            The wallet address to send tokens to
          </p>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Amount to Send *
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="Enter amount"
            min="0"
            step="any"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors"
            required
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-green-400 font-medium mb-2">
                  {success.message}
                </p>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-300">
                    <span className="text-gray-400">Amount:</span>{" "}
                    {success.amount} tokens
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-400">Recipient:</span>{" "}
                    <code className="bg-gray-800 px-2 py-1 rounded text-green-400 break-all">
                      {success.recipient}
                    </code>
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-400">From Account:</span>{" "}
                    <code className="bg-gray-800 px-2 py-1 rounded text-green-400 break-all">
                      {success.senderAccount}
                    </code>
                  </p>
                  <p className="text-gray-300">
                    <span className="text-gray-400">To Account:</span>{" "}
                    <code className="bg-gray-800 px-2 py-1 rounded text-green-400 break-all">
                      {success.recipientAccount}
                    </code>
                  </p>
                  <div className="mt-2">
                    <a
                      href={success.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline text-sm"
                    >
                      View Transaction on Solana Explorer →
                    </a>
                  </div>
                  {success.note && (
                    <p className="text-green-400 text-xs mt-2">
                      {success.note}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={sending || !connected}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {sending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Sending Tokens on Blockchain...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Send Tokens on Blockchain</span>
            </>
          )}
        </button>
      </form>

      {/* Information Box */}
      <div className="mt-8 bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
        <h4 className="text-blue-400 font-medium mb-2">
          Blockchain Transfer Information
        </h4>
        <ul className="text-blue-300 text-sm space-y-1">
          <li>• You can only send tokens you own</li>
          <li>• Requires small amount of SOL for transaction fees</li>
          <li>
            • Recipient will get an associated token account created if needed
          </li>
          <li>• Transfers are permanent and cannot be undone</li>
          <li>• Transaction will be recorded on Solana blockchain</li>
          <li>• Wallet will prompt for transaction approval</li>
        </ul>
      </div>
    </div>
  );
}
