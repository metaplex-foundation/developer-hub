// [IMPORTS]
import { publicKey } from '@metaplex-foundation/umi';
import {
  updateAsProgrammableConfigItemDelegateV2,
  ruleSetToggle,
} from '@metaplex-foundation/mpl-token-metadata';
import { findAssociatedTokenPda } from '@metaplex-foundation/mpl-toolbox';
// [/IMPORTS]

// [SETUP]
const mint = publicKey('mintAddress...');
const assetOwner = publicKey('ownerAddress...');
const programmableConfigItemDelegate = umi.identity; // The delegate authority
const ruleSet = publicKey('ruleSetAddress...');
// [/SETUP]

// [MAIN]
await updateAsProgrammableConfigItemDelegateV2(umi, {
  mint,
  token: findAssociatedTokenPda(umi, { mint, owner: assetOwner }),
  authority: programmableConfigItemDelegate,
  ruleSet: ruleSetToggle('Set', [ruleSet]),
}).sendAndConfirm(umi);
// [/MAIN]

// [OUTPUT]
console.log('Rule set updated via Programmable Config Item delegate');
// [/OUTPUT]
