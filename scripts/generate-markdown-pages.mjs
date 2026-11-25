#!/usr/bin/env node

/**
 * Generate a Markdown copy of every English docs page for AI agents.
 *
 * Each page is written to public/<url-path>.md, so
 *   https://www.metaplex.com/docs/smart-contracts/core/create-asset
 * has a Markdown twin at
 *   https://www.metaplex.com/docs/smart-contracts/core/create-asset.md
 * The docs home is public/index.md. src/middleware.js also serves these files
 * for page URLs requested with `Accept: text/markdown`.
 *
 * Output is build-generated and gitignored. Manifest of written files lives in
 * public/.markdown-pages.json so the next run can remove stale pages.
 *
 * Usage:
 *   node scripts/generate-markdown-pages.mjs
 */

import fs from 'fs'
import path from 'path'
import { PUBLIC_DIR, collectPages, pageToMarkdown } from './lib/markdown-export.mjs'

const MANIFEST = path.join(PUBLIC_DIR, '.markdown-pages.json')

function main() {
  console.log('Generating Markdown pages...')

  // Remove files written by the previous run so renamed pages don't linger.
  if (fs.existsSync(MANIFEST)) {
    for (const rel of JSON.parse(fs.readFileSync(MANIFEST, 'utf-8'))) {
      fs.rmSync(path.join(PUBLIC_DIR, rel), { force: true })
    }
  }

  const pages = collectPages()
  const written = []
  for (const page of pages) {
    const rel = page.markdownPath.slice(1)
    const out = path.join(PUBLIC_DIR, rel)
    if (fs.existsSync(out)) {
      console.warn(`Warning: ${rel} already exists in public/ and is not generated; skipping`)
      continue
    }
    fs.mkdirSync(path.dirname(out), { recursive: true })
    fs.writeFileSync(out, pageToMarkdown(page), 'utf-8')
    written.push(rel)
  }

  fs.writeFileSync(MANIFEST, JSON.stringify(written.sort(), null, 2), 'utf-8')
  console.log(`Wrote ${written.length} Markdown pages to public/`)
}

main()
