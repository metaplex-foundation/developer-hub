/**
 * Example: Transfer an NFT
 *
 * Transfer an NFT to another wallet using the Token Metadata program
 */

const kitSections = {
  "imports": "import { transferNft } from '@metaplex-foundation/mpl-token-metadata'",
  "setup": "// Initialize client\nconst client = createClient()",
  "main": "// Transfer NFT to new owner\nawait transferNft({\n  mint: mintAddress,\n  destination: newOwnerAddress,\n  owner: currentOwner,\n})",
  "output": "console.log('NFT transferred successfully')",
  "full": "// [IMPORTS]\nimport { transferNft } from '@metaplex-foundation/mpl-token-metadata'\n// [/IMPORTS]\n\n// [SETUP]\n// Initialize client\nconst client = createClient()\n// [/SETUP]\n\n// [MAIN]\n// Transfer NFT to new owner\nawait transferNft({\n  mint: mintAddress,\n  destination: newOwnerAddress,\n  owner: currentOwner,\n})\n// [/MAIN]\n\n// [OUTPUT]\nconsole.log('NFT transferred successfully')\n// [/OUTPUT]\n"
}

const umiSections = {
  "imports": "import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'\nimport { transferV1, mplTokenMetadata, TokenStandard } from '@metaplex-foundation/mpl-token-metadata'\nimport { publicKey } from '@metaplex-foundation/umi'",
  "setup": "// Initialize UMI\nconst umi = createUmi('https://api.devnet.solana.com')\n  .use(mplTokenMetadata())\n\nconst mintAddress = publicKey('YOUR_MINT_ADDRESS')\nconst destinationOwner = publicKey('DESTINATION_WALLET')",
  "main": "// Transfer NFT to new owner\nawait transferV1(umi, {\n  mint: mintAddress,\n  authority: umi.identity,\n  tokenOwner: umi.identity.publicKey,\n  destinationOwner,\n  tokenStandard: TokenStandard.NonFungible,\n}).sendAndConfirm(umi)",
  "output": "console.log('NFT transferred to:', destinationOwner)",
  "full": "// [IMPORTS]\nimport { createUmi } from '@metaplex-foundation/umi-bundle-defaults'\nimport { transferV1, mplTokenMetadata, TokenStandard } from '@metaplex-foundation/mpl-token-metadata'\nimport { publicKey } from '@metaplex-foundation/umi'\n// [/IMPORTS]\n\n// [SETUP]\n// Initialize UMI\nconst umi = createUmi('https://api.devnet.solana.com')\n  .use(mplTokenMetadata())\n\nconst mintAddress = publicKey('YOUR_MINT_ADDRESS')\nconst destinationOwner = publicKey('DESTINATION_WALLET')\n// [/SETUP]\n\n// [MAIN]\n// Transfer NFT to new owner\nawait transferV1(umi, {\n  mint: mintAddress,\n  authority: umi.identity,\n  tokenOwner: umi.identity.publicKey,\n  destinationOwner,\n  tokenStandard: TokenStandard.NonFungible,\n}).sendAndConfirm(umi)\n// [/MAIN]\n\n// [OUTPUT]\nconsole.log('NFT transferred to:', destinationOwner)\n// [/OUTPUT]\n"
}

const shankSections = {
  "imports": "use mpl_token_metadata::instructions::TransferV1Builder;\nuse solana_sdk::signer::Signer;",
  "setup": "",
  "main": "// Transfer NFT instruction\nlet transfer_ix = TransferV1Builder::new()\n    .token(source_token_account)\n    .token_owner(owner.pubkey())\n    .destination_token(destination_token_account)\n    .destination_owner(destination_owner)\n    .mint(mint)\n    .metadata(metadata_pda)\n    .authority(owner.pubkey())\n    .payer(payer.pubkey())\n    .amount(1)\n    .build();",
  "output": "println!(\"NFT transfer instruction created\");",
  "full": "// [IMPORTS]\nuse mpl_token_metadata::instructions::TransferV1Builder;\nuse solana_sdk::signer::Signer;\n// [/IMPORTS]\n\n// [MAIN]\n// Transfer NFT instruction\nlet transfer_ix = TransferV1Builder::new()\n    .token(source_token_account)\n    .token_owner(owner.pubkey())\n    .destination_token(destination_token_account)\n    .destination_owner(destination_owner)\n    .mint(mint)\n    .metadata(metadata_pda)\n    .authority(owner.pubkey())\n    .payer(payer.pubkey())\n    .amount(1)\n    .build();\n// [/MAIN]\n\n// [OUTPUT]\nprintln!(\"NFT transfer instruction created\");\n// [/OUTPUT]\n"
}

const anchorSections = {
  "imports": "use anchor_lang::prelude::*;\nuse mpl_token_metadata::instructions::TransferV1CpiBuilder;",
  "setup": "",
  "main": "// Transfer NFT via CPI\nTransferV1CpiBuilder::new(&ctx.accounts.token_metadata_program)\n    .token(&ctx.accounts.source_token)\n    .token_owner(&ctx.accounts.owner)\n    .destination_token(&ctx.accounts.destination_token)\n    .destination_owner(&ctx.accounts.destination_owner)\n    .mint(&ctx.accounts.mint)\n    .metadata(&ctx.accounts.metadata)\n    .authority(&ctx.accounts.owner)\n    .payer(&ctx.accounts.payer)\n    .system_program(&ctx.accounts.system_program)\n    .sysvar_instructions(&ctx.accounts.sysvar_instructions)\n    .spl_token_program(&ctx.accounts.token_program)\n    .spl_ata_program(&ctx.accounts.ata_program)\n    .amount(1)\n    .invoke()?;",
  "output": "",
  "full": "// [IMPORTS]\nuse anchor_lang::prelude::*;\nuse mpl_token_metadata::instructions::TransferV1CpiBuilder;\n// [/IMPORTS]\n\n// [MAIN]\n// Transfer NFT via CPI\nTransferV1CpiBuilder::new(&ctx.accounts.token_metadata_program)\n    .token(&ctx.accounts.source_token)\n    .token_owner(&ctx.accounts.owner)\n    .destination_token(&ctx.accounts.destination_token)\n    .destination_owner(&ctx.accounts.destination_owner)\n    .mint(&ctx.accounts.mint)\n    .metadata(&ctx.accounts.metadata)\n    .authority(&ctx.accounts.owner)\n    .payer(&ctx.accounts.payer)\n    .system_program(&ctx.accounts.system_program)\n    .sysvar_instructions(&ctx.accounts.sysvar_instructions)\n    .spl_token_program(&ctx.accounts.token_program)\n    .spl_ata_program(&ctx.accounts.ata_program)\n    .amount(1)\n    .invoke()?;\n// [/MAIN]\n"
}

export const metadata = {
  title: "Transfer an NFT",
  description: "Transfer an NFT to another wallet using the Token Metadata program",
  tags: ['token-metadata', 'nft', 'transfer', 'beginner'],
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
