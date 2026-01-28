// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import {
  revokeProgrammableConfigItemV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
const mint = publicKey('mintAddress...');
const updateAuthority = umi.identity;
const programmableConfigItemDelegate = publicKey('delegateAddress...');
// [/SETUP]

// [MAIN]
await revokeProgrammableConfigItemV1(umi, {
  mint,
  authority: updateAuthority, // Or pass the delegate authority as a Signer to self-revoke
  delegate: programmableConfigItemDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Programmable Config Item delegate revoked');
// [/OUTPUT]
