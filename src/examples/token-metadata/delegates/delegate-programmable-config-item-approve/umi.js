// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import {
  delegateProgrammableConfigItemV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
const mint = publicKey('mintAddress...');
const updateAuthority = umi.identity;
const programmableConfigItemDelegate = publicKey('delegateAddress...');
// [/SETUP]

// [MAIN]
await delegateProgrammableConfigItemV1(umi, {
  mint,
  authority: updateAuthority,
  delegate: programmableConfigItemDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Programmable Config Item delegate approved');
// [/OUTPUT]
