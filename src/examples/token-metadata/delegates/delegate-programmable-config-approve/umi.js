// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import {
  delegateProgrammableConfigV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
const mint = publicKey('mintAddress...');
const updateAuthority = umi.identity;
const programmableConfigDelegate = publicKey('delegateAddress...');
// [/SETUP]

// [MAIN]
await delegateProgrammableConfigV1(umi, {
  mint,
  authority: updateAuthority,
  delegate: programmableConfigDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Programmable Config delegate approved');
// [/OUTPUT]
