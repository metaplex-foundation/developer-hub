// [IMPORTS]
import { createAndRegisterLaunch } from '@metaplex-foundation/genesis/api';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { keypairIdentity } from '@metaplex-foundation/umi';
// [/IMPORTS]

// [SETUP]
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(mySecretKeyBytes);
umi.use(keypairIdentity(keypair));
// [/SETUP]

// [MAIN]
const result = await createAndRegisterLaunch(umi, {}, {
  wallet: umi.identity.publicKey,
  agent: {
    mint: agentAssetAddress,
    setToken: false, // use false when testing to avoid locking in on devnet
  },
  launchType: 'bondingCurve',
  network: 'solana-devnet',
  token: {
    name: 'Test Token',
    symbol: 'TEST',
    image: 'https://gateway.irys.xyz/test-image',
  },
  launch: {},
});
// [/MAIN]

// [OUTPUT]
// [/OUTPUT]
