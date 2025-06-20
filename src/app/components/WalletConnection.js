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
              <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
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
        <WalletMultiButton className="!bg-gradient-to-r !from-purple-500 !to-pink-500 hover:!from-purple-600 hover:!to-pink-600 !rounded-lg !transition-all !duration-200 !border-none !text-white !font-medium !text-sm !px-4 !py-2" />
      </div>
    </div>
  );
}
