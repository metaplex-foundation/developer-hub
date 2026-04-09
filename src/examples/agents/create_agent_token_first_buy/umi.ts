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
    mint: agentAssetAddress,
    setToken: true,
  },
  launchType: 'bondingCurve',
  token: {
    name: 'Agent Token',
    symbol: 'AGT',
    image: 'https://gateway.irys.xyz/your-image-id',
  },
  launch: {
    firstBuyAmount: 0.1, // 0.1 SOL, fee-free
  },
});
// [/MAIN]

// [OUTPUT]
// [/OUTPUT]
