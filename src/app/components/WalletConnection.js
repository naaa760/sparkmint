"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Wallet, CheckCircle, AlertCircle } from "lucide-react";

export default function WalletConnection() {
  const { wallet, connected, connecting, publicKey } = useWallet();

  return (
    <div className="flex items-center space-x-4">
      {/* Connection Status */}
      <div className="hidden sm:flex items-center space-x-2">
        {connected ? (
          <>
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm text-green-400 font-medium">
              Connected
            </span>
            {publicKey && (
              <span className="text-xs text-amber-800 bg-amber-100/80 px-2 py-1 rounded-lg border border-amber-200">
                {`${publicKey.toString().slice(0, 4)}...${publicKey
                  .toString()
                  .slice(-4)}`}
              </span>
            )}
          </>
        ) : connecting ? (
          <>
            <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-yellow-400 font-medium">
              Connecting...
            </span>
          </>
        ) : (
          <>
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400 font-medium">
              Not Connected
            </span>
          </>
        )}
      </div>

      {/* Wallet Button */}
      <div className="wallet-adapter-button-trigger">
        <WalletMultiButton
          style={{
            backgroundColor: "#fef3c7",
            backgroundImage: "linear-gradient(to right, #fef3c7, #fef08a)",
            color: "#78350f",
            borderRadius: "1rem",
            border: "none",
            fontWeight: "500",
            fontSize: "0.875rem",
            padding: "0.5rem 1rem",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            transition: "all 0.2s ease-in-out",
          }}
          className="!bg-gradient-to-r !from-amber-100 !to-yellow-100 hover:!from-amber-200 hover:!to-yellow-200 !rounded-2xl !transition-all !duration-200 !border-none !text-amber-900 !font-medium !text-sm !px-4 !py-2 !shadow-sm hover:!shadow-md [&>*]:!text-amber-900 [&]:hover:!bg-amber-200 [&]:!border-0"
        />
      </div>
    </div>
  );
}
