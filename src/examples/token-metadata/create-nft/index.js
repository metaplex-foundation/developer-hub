/**
 * Example: Create an NFT with Token Metadata
 *
 * Create an NFT using the Token Metadata program
 */

const kitSections = {
  "imports": "import { createNft } from '@metaplex-foundation/mpl-token-metadata'",
  "setup": "// Initialize client\nconst client = createClient()",
  "main": "// Create a new NFT\nconst nft = await createNft({\n  name: 'My NFT',\n  symbol: 'MNFT',\n  uri: 'https://example.com/metadata.json',\n  sellerFeeBasisPoints: 500, // 5% royalty\n})",
  "output": "console.log('NFT created:', nft.mint.publicKey)",
  "full": "// [IMPORTS]\nimport { createNft } from '@metaplex-foundation/mpl-token-metadata'\n// [/IMPORTS]\n\n// [SETUP]\n// Initialize client\nconst client = createClient()\n// [/SETUP]\n\n// [MAIN]\n// Create a new NFT\nconst nft = await createNft({\n  name: 'My NFT',\n  symbol: 'MNFT',\n  uri: 'https://example.com/metadata.json',\n  sellerFeeBasisPoints: 500, // 5% royalty\n})\n// [/MAIN]\n\n// [OUTPUT]\nconsole.log('NFT created:', nft.mint.publicKey)\n// [/OUTPUT]\n"
}

const umiSections = {
  "imports": "import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'\nimport { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'\nimport { generateSigner, percentAmount } from '@metaplex-foundation/umi'",
  "setup": "// Initialize UMI\nconst umi = createUmi('https://api.devnet.solana.com')\n  .use(mplTokenMetadata())",
  "main": "// Generate a new mint signer\nconst mint = generateSigner(umi)\n\n// Create a new NFT\nawait createNft(umi, {\n  mint,\n  name: 'My NFT',\n  symbol: 'MNFT',\n  uri: 'https://example.com/metadata.json',\n  sellerFeeBasisPoints: percentAmount(5), // 5% royalty\n}).sendAndConfirm(umi)",
  "output": "console.log('NFT created:', mint.publicKey)",
  "full": "// [IMPORTS]\nimport { createUmi } from '@metaplex-foundation/umi-bundle-defaults'\nimport { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'\nimport { generateSigner, percentAmount } from '@metaplex-foundation/umi'\n// [/IMPORTS]\n\n// [SETUP]\n// Initialize UMI\nconst umi = createUmi('https://api.devnet.solana.com')\n  .use(mplTokenMetadata())\n// [/SETUP]\n\n// [MAIN]\n// Generate a new mint signer\nconst mint = generateSigner(umi)\n\n// Create a new NFT\nawait createNft(umi, {\n  mint,\n  name: 'My NFT',\n  symbol: 'MNFT',\n  uri: 'https://example.com/metadata.json',\n  sellerFeeBasisPoints: percentAmount(5), // 5% royalty\n}).sendAndConfirm(umi)\n// [/MAIN]\n\n// [OUTPUT]\nconsole.log('NFT created:', mint.publicKey)\n// [/OUTPUT]\n"
}

const shankSections = {
  "imports": "use mpl_token_metadata::instructions::CreateV1Builder;\nuse solana_sdk::signer::Signer;",
  "setup": "",
  "main": "// Create NFT instruction\nlet create_ix = CreateV1Builder::new()\n    .metadata(metadata_pda)\n    .master_edition(Some(master_edition_pda))\n    .mint(mint.pubkey(), true)\n    .authority(payer.pubkey())\n    .payer(payer.pubkey())\n    .update_authority(payer.pubkey(), true)\n    .name(\"My NFT\".to_string())\n    .symbol(\"MNFT\".to_string())\n    .uri(\"https://example.com/metadata.json\".to_string())\n    .seller_fee_basis_points(500)\n    .build();",
  "output": "println!(\"NFT instruction created\");",
  "full": "// [IMPORTS]\nuse mpl_token_metadata::instructions::CreateV1Builder;\nuse solana_sdk::signer::Signer;\n// [/IMPORTS]\n\n// [MAIN]\n// Create NFT instruction\nlet create_ix = CreateV1Builder::new()\n    .metadata(metadata_pda)\n    .master_edition(Some(master_edition_pda))\n    .mint(mint.pubkey(), true)\n    .authority(payer.pubkey())\n    .payer(payer.pubkey())\n    .update_authority(payer.pubkey(), true)\n    .name(\"My NFT\".to_string())\n    .symbol(\"MNFT\".to_string())\n    .uri(\"https://example.com/metadata.json\".to_string())\n    .seller_fee_basis_points(500)\n    .build();\n// [/MAIN]\n\n// [OUTPUT]\nprintln!(\"NFT instruction created\");\n// [/OUTPUT]\n"
}

const anchorSections = {
  "imports": "use anchor_lang::prelude::*;\nuse mpl_token_metadata::instructions::CreateV1CpiBuilder;",
  "setup": "",
  "main": "// Create NFT via CPI\nCreateV1CpiBuilder::new(&ctx.accounts.token_metadata_program)\n    .metadata(&ctx.accounts.metadata)\n    .master_edition(Some(&ctx.accounts.master_edition))\n    .mint(&ctx.accounts.mint, true)\n    .authority(&ctx.accounts.payer)\n    .payer(&ctx.accounts.payer)\n    .update_authority(&ctx.accounts.payer, true)\n    .system_program(&ctx.accounts.system_program)\n    .sysvar_instructions(&ctx.accounts.sysvar_instructions)\n    .spl_token_program(&ctx.accounts.token_program)\n    .name(\"My NFT\".to_string())\n    .symbol(\"MNFT\".to_string())\n    .uri(\"https://example.com/metadata.json\".to_string())\n    .seller_fee_basis_points(500)\n    .invoke()?;",
  "output": "",
  "full": "// [IMPORTS]\nuse anchor_lang::prelude::*;\nuse mpl_token_metadata::instructions::CreateV1CpiBuilder;\n// [/IMPORTS]\n\n// [MAIN]\n// Create NFT via CPI\nCreateV1CpiBuilder::new(&ctx.accounts.token_metadata_program)\n    .metadata(&ctx.accounts.metadata)\n    .master_edition(Some(&ctx.accounts.master_edition))\n    .mint(&ctx.accounts.mint, true)\n    .authority(&ctx.accounts.payer)\n    .payer(&ctx.accounts.payer)\n    .update_authority(&ctx.accounts.payer, true)\n    .system_program(&ctx.accounts.system_program)\n    .sysvar_instructions(&ctx.accounts.sysvar_instructions)\n    .spl_token_program(&ctx.accounts.token_program)\n    .name(\"My NFT\".to_string())\n    .symbol(\"MNFT\".to_string())\n    .uri(\"https://example.com/metadata.json\".to_string())\n    .seller_fee_basis_points(500)\n    .invoke()?;\n// [/MAIN]\n"
}

export const metadata = {
  title: "Create an NFT",
  description: "Create an NFT using the Token Metadata program",
  tags: ['token-metadata', 'nft', 'create', 'beginner'],
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
