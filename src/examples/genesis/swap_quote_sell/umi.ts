// [IMPORTS]
import {
  genesis,
  findBondingCurveBucketV2Pda,
  fetchBondingCurveBucketV2,
  getSwapResult,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com').use(genesis());

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT_PUBKEY');
const [bucketPda] = findBondingCurveBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });
const bucket = await fetchBondingCurveBucketV2(umi, bucketPda);
// [/SETUP]

// [MAIN]
const TOKENS_IN = 500_000_000_000n; // 500 tokens (9 decimals)

const sellQuote = getSwapResult(bucket, TOKENS_IN, 'sell');

console.log('Tokens input: ', sellQuote.amountIn.toString());
console.log('Total fee:    ', sellQuote.fee.toString(), 'lamports');
console.log('SOL out:      ', sellQuote.amountOut.toString(), 'lamports');
// [/MAIN]

// [OUTPUT]
// Tokens input:  500000000000
// Total fee:     <fee in lamports>
// SOL out:       <calculated SOL amount>
// [/OUTPUT]
