#!/usr/bin/env node

/**
 * Generate the list of public docs routes for the middleware.
 *
 * `src/middleware.js` uses this list to tell a real page from a dead URL.
 * A dead URL is redirected to its replacement (see src/redirects/dead-urls.js);
 * a real page is never redirected by those rules.
 *
 * Usage:
 *   node scripts/generate-route-manifest.mjs
 *
 * Output:
 *   src/generated/routes.json  (["/", "/smart-contracts/core", "/ja", ...])
 *
 * Public paths drop the `/docs` basePath and the `/en` locale directory,
 * because the middleware sees `/smart-contracts/core`, not `/en/...`.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const PAGES_DIR = path.join(ROOT, 'src', 'pages')
const OUTPUT_FILE = path.join(ROOT, 'src', 'generated', 'routes.json')
const LOCALES = ['en', 'ja', 'ko', 'zh']
const PAGE_EXTENSIONS = new Set(['.md', '.js', '.jsx'])

function walk(dir) {
  const files = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...walk(full))
    else files.push(full)
  }
  return files
}

const routes = new Set()

for (const locale of LOCALES) {
  const localeDir = path.join(PAGES_DIR, locale)
  if (!fs.existsSync(localeDir)) continue

  for (const file of walk(localeDir)) {
    const ext = path.extname(file)
    if (!PAGE_EXTENSIONS.has(ext)) continue
    if (path.basename(file).startsWith('_')) continue

    let route = path
      .relative(localeDir, file)
      .slice(0, -ext.length)
      .split(path.sep)
      .join('/')
    route = route === 'index' ? '' : route.replace(/\/index$/, '')

    const prefix = locale === 'en' ? '' : `/${locale}`
    routes.add(`${prefix}/${route}`.replace(/\/$/, '') || '/')
  }
}

const sorted = [...routes].sort()
fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true })
fs.writeFileSync(OUTPUT_FILE, `${JSON.stringify(sorted, null, 0)}\n`)
console.log(`Wrote ${sorted.length} routes to ${path.relative(ROOT, OUTPUT_FILE)}`)
