"use client";

import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { Coins, Loader2, Check, AlertCircle } from "lucide-react";
import { useTokenContext } from "../dashboard/page";

export default function TokenMinter() {
  const { connected, publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const { demoTokens, updateTokenBalance, addDemoTransaction } =
    useTokenContext();

  const [formData, setFormData] = useState({
    mintAddress: "",
    recipientAddress: "",
    amount: "",
  });

  const [minting, setMinting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const mintTokens = async (e) => {
    e.preventDefault();

    if (!connected || !publicKey || !signTransaction) {
      setError("Please connect your wallet first");
      return;
    }

    if (
      !formData.mintAddress ||
      !formData.recipientAddress ||
      !formData.amount
    ) {
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
      mintPublicKey = new PublicKey(formData.mintAddress);
      recipientPublicKey = new PublicKey(formData.recipientAddress);
    } catch {
      setError("Invalid address format");
      return;
    }

    setMinting(true);
    setError(null);
    setSuccess(null);

    try {
      console.log("Starting minting process...");
      console.log("Mint:", mintPublicKey.toString());
      console.log("Recipient:", recipientPublicKey.toString());
      console.log("Amount:", amount);

      // Get mint info to determine decimals
      const mintInfo = await connection.getParsedAccountInfo(mintPublicKey);
      if (!mintInfo.value) {
        throw new Error("Invalid mint address - mint account not found");
      }

      const mintData = mintInfo.value.data;
      if (!mintData || typeof mintData === "string") {
        throw new Error("Unable to parse mint account data");
      }

      const decimals = mintData.parsed.info.decimals;
      const mintAuthority = mintData.parsed.info.mintAuthority;

      // Check if current wallet is the mint authority
      if (mintAuthority !== publicKey.toString()) {
        throw new Error("You are not the mint authority for this token");
      }

      // Calculate mint amount with decimals
      const mintAmount = Math.floor(amount * Math.pow(10, decimals));

      // Get or create associated token account for recipient
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

      // Mint tokens to recipient
      const signature = await mintTo(
        connection,
        {
          publicKey,
          signTransaction,
        },
        mintPublicKey,
        recipientTokenAccount.address,
        publicKey, // mint authority
        mintAmount
      );

      console.log("Minting successful, signature:", signature);

      // Update token balance if it's a demo token and recipient is current user
      if (recipientPublicKey.equals(publicKey)) {
        const demoToken = demoTokens.find(
          (token) => token.mintAddress === formData.mintAddress
        );
        if (demoToken) {
          updateTokenBalance(formData.mintAddress, demoToken.balance + amount);
        }
      }

      // Add transaction record
      addDemoTransaction({
        type: "Token Mint",
        status: "success",
        details: {
          mint: formData.mintAddress,
          recipient: formData.recipientAddress,
          amount: amount,
          signature: signature,
        },
      });

      setSuccess({
        message: "Tokens minted successfully on blockchain!",
        amount: amount,
        recipient: formData.recipientAddress,
        tokenAccount: recipientTokenAccount.address.toString(),
        signature: signature,
        explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
        note: "Transaction completed on Solana Devnet blockchain",
      });

      // Reset form
      setFormData({
        mintAddress: "",
        recipientAddress: "",
        amount: "",
      });
    } catch (err) {
      console.error("Error minting tokens:", err);
      let errorMessage = "Failed to mint tokens";

      if (err.message.includes("User rejected")) {
        errorMessage = "Transaction was rejected by user";
      } else if (err.message.includes("insufficient funds")) {
        errorMessage = "Insufficient SOL balance for transaction fees";
      } else if (err.message.includes("mint authority")) {
        errorMessage = "You are not authorized to mint this token";
      } else if (err.message.includes("Invalid mint address")) {
        errorMessage = "Invalid or non-existent mint address";
      } else if (err.message.includes("blockhash")) {
        errorMessage =
          "Transaction failed due to network issues. Please try again.";
      } else {
        errorMessage = `Failed to mint tokens: ${err.message}`;
      }

      setError(errorMessage);
    } finally {
      setMinting(false);
    }
  };

  if (!connected) {
    return (
      <div className="text-center py-12">
        <Coins className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-gray-400">
          You need to connect your wallet to mint tokens
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Available Tokens */}
      {demoTokens.length > 0 && (
        <div className="mb-6 bg-gray-800/30 rounded-xl p-4">
          <h4 className="text-white font-medium mb-3">Your Created Tokens</h4>
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
                        mintAddress: token.mintAddress,
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

      <form onSubmit={mintTokens} className="space-y-6">
        {/* Token Mint Address */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Token Mint Address *
          </label>
          <input
            type="text"
            name="mintAddress"
            value={formData.mintAddress}
            onChange={handleInputChange}
            placeholder="Enter token mint address"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            You must be the mint authority to mint tokens
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
          <div className="flex justify-between mt-2">
            <p className="text-xs text-gray-500">
              The wallet address to receive the tokens
            </p>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  recipientAddress: publicKey?.toString() || "",
                }))
              }
              className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
              Use my address
            </button>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Amount to Mint *
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
                    <span className="text-gray-400">Token Account:</span>{" "}
                    <code className="bg-gray-800 px-2 py-1 rounded text-green-400 break-all">
                      {success.tokenAccount}
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
          disabled={minting || !connected}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {minting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Minting Tokens on Blockchain...</span>
            </>
          ) : (
            <>
              <Coins className="w-5 h-5" />
              <span>Mint Tokens on Blockchain</span>
            </>
          )}
        </button>
      </form>

      {/* Information Box */}
      <div className="mt-8 bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
        <h4 className="text-blue-400 font-medium mb-2">
          Blockchain Minting Requirements
        </h4>
        <ul className="text-blue-300 text-sm space-y-1">
          <li>• You must be the mint authority of the token</li>
          <li>• Requires small amount of SOL for transaction fees</li>
          <li>
            • Recipient will get an associated token account created if needed
          </li>
          <li>• Minting is permanent and increases total supply</li>
          <li>• Transaction will be recorded on Solana blockchain</li>
          <li>• Wallet will prompt for transaction approval</li>
        </ul>
      </div>
    </div>
  );
}
