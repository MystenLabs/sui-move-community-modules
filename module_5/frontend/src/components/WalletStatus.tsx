import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
import { Flex, Text, Card } from "@radix-ui/themes";

export function WalletStatus() {
  const account = useCurrentAccount();

  const { data: balance } = useSuiClientQuery(
    "getBalance",
    {
      owner: account?.address as string,
    },
    {
      enabled: !!account,
    }
  );

  if (!account) {
    return (
      <Card>
        <Text>Please connect your wallet to continue</Text>
      </Card>
    );
  }

  return (
    <Card>
      <Flex direction="column" gap="2">
        <Text size="4" weight="bold">Wallet Status</Text>
        <Text>Address: {account.address}</Text>
        <Text>
          Balance: {balance ? Number(balance.totalBalance) / 1_000_000_000 : "Loading..."} SUI
        </Text>
      </Flex>
    </Card>
  );
}