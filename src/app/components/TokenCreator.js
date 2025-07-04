"use client";

import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  createInitializeMintInstruction,
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
} from "@solana/spl-token";
import {
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { Plus, Loader2, Check, AlertCircle, Coins } from "lucide-react";
import { useTokenContext } from "../dashboard/page";

export default function TokenCreator() {
  const { connected, publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  const { addDemoToken } = useTokenContext();

  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    decimals: 9,
    initialSupply: 1000000,
    description: "",
  });

  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "decimals" || name === "initialSupply" ? Number(value) : value,
    }));
  };

  const createToken = async (e) => {
    e.preventDefault();

    if (!connected || !publicKey || !signTransaction) {
      setError("Please connect your wallet first");
      return;
    }

    if (!formData.name || !formData.symbol) {
      setError("Name and symbol are required");
      return;
    }

    setCreating(true);
    setError(null);
    setSuccess(null);

    try {
      console.log("Creating token on Solana blockchain...");

      // Generate a new keypair for the mint
      const mintKeypair = Keypair.generate();

      // Get minimum balance for rent exemption
      const lamports = await getMinimumBalanceForRentExemptMint(connection);

      // Create transaction to create the mint account
      const transaction = new Transaction().add(
        // Create account instruction
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID,
        }),
        // Initialize mint instruction
        createInitializeMintInstruction(
          mintKeypair.publicKey,
          formData.decimals,
          publicKey, // mint authority
          publicKey // freeze authority
        )
      );

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign with mint keypair first
      transaction.partialSign(mintKeypair);

      // Sign with wallet
      const signedTransaction = await signTransaction(transaction);

      // Send transaction
      const signature = await connection.sendRawTransaction(
        signedTransaction.serialize()
      );
      await connection.confirmTransaction(signature, "confirmed");

      console.log(
        "Mint created successfully:",
        mintKeypair.publicKey.toString()
      );

      // Create associated token account for the user if initial supply > 0
      let tokenAccount = null;
      if (formData.initialSupply > 0) {
        tokenAccount = await getOrCreateAssociatedTokenAccount(
          connection,
          {
            publicKey,
            signTransaction,
          },
          mintKeypair.publicKey,
          publicKey
        );

        console.log("Token account created:", tokenAccount.address.toString());

        // Mint initial supply to the user's token account
        const mintAmount =
          formData.initialSupply * Math.pow(10, formData.decimals);

        await mintTo(
          connection,
          {
            publicKey,
            signTransaction,
          },
          mintKeypair.publicKey,
          tokenAccount.address,
          publicKey, // mint authority
          mintAmount
        );

        console.log(`Minted ${formData.initialSupply} tokens to user account`);
      }

      // Add token to global state for immediate display
      addDemoToken({
        name: formData.name,
        symbol: formData.symbol,
        decimals: formData.decimals,
        initialSupply: formData.initialSupply,
        description: formData.description,
        mintAddress: mintKeypair.publicKey.toString(),
        balance: formData.initialSupply,
        type: "blockchain", // Mark as real blockchain token
      });

      // Show success message
      setSuccess({
        message: "Token created successfully on Solana blockchain!",
        mintAddress: mintKeypair.publicKey.toString(),
        tokenAccount: tokenAccount ? tokenAccount.address.toString() : null,
        explorerUrl: `https://explorer.solana.com/address/${mintKeypair.publicKey.toString()}?cluster=devnet`,
        note: "This is a real token created on Solana Devnet blockchain",
      });

      // Reset form
      setFormData({
        name: "",
        symbol: "",
        decimals: 9,
        initialSupply: 1000000,
        description: "",
      });
    } catch (err) {
      console.error("Error creating token:", err);
      let errorMessage = "Failed to create token";

      if (
        err.message.includes("User rejected") ||
        err.message.includes("rejected")
      ) {
        errorMessage = "Transaction was rejected by user";
      } else if (
        err.message.includes("insufficient funds") ||
        err.message.includes("0x1")
      ) {
        errorMessage =
          "Insufficient SOL balance for transaction fees (~0.002 SOL required)";
      } else if (
        err.message.includes("blockhash") ||
        err.message.includes("timeout")
      ) {
        errorMessage =
          "Transaction failed due to network issues. Please try again.";
      } else if (err.message.includes("not connected")) {
        errorMessage =
          "Wallet not properly connected. Please reconnect your wallet.";
      } else {
        errorMessage = `Failed to create token: ${err.message}`;
      }

      setError(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  if (!connected) {
    return (
      <div className="text-center py-12">
        <Coins className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-black mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-gray-600">
          You need to connect your wallet to create tokens on the blockchain
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={createToken} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Token Name */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Token Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="My Amazing Token"
              className="w-full bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:bg-white/90 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all"
              required
            />
          </div>

          {/* Token Symbol */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Token Symbol *
            </label>
            <input
              type="text"
              name="symbol"
              value={formData.symbol}
              onChange={handleInputChange}
              placeholder="MAT"
              className="w-full bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:bg-white/90 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all uppercase"
              maxLength="10"
              required
            />
          </div>

          {/* Decimals */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Decimals
            </label>
            <input
              type="number"
              name="decimals"
              value={formData.decimals}
              onChange={handleInputChange}
              min="0"
              max="18"
              className="w-full bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:bg-white/90 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all"
            />
            <p className="text-xs text-gray-600 mt-1">
              Number of decimal places (0-18)
            </p>
          </div>

          {/* Initial Supply */}
          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Initial Supply
            </label>
            <input
              type="number"
              name="initialSupply"
              value={formData.initialSupply}
              onChange={handleInputChange}
              min="0"
              className="w-full bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:bg-white/90 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all"
            />
            <p className="text-xs text-gray-600 mt-1">
              Initial tokens to mint to your wallet
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Describe your token..."
            rows="3"
            className="w-full bg-white/80 backdrop-blur-sm rounded-lg px-4 py-3 text-black placeholder-gray-500 focus:bg-white/90 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all resize-none"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 backdrop-blur-sm rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-500/10 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-green-400 font-medium mb-2">
                  {success.message}
                </p>
                <div className="space-y-1 text-sm">
                  <p className="text-black">
                    <span className="text-gray-600">Mint Address:</span>{" "}
                    <code className="bg-gray-200/50 px-2 py-1 rounded text-green-600 break-all">
                      {success.mintAddress}
                    </code>
                  </p>
                  <p className="text-black">
                    <span className="text-gray-600">Token Account:</span>{" "}
                    <code className="bg-gray-200/50 px-2 py-1 rounded text-green-600 break-all">
                      {success.tokenAccount}
                    </code>
                  </p>
                  <div className="mt-2">
                    <a
                      href={success.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 underline text-sm"
                    >
                      View on Solana Explorer →
                    </a>
                  </div>
                  {success.note && (
                    <p className="text-green-600 text-xs mt-2">
                      {success.note}
                    </p>
                  )}
                </div>
                <div className="mt-3 text-sm">
                  <p className="text-green-600">
                    ✓ Token created on blockchain and added to your wallet
                    balance
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button - Changed to light beige */}
        <button
          type="submit"
          disabled={creating || !connected}
          className="w-full bg-gradient-to-r from-amber-100/80 to-yellow-100/80 backdrop-blur-sm text-amber-900 py-4 px-6 rounded-lg font-semibold hover:from-amber-200/80 hover:to-yellow-200/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
        >
          {creating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Creating Token on Blockchain...</span>
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>Create Token on Blockchain</span>
            </>
          )}
        </button>
      </form>

      {/* Information Box */}
      <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm">
        <h4 className="text-black font-medium mb-2">
          Blockchain Token Creation
        </h4>
        <ul className="text-black text-sm space-y-1 opacity-80">
          <li>
            • Requires ~0.002 SOL for mint account creation and transaction fees
          </li>
          <li>
            • You will be the mint authority and can mint more tokens later
          </li>
          <li>• Token will be created on Solana Devnet blockchain</li>
          <li>• Wallet will prompt for transaction approval</li>
          <li>
            • Created tokens will appear in your wallet balance immediately
          </li>
          <li>• Transaction can be verified on Solana Explorer</li>
        </ul>
      </div>
    </div>
  );
}
