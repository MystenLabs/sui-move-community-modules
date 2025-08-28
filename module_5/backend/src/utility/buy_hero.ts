import { Transaction } from "@mysten/sui/transactions";

export const buyHero = (packageId: string, listHeroId: string, priceInSui: string) => {
  const tx = new Transaction();
  
  const priceInMist = Number(priceInSui) * 1_000_000_000;
  
  const [paymentCoin] = tx.splitCoins(tx.gas, [priceInMist]);

  tx.moveCall({
    target: `${packageId}::hero::buy_hero`,
    typeArguments: [],
    arguments: [tx.object(listHeroId), paymentCoin],
  });

  return tx;
};
