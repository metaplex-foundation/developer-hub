/**
 * Example: Burn a Compressed NFT
 *
 * Burn a compressed NFT (cNFT) using Bubblegum
 */

const kitSections = {
  "imports": "import { burn } from '@metaplex-foundation/mpl-bubblegum'\nimport { getAssetWithProof } from '@metaplex-foundation/mpl-bubblegum'",
  "setup": "// Initialize client and get asset proof from DAS API\nconst client = createClient()\nconst assetWithProof = await getAssetWithProof(assetId)",
  "main": "// Burn the compressed NFT\nawait burn({\n  ...assetWithProof,\n  leafOwner: ownerAddress,\n})",
  "output": "console.log('cNFT burned successfully')",
  "full": "// [IMPORTS]\nimport { burn } from '@metaplex-foundation/mpl-bubblegum'\nimport { getAssetWithProof } from '@metaplex-foundation/mpl-bubblegum'\n// [/IMPORTS]\n\n// [SETUP]\n// Initialize client and get asset proof from DAS API\nconst client = createClient()\nconst assetWithProof = await getAssetWithProof(assetId)\n// [/SETUP]\n\n// [MAIN]\n// Burn the compressed NFT\nawait burn({\n  ...assetWithProof,\n  leafOwner: ownerAddress,\n})\n// [/MAIN]\n\n// [OUTPUT]\nconsole.log('cNFT burned successfully')\n// [/OUTPUT]\n"
}

const umiSections = {
  "imports": "import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'\nimport { burn, mplBubblegum, getAssetWithProof } from '@metaplex-foundation/mpl-bubblegum'\nimport { publicKey } from '@metaplex-foundation/umi'",
  "setup": "// Initialize UMI with DAS API\nconst umi = createUmi('https://api.devnet.solana.com')\n  .use(mplBubblegum())\n\n// Get the asset ID\nconst assetId = publicKey('YOUR_ASSET_ID')\n\n// Fetch asset with proof from DAS API\nconst assetWithProof = await getAssetWithProof(umi, assetId)",
  "main": "// Burn the compressed NFT\nawait burn(umi, {\n  ...assetWithProof,\n  leafOwner: umi.identity.publicKey,\n}).sendAndConfirm(umi)",
  "output": "console.log('cNFT burned successfully')",
  "full": "// [IMPORTS]\nimport { createUmi } from '@metaplex-foundation/umi-bundle-defaults'\nimport { burn, mplBubblegum, getAssetWithProof } from '@metaplex-foundation/mpl-bubblegum'\nimport { publicKey } from '@metaplex-foundation/umi'\n// [/IMPORTS]\n\n// [SETUP]\n// Initialize UMI with DAS API\nconst umi = createUmi('https://api.devnet.solana.com')\n  .use(mplBubblegum())\n\n// Get the asset ID\nconst assetId = publicKey('YOUR_ASSET_ID')\n\n// Fetch asset with proof from DAS API\nconst assetWithProof = await getAssetWithProof(umi, assetId)\n// [/SETUP]\n\n// [MAIN]\n// Burn the compressed NFT\nawait burn(umi, {\n  ...assetWithProof,\n  leafOwner: umi.identity.publicKey,\n}).sendAndConfirm(umi)\n// [/MAIN]\n\n// [OUTPUT]\nconsole.log('cNFT burned successfully')\n// [/OUTPUT]\n"
}

const shankSections = {
  "imports": "use mpl_bubblegum::instructions::BurnBuilder;\nuse solana_sdk::signer::Signer;",
  "setup": "// Get proof from DAS API (off-chain)\n// proof: Vec<[u8; 32]> - merkle proof\n// root: [u8; 32] - current merkle root\n// data_hash: [u8; 32] - hash of the NFT data\n// creator_hash: [u8; 32] - hash of the creators\n// nonce: u64 - leaf nonce\n// index: u32 - leaf index",
  "main": "// Burn compressed NFT instruction\nlet burn_ix = BurnBuilder::new()\n    .tree_config(tree_config_pda)\n    .leaf_owner(leaf_owner.pubkey(), true)\n    .leaf_delegate(leaf_owner.pubkey(), false)\n    .merkle_tree(merkle_tree)\n    .log_wrapper(spl_noop::id())\n    .compression_program(spl_account_compression::id())\n    .system_program(system_program::id())\n    .root(root)\n    .data_hash(data_hash)\n    .creator_hash(creator_hash)\n    .nonce(nonce)\n    .index(index)\n    .add_remaining_accounts(&proof_accounts)\n    .build();",
  "output": "println!(\"cNFT burn instruction created\");",
  "full": "// [IMPORTS]\nuse mpl_bubblegum::instructions::BurnBuilder;\nuse solana_sdk::signer::Signer;\n// [/IMPORTS]\n\n// [SETUP]\n// Get proof from DAS API (off-chain)\n// proof: Vec<[u8; 32]> - merkle proof\n// root: [u8; 32] - current merkle root\n// data_hash: [u8; 32] - hash of the NFT data\n// creator_hash: [u8; 32] - hash of the creators\n// nonce: u64 - leaf nonce\n// index: u32 - leaf index\n// [/SETUP]\n\n// [MAIN]\n// Burn compressed NFT instruction\nlet burn_ix = BurnBuilder::new()\n    .tree_config(tree_config_pda)\n    .leaf_owner(leaf_owner.pubkey(), true)\n    .leaf_delegate(leaf_owner.pubkey(), false)\n    .merkle_tree(merkle_tree)\n    .log_wrapper(spl_noop::id())\n    .compression_program(spl_account_compression::id())\n    .system_program(system_program::id())\n    .root(root)\n    .data_hash(data_hash)\n    .creator_hash(creator_hash)\n    .nonce(nonce)\n    .index(index)\n    .add_remaining_accounts(&proof_accounts)\n    .build();\n// [/MAIN]\n\n// [OUTPUT]\nprintln!(\"cNFT burn instruction created\");\n// [/OUTPUT]\n"
}

const anchorSections = {
  "imports": "use anchor_lang::prelude::*;\nuse mpl_bubblegum::instructions::BurnCpiBuilder;",
  "setup": "// Get proof from DAS API (off-chain)\n// The proof and hashes must be fetched from a DAS API provider",
  "main": "// Burn compressed NFT via CPI\nBurnCpiBuilder::new(&ctx.accounts.bubblegum_program)\n    .tree_config(&ctx.accounts.tree_config)\n    .leaf_owner(&ctx.accounts.leaf_owner, true)\n    .leaf_delegate(&ctx.accounts.leaf_owner, false)\n    .merkle_tree(&ctx.accounts.merkle_tree)\n    .log_wrapper(&ctx.accounts.log_wrapper)\n    .compression_program(&ctx.accounts.compression_program)\n    .system_program(&ctx.accounts.system_program)\n    .root(root)\n    .data_hash(data_hash)\n    .creator_hash(creator_hash)\n    .nonce(nonce)\n    .index(index)\n    .add_remaining_accounts(&proof_accounts)\n    .invoke()?;",
  "output": "",
  "full": "// [IMPORTS]\nuse anchor_lang::prelude::*;\nuse mpl_bubblegum::instructions::BurnCpiBuilder;\n// [/IMPORTS]\n\n// [SETUP]\n// Get proof from DAS API (off-chain)\n// The proof and hashes must be fetched from a DAS API provider\n// [/SETUP]\n\n// [MAIN]\n// Burn compressed NFT via CPI\nBurnCpiBuilder::new(&ctx.accounts.bubblegum_program)\n    .tree_config(&ctx.accounts.tree_config)\n    .leaf_owner(&ctx.accounts.leaf_owner, true)\n    .leaf_delegate(&ctx.accounts.leaf_owner, false)\n    .merkle_tree(&ctx.accounts.merkle_tree)\n    .log_wrapper(&ctx.accounts.log_wrapper)\n    .compression_program(&ctx.accounts.compression_program)\n    .system_program(&ctx.accounts.system_program)\n    .root(root)\n    .data_hash(data_hash)\n    .creator_hash(creator_hash)\n    .nonce(nonce)\n    .index(index)\n    .add_remaining_accounts(&proof_accounts)\n    .invoke()?;\n// [/MAIN]\n"
}

export const metadata = {
  title: "Burn a Compressed NFT",
  description: "Burn a compressed NFT (cNFT) using Bubblegum",
  tags: ['bubblegum', 'cnft', 'burn', 'intermediate'],
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
