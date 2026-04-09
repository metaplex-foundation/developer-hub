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
const SOL_IN = 1_000_000_000n; // 1 SOL in lamports

const buyQuote = getSwapResult(bucket, SOL_IN, 'buy');

console.log('SOL input:  ', buyQuote.amountIn.toString(), 'lamports');
console.log('Total fee:  ', buyQuote.fee.toString(), 'lamports');
console.log('Tokens out: ', buyQuote.amountOut.toString());
// [/MAIN]

// [OUTPUT]
// SOL input:   1000000000 lamports
// Total fee:   10000000 lamports
// Tokens out:  <calculated token amount>
// [/OUTPUT]
