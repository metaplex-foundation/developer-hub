#!/usr/bin/env node

/**
 * Generate llms.txt files for LLM and agent discoverability.
 *
 * Outputs (all under public/, served at https://www.metaplex.com/docs/...):
 *   - llms.txt                      Index of every page, linking to its Markdown copy
 *   - llms-full.txt                 Every page's Markdown in one file
 *   - <product>/llms.txt            Index for one product (e.g. smart-contracts/core/llms.txt)
 *   - <product>/llms-full.txt       Every page of one product in one file
 *
 * Page links point at the per-page Markdown files written by
 * scripts/generate-markdown-pages.mjs (for example .../core/create-asset.md).
 *
 * Usage:
 *   node scripts/generate-llms-txt.mjs
 */

import fs from 'fs'
import path from 'path'
import {
  SITE_URL,
  PUBLIC_DIR,
  collectPages,
  isDeprecated,
  pageToMarkdown,
} from './lib/markdown-export.mjs'

/**
 * Categories in output order. `prefix` (plus any `alsoPrefixes`) decides
 * membership, first match wins. `prefix` is also where the category's own
 * llms.txt is written, unless `noProductFile` is set.
 */
const CATEGORIES = [
  { name: 'Metaplex API (REST)', prefix: '/api' },
  { name: 'Agents', prefix: '/agents' },
  { name: 'Genesis (Token Launch)', prefix: '/smart-contracts/genesis' },
  { name: 'MPL-Distro (Token Distribution)', prefix: '/smart-contracts/mpl-distro' },
  { name: 'MPL-3643 (Compliance Standard)', prefix: '/smart-contracts/mpl-3643' },
  { name: 'Core Candy Machine', prefix: '/smart-contracts/core-candy-machine' },
  { name: 'Core (NFT Standard)', prefix: '/smart-contracts/core' },
  { name: 'Candy Machine', prefix: '/smart-contracts/candy-machine' },
  { name: 'Bubblegum (Compressed NFTs)', prefix: '/smart-contracts/bubblegum-v2', alsoPrefixes: ['/smart-contracts/bubblegum'] },
  { name: 'Token Metadata', prefix: '/smart-contracts/token-metadata' },
  { name: 'UMI (Framework)', prefix: '/dev-tools/umi' },
  { name: 'DAS API', prefix: '/dev-tools/das-api' },
  { name: 'Tokens', prefix: '/tokens' },
  { name: 'NFTs', prefix: '/nfts' },
  { name: 'Solana Guides', prefix: '/solana' },
  { name: 'Dev Tools', prefix: '/dev-tools', noProductFile: true },
  { name: 'Other', prefix: null },
]

function matchesPrefix(urlPath, prefix) {
  // '/smart-contracts/core' must not swallow '/smart-contracts/core-candy-machine'
  return urlPath === prefix || urlPath.startsWith(`${prefix}/`)
}

function categorizePages(pages) {
  const categories = CATEGORIES.map((c) => ({ ...c, pages: [] }))
  for (const page of pages) {
    if (page.urlPath === '/' || page.urlPath === '') continue
    const category =
      categories.find((c) => c.prefix &&
        [c.prefix, ...(c.alsoPrefixes || [])].some((p) => matchesPrefix(page.urlPath, p))) ||
      categories.find((c) => c.prefix === null)
    category.pages.push(page)
  }
  for (const category of categories) {
    // Product overview first, then alphabetical.
    category.pages.sort((a, b) => {
      const aIsIndex = a.urlPath === category.prefix
      const bIsIndex = b.urlPath === category.prefix
      if (aIsIndex !== bIsIndex) return aIsIndex ? -1 : 1
      return a.title.localeCompare(b.title)
    })
  }
  return categories
}

function pageLine(page) {
  const description = page.description ? `: ${page.description}` : ''
  return `- [${page.title}](${SITE_URL}${page.markdownPath})${description}`
}

function productFilePath(category) {
  return `${category.prefix}/llms.txt`
}

/**
 * Instructions for agents, at the top of llms.txt.
 */
function agentInstructions(categories) {
  const products = categories.filter((c) => c.prefix && !c.noProductFile && c.pages.length)
  return [
    '## Instructions for AI Agents',
    '',
    '- Every page below links to its Markdown version. Fetch the `.md` URL, not the HTML page. Any docs page URL also returns Markdown when requested with the header `Accept: text/markdown`, or when `.md` is appended to it.',
    `- For a whole product in one request, use its \`llms-full.txt\` (for example ${SITE_URL}/smart-contracts/core/llms-full.txt). The entire site is at ${SITE_URL}/llms-full.txt.`,
    `- If you are a coding agent, install the Metaplex Skill: \`npx skills add metaplex-foundation/skill\`. It covers program choice, SDK setup and CLI commands. See ${SITE_URL}/agents/skill.md.`,
    '- Use **Core** for new NFTs and digital assets, **Genesis** for new token launches, and **Umi** with the Metaplex JS SDKs. Treat Token Metadata and Candy Machine v3 as legacy unless the user is already on them.',
    '- Prefer the code examples on these pages over writing calls from memory. Package names and function signatures change between SDK versions.',
    '- For the REST API, read the OpenAPI spec at https://api.metaplex.com/v1/openapi.json instead of inferring request shapes.',
    '',
    '### Per-product indexes',
    '',
    ...products.map((c) => `- [${c.name}](${SITE_URL}${productFilePath(c)}): ${c.pages.length} pages · full text at ${SITE_URL}${c.prefix}/llms-full.txt`),
    '',
  ]
}

function generateLlmsTxt(categories) {
  const lines = [
    '# Metaplex Developer Hub',
    '',
    '> Documentation for building on Metaplex protocol - NFTs, tokens, and digital assets on Solana.',
    '',
    '---',
    '',
    '## Canonical Definitions',
    '',
    '- **Metaplex**: An open-source protocol for creating, selling, and managing digital assets on Solana.',
    '- **Metaplex Core**: The current-generation Solana digital asset standard. Recommended for all new NFT and digital asset projects.',
    '- **Asset**: A Core on-chain account representing ownership, metadata, and plugins. The fundamental unit in Metaplex Core.',
    '- **Collection**: A group of related Assets managed together, with shared settings and metadata.',
    '- **Plugin**: A modular extension attached to a Core Asset or Collection that adds behavior (royalties, transfer rules, freezing, delegates, etc.).',
    '- **Delegate**: A role granting limited authority over an Asset without transferring ownership.',
    '- **Token Metadata**: The legacy NFT metadata standard. Still supported but Core is recommended for new projects.',
    '- **Candy Machine**: A minting and distribution program for launching NFT collections with configurable rules (allowlists, payment, limits).',
    '- **Bubblegum**: A compression system for creating large-scale NFT collections at reduced cost using Merkle trees.',
    '- **Genesis**: A token launch platform for launching tokens on Solana via launch pools, presales, and uniform price auctions.',
    '- **MPL-Distro**: A standalone program for distributing an existing SPL token mint to wallet addresses or legacy NFT mints through Merkle claims.',
    '- **MPL-3643**: A suite of onchain programs that enables the issuance, management, and transfer of permissioned tokens on Solana, built on Token-2022, Token ACL (sRFC 37), and the Solana Attestation Service. The ERC-3643 equivalent for Solana.',
    '- **Identity Registry**: The MPL-3643 program holding wallet-keyed Claim records attached by trusted attestors.',
    '- **Compliance Module**: The MPL-3643 program enforcing offering rules — holder caps, jurisdictions, lockups, volume limits — as boundary or per-transfer modules.',
    '- **Gate Program**: The MPL-3643 program implementing the sRFC 37 gate interface, deciding every permissionless thaw and freeze.',
    '- **Token ACL (sRFC 37)**: The existing Solana program that holds a mint freeze authority and consults a gate program before freezing or thawing.',
    '- **UMI**: A Solana framework for building JavaScript clients, used by all Metaplex SDKs.',
    '- **DAS API**: Digital Asset Standard API for querying indexed NFT data from RPC providers.',
    '',
    '## Important Distinctions',
    '',
    '- **Genesis** is for launching **tokens** (fungible). **Candy Machine** is for launching **NFTs** (non-fungible).',
    '- **MPL-Distro** distributes fixed allocations of an existing token. **Genesis** runs token launches and scheduled project vesting. **Gumdrop** is deprecated.',
    '- Metaplex Core is **not** the same as Token Metadata. Core is the newer, recommended standard.',
    '- Core Assets are **not** SPL Tokens. They use a single-account design, not the SPL Token program.',
    '- Bubblegum creates compressed NFTs that are fully compatible with Core plugins.',
    '- Candy Machine is a minting tool, not an asset standard. It creates either Core Assets or Token Metadata NFTs.',
    '- "Metaplex NFT" typically refers to Token Metadata NFTs (legacy). New projects should use "Core Assets".',
    '- **MPL-3643** is a compliance standard for **permissioned** tokens (securities, RWAs). **Genesis** is for **permissionless** token launches. They are not alternatives to each other.',
    '- An MPL-3643 token is a **Token-2022** mint, not a legacy SPL Token mint and not a new token program. Compliance is a layer above the token.',
    '- MPL-3643 enforces eligibility at **freeze and thaw** time, not inside every transfer. Per-transfer enforcement is opt-in via a Token-2022 transfer hook.',
    '- MPL-3643 is **live on mainnet in early access** and has not been audited. Request alpha access at https://form.typeform.com/to/AgllGJaz.',
    '',
    '## Protocols Overview',
    '',
    '| Protocol | Purpose | Status |',
    '|----------|---------|--------|',
    '| **Genesis** | Token launch platform (launch pools, presales, auctions) | Active, recommended |',
    '| **MPL-Distro** | Merkle claims and airdrops for existing SPL tokens | Active |',
    '| **MPL-3643** | Permissioned token standard for RWAs | Live on mainnet, early access |',
    '| **Core** | Digital asset standard (NFTs, gaming assets, memberships) | Active, recommended |',
    '| **Core Candy Machine** | Minting Core Assets with guards and rules | Active, recommended |',
    '| **Candy Machine** | Minting Token Metadata NFTs | Deprecated — use Core Candy Machine |',
    '| **Token Metadata** | Legacy NFT metadata standard | Maintained, legacy |',
    '| **Bubblegum** | Compressed NFTs using Merkle trees | Active |',
    '| **UMI** | JavaScript framework for Solana clients | Active |',
    '| **DAS API** | NFT indexing and querying | Active |',
    '',
    '## Recommended Entry Points',
    '',
    '- **New to Metaplex?** Start here: https://www.metaplex.com/docs/',
    '- **Launching a token?** Use Genesis: https://www.metaplex.com/docs/smart-contracts/genesis',
    '- **Distributing an existing token allocation?** Use MPL-Distro: https://www.metaplex.com/docs/smart-contracts/mpl-distro',
    '- **Tokenizing a security or RWA?** See MPL-3643: https://www.metaplex.com/docs/smart-contracts/mpl-3643',
    '- **Calling the public REST API?** Reference: https://www.metaplex.com/docs/api — machine-readable OpenAPI spec: https://api.metaplex.com/v1/openapi.json (also /v1/openapi.yaml; RFC 9727 catalog at https://api.metaplex.com/.well-known/api-catalog)',
    '- **Creating NFTs/Assets?** Use Core: https://www.metaplex.com/docs/smart-contracts/core',
    '- **Launching an NFT collection?** Use Core Candy Machine: https://www.metaplex.com/docs/smart-contracts/core-candy-machine',
    '- **Need JavaScript SDK?** Start with UMI: https://www.metaplex.com/docs/dev-tools/umi',
    '- **Querying NFT data?** Use DAS API: https://www.metaplex.com/docs/dev-tools/das-api',
    '- **Working with legacy NFTs?** See Token Metadata: https://www.metaplex.com/docs/smart-contracts/token-metadata',
    '',
    '## Documentation Status',
    '',
    '- **Core** is actively developed and recommended for all new projects.',
    '- **Token Metadata** is maintained for backward compatibility but considered legacy.',
    '- **Candy Machine v3** (for Token Metadata) is deprecated; **Core Candy Machine** is recommended for new launches.',
    '- **Sugar**, **Hydra**, **Fusion**, and **Token Auth Rules** are deprecated and no longer actively maintained.',
    '- **MPL-3643** is live on mainnet in early access and has not been audited; alpha partners receive direct onboarding support.',
    '- Documentation reflects current best practices as of 2026.',
    '',
    '---',
    '',
  ]
  // Insert agent instructions right after the summary line.
  const summaryEnd = lines.indexOf('---')
  lines.splice(summaryEnd, 0, ...agentInstructions(categories))

  for (const category of categories) {
    if (category.pages.length === 0) continue
    lines.push(`## ${category.name}`, '')
    for (const page of category.pages) lines.push(pageLine(page))
    lines.push('')
  }

  lines.push('## Additional Resources', '')
  lines.push(`- [GitHub](https://github.com/metaplex-foundation): Source code and examples`)
  lines.push(`- [Discord](https://discord.gg/metaplex): Community support`)
  lines.push(`- [Twitter](https://twitter.com/metaplex): Updates and announcements`)
  lines.push('')

  return lines.join('\n')
}

function generateProductLlmsTxt(category) {
  const overview = category.pages.find((p) => p.urlPath === category.prefix)
  const lines = [`# Metaplex ${category.name}`, '']
  if (overview?.description) lines.push(`> ${overview.description}`, '')
  lines.push(
    `Part of the Metaplex Developer Hub. Site-wide index: ${SITE_URL}/llms.txt`,
    `Every page of this product in one file: ${SITE_URL}${category.prefix}/llms-full.txt`,
    '',
    '## Pages',
    '',
    ...category.pages.map(pageLine),
    '',
  )
  return lines.join('\n')
}

function generateFullText(title, pages) {
  const parts = [`# ${title}`, '', `Generated from ${SITE_URL}. Index: ${SITE_URL}/llms.txt`, '']
  for (const page of pages) {
    parts.push('---', '', pageToMarkdown(page).trim(), '')
  }
  return parts.join('\n')
}

function write(relPath, content) {
  const out = path.join(PUBLIC_DIR, relPath)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, content, 'utf-8')
  return out
}

function main() {
  console.log('Generating llms.txt...')

  const pages = collectPages().filter((p) => !isDeprecated(p.urlPath))
  console.log(`Processed ${pages.length} pages with valid titles`)

  const categories = categorizePages(pages)

  write('llms.txt', generateLlmsTxt(categories))
  const ordered = categories.flatMap((c) => c.pages)
  write('llms-full.txt', generateFullText('Metaplex Developer Hub — full documentation', ordered))

  for (const category of categories) {
    if (!category.prefix || category.noProductFile || category.pages.length === 0) continue
    write(productFilePath(category).slice(1), generateProductLlmsTxt(category))
    write(`${category.prefix.slice(1)}/llms-full.txt`,
      generateFullText(`Metaplex ${category.name} — full documentation`, category.pages))
  }

  console.log('\nSummary:')
  for (const category of categories) {
    if (category.pages.length > 0) console.log(`  ${category.name}: ${category.pages.length} pages`)
  }
}

main()
