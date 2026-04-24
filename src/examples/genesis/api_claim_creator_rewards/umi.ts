// [IMPORTS]
import { claimCreatorRewards } from '@metaplex-foundation/genesis'
import { base58 } from '@metaplex-foundation/umi/serializers'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { keypairIdentity } from '@metaplex-foundation/umi'
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com')
const keypair = umi.eddsa.createKeypairFromSecretKey(mySecretKeyBytes)
umi.use(keypairIdentity(keypair))
// [/SETUP]

// [MAIN]
const result = await claimCreatorRewards(umi, {}, {
  wallet: umi.identity.publicKey,
  network: 'solana-mainnet',
  // payer is optional — defaults to `wallet` on the server.
  // Set it to have a different wallet cover rent and transaction fees.
  // payer: umi.identity.publicKey,
})

for (const tx of result.transactions) {
  const signed = await umi.identity.signTransaction(tx)
  const signature = await umi.rpc.sendTransaction(signed, {
    preflightCommitment: 'confirmed',
  })
  await umi.rpc.confirmTransaction(signature, {
    strategy: { type: 'blockhash', ...result.blockhash },
    commitment: 'confirmed',
  })
  console.log('Claimed:', base58.deserialize(signature)[0])
}
// [/MAIN]

// [OUTPUT]
// Claimed: 5uGGYEMmjP2HpyFCvLPNpVDSQEBtUE3LR6ZQFqhJxQSh5FbKacSyN8nQmAJowuFs6BTCdwzoFyyJz8Y2hQx8kPxo
// Claimed: 3TAroVovEap1ZEAJYq3WiDZoMK3GU3soCdrhvZJNg6b9EANqvWrVcDGNffm7mD8wvtpR7ynWQBcbrmz8AK6nrhfy
// [/OUTPUT]
