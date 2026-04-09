// [IMPORTS]
import { createAndRegisterLaunch } from '@metaplex-foundation/genesis/api';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity } from '@metaplex-foundation/umi';
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.mainnet-beta.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(mySecretKeyBytes);
umi.use(keypairIdentity(keypair));
// [/SETUP]

// [MAIN]
const result = await createAndRegisterLaunch(umi, {}, {
  wallet: umi.identity.publicKey,
  agent: {
    mint: agentAssetAddress, // Core asset address of the registered agent
    setToken: true,          // permanently associates this token with the agent
  },
  launchType: 'bondingCurve',
  token: {
    name: 'Agent Token',
    symbol: 'AGT',
    image: 'https://gateway.irys.xyz/your-image-id',
  },
  launch: {},
});

console.log('Token launched!');
console.log('Mint address:', result.mintAddress);
console.log('View at:', result.launch.link);
// [/MAIN]

// [OUTPUT]
// Token launched!
// Mint address: <base58 mint address>
// View at: https://www.metaplex.com/...
// [/OUTPUT]
