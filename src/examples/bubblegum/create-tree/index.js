/**
 * Example: Create a Merkle Tree
 *
 * Create a Merkle tree for minting compressed NFTs with Bubblegum
 */

const kitSections = {
  "imports": "import { createTree } from '@metaplex-foundation/mpl-bubblegum'",
  "setup": "// Initialize client\nconst client = createClient()",
  "main": "// Create a new Merkle tree\n// maxDepth: 14 and maxBufferSize: 64 allows for ~16,000 NFTs\nconst tree = await createTree({\n  maxDepth: 14,\n  maxBufferSize: 64,\n  public: false, // Only tree creator can mint\n})",
  "output": "console.log('Tree created:', tree.merkleTree)",
  "full": "// [IMPORTS]\nimport { createTree } from '@metaplex-foundation/mpl-bubblegum'\n// [/IMPORTS]\n\n// [SETUP]\n// Initialize client\nconst client = createClient()\n// [/SETUP]\n\n// [MAIN]\n// Create a new Merkle tree\n// maxDepth: 14 and maxBufferSize: 64 allows for ~16,000 NFTs\nconst tree = await createTree({\n  maxDepth: 14,\n  maxBufferSize: 64,\n  public: false, // Only tree creator can mint\n})\n// [/MAIN]\n\n// [OUTPUT]\nconsole.log('Tree created:', tree.merkleTree)\n// [/OUTPUT]\n"
}

const umiSections = {
  "imports": "import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'\nimport { createTree, mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'\nimport { generateSigner } from '@metaplex-foundation/umi'",
  "setup": "// Initialize UMI\nconst umi = createUmi('https://api.devnet.solana.com')\n  .use(mplBubblegum())\n\n// Generate a new merkle tree signer\nconst merkleTree = generateSigner(umi)",
  "main": "// Create a new Merkle tree\n// maxDepth: 14 and maxBufferSize: 64 allows for ~16,000 NFTs\nawait createTree(umi, {\n  merkleTree,\n  maxDepth: 14,\n  maxBufferSize: 64,\n  public: false, // Only tree creator can mint\n}).sendAndConfirm(umi)",
  "output": "console.log('Tree created:', merkleTree.publicKey)",
  "full": "// [IMPORTS]\nimport { createUmi } from '@metaplex-foundation/umi-bundle-defaults'\nimport { createTree, mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'\nimport { generateSigner } from '@metaplex-foundation/umi'\n// [/IMPORTS]\n\n// [SETUP]\n// Initialize UMI\nconst umi = createUmi('https://api.devnet.solana.com')\n  .use(mplBubblegum())\n\n// Generate a new merkle tree signer\nconst merkleTree = generateSigner(umi)\n// [/SETUP]\n\n// [MAIN]\n// Create a new Merkle tree\n// maxDepth: 14 and maxBufferSize: 64 allows for ~16,000 NFTs\nawait createTree(umi, {\n  merkleTree,\n  maxDepth: 14,\n  maxBufferSize: 64,\n  public: false, // Only tree creator can mint\n}).sendAndConfirm(umi)\n// [/MAIN]\n\n// [OUTPUT]\nconsole.log('Tree created:', merkleTree.publicKey)\n// [/OUTPUT]\n"
}

const shankSections = {
  "imports": "use mpl_bubblegum::instructions::CreateTreeConfigBuilder;\nuse spl_account_compression::state::CONCURRENT_MERKLE_TREE_HEADER_SIZE_V1;\nuse solana_sdk::signer::Signer;",
  "setup": "",
  "main": "// Create tree config instruction\nlet max_depth = 14;\nlet max_buffer_size = 64;\n\nlet create_tree_ix = CreateTreeConfigBuilder::new()\n    .tree_config(tree_config_pda)\n    .merkle_tree(merkle_tree.pubkey())\n    .payer(payer.pubkey())\n    .tree_creator(payer.pubkey())\n    .log_wrapper(spl_noop::id())\n    .compression_program(spl_account_compression::id())\n    .system_program(system_program::id())\n    .max_depth(max_depth)\n    .max_buffer_size(max_buffer_size)\n    .public(false)\n    .build();",
  "output": "println!(\"Tree config instruction created\");",
  "full": "// [IMPORTS]\nuse mpl_bubblegum::instructions::CreateTreeConfigBuilder;\nuse spl_account_compression::state::CONCURRENT_MERKLE_TREE_HEADER_SIZE_V1;\nuse solana_sdk::signer::Signer;\n// [/IMPORTS]\n\n// [MAIN]\n// Create tree config instruction\nlet max_depth = 14;\nlet max_buffer_size = 64;\n\nlet create_tree_ix = CreateTreeConfigBuilder::new()\n    .tree_config(tree_config_pda)\n    .merkle_tree(merkle_tree.pubkey())\n    .payer(payer.pubkey())\n    .tree_creator(payer.pubkey())\n    .log_wrapper(spl_noop::id())\n    .compression_program(spl_account_compression::id())\n    .system_program(system_program::id())\n    .max_depth(max_depth)\n    .max_buffer_size(max_buffer_size)\n    .public(false)\n    .build();\n// [/MAIN]\n\n// [OUTPUT]\nprintln!(\"Tree config instruction created\");\n// [/OUTPUT]\n"
}

const anchorSections = {
  "imports": "use anchor_lang::prelude::*;\nuse mpl_bubblegum::instructions::CreateTreeConfigCpiBuilder;",
  "setup": "",
  "main": "// Create tree config via CPI\nlet max_depth = 14;\nlet max_buffer_size = 64;\n\nCreateTreeConfigCpiBuilder::new(&ctx.accounts.bubblegum_program)\n    .tree_config(&ctx.accounts.tree_config)\n    .merkle_tree(&ctx.accounts.merkle_tree)\n    .payer(&ctx.accounts.payer)\n    .tree_creator(&ctx.accounts.payer)\n    .log_wrapper(&ctx.accounts.log_wrapper)\n    .compression_program(&ctx.accounts.compression_program)\n    .system_program(&ctx.accounts.system_program)\n    .max_depth(max_depth)\n    .max_buffer_size(max_buffer_size)\n    .public(false)\n    .invoke()?;",
  "output": "",
  "full": "// [IMPORTS]\nuse anchor_lang::prelude::*;\nuse mpl_bubblegum::instructions::CreateTreeConfigCpiBuilder;\n// [/IMPORTS]\n\n// [MAIN]\n// Create tree config via CPI\nlet max_depth = 14;\nlet max_buffer_size = 64;\n\nCreateTreeConfigCpiBuilder::new(&ctx.accounts.bubblegum_program)\n    .tree_config(&ctx.accounts.tree_config)\n    .merkle_tree(&ctx.accounts.merkle_tree)\n    .payer(&ctx.accounts.payer)\n    .tree_creator(&ctx.accounts.payer)\n    .log_wrapper(&ctx.accounts.log_wrapper)\n    .compression_program(&ctx.accounts.compression_program)\n    .system_program(&ctx.accounts.system_program)\n    .max_depth(max_depth)\n    .max_buffer_size(max_buffer_size)\n    .public(false)\n    .invoke()?;\n// [/MAIN]\n"
}

export const metadata = {
  title: "Create a Merkle Tree",
  description: "Create a Merkle tree for minting compressed NFTs with Bubblegum",
  tags: ['bubblegum', 'cnft', 'tree', 'beginner'],
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
