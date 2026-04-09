// [IMPORTS]
import {
  findBondingCurveBucketV2Pda,
  fetchBondingCurveBucketV2,
  genesis,
} from '@metaplex-foundation/genesis';
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com').use(genesis());
// [/SETUP]

// [MAIN]
const genesisAccount = publicKey('YOUR_GENESIS_ACCOUNT_PUBKEY');

const [bucketPda] = findBondingCurveBucketV2Pda(umi, {
  genesisAccount,
  bucketIndex: 0,
});

const bucket = await fetchBondingCurveBucketV2(umi, bucketPda);
// [/MAIN]

// [OUTPUT]
// [/OUTPUT]
