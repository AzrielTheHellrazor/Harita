"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { base } from "wagmi/chains";
import { createConfig, http } from "wagmi";
import { baseAccount } from "wagmi/connectors";
import { useState, useEffect } from "react";
import { useConnect } from "wagmi";

export function MiniKitProvider({ children }: { children: React.ReactNode }) {
  // QueryClient oluştur (her render'da yeni instance oluşturmamak için)
  const [queryClient] = useState(() => new QueryClient());

  // Wagmi config - Base chain için
  // Base App içinde açıldığında Base Account otomatik olarak bağlanır
  const [config] = useState(() =>
    createConfig({
      chains: [base],
      connectors: [
        baseAccount({
          appName: "Harita Uygulamasi",
          appLogoUrl: typeof window !== "undefined" ? `${window.location.origin}/logo.png` : "",
        }),
      ],
      transports: {
        [base.id]: http(),
      },
    })
  );

  // Auto-connect component
  function AutoConnect() {
    const { connect, connectors, isConnected } = useConnect();
    
    useEffect(() => {
      // Base App içinde açıldığında otomatik bağlan
      if (!isConnected && connectors.length > 0) {
        const baseAccountConnector = connectors.find(
          (c) => c.type === "baseAccount" || c.id === "baseAccount"
        );
        if (baseAccountConnector) {
          connect({ connector: baseAccountConnector });
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

