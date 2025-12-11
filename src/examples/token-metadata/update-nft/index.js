/**
 * Example: Update NFT Metadata
 *
 * Update an existing NFT's metadata using the Token Metadata program
 */

const kitSections = {
  "imports": "import { updateNft } from '@metaplex-foundation/mpl-token-metadata'",
  "setup": "// Initialize client\nconst client = createClient()",
  "main": "// Update NFT metadata\nawait updateNft({\n  mint: mintAddress,\n  name: 'Updated NFT Name',\n  symbol: 'UNFT',\n  uri: 'https://example.com/new-metadata.json',\n})",
  "output": "console.log('NFT updated successfully')",
  "full": "// [IMPORTS]\nimport { updateNft } from '@metaplex-foundation/mpl-token-metadata'\n// [/IMPORTS]\n\n// [SETUP]\n// Initialize client\nconst client = createClient()\n// [/SETUP]\n\n// [MAIN]\n// Update NFT metadata\nawait updateNft({\n  mint: mintAddress,\n  name: 'Updated NFT Name',\n  symbol: 'UNFT',\n  uri: 'https://example.com/new-metadata.json',\n})\n// [/MAIN]\n\n// [OUTPUT]\nconsole.log('NFT updated successfully')\n// [/OUTPUT]\n"
}

const umiSections = {
  "imports": "import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'\nimport { updateV1, mplTokenMetadata, fetchMetadataFromSeeds } from '@metaplex-foundation/mpl-token-metadata'\nimport { publicKey } from '@metaplex-foundation/umi'",
  "setup": "// Initialize UMI\nconst umi = createUmi('https://api.devnet.solana.com')\n  .use(mplTokenMetadata())\n\n// Fetch existing metadata\nconst mintAddress = publicKey('YOUR_MINT_ADDRESS')\nconst initialMetadata = await fetchMetadataFromSeeds(umi, { mint: mintAddress })",
  "main": "// Update NFT metadata\nawait updateV1(umi, {\n  mint: mintAddress,\n  authority: umi.identity,\n  data: {\n    ...initialMetadata,\n    name: 'Updated NFT Name',\n    symbol: 'UNFT',\n    uri: 'https://example.com/new-metadata.json',\n  },\n}).sendAndConfirm(umi)",
  "output": "console.log('NFT updated successfully')",
  "full": "// [IMPORTS]\nimport { createUmi } from '@metaplex-foundation/umi-bundle-defaults'\nimport { updateV1, mplTokenMetadata, fetchMetadataFromSeeds } from '@metaplex-foundation/mpl-token-metadata'\nimport { publicKey } from '@metaplex-foundation/umi'\n// [/IMPORTS]\n\n// [SETUP]\n// Initialize UMI\nconst umi = createUmi('https://api.devnet.solana.com')\n  .use(mplTokenMetadata())\n\n// Fetch existing metadata\nconst mintAddress = publicKey('YOUR_MINT_ADDRESS')\nconst initialMetadata = await fetchMetadataFromSeeds(umi, { mint: mintAddress })\n// [/SETUP]\n\n// [MAIN]\n// Update NFT metadata\nawait updateV1(umi, {\n  mint: mintAddress,\n  authority: umi.identity,\n  data: {\n    ...initialMetadata,\n    name: 'Updated NFT Name',\n    symbol: 'UNFT',\n    uri: 'https://example.com/new-metadata.json',\n  },\n}).sendAndConfirm(umi)\n// [/MAIN]\n\n// [OUTPUT]\nconsole.log('NFT updated successfully')\n// [/OUTPUT]\n"
}

const shankSections = {
  "imports": "use mpl_token_metadata::instructions::UpdateV1Builder;\nuse mpl_token_metadata::types::Data;\nuse solana_sdk::signer::Signer;",
  "setup": "",
  "main": "// Update NFT metadata instruction\nlet update_ix = UpdateV1Builder::new()\n    .metadata(metadata_pda)\n    .authority(authority.pubkey())\n    .new_name(\"Updated NFT Name\".to_string())\n    .new_symbol(\"UNFT\".to_string())\n    .new_uri(\"https://example.com/new-metadata.json\".to_string())\n    .build();",
  "output": "println!(\"NFT update instruction created\");",
  "full": "// [IMPORTS]\nuse mpl_token_metadata::instructions::UpdateV1Builder;\nuse mpl_token_metadata::types::Data;\nuse solana_sdk::signer::Signer;\n// [/IMPORTS]\n\n// [MAIN]\n// Update NFT metadata instruction\nlet update_ix = UpdateV1Builder::new()\n    .metadata(metadata_pda)\n    .authority(authority.pubkey())\n    .new_name(\"Updated NFT Name\".to_string())\n    .new_symbol(\"UNFT\".to_string())\n    .new_uri(\"https://example.com/new-metadata.json\".to_string())\n    .build();\n// [/MAIN]\n\n// [OUTPUT]\nprintln!(\"NFT update instruction created\");\n// [/OUTPUT]\n"
}

const anchorSections = {
  "imports": "use anchor_lang::prelude::*;\nuse mpl_token_metadata::instructions::UpdateV1CpiBuilder;",
  "setup": "",
  "main": "// Update NFT metadata via CPI\nUpdateV1CpiBuilder::new(&ctx.accounts.token_metadata_program)\n    .metadata(&ctx.accounts.metadata)\n    .authority(&ctx.accounts.authority)\n    .new_name(\"Updated NFT Name\".to_string())\n    .new_symbol(\"UNFT\".to_string())\n    .new_uri(\"https://example.com/new-metadata.json\".to_string())\n    .invoke()?;",
  "output": "",
  "full": "// [IMPORTS]\nuse anchor_lang::prelude::*;\nuse mpl_token_metadata::instructions::UpdateV1CpiBuilder;\n// [/IMPORTS]\n\n// [MAIN]\n// Update NFT metadata via CPI\nUpdateV1CpiBuilder::new(&ctx.accounts.token_metadata_program)\n    .metadata(&ctx.accounts.metadata)\n    .authority(&ctx.accounts.authority)\n    .new_name(\"Updated NFT Name\".to_string())\n    .new_symbol(\"UNFT\".to_string())\n    .new_uri(\"https://example.com/new-metadata.json\".to_string())\n    .invoke()?;\n// [/MAIN]\n"
}

export const metadata = {
  title: "Update NFT Metadata",
  description: "Update an existing NFT's metadata using the Token Metadata program",
  tags: ['token-metadata', 'nft', 'update', 'intermediate'],
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
