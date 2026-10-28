// [IMPORTS]
import {
  genesis,
  findBondingCurveBucketV2Pda,
  fetchBondingCurveBucketV2,
  getSwapResult,
  applySlippage,
  swapBondingCurveV2,
  isSwappable,
  SwapDirection,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com').use(genesis());

const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT_PUBKEY');
const baseMint = publicKey('TOKEN_MINT_PUBKEY');
const quoteMint = publicKey('So11111111111111111111111111111111111111112'); // wSOL

const [bucketPda] = findBondingCurveBucketV2Pda(umi, { genesisAccount, bucketIndex: 0 });
const bucket = await fetchBondingCurveBucketV2(umi, bucketPda);
// [/SETUP]

// [MAIN]
if (!isSwappable(bucket)) throw new Error('Curve is not currently accepting swaps');

const SOL_IN = 1_000_000_000n; // 1 SOL in lamports
const quote = getSwapResult(bucket, SOL_IN, SwapDirection.Buy);
const minAmountOutScaled = applySlippage(quote.amountOut, 100); // 1% slippage

// NOTE: Fund the wSOL ATA before this call — see the wSOL Wrapping Note on this page.
// The user's base and wSOL token accounts default to the payer's ATAs.
const result = await swapBondingCurveV2(umi, {
  genesisAccount,
  bucket: bucketPda,
  baseMint,
  quoteMint,
  amount: quote.amountIn,
  minAmountOutScaled,
  swapDirection: SwapDirection.Buy,
}).sendAndConfirm(umi);

console.log('Buy confirmed:', result.signature);
// [/MAIN]

// [OUTPUT]
// Buy confirmed: <base58 transaction signature>
// [/OUTPUT]
