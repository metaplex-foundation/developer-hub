// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import {
  updateAsProgrammableConfigDelegateV2,
  ruleSetToggle,
} from '@metaplex-foundation/mpl-token-metadata';
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';
// [/IMPORTS]

// [SETUP]
const mint = publicKey('mintAddress...');
const assetOwner = publicKey('ownerAddress...');
const programmableConfigDelegate = umi.identity; // The delegate authority
const ruleSet = publicKey('ruleSetAddress...');
// [/SETUP]

// [MAIN]
await updateAsProgrammableConfigDelegateV2(umi, {
  mint,
  token: findAssociatedTokenPda(umi, { mint, owner: assetOwner }),
  authority: programmableConfigDelegate,
  ruleSet: ruleSetToggle('Set', [ruleSet]),
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Rule set updated via Programmable Config delegate');
// [/OUTPUT]
