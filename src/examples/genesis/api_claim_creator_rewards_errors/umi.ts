// [IMPORTS]
import {
  claimCreatorRewards,
  isGenesisApiError,
  isGenesisApiNetworkError,
} from '@metaplex-foundation/genesis'
// [/IMPORTS]

// [SETUP]
// Assumes umi is configured with a keypair identity.
// [/SETUP]

// [MAIN]
try {
  const result = await claimCreatorRewards(umi, {}, {
    wallet: umi.identity.publicKey,
    network: 'solana-mainnet',
  })
  console.log(`Claimable transactions: ${result.transactions.length}`)
} catch (err) {
  if (isGenesisApiError(err)) {
    // The API returns HTTP 400 with
    //   { "error": { "message": "No rewards available to claim" } }
    // when the wallet has no unclaimed creator rewards. Match on the message
    // (or statusCode === 400) to handle this as a success case rather than a
    // failure.
    if (err.message === 'No rewards available to claim') {
      console.log('Nothing to claim right now.')
    } else {
      console.error('API error:', err.statusCode, err.message)
    }
  } else if (isGenesisApiNetworkError(err)) {
    console.error('Network error:', err.cause.message)
  } else {
    throw err
  }
}
// [/MAIN]

// [OUTPUT]
// Nothing to claim right now.
// [/OUTPUT]
