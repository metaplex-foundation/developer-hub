// [IMPORTS]
import {
  genesis,
  findBondingCurveBucketV2Pda,
  fetchBondingCurveBucketV2,
  getSwapResult,
  applySlippage,
  swapBondingCurveV2,
} from '@metaplex-foundation/genesis';
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';
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

const [userBaseTokenAccount] = findAssociatedTokenPda(umi, { mint: baseMint, owner: umi.identity.publicKey });
const [userQuoteTokenAccount] = findAssociatedTokenPda(umi, { mint: quoteMint, owner: umi.identity.publicKey });
// [/SETUP]

// [MAIN]
const TOKENS_IN = 500_000_000_000n; // 500 tokens (9 decimals)
const quote = getSwapResult(bucket, TOKENS_IN, 'sell');
const minAmountOut = applySlippage(quote.amountOut, 100); // 1% slippage

const result = await swapBondingCurveV2(umi, {
  genesisAccount,
  bucketPda,
  baseMint,
  quoteMint,
  userBaseTokenAccount,
  userQuoteTokenAccount,
  amountIn: quote.amountIn,
  minAmountOut,
  direction: 'sell',
}).sendAndConfirm(umi);

// NOTE: Close the wSOL ATA after confirming to unwrap back to native SOL.
console.log('Sell confirmed:', result.signature);
// [/MAIN]

// [OUTPUT]
// Sell confirmed: <base58 transaction signature>
// [/OUTPUT]
