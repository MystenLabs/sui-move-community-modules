const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// Simple API call helper
export async function makeApiCall(endpoint: string, data: any) {
  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
}

// Hero operations
export async function createHeroAPI(sender: string, packageId: string, name: string, imageUrl: string, power: string) {
  return makeApiCall('/api/create-hero', { sender, packageId, name, imageUrl, power });
}

export async function listHeroAPI(sender: string, packageId: string, heroId: string, price: string) {
  return makeApiCall('/api/list-hero', { sender, packageId, heroId, price });
}

export async function buyHeroAPI(sender: string, packageId: string, paymentCoinObject: string, listHeroId: string, price: string) {
  return makeApiCall('/api/buy-hero', { sender, packageId, paymentCoinObject, listHeroId, price });
}

export async function transferHeroAPI(sender: string, packageId: string, heroId: string, recipient: string) {
  return makeApiCall('/api/transfer-hero', { sender, packageId, heroId, recipient });
}

export async function executeTransactionAPI(digest: string, signature: string) {
  return makeApiCall('/api/execute-transaction', { digest, signature });
}
