/**
 * Example: Mint a Compressed NFT
 *
 * Mint a compressed NFT (cNFT) to a Merkle tree using Bubblegum
 */

const kitSections = {
  "imports": "import { mintV1 } from '@metaplex-foundation/mpl-bubblegum'",
  "setup": "// Initialize client\nconst client = createClient()",
  "main": "// Mint a compressed NFT\nawait mintV1({\n  merkleTree: treeAddress,\n  leafOwner: recipientAddress,\n  metadata: {\n    name: 'My cNFT',\n    symbol: 'CNFT',\n    uri: 'https://example.com/metadata.json',\n    sellerFeeBasisPoints: 500, // 5%\n    collection: null,\n    creators: [],\n  },\n})",
  "output": "console.log('cNFT minted successfully')",
  "full": "// [IMPORTS]\nimport { mintV1 } from '@metaplex-foundation/mpl-bubblegum'\n// [/IMPORTS]\n\n// [SETUP]\n// Initialize client\nconst client = createClient()\n// [/SETUP]\n\n// [MAIN]\n// Mint a compressed NFT\nawait mintV1({\n  merkleTree: treeAddress,\n  leafOwner: recipientAddress,\n  metadata: {\n    name: 'My cNFT',\n    symbol: 'CNFT',\n    uri: 'https://example.com/metadata.json',\n    sellerFeeBasisPoints: 500, // 5%\n    collection: null,\n    creators: [],\n  },\n})\n// [/MAIN]\n\n// [OUTPUT]\nconsole.log('cNFT minted successfully')\n// [/OUTPUT]\n"
}

const umiSections = {
  "imports": "import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'\nimport { mintV1, mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'\nimport { publicKey, none } from '@metaplex-foundation/umi'",
  "setup": "// Initialize UMI\nconst umi = createUmi('https://api.devnet.solana.com')\n  .use(mplBubblegum())\n\nconst merkleTree = publicKey('YOUR_MERKLE_TREE_ADDRESS')\nconst leafOwner = publicKey('RECIPIENT_ADDRESS')",
  "main": "// Mint a compressed NFT\nawait mintV1(umi, {\n  merkleTree,\n  leafOwner,\n  metadata: {\n    name: 'My cNFT',\n    symbol: 'CNFT',\n    uri: 'https://example.com/metadata.json',\n    sellerFeeBasisPoints: 500, // 5%\n    collection: none(),\n    creators: [],\n  },\n}).sendAndConfirm(umi)",
  "output": "console.log('cNFT minted to:', leafOwner)",
  "full": "// [IMPORTS]\nimport { createUmi } from '@metaplex-foundation/umi-bundle-defaults'\nimport { mintV1, mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'\nimport { publicKey, none } from '@metaplex-foundation/umi'\n// [/IMPORTS]\n\n// [SETUP]\n// Initialize UMI\nconst umi = createUmi('https://api.devnet.solana.com')\n  .use(mplBubblegum())\n\nconst merkleTree = publicKey('YOUR_MERKLE_TREE_ADDRESS')\nconst leafOwner = publicKey('RECIPIENT_ADDRESS')\n// [/SETUP]\n\n// [MAIN]\n// Mint a compressed NFT\nawait mintV1(umi, {\n  merkleTree,\n  leafOwner,\n  metadata: {\n    name: 'My cNFT',\n    symbol: 'CNFT',\n    uri: 'https://example.com/metadata.json',\n    sellerFeeBasisPoints: 500, // 5%\n    collection: none(),\n    creators: [],\n  },\n}).sendAndConfirm(umi)\n// [/MAIN]\n\n// [OUTPUT]\nconsole.log('cNFT minted to:', leafOwner)\n// [/OUTPUT]\n"
}

const shankSections = {
  "imports": "use mpl_bubblegum::instructions::MintV1Builder;\nuse mpl_bubblegum::types::MetadataArgs;\nuse solana_sdk::signer::Signer;",
  "setup": "",
  "main": "// Create metadata for the cNFT\nlet metadata = MetadataArgs {\n    name: \"My cNFT\".to_string(),\n    symbol: \"CNFT\".to_string(),\n    uri: \"https://example.com/metadata.json\".to_string(),\n    seller_fee_basis_points: 500,\n    primary_sale_happened: false,\n    is_mutable: true,\n    edition_nonce: None,\n    token_standard: None,\n    collection: None,\n    uses: None,\n    token_program_version: Default::default(),\n    creators: vec![],\n};\n\n// Mint compressed NFT instruction\nlet mint_ix = MintV1Builder::new()\n    .tree_config(tree_config_pda)\n    .leaf_owner(leaf_owner)\n    .leaf_delegate(leaf_owner)\n    .merkle_tree(merkle_tree)\n    .payer(payer.pubkey())\n    .tree_creator_or_delegate(tree_creator.pubkey())\n    .log_wrapper(spl_noop::id())\n    .compression_program(spl_account_compression::id())\n    .system_program(system_program::id())\n    .metadata(metadata)\n    .build();",
  "output": "println!(\"cNFT mint instruction created\");",
  "full": "// [IMPORTS]\nuse mpl_bubblegum::instructions::MintV1Builder;\nuse mpl_bubblegum::types::MetadataArgs;\nuse solana_sdk::signer::Signer;\n// [/IMPORTS]\n\n// [MAIN]\n// Create metadata for the cNFT\nlet metadata = MetadataArgs {\n    name: \"My cNFT\".to_string(),\n    symbol: \"CNFT\".to_string(),\n    uri: \"https://example.com/metadata.json\".to_string(),\n    seller_fee_basis_points: 500,\n    primary_sale_happened: false,\n    is_mutable: true,\n    edition_nonce: None,\n    token_standard: None,\n    collection: None,\n    uses: None,\n    token_program_version: Default::default(),\n    creators: vec![],\n};\n\n// Mint compressed NFT instruction\nlet mint_ix = MintV1Builder::new()\n    .tree_config(tree_config_pda)\n    .leaf_owner(leaf_owner)\n    .leaf_delegate(leaf_owner)\n    .merkle_tree(merkle_tree)\n    .payer(payer.pubkey())\n    .tree_creator_or_delegate(tree_creator.pubkey())\n    .log_wrapper(spl_noop::id())\n    .compression_program(spl_account_compression::id())\n    .system_program(system_program::id())\n    .metadata(metadata)\n    .build();\n// [/MAIN]\n\n// [OUTPUT]\nprintln!(\"cNFT mint instruction created\");\n// [/OUTPUT]\n"
}

const anchorSections = {
  "imports": "use anchor_lang::prelude::*;\nuse mpl_bubblegum::instructions::MintV1CpiBuilder;\nuse mpl_bubblegum::types::MetadataArgs;",
  "setup": "",
  "main": "// Create metadata for the cNFT\nlet metadata = MetadataArgs {\n    name: \"My cNFT\".to_string(),\n    symbol: \"CNFT\".to_string(),\n    uri: \"https://example.com/metadata.json\".to_string(),\n    seller_fee_basis_points: 500,\n    primary_sale_happened: false,\n    is_mutable: true,\n    edition_nonce: None,\n    token_standard: None,\n    collection: None,\n    uses: None,\n    token_program_version: Default::default(),\n    creators: vec![],\n};\n\n// Mint compressed NFT via CPI\nMintV1CpiBuilder::new(&ctx.accounts.bubblegum_program)\n    .tree_config(&ctx.accounts.tree_config)\n    .leaf_owner(&ctx.accounts.leaf_owner)\n    .leaf_delegate(&ctx.accounts.leaf_owner)\n    .merkle_tree(&ctx.accounts.merkle_tree)\n    .payer(&ctx.accounts.payer)\n    .tree_creator_or_delegate(&ctx.accounts.tree_creator)\n    .log_wrapper(&ctx.accounts.log_wrapper)\n    .compression_program(&ctx.accounts.compression_program)\n    .system_program(&ctx.accounts.system_program)\n    .metadata(metadata)\n    .invoke()?;",
  "output": "",
  "full": "// [IMPORTS]\nuse anchor_lang::prelude::*;\nuse mpl_bubblegum::instructions::MintV1CpiBuilder;\nuse mpl_bubblegum::types::MetadataArgs;\n// [/IMPORTS]\n\n// [MAIN]\n// Create metadata for the cNFT\nlet metadata = MetadataArgs {\n    name: \"My cNFT\".to_string(),\n    symbol: \"CNFT\".to_string(),\n    uri: \"https://example.com/metadata.json\".to_string(),\n    seller_fee_basis_points: 500,\n    primary_sale_happened: false,\n    is_mutable: true,\n    edition_nonce: None,\n    token_standard: None,\n    collection: None,\n    uses: None,\n    token_program_version: Default::default(),\n    creators: vec![],\n};\n\n// Mint compressed NFT via CPI\nMintV1CpiBuilder::new(&ctx.accounts.bubblegum_program)\n    .tree_config(&ctx.accounts.tree_config)\n    .leaf_owner(&ctx.accounts.leaf_owner)\n    .leaf_delegate(&ctx.accounts.leaf_owner)\n    .merkle_tree(&ctx.accounts.merkle_tree)\n    .payer(&ctx.accounts.payer)\n    .tree_creator_or_delegate(&ctx.accounts.tree_creator)\n    .log_wrapper(&ctx.accounts.log_wrapper)\n    .compression_program(&ctx.accounts.compression_program)\n    .system_program(&ctx.accounts.system_program)\n    .metadata(metadata)\n    .invoke()?;\n// [/MAIN]\n"
}

export const metadata = {
  title: "Mint a Compressed NFT",
  description: "Mint a compressed NFT (cNFT) to a Merkle tree using Bubblegum",
  tags: ['bubblegum', 'cnft', 'mint', 'beginner'],
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
