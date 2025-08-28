import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { EnokiClient } from '@mysten/enoki';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { toBase64 } from '@mysten/sui/utils';
import { createHero } from './utility/create_hero';
import { listHero } from './utility/list_hero';
import { buyHero } from './utility/buy_hero';
import { transferHero } from './utility/transfer_hero';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize clients
const suiClient = new SuiClient({ url: getFullnodeUrl('testnet') });
const enokiClient = new EnokiClient({
  apiKey: process.env.ENOKI_PRIVATE_KEY!
});

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Hero Marketplace Backend' });
});

// Create Hero - Sponsored Transaction
app.post('/api/create-hero', async (req, res) => {
  try {
    const { sender, packageId, name, imageUrl, power } = req.body;

    const tx = createHero(packageId, name, imageUrl, power);

    const txBytes = await tx.build({
      client: suiClient,
      onlyTransactionKind: true,
    });

    const sponsored = await enokiClient.createSponsoredTransaction({
      network: 'testnet',
      transactionKindBytes: toBase64(txBytes),
      sender,
      allowedMoveCallTargets: [`${packageId}::hero::create_hero`],
    });

    res.json({ 
      bytes: sponsored.bytes, 
      digest: sponsored.digest 
    });
  } catch (error) {
    console.error('Create hero error:', error);
    res.status(500).json({ error: 'Failed to create sponsored transaction' });
  }
});

// List Hero - Sponsored Transaction  
app.post('/api/list-hero', async (req, res) => {
  try {
    const { sender, packageId, heroId, price } = req.body;

    const tx = listHero(packageId, heroId, price);

    const txBytes = await tx.build({
      client: suiClient,
      onlyTransactionKind: true,
    });

    const sponsored = await enokiClient.createSponsoredTransaction({
      network: 'testnet',
      transactionKindBytes: toBase64(txBytes),
      sender,
      allowedMoveCallTargets: [`${packageId}::hero::list_hero`],
    });

    res.json({ 
      bytes: sponsored.bytes, 
      digest: sponsored.digest 
    });
  } catch (error) {
    console.error('List hero error:', error);
    res.status(500).json({ error: 'Failed to create sponsored transaction' });
  }
});

// Buy Hero - Sponsored Transaction
app.post('/api/buy-hero', async (req, res) => {
  try {
    const { sender, packageId, listHeroId, price } = req.body;

    const tx = buyHero(packageId, listHeroId, price);

    const txBytes = await tx.build({
      client: suiClient,
      onlyTransactionKind: true,
    });

    const sponsored = await enokiClient.createSponsoredTransaction({
      network: 'testnet',
      transactionKindBytes: toBase64(txBytes),
      sender,
      allowedMoveCallTargets: [`${packageId}::hero::buy_hero`],
    });

    res.json({ 
      bytes: sponsored.bytes, 
      digest: sponsored.digest 
    });
  } catch (error) {
    console.error('Buy hero error:', error);
    res.status(500).json({ error: 'Failed to create sponsored transaction' });
  }
});

// Transfer Hero - Sponsored Transaction
app.post('/api/transfer-hero', async (req, res) => {
  try {
    const { sender, packageId, heroId, recipient } = req.body;

    const tx = transferHero(packageId, heroId, recipient);

    const txBytes = await tx.build({
      client: suiClient,
      onlyTransactionKind: true,
    });

    const sponsored = await enokiClient.createSponsoredTransaction({
      network: 'testnet',
      transactionKindBytes: toBase64(txBytes),
      sender,
      allowedMoveCallTargets: [`${packageId}::hero::transfer_hero`],
      allowedAddresses: [recipient],
    });

    res.json({ 
      bytes: sponsored.bytes, 
      digest: sponsored.digest 
    });
  } catch (error) {
    console.error('Transfer hero error:', error);
    res.status(500).json({ error: 'Failed to create sponsored transaction' });
  }
});

// Execute Sponsored Transaction
app.post('/api/execute-transaction', async (req, res) => {
  try {
    const { digest, signature } = req.body;

    const result = await enokiClient.executeSponsoredTransaction({
      digest,
      signature,
    });

    res.json({ result });
  } catch (error) {
    console.error('Execute transaction error:', error);
    res.status(500).json({ error: 'Failed to execute transaction' });
  }
});

app.listen(PORT, () => {
  console.log(`Hero Marketplace Backend running on port ${PORT}`);
});
