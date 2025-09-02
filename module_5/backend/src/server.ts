import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { EnokiClient } from '@mysten/enoki';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { toBase64 } from '@mysten/sui/utils';
import { createHero } from './utility/create_hero';
import { listHero } from './utility/list_hero';
import { buyHero } from './utility/buy_hero';
import { transferHero } from './utility/transfer_hero';
import { logTransaction, logRequest, logServer, logError } from './helpers/logger';

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

// Request logging middleware
app.use((req, res, next) => {
  logRequest(req.method, req.path, req.headers['user-agent']);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Hero Marketplace Backend' });
});

// Create Hero - Sponsored Transaction
app.post('/api/create-hero', async (req, res) => {
  try {
    const { sender, packageId, name, imageUrl, power } = req.body;

    logTransaction('CREATE_HERO', sender, {
      name,
      power,
      imageUrl: imageUrl?.slice(0, 50) + '...'
    });

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

    logTransaction('CREATE_HERO', sender, {
      name,
      power,
      digest: sponsored.digest
    }, 'SUCCESS');

    res.json({ 
      bytes: sponsored.bytes, 
      digest: sponsored.digest 
    });
  } catch (error) {
    logError('Create hero transaction failed', error, {
      sender: req.body.sender,
      name: req.body.name
    });
    
    logTransaction('CREATE_HERO', req.body.sender || 'unknown', {
      name: req.body.name,
      error: error instanceof Error ? error.message : String(error)
    }, 'ERROR');

    res.status(500).json({ error: 'Failed to create sponsored transaction' });
  }
});

// List Hero - Sponsored Transaction  
app.post('/api/list-hero', async (req, res) => {
  try {
    const { sender, packageId, heroId, price } = req.body;

    logTransaction('LIST_HERO', sender, {
      heroId: `${heroId.slice(0, 8)}...${heroId.slice(-4)}`,
      price: `${price} SUI`
    });

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

    logTransaction('LIST_HERO', sender, {
      heroId: `${heroId.slice(0, 8)}...${heroId.slice(-4)}`,
      price: `${price} SUI`,
      digest: sponsored.digest
    }, 'SUCCESS');

    res.json({ 
      bytes: sponsored.bytes, 
      digest: sponsored.digest 
    });
  } catch (error) {
    logError('List hero transaction failed', error, {
      sender: req.body.sender,
      heroId: req.body.heroId
    });
    
    logTransaction('LIST_HERO', req.body.sender || 'unknown', {
      heroId: req.body.heroId,
      price: req.body.price,
      error: error instanceof Error ? error.message : String(error)
    }, 'ERROR');

    res.status(500).json({ error: 'Failed to create sponsored transaction' });
  }
});

// Buy Hero - Sponsored Transaction
app.post('/api/buy-hero', async (req, res) => {
  try {
    const { sender, packageId, paymentCoinObject, listHeroId, price } = req.body;

    logTransaction('BUY_HERO', sender, {
      listHeroId: `${listHeroId.slice(0, 8)}...${listHeroId.slice(-4)}`,
      price: `${price} SUI`,
      paymentCoin: `${paymentCoinObject.slice(0, 8)}...${paymentCoinObject.slice(-4)}`
    });

    const tx = buyHero(packageId, paymentCoinObject, listHeroId, price);

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

    logTransaction('BUY_HERO', sender, {
      listHeroId: `${listHeroId.slice(0, 8)}...${listHeroId.slice(-4)}`,
      price: `${price} SUI`,
      digest: sponsored.digest
    }, 'SUCCESS');

    res.json({ 
      bytes: sponsored.bytes, 
      digest: sponsored.digest 
    });
  } catch (error) {
    logError('Buy hero transaction failed', error, {
      sender: req.body.sender,
      listHeroId: req.body.listHeroId,
      price: req.body.price
    });
    
    logTransaction('BUY_HERO', req.body.sender || 'unknown', {
      listHeroId: req.body.listHeroId,
      price: req.body.price,
      error: error instanceof Error ? error.message : String(error)
    }, 'ERROR');

    res.status(500).json({ error: 'Failed to create sponsored transaction' });
  }
});

// Transfer Hero - Sponsored Transaction
app.post('/api/transfer-hero', async (req, res) => {
  try {
    const { sender, packageId, heroId, recipient } = req.body;

    logTransaction('TRANSFER_HERO', sender, {
      heroId: `${heroId.slice(0, 8)}...${heroId.slice(-4)}`,
      recipient: `${recipient.slice(0, 6)}...${recipient.slice(-4)}`
    });

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

    logTransaction('TRANSFER_HERO', sender, {
      heroId: `${heroId.slice(0, 8)}...${heroId.slice(-4)}`,
      recipient: `${recipient.slice(0, 6)}...${recipient.slice(-4)}`,
      digest: sponsored.digest
    }, 'SUCCESS');

    res.json({ 
      bytes: sponsored.bytes, 
      digest: sponsored.digest 
    });
  } catch (error) {
    logError('Transfer hero transaction failed', error, {
      sender: req.body.sender,
      heroId: req.body.heroId,
      recipient: req.body.recipient
    });
    
    logTransaction('TRANSFER_HERO', req.body.sender || 'unknown', {
      heroId: req.body.heroId,
      recipient: req.body.recipient,
      error: error instanceof Error ? error.message : String(error)
    }, 'ERROR');

    res.status(500).json({ error: 'Failed to create sponsored transaction' });
  }
});

// Execute Sponsored Transaction
app.post('/api/execute-transaction', async (req, res) => {
  try {
    const { digest, signature } = req.body;

    logServer('Executing sponsored transaction', {
      digest: `${digest.slice(0, 8)}...${digest.slice(-4)}`
    });

    const result = await enokiClient.executeSponsoredTransaction({
      digest,
      signature,
    });

    logServer('Transaction executed successfully', {
      digest: `${digest.slice(0, 8)}...${digest.slice(-4)}`,
      status: (result as any).effects?.status?.status
    });

    res.json({ result });
  } catch (error) {
    logError('Execute transaction failed', error, {
      digest: req.body.digest
    });

    res.status(500).json({ error: 'Failed to execute transaction' });
  }
});

app.listen(PORT, () => {
  logServer('Hero Marketplace Backend started', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    network: 'testnet'
  });
});
