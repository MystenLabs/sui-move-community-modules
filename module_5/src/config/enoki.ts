export const ENOKI_CONFIG = {
  publicKey: import.meta.env.VITE_ENOKI_PUBLIC_KEY,
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001',
  packageId: import.meta.env.VITE_PACKAGE_ID,
};

// Validate required environment variables
const requiredEnvVars = [
  'VITE_ENOKI_PUBLIC_KEY',
  'VITE_GOOGLE_CLIENT_ID', 
  'VITE_PACKAGE_ID'
];

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);

if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars);
  console.error('Please copy .env.example to .env and fill in the required values');
}
