/**
 * Example: Transfer a Compressed NFT
 *
 * Transfer a compressed NFT (cNFT) to another wallet using Bubblegum
 */

const kitSections = {
  "imports": "import { transfer } from '@metaplex-foundation/mpl-bubblegum'\nimport { getAssetWithProof } from '@metaplex-foundation/mpl-bubblegum'",
  "setup": "// Initialize client and get asset proof from DAS API\nconst client = createClient()\nconst assetWithProof = await getAssetWithProof(assetId)",
  "main": "// Transfer the compressed NFT\nawait transfer({\n  ...assetWithProof,\n  leafOwner: currentOwner,\n  newLeafOwner: newOwnerAddress,\n})",
  "output": "console.log('cNFT transferred successfully')",
  "full": "// [IMPORTS]\nimport { transfer } from '@metaplex-foundation/mpl-bubblegum'\nimport { getAssetWithProof } from '@metaplex-foundation/mpl-bubblegum'\n// [/IMPORTS]\n\n// [SETUP]\n// Initialize client and get asset proof from DAS API\nconst client = createClient()\nconst assetWithProof = await getAssetWithProof(assetId)\n// [/SETUP]\n\n// [MAIN]\n// Transfer the compressed NFT\nawait transfer({\n  ...assetWithProof,\n  leafOwner: currentOwner,\n  newLeafOwner: newOwnerAddress,\n})\n// [/MAIN]\n\n// [OUTPUT]\nconsole.log('cNFT transferred successfully')\n// [/OUTPUT]\n"
}

const umiSections = {
  "imports": "import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'\nimport { transfer, mplBubblegum, getAssetWithProof } from '@metaplex-foundation/mpl-bubblegum'\nimport { publicKey } from '@metaplex-foundation/umi'",
  "setup": "// Initialize UMI with DAS API\nconst umi = createUmi('https://api.devnet.solana.com')\n  .use(mplBubblegum())\n\n// Get the asset ID and new owner\nconst assetId = publicKey('YOUR_ASSET_ID')\nconst newLeafOwner = publicKey('NEW_OWNER_ADDRESS')\n\n// Fetch asset with proof from DAS API\nconst assetWithProof = await getAssetWithProof(umi, assetId)",
  "main": "// Transfer the compressed NFT\nawait transfer(umi, {\n  ...assetWithProof,\n  leafOwner: umi.identity.publicKey,\n  newLeafOwner,\n}).sendAndConfirm(umi)",
  "output": "console.log('cNFT transferred to:', newLeafOwner)",
  "full": "// [IMPORTS]\nimport { createUmi } from '@metaplex-foundation/umi-bundle-defaults'\nimport { transfer, mplBubblegum, getAssetWithProof } from '@metaplex-foundation/mpl-bubblegum'\nimport { publicKey } from '@metaplex-foundation/umi'\n// [/IMPORTS]\n\n// [SETUP]\n// Initialize UMI with DAS API\nconst umi = createUmi('https://api.devnet.solana.com')\n  .use(mplBubblegum())\n\n// Get the asset ID and new owner\nconst assetId = publicKey('YOUR_ASSET_ID')\nconst newLeafOwner = publicKey('NEW_OWNER_ADDRESS')\n\n// Fetch asset with proof from DAS API\nconst assetWithProof = await getAssetWithProof(umi, assetId)\n// [/SETUP]\n\n// [MAIN]\n// Transfer the compressed NFT\nawait transfer(umi, {\n  ...assetWithProof,\n  leafOwner: umi.identity.publicKey,\n  newLeafOwner,\n}).sendAndConfirm(umi)\n// [/MAIN]\n\n// [OUTPUT]\nconsole.log('cNFT transferred to:', newLeafOwner)\n// [/OUTPUT]\n"
}

const shankSections = {
  "imports": "use mpl_bubblegum::instructions::TransferBuilder;\nuse solana_sdk::signer::Signer;",
  "setup": "// Get proof from DAS API (off-chain)\n// proof: Vec<[u8; 32]> - merkle proof\n// root: [u8; 32] - current merkle root\n// data_hash: [u8; 32] - hash of the NFT data\n// creator_hash: [u8; 32] - hash of the creators\n// nonce: u64 - leaf nonce\n// index: u32 - leaf index",
  "main": "// Transfer compressed NFT instruction\nlet transfer_ix = TransferBuilder::new()\n    .tree_config(tree_config_pda)\n    .leaf_owner(leaf_owner.pubkey(), true)\n    .leaf_delegate(leaf_owner.pubkey(), false)\n    .new_leaf_owner(new_leaf_owner)\n    .merkle_tree(merkle_tree)\n    .log_wrapper(spl_noop::id())\n    .compression_program(spl_account_compression::id())\n    .system_program(system_program::id())\n    .root(root)\n    .data_hash(data_hash)\n    .creator_hash(creator_hash)\n    .nonce(nonce)\n    .index(index)\n    .add_remaining_accounts(&proof_accounts)\n    .build();",
  "output": "println!(\"cNFT transfer instruction created\");",
  "full": "// [IMPORTS]\nuse mpl_bubblegum::instructions::TransferBuilder;\nuse solana_sdk::signer::Signer;\n// [/IMPORTS]\n\n// [SETUP]\n// Get proof from DAS API (off-chain)\n// proof: Vec<[u8; 32]> - merkle proof\n// root: [u8; 32] - current merkle root\n// data_hash: [u8; 32] - hash of the NFT data\n// creator_hash: [u8; 32] - hash of the creators\n// nonce: u64 - leaf nonce\n// index: u32 - leaf index\n// [/SETUP]\n\n// [MAIN]\n// Transfer compressed NFT instruction\nlet transfer_ix = TransferBuilder::new()\n    .tree_config(tree_config_pda)\n    .leaf_owner(leaf_owner.pubkey(), true)\n    .leaf_delegate(leaf_owner.pubkey(), false)\n    .new_leaf_owner(new_leaf_owner)\n    .merkle_tree(merkle_tree)\n    .log_wrapper(spl_noop::id())\n    .compression_program(spl_account_compression::id())\n    .system_program(system_program::id())\n    .root(root)\n    .data_hash(data_hash)\n    .creator_hash(creator_hash)\n    .nonce(nonce)\n    .index(index)\n    .add_remaining_accounts(&proof_accounts)\n    .build();\n// [/MAIN]\n\n// [OUTPUT]\nprintln!(\"cNFT transfer instruction created\");\n// [/OUTPUT]\n"
}

const anchorSections = {
  "imports": "use anchor_lang::prelude::*;\nuse mpl_bubblegum::instructions::TransferCpiBuilder;",
  "setup": "// Get proof from DAS API (off-chain)\n// The proof and hashes must be fetched from a DAS API provider",
  "main": "// Transfer compressed NFT via CPI\nTransferCpiBuilder::new(&ctx.accounts.bubblegum_program)\n    .tree_config(&ctx.accounts.tree_config)\n    .leaf_owner(&ctx.accounts.leaf_owner, true)\n    .leaf_delegate(&ctx.accounts.leaf_owner, false)\n    .new_leaf_owner(&ctx.accounts.new_leaf_owner)\n    .merkle_tree(&ctx.accounts.merkle_tree)\n    .log_wrapper(&ctx.accounts.log_wrapper)\n    .compression_program(&ctx.accounts.compression_program)\n    .system_program(&ctx.accounts.system_program)\n    .root(root)\n    .data_hash(data_hash)\n    .creator_hash(creator_hash)\n    .nonce(nonce)\n    .index(index)\n    .add_remaining_accounts(&proof_accounts)\n    .invoke()?;",
  "output": "",
  "full": "// [IMPORTS]\nuse anchor_lang::prelude::*;\nuse mpl_bubblegum::instructions::TransferCpiBuilder;\n// [/IMPORTS]\n\n// [SETUP]\n// Get proof from DAS API (off-chain)\n// The proof and hashes must be fetched from a DAS API provider\n// [/SETUP]\n\n// [MAIN]\n// Transfer compressed NFT via CPI\nTransferCpiBuilder::new(&ctx.accounts.bubblegum_program)\n    .tree_config(&ctx.accounts.tree_config)\n    .leaf_owner(&ctx.accounts.leaf_owner, true)\n    .leaf_delegate(&ctx.accounts.leaf_owner, false)\n    .new_leaf_owner(&ctx.accounts.new_leaf_owner)\n    .merkle_tree(&ctx.accounts.merkle_tree)\n    .log_wrapper(&ctx.accounts.log_wrapper)\n    .compression_program(&ctx.accounts.compression_program)\n    .system_program(&ctx.accounts.system_program)\n    .root(root)\n    .data_hash(data_hash)\n    .creator_hash(creator_hash)\n    .nonce(nonce)\n    .index(index)\n    .add_remaining_accounts(&proof_accounts)\n    .invoke()?;\n// [/MAIN]\n"
}

export const metadata = {
  title: "Transfer a Compressed NFT",
  description: "Transfer a compressed NFT (cNFT) to another wallet using Bubblegum",
  tags: ['bubblegum', 'cnft', 'transfer', 'intermediate'],
}

export const examples = {
  kit: {
    framework: 'Kit',
    language: 'javascript',
    code: kitSections.full,
    sections: kitSections,
  },

  umi: {
    framework: 'Umi',
    language: 'javascript',
    code: umiSections.full,
    sections: umiSections,
  },

  shank: {
    framework: 'Shank',
    language: 'rust',
    code: shankSections.full,
    sections: shankSections,
  },

  anchor: {
    framework: 'Anchor',
    language: 'rust',
    code: anchorSections.full,
    sections: anchorSections,
  },
}
