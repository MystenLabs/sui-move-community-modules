import { SuiClient } from "@mysten/sui/client";
import { CoinStruct } from "@mysten/sui/client";

export interface SuiCoin {
  coinObjectId: string;
  balance: string;
  balanceNumber: number;
}

/**
 * Fetch SUI coins from user's wallet
 */
export async function fetchSuiCoins(suiClient: SuiClient, address: string): Promise<SuiCoin[]> {
  try {
    const coins = await suiClient.getCoins({
      owner: address,
      coinType: "0x2::sui::SUI",
    });

    return coins.data.map((coin: CoinStruct) => ({
      coinObjectId: coin.coinObjectId,
      balance: coin.balance,
      balanceNumber: parseInt(coin.balance, 10),
    }));
  } catch (error) {
    console.error("Error fetching SUI coins:", error);
    return [];
  }
}

/**
 * Find a suitable SUI coin for payment
 * Returns the first coin that has enough balance for the required amount
 */
export function findSuitableCoin(coins: SuiCoin[], requiredAmountInMist: number): SuiCoin | null {
  // Sort coins by balance (largest first) to use the most suitable coin
  const sortedCoins = [...coins].sort((a, b) => b.balanceNumber - a.balanceNumber);
  
  // Find the first coin that has enough balance
  const suitableCoin = sortedCoins.find(coin => coin.balanceNumber >= requiredAmountInMist);
  
  return suitableCoin || null;
}

/**
 * Convert SUI amount to MIST (1 SUI = 1,000,000,000 MIST)
 */
export function suiToMist(suiAmount: number): number {
  return Math.floor(suiAmount * 1_000_000_000);
}

