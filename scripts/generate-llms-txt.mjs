#!/usr/bin/env node

/**
 * Generate llms.txt file for LLM discoverability
 *
 * This script generates a plain text file (similar to robots.txt) that helps
 * LLMs understand and prioritize site content. It parses markdown files and
 * organizes them by product/category.
 *
 * Usage:
 *   node scripts/generate-llms-txt.mjs
 *
 * Output:
 *   public/llms.txt
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SITE_URL = 'https://metaplex.com/docs'
const PAGES_DIR = path.join(__dirname, '..', 'src', 'pages', 'en')
const OUTPUT_FILE = path.join(__dirname, '..', 'public', 'llms.txt')

/**
 * Parse frontmatter from markdown content
 */
function parseFrontmatter(content) {
  // Handle both Unix (\n) and Windows (\r\n) line endings
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!frontmatterMatch) {
    return {}
  }

  const frontmatterStr = frontmatterMatch[1]
  const frontmatter = {}

  // Split by either line ending type
  for (const line of frontmatterStr.split(/\r?\n/)) {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim()
      // Also trim any trailing \r that might remain
      let value = line.slice(colonIndex + 1).trim().replace(/\r$/, '')
      // Remove surrounding quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      frontmatter[key] = value
    }
  }

  return frontmatter
}

/**
 * Get all markdown files recursively
 */
function getMarkdownFiles(dir) {
  const files = []

  if (!fs.existsSync(dir)) {
    return files
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      files.push(...getMarkdownFiles(fullPath))
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Convert file path to URL path
 */
function filePathToUrlPath(filePath) {
  let urlPath = path.relative(PAGES_DIR, filePath)
    .replace(/\\/g, '/')
    .replace(/\.md$/, '')

  // Handle index files
  if (urlPath.endsWith('/index')) {
    urlPath = urlPath.slice(0, -6)
  }
  if (urlPath === 'index') {
    urlPath = ''
  }

  return '/' + urlPath
}

/**
 * Categorize pages by their path structure
 */
function categorizePages(pages) {
  const categories = {
    'Genesis (Token Launch)': [],
    'Core (NFT Standard)': [],
    'Candy Machine': [],
    'Core Candy Machine': [],
    'Bubblegum (Compressed NFTs)': [],
    'Token Metadata': [],
    'UMI (Framework)': [],
    'DAS API': [],
    'Guides': [],
    'Dev Tools': [],
    'Other': [],
  }

  for (const page of pages) {
    const urlPath = page.urlPath

    if (urlPath.startsWith('/smart-contracts/genesis')) {
      categories['Genesis (Token Launch)'].push(page)
    } else if (urlPath.startsWith('/smart-contracts/core/') || urlPath === '/smart-contracts/core') {
      if (!urlPath.includes('candy-machine')) {
        categories['Core (NFT Standard)'].push(page)
      }
    } else if (urlPath.startsWith('/smart-contracts/core-candy-machine')) {
      categories['Core Candy Machine'].push(page)
    } else if (urlPath.startsWith('/smart-contracts/candy-machine')) {
      categories['Candy Machine'].push(page)
    } else if (urlPath.startsWith('/smart-contracts/bubblegum')) {
      categories['Bubblegum (Compressed NFTs)'].push(page)
    } else if (urlPath.startsWith('/smart-contracts/token-metadata')) {
      categories['Token Metadata'].push(page)
    } else if (urlPath.startsWith('/dev-tools/umi')) {
      categories['UMI (Framework)'].push(page)
    } else if (urlPath.startsWith('/dev-tools/das-api')) {
      categories['DAS API'].push(page)
    } else if (urlPath.startsWith('/guides')) {
      categories['Guides'].push(page)
    } else if (urlPath.startsWith('/dev-tools')) {
      categories['Dev Tools'].push(page)
    } else if (urlPath !== '' && urlPath !== '/') {
      categories['Other'].push(page)
    }
  }

  return categories
}

/**
 * Generate llms.txt content
 */
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
    '- **UMI**: A Solana framework for building JavaScript clients, used by all Metaplex SDKs.',
    '- **DAS API**: Digital Asset Standard API for querying indexed NFT data from RPC providers.',
    '',
    '## Important Distinctions',
    '',
    '- **Genesis** is for launching **tokens** (fungible). **Candy Machine** is for launching **NFTs** (non-fungible).',
    '- Metaplex Core is **not** the same as Token Metadata. Core is the newer, recommended standard.',
    '- Core Assets are **not** SPL Tokens. They use a single-account design, not the SPL Token program.',
    '- Bubblegum creates compressed NFTs that are fully compatible with Core plugins.',
    '- Candy Machine is a minting tool, not an asset standard. It creates either Core Assets or Token Metadata NFTs.',
    '- "Metaplex NFT" typically refers to Token Metadata NFTs (legacy). New projects should use "Core Assets".',
    '',
    '## Protocols Overview',
    '',
    '| Protocol | Purpose | Status |',
    '|----------|---------|--------|',
    '| **Genesis** | Token launch platform (launch pools, presales, auctions) | Active, recommended |',
    '| **Core** | Digital asset standard (NFTs, gaming assets, memberships) | Active, recommended |',
    '| **Core Candy Machine** | Minting Core Assets with guards and rules | Active, recommended |',
    '| **Candy Machine** | Minting Token Metadata NFTs | Active, legacy |',
    '| **Token Metadata** | Legacy NFT metadata standard | Maintained, legacy |',
    '| **Bubblegum** | Compressed NFTs using Merkle trees | Active |',
    '| **UMI** | JavaScript framework for Solana clients | Active |',
    '| **DAS API** | NFT indexing and querying | Active |',
    '',
    '## Recommended Entry Points',
    '',
    '- **New to Metaplex?** Start here: https://metaplex.com/docs/',
    '- **Launching a token?** Use Genesis: https://metaplex.com/docs/smart-contracts/genesis',
    '- **Creating NFTs/Assets?** Use Core: https://metaplex.com/docs/smart-contracts/core',
    '- **Launching an NFT collection?** Use Core Candy Machine: https://metaplex.com/docs/smart-contracts/core-candy-machine',
    '- **Need JavaScript SDK?** Start with UMI: https://metaplex.com/docs/dev-tools/umi',
    '- **Querying NFT data?** Use DAS API: https://metaplex.com/docs/dev-tools/das-api',
    '- **Working with legacy NFTs?** See Token Metadata: https://metaplex.com/docs/smart-contracts/token-metadata',
    '',
    '## Documentation Status',
    '',
    '- **Core** is actively developed and recommended for all new projects.',
    '- **Token Metadata** is maintained for backward compatibility but considered legacy.',
    '- **Candy Machine v3** (for Token Metadata) is stable; **Core Candy Machine** is recommended for new launches.',
    '- Documentation reflects current best practices as of 2025.',
    '',
    '---',
    '',
  ]

  // Add each category
  for (const [category, pages] of Object.entries(categories)) {
    if (pages.length === 0) continue

    lines.push(`## ${category}`)
    lines.push('')

    // Sort pages: index pages first, then alphabetically
    const sortedPages = pages.sort((a, b) => {
      const aIsIndex = a.urlPath.endsWith(a.urlPath.split('/').slice(-2, -1)[0]) || a.title === 'Overview'
      const bIsIndex = b.urlPath.endsWith(b.urlPath.split('/').slice(-2, -1)[0]) || b.title === 'Overview'

      if (aIsIndex && !bIsIndex) return -1
      if (!aIsIndex && bIsIndex) return 1
      return a.title.localeCompare(b.title)
    })

    for (const page of sortedPages) {
      const description = page.description ? `: ${page.description}` : ''
      lines.push(`- [${page.title}](${SITE_URL}${page.urlPath})${description}`)
    }

    lines.push('')
  }

  // Add footer
  lines.push('## Additional Resources')
  lines.push('')
  lines.push(`- [GitHub](https://github.com/metaplex-foundation): Source code and examples`)
  lines.push(`- [Discord](https://discord.gg/metaplex): Community support`)
  lines.push(`- [Twitter](https://twitter.com/metaplex): Updates and announcements`)
  lines.push('')

  return lines.join('\n')
}

/**
 * Main function
 */
function main() {
  console.log('Generating llms.txt...')

  // Get all markdown files
  const markdownFiles = getMarkdownFiles(PAGES_DIR)
  console.log(`Found ${markdownFiles.length} markdown files`)

  // Parse each file
  const pages = []

  for (const filePath of markdownFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const frontmatter = parseFrontmatter(content)

      // Skip pages without titles or with empty titles
      if (!frontmatter.title && !frontmatter.metaTitle) {
        continue
      }

      const title = frontmatter.title || frontmatter.metaTitle.split('|')[0].trim()

      // Skip legacy documentation for cleaner output
      const urlPath = filePathToUrlPath(filePath)
      if (urlPath.startsWith('/legacy-documentation')) {
        continue
      }

      pages.push({
        filePath,
        urlPath,
        title,
        description: frontmatter.description || '',
      })
    } catch (error) {
      console.warn(`Warning: Could not parse ${filePath}: ${error.message}`)
    }
  }

  console.log(`Processed ${pages.length} pages with valid titles`)

  // Categorize pages
  const categories = categorizePages(pages)

  // Generate content
  const content = generateLlmsTxt(categories)

  // Write output file
  fs.writeFileSync(OUTPUT_FILE, content, 'utf-8')
  console.log(`Generated ${OUTPUT_FILE}`)

  // Print summary
  console.log('\nSummary:')
  for (const [category, categoryPages] of Object.entries(categories)) {
    if (categoryPages.length > 0) {
      console.log(`  ${category}: ${categoryPages.length} pages`)
    }
  }
}

main()
