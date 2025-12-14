"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { base } from "wagmi/chains";
import { createConfig, http } from "wagmi";
import { coinbaseWallet } from "wagmi/connectors";
import { useState, useEffect } from "react";
import { useConnect, useAccount } from "wagmi";

export function MiniKitProvider({ children }: { children: React.ReactNode }) {
  // QueryClient oluştur (her render'da yeni instance oluşturmamak için)
  const [queryClient] = useState(() => new QueryClient());

  // Wagmi config - Base chain için
  // Base App içinde açıldığında Base Account otomatik olarak bağlanır
  const [config] = useState(() =>
    createConfig({
      chains: [base],
      connectors: [
        coinbaseWallet({
          appName: "Harita Uygulamasi",
          appLogoUrl: typeof window !== "undefined" ? `${window.location.origin}/logo.png` : "",
        }),
      ],
      transports: {
        [base.id]: http(),
      },
    })
  );

  // Auto-connect component - Base App içinde otomatik bağlan
  function AutoConnect() {
    const { connect, connectors } = useConnect();
    const { isConnected } = useAccount();
    
    useEffect(() => {
      // Base App içinde açıldığında otomatik bağlan
      // Base App, window.coinbaseSDK veya window.ethereum üzerinden otomatik bağlanır
      if (!isConnected && typeof window !== "undefined") {
        // Base App içinde mi kontrol et
        const isBaseApp = 
          (window as any).coinbaseSDK || 
          (window as any).ethereum?.isCoinbaseWallet ||
          navigator.userAgent.includes("BaseApp");
        
        if (isBaseApp && connectors.length > 0) {
          // Coinbase Wallet connector'ını bul ve bağlan
          const coinbaseConnector = connectors.find(
            (c) => c.id === "coinbaseWallet" || c.name === "Coinbase Wallet"
          );
          if (coinbaseConnector) {
            connect({ connector: coinbaseConnector });
          }
        }
      }
    }, [isConnected, connectors, connect]);

    return null;
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AutoConnect />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

