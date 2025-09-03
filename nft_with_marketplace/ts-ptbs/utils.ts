import 'dotenv/config'
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'
import { Transaction } from '@mysten/sui/transactions'
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client'

const rpcUrl = getFullnodeUrl('testnet')
const client = new SuiClient({ url: rpcUrl })

export const getSigner = () => {
  const secretKey = process.env.SUI_PRIVATE_KEY
  if (!secretKey) throw new Error('SUI_PRIVATE_KEY is not set')

  return Ed25519Keypair.fromSecretKey(secretKey)
}

export async function executeTransaction(tx: Transaction) {
  const { digest } = await client.signAndExecuteTransaction({
    signer: getSigner(),
    transaction: tx,
  })
  console.log(`Transaction executed: ${digest}`)

  const { events } = await client.waitForTransaction({
    digest,
    options: { showEvents: true },
  })
  console.log(
    `Transaction confirmed, can view on https://testnet.suivision.xyz/txblock/${digest} \n`
  )

  return events
}
