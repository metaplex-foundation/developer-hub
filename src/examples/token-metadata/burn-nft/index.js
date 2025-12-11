/**
 * Example: Burn an NFT
 *
 * Burn an NFT using the Token Metadata program
 */

const kitSections = {
  "imports": "import { burnNft } from '@metaplex-foundation/mpl-token-metadata'",
  "setup": "// Initialize client\nconst client = createClient()",
  "main": "// Burn the NFT\nawait burnNft({\n  mint: mintAddress,\n  owner: ownerKeypair,\n})",
  "output": "console.log('NFT burned successfully')",
  "full": "// [IMPORTS]\nimport { burnNft } from '@metaplex-foundation/mpl-token-metadata'\n// [/IMPORTS]\n\n// [SETUP]\n// Initialize client\nconst client = createClient()\n// [/SETUP]\n\n// [MAIN]\n// Burn the NFT\nawait burnNft({\n  mint: mintAddress,\n  owner: ownerKeypair,\n})\n// [/MAIN]\n\n// [OUTPUT]\nconsole.log('NFT burned successfully')\n// [/OUTPUT]\n"
}

const umiSections = {
  "imports": "import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'\nimport { burnV1, mplTokenMetadata, TokenStandard } from '@metaplex-foundation/mpl-token-metadata'\nimport { publicKey } from '@metaplex-foundation/umi'",
  "setup": "// Initialize UMI\nconst umi = createUmi('https://api.devnet.solana.com')\n  .use(mplTokenMetadata())\n\nconst mintAddress = publicKey('YOUR_MINT_ADDRESS')",
  "main": "// Burn the NFT\nawait burnV1(umi, {\n  mint: mintAddress,\n  authority: umi.identity,\n  tokenOwner: umi.identity.publicKey,\n  tokenStandard: TokenStandard.NonFungible,\n}).sendAndConfirm(umi)",
  "output": "console.log('NFT burned successfully')",
  "full": "// [IMPORTS]\nimport { createUmi } from '@metaplex-foundation/umi-bundle-defaults'\nimport { burnV1, mplTokenMetadata, TokenStandard } from '@metaplex-foundation/mpl-token-metadata'\nimport { publicKey } from '@metaplex-foundation/umi'\n// [/IMPORTS]\n\n// [SETUP]\n// Initialize UMI\nconst umi = createUmi('https://api.devnet.solana.com')\n  .use(mplTokenMetadata())\n\nconst mintAddress = publicKey('YOUR_MINT_ADDRESS')\n// [/SETUP]\n\n// [MAIN]\n// Burn the NFT\nawait burnV1(umi, {\n  mint: mintAddress,\n  authority: umi.identity,\n  tokenOwner: umi.identity.publicKey,\n  tokenStandard: TokenStandard.NonFungible,\n}).sendAndConfirm(umi)\n// [/MAIN]\n\n// [OUTPUT]\nconsole.log('NFT burned successfully')\n// [/OUTPUT]\n"
}

const shankSections = {
  "imports": "use mpl_token_metadata::instructions::BurnV1Builder;\nuse solana_sdk::signer::Signer;",
  "setup": "",
  "main": "// Burn NFT instruction\nlet burn_ix = BurnV1Builder::new()\n    .authority(owner.pubkey())\n    .metadata(metadata_pda)\n    .edition(Some(master_edition_pda))\n    .mint(mint)\n    .token(token_account)\n    .amount(1)\n    .build();",
  "output": "println!(\"NFT burn instruction created\");",
  "full": "// [IMPORTS]\nuse mpl_token_metadata::instructions::BurnV1Builder;\nuse solana_sdk::signer::Signer;\n// [/IMPORTS]\n\n// [MAIN]\n// Burn NFT instruction\nlet burn_ix = BurnV1Builder::new()\n    .authority(owner.pubkey())\n    .metadata(metadata_pda)\n    .edition(Some(master_edition_pda))\n    .mint(mint)\n    .token(token_account)\n    .amount(1)\n    .build();\n// [/MAIN]\n\n// [OUTPUT]\nprintln!(\"NFT burn instruction created\");\n// [/OUTPUT]\n"
}

const anchorSections = {
  "imports": "use anchor_lang::prelude::*;\nuse mpl_token_metadata::instructions::BurnV1CpiBuilder;",
  "setup": "",
  "main": "// Burn NFT via CPI\nBurnV1CpiBuilder::new(&ctx.accounts.token_metadata_program)\n    .authority(&ctx.accounts.owner)\n    .metadata(&ctx.accounts.metadata)\n    .edition(Some(&ctx.accounts.master_edition))\n    .mint(&ctx.accounts.mint)\n    .token(&ctx.accounts.token)\n    .system_program(&ctx.accounts.system_program)\n    .sysvar_instructions(&ctx.accounts.sysvar_instructions)\n    .spl_token_program(&ctx.accounts.token_program)\n    .amount(1)\n    .invoke()?;",
  "output": "",
  "full": "// [IMPORTS]\nuse anchor_lang::prelude::*;\nuse mpl_token_metadata::instructions::BurnV1CpiBuilder;\n// [/IMPORTS]\n\n// [MAIN]\n// Burn NFT via CPI\nBurnV1CpiBuilder::new(&ctx.accounts.token_metadata_program)\n    .authority(&ctx.accounts.owner)\n    .metadata(&ctx.accounts.metadata)\n    .edition(Some(&ctx.accounts.master_edition))\n    .mint(&ctx.accounts.mint)\n    .token(&ctx.accounts.token)\n    .system_program(&ctx.accounts.system_program)\n    .sysvar_instructions(&ctx.accounts.sysvar_instructions)\n    .spl_token_program(&ctx.accounts.token_program)\n    .amount(1)\n    .invoke()?;\n// [/MAIN]\n"
}

export const metadata = {
  title: "Burn an NFT",
  description: "Burn an NFT using the Token Metadata program",
  tags: ['token-metadata', 'nft', 'burn', 'beginner'],
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
