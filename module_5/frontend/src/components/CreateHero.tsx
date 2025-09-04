import { useCurrentAccount, useSignTransaction } from "@mysten/dapp-kit";
import { Flex, Heading, Text, Card, Button, TextField } from "@radix-ui/themes";
import { useState } from "react";
import { createHeroAPI, executeTransactionAPI } from "../utils/api";
import { useNetworkVariable } from "../networkConfig";
import { RefreshProps } from "../types/props";

export function CreateHero({ setRefreshKey }: RefreshProps) {
  const account = useCurrentAccount();
  const packageId = useNetworkVariable("packageId");
  const { mutateAsync: signTransaction } = useSignTransaction();

  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [power, setPower] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateHero = async () => {
    if (!account || !packageId || !name.trim() || !imageUrl.trim() || !power.trim()) return;
    
    setIsCreating(true);
    
    try {
      // 1. Get sponsored transaction from backend
      const sponsored = await createHeroAPI(account.address, packageId, name, imageUrl, power);
      
      // 2. Sign the transaction
      const { signature } = await signTransaction({
        transaction: sponsored.bytes,
      });

      if (!signature) {
        throw new Error('Failed to sign transaction');
      }

      // 3. Execute the sponsored transaction
      await executeTransactionAPI(sponsored.digest, signature);
      
      console.log("Hero created successfully!");
      setName("");
      setImageUrl("");
      setPower("");
      setRefreshKey(Date.now());
    } catch (error) {
      console.error("Error creating hero:", error);
      alert("Failed to create hero: " + (error as Error).message);
    } finally {
      setIsCreating(false);
    }
  };

  const isFormValid = name.trim() && imageUrl.trim() && power.trim() && Number(power) > 0;

  if (!account) {
    return (
      <Card>
        <Text>Please connect your wallet to create heroes</Text>
      </Card>
    );
  }

  return (
    <Card style={{ padding: "20px" }}>
      <Flex direction="column" gap="4">
        <Heading size="6">Create New Hero</Heading>
        
        <Flex direction="column" gap="3">
          <Flex direction="column" gap="2">
            <Text size="3" weight="medium">Hero Name</Text>
            <TextField.Root
              placeholder="Enter hero name (e.g., Fire Dragon)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Flex>

          <Flex direction="column" gap="2">
            <Text size="3" weight="medium">Image URL</Text>
            <TextField.Root
              placeholder="Enter image URL (e.g., https://example.com/hero.jpg)"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </Flex>

          <Flex direction="column" gap="2">
            <Text size="3" weight="medium">Power Level</Text>
            <TextField.Root
              placeholder="Enter power level (e.g., 100)"
              type="number"
              min="1"
              value={power}
              onChange={(e) => setPower(e.target.value)}
            />
          </Flex>

          <Button 
            onClick={handleCreateHero}
            disabled={!isFormValid || isCreating}
            size="3"
            loading={isCreating}
            style={{ marginTop: "8px" }}
          >
            {isCreating ? "Creating Hero..." : "Create Hero"}
          </Button>
        </Flex>

        {/* Preview */}
        {name && imageUrl && power && (
          <Card style={{ padding: "16px", background: "var(--gray-a2)" }}>
            <Flex direction="column" gap="2">
              <Text size="3" weight="medium" color="gray">Preview:</Text>
              <Text size="4">{name} (Power: {power})</Text>
              {imageUrl && (
                <img 
                  src={imageUrl} 
                  alt={name}
                  style={{ 
                    width: "120px", 
                    height: "80px", 
                    objectFit: "cover", 
                    borderRadius: "6px" 
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
            </Flex>
          </Card>
        )}
      </Flex>
    </Card>
  );
}
