import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      variables: {
        packageId: "", // TODO: Get package ID from instructor
      },
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        packageId: import.meta.env.VITE_PACKAGE_ID, // TODO: Get package ID from instructor
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: {
        packageId: "", // TODO: Get package ID from instructor
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
