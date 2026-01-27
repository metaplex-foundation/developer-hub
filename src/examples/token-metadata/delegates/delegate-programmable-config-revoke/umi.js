// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import {
  revokeProgrammableConfigV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
// [/IMPORTS]

// [SETUP]
const mint = publicKey('mintAddress...');
const updateAuthority = umi.identity;
const programmableConfigDelegate = publicKey('delegateAddress...');
// [/SETUP]

// [MAIN]
await revokeProgrammableConfigV1(umi, {
  mint,
  authority: updateAuthority, // Or pass the delegate authority as a Signer to self-revoke
  delegate: programmableConfigDelegate,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Programmable Config delegate revoked');
// [/OUTPUT]
