// [IMPORTS]
import { address } from '@solana/addresses';
import {
  getUpdateAsProgrammableConfigItemDelegateV2InstructionAsync,
  findAssociatedTokenPda,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
const mint = address('mintAddress...');
const assetOwner = address('ownerAddress...');
const ruleSet = address('ruleSetAddress...');
// [/SETUP]

// [MAIN]
const [token] = await findAssociatedTokenPda({ mint, owner: assetOwner });
const updateIx = await getUpdateAsProgrammableConfigItemDelegateV2InstructionAsync({
  mint,
  token,
  authority: programmableConfigItemDelegate,
  ruleSet: { __kind: 'Set', fields: [ruleSet] },
});

await sendAndConfirm([updateIx], [programmableConfigItemDelegate]);
// [/MAIN]

// [OUTPUT]
console.log('Rule set updated via Programmable Config Item delegate');
// [/OUTPUT]
