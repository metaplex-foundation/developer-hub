// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import { burnV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
// Assuming umi is set up with mplTokenMetadata plugin
// See getting-started for full setup

const mintAddress = publicKey('mintAddress...');
// [/SETUP]

// [MAIN]
// Burn the NFT (removes all accounts and closes token account)
await burnV1(umi, {
  mint: mintAddress,
  authority: umi.identity,
  tokenOwner: umi.identity.publicKey,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('NFT burned:', mintAddress);
// [/OUTPUT]
