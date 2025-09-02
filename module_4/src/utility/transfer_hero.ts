import { Transaction } from "@mysten/sui/transactions";

export const transferHero = (packageId: string, heroId: string, to: string) => {
  const tx = new Transaction();

  tx.moveCall({
    target: `${packageId}::hero::transfer_hero`,
    arguments: [
      tx.object(heroId), 
      tx.pure.address(to)
    ],
  });
  
  return tx;
};