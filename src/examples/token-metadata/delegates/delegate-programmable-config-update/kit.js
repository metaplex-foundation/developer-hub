// [IMPORTS]
import { address } from '@solana/addresses';
import {
  getUpdateAsProgrammableConfigDelegateV2InstructionAsync,
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
const updateIx = await getUpdateAsProgrammableConfigDelegateV2InstructionAsync({
  mint,
  token,
  authority: programmableConfigDelegate,
  ruleSet: { __kind: 'Set', fields: [ruleSet] },
});

await sendAndConfirm({
  instructions: [updateIx],
  payer: programmableConfigDelegate,
});
// [/MAIN]

// [OUTPUT]
console.log('Rule set updated via Programmable Config delegate');
// [/OUTPUT]
