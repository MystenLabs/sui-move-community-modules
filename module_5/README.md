## Module 5 — Hero NFT Marketplace (zkLogin + Sponsored Gas dApp)

A comprehensive full-stack decentralized application for creating, listing, buying, and transferring Hero NFTs on the Sui blockchain. This marketplace features sponsored transactions powered by Enoki, providing gasless interactions for users with zkLogin authentication.

### What's inside

This module consists of three main components:

#### **Smart Contract** (Sui Move)
- **Module**: `module_3::hero` (from Module 3)
- **Structs**:
  - **Hero**: NFT with `name`, `image_url`, `power`
  - **ListHero**: Shared listing object for marketplace functionality
- **Functions**: `create_hero`, `list_hero`, `buy_hero`, `transfer_hero`

#### **Backend** 
- **Express API server** with comprehensive logging
- **Sponsored transactions** using Enoki SDK
- **Real-time transaction monitoring** with structured logs
- **Endpoints**:
  - `POST /api/create-hero` — Create a new Hero NFT
  - `POST /api/list-hero` — List Hero for sale
  - `POST /api/buy-hero` — Purchase a listed Hero
  - `POST /api/transfer-hero` — Transfer Hero to another address
  - `POST /api/execute-transaction` — Execute sponsored transactions

#### **Frontend** (React + TypeScript + Vite)
- **Modern React application** with Radix UI components
- **Enoki wallet integration** with zkLogin
- **Real-time marketplace** with hero listings
- **Transaction history** and event tracking
- **Components**:
  - Hero creation form with image url
  - Owned heroes management
  - Marketplace listings 
  - Transaction history viewer
  - Wallet status dashboard

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** or **yarn** package manager
- **Enoki account** with API keys (private + public)
- **zkLogin credentials** for wallet authentication
- **Deployed Hero smart contract** package ID

### Setup Instructions

#### 1. Backend Setup

Navigate to the backend directory:
```bash
cd module_5/backend
```

Install dependencies:
```bash
npm install
```

Copy and configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` file with your credentials:
```env
# Enoki private key for sponsored transactions
ENOKI_PRIVATE_KEY=your_enoki_private_key_here

# Optional: Server configuration
PORT=3001
NODE_ENV=development
```

#### 2. Frontend Setup

Navigate to the frontend directory:
```bash
cd module_5/frontend
```

Install dependencies:
```bash
npm install
```

Copy and configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
# Enoki public key for wallet integration
VITE_ENOKI_PUBLIC_KEY=your_enoki_public_key_here

# Google client ID for authentication
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here

# Deployed smart contract package ID
VITE_PACKAGE_ID=your_package_id_here

# Backend API URL (optional, defaults to localhost:3001)
VITE_BACKEND_URL=http://localhost:3001
```

### Running the Application

#### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:3001` with structured logging:

```
2025-08-30 13:24:50 [info]: Hero Marketplace Backend started {
  "service": "hero-marketplace-backend",
  "port": "3001",
  "environment": "development",
  "network": "testnet"
}
```

#### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

### API Endpoints

All endpoints accept JSON payloads and return transaction data for sponsored execution:

#### `POST /api/create-hero`
```json
{
  "sender": "0x...",
  "packageId": "0x...",
  "name": "Lightning Hero",
  "imageUrl": "https://...",
  "power": "850"
}
```

#### `POST /api/list-hero`
```json
{
  "sender": "0x...",
  "packageId": "0x...",
  "heroId": "0x...",
  "price": "5000000000"
}
```

#### `POST /api/buy-hero`
```json
{
  "sender": "0x...",
  "packageId": "0x...",
  "paymentCoinObject": "0x...",
  "listHeroId": "0x...",
  "price": "5000000000"
}
```

#### `POST /api/transfer-hero`
```json
{
  "sender": "0x...",
  "packageId": "0x...",
  "heroId": "0x...",
  "recipient": "0x..."
}
```

### Transaction Logging


Example log output:
```
2025-08-30 13:25:15 [info]: Transaction CREATE_HERO initiated {
  "service": "hero-marketplace-backend",
  "operation": "CREATE_HERO",
  "sender": "0xb532...1d63",
  "status": "INITIATED",
  "details": {
    "name": "Ercan",
    "power": "200",
    "imageUrl": "..."
  }
}
```

