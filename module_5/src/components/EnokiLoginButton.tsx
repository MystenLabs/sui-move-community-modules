import { useCurrentAccount, useConnectWallet, useWallets } from '@mysten/dapp-kit';
import { isEnokiWallet } from '@mysten/enoki';
import { Button, Flex, Text } from '@radix-ui/themes';

export function EnokiLoginButton() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: connectWallet } = useConnectWallet();
  const wallets = useWallets();

  const handleGoogleLogin = async () => {
    try {
      // Find Enoki Google wallet
      const enokiWallets = wallets.filter(isEnokiWallet);
      const googleWallet = enokiWallets.find((wallet: any) => 
        wallet.provider === 'google' || wallet.name?.includes('Google')
      );

      if (!googleWallet) {
        alert('Google zkLogin wallet not found. Make sure Enoki is configured properly.');
        return;
      }

      // Connect with Google zkLogin
      await connectWallet({ wallet: googleWallet });
      console.log('Google zkLogin successful!');
    } catch (error) {
      console.error('Google zkLogin failed:', error);
      alert('Login failed: ' + (error as Error).message);
    }
  };

  if (currentAccount) {
    return (
      <Flex align="center" gap="2">
        <Text size="2" color="green">✓ Connected via zkLogin</Text>
      </Flex>
    );
  }

  return (
    <Flex gap="2">
      <Button
        onClick={handleGoogleLogin}
        variant="solid"
        color="blue"
      >
        Sign in with Google
      </Button>
    </Flex>
  );
}
