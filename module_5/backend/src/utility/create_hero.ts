import { Transaction } from "@mysten/sui/transactions";

export const createHero = (packageId: string, name: string, imageUrl: string, power: string) => {
  const tx = new Transaction();
  
  tx.moveCall({
    target: `${packageId}::hero::create_hero`,
    typeArguments: [],
    arguments: [tx.pure.string(name), tx.pure.string(imageUrl), tx.pure.u64(Number(power))],
  });
  
  return tx;
};
