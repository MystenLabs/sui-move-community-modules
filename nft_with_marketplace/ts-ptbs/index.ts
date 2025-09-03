import { Transaction } from '@mysten/sui/transactions'
import { executeTransaction } from './utils'

const PACKAGE =
  '0x9c08c2742ed347588f473a71d2dc015ef7ddf3eea28a034606a95b32c96e8919'
const MARKETPLACE =
  '0xb884376b4cfa30e5a7792ee18f3f99813cdd8d2b54ff13651aa3bda30e6bb430'
const MY_ADDRESS =
  '0x24042ef53b9b743e0aa936e4bd5509a5e606b84901be0a81508c93d33653b59f'

const NFT_PRICE = 1000

/**
 * Mint and burn NFT
 */
async function mintAndBurnNft() {
  console.log('\nMinting and burning NFT')
  const tx = new Transaction()

  const [nft] = tx.moveCall({
    target: `${PACKAGE}::nft::mint`,
    arguments: [tx.pure.string('Sui NFT')],
  })

  tx.moveCall({
    target: `${PACKAGE}::nft::burn`,
    arguments: [nft],
  })

  await executeTransaction(tx)
}

let NFT_TO_BUY: string

/**
 * Mint and list NFT
 */
async function mintAndListNft() {
  console.log('\nMinting and listing NFT')
  const tx = new Transaction()

  const [nft] = tx.moveCall({
    target: `${PACKAGE}::nft::mint`,
    arguments: [tx.pure.string('Sui NFT')],
  })

  tx.moveCall({
    target: `${PACKAGE}::marketplace::list_nft`,
    arguments: [tx.object(MARKETPLACE), nft, tx.pure.u64(NFT_PRICE)],
  })

  const events = await executeTransaction(tx)

  // Don't do this in production
  NFT_TO_BUY = events?.[0]?.parsedJson?.['nft_id']
}

/**
 * Buy and send NFT to self
 */
async function buyAndSendNftToSelf() {
  console.log('\nBuying and sending NFT to self')
  const tx = new Transaction()

  const [gas] = tx.splitCoins(tx.gas, [tx.pure.u64(NFT_PRICE)])

  const [nft] = tx.moveCall({
    target: `${PACKAGE}::marketplace::buy_nft`,
    arguments: [tx.object(MARKETPLACE), tx.object(NFT_TO_BUY), gas],
  })

  tx.transferObjects([nft], MY_ADDRESS)

  await executeTransaction(tx)
}

/**
 * Mint, list, buy, claim payment and transfer to self
 */
async function mintListBuyClaimPaymentAndTransferToSelf() {
  console.log(
    '\nMinting, listing, buying, claiming payment and transferring to self'
  )
  const tx = new Transaction()

  const [mintedNft] = tx.moveCall({
    target: `${PACKAGE}::nft::mint`,
    arguments: [tx.pure.string('Sui NFT')],
  })

  const [nftId] = tx.moveCall({
    target: `0x2::object::id`,
    arguments: [mintedNft],
    typeArguments: [`${PACKAGE}::nft::SimpleNft`],
  })

  tx.moveCall({
    target: `${PACKAGE}::marketplace::list_nft`,
    arguments: [tx.object(MARKETPLACE), mintedNft, tx.pure.u64(NFT_PRICE)],
  })

  const [gas] = tx.splitCoins(tx.gas, [tx.pure.u64(NFT_PRICE)])

  const [boughtNft] = tx.moveCall({
    target: `${PACKAGE}::marketplace::buy_nft`,
    arguments: [tx.object(MARKETPLACE), nftId, gas],
  })

  const [payment] = tx.moveCall({
    target: `${PACKAGE}::marketplace::claim_payments`,
    arguments: [tx.object(MARKETPLACE)],
  })

  tx.transferObjects([boughtNft, payment], MY_ADDRESS)

  await executeTransaction(tx)
}

;(async () => {
  // // 1. Mint and burn NFT
  await mintAndBurnNft()
  // // 2. Mint and list NFT
  await mintAndListNft()
  // // 3. Buy and send NFT to self
  await buyAndSendNftToSelf()
  // 4. Mint, list, buy, burn, claim payment and transfer to self
  await mintListBuyClaimPaymentAndTransferToSelf()
})()
