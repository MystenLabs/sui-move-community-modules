import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "@mysten/dapp-kit/dist/index.css";
import "@radix-ui/themes/styles.css";

import { SuiClientProvider, useSuiClientContext, WalletProvider } from "@mysten/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Theme } from "@radix-ui/themes";
import App from "./App.tsx";
import { networkConfig } from "./networkConfig.ts";
import { isEnokiNetwork, registerEnokiWallets } from "@mysten/enoki";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme appearance="dark">
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
          <RegisterEnokiWallets />
          <WalletProvider>
            <App />
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </Theme>
  </React.StrictMode>,
);

function RegisterEnokiWallets() {
	const { client, network } = useSuiClientContext();
 
	useEffect(() => {
		if (!isEnokiNetwork(network)) return;
 
		const { unregister } = registerEnokiWallets({
			apiKey: import.meta.env.VITE_ENOKI_PUBLIC_KEY,
			providers: {
				google: {
					clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
				},
			},
			client: client as any,
			network,
		});
 
		return unregister;
	}, [client, network]);
 
	return null;
}
