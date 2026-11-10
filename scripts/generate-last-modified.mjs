#!/usr/bin/env node

/**
 * Generate the last-modified date of every docs page.
 *
 * A page's date is its `updated` frontmatter when set, otherwise the date of
 * the last git commit that touched its source file. The sitemap uses it for
 * `<lastmod>`, and `scripts/last-modified-loader.cjs` injects it into each
 * page's frontmatter for the "Last updated" label and the JSON-LD
 * `dateModified`, so all three always agree.
 *
 * Usage:
 *   node scripts/generate-last-modified.mjs
 *
 * Output:
 *   src/generated/last-modified.json  ({ "/en/core": "2026-09-03", ... })
 *
 * Vercel clones only recent history. A shallow clone is deepened with
 * `git fetch --unshallow` first; if that fails, pages whose last change is
 * older than the clone fall back to their frontmatter date or get none.
 * Setting VERCEL_DEEP_CLONE=true on the project avoids the fetch.
 */

import { execFileSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const PAGES_DIR = 'src/pages'
const OUTPUT_FILE = path.join(ROOT, 'src', 'generated', 'last-modified.json')

function git(args) {
  return execFileSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
  })
}

/** `src/pages/en/core/index.md` -> `/en/core` (the routes-manifest page). */
export function routeForFile(file) {
  const route = file
    .slice(PAGES_DIR.length)
    .replace(/\.md$/, '')
    .replace(/\/index$/, '')
  return route === '' ? '/' : route
}

/** Frontmatter dates are MM-DD-YYYY or YYYY-MM-DD; return YYYY-MM-DD. */
function normalizeDate(value) {
  const text = String(value).trim().replace(/^['"]|['"]$/g, '')
  const mdy = /^(\d{2})-(\d{2})-(\d{4})$/.exec(text)
  if (mdy) return `${mdy[3]}-${mdy[1]}-${mdy[2]}`
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text
  return null
}

function frontmatterUpdated(file) {
  const source = fs.readFileSync(path.join(ROOT, file), 'utf8')
  const block = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source)
  if (!block) return null
  const line = /^updated:\s*(.+)$/m.exec(block[1])
  return line ? normalizeDate(line[1]) : null
}

function isShallow() {
  return git(['rev-parse', '--is-shallow-repository']).trim() === 'true'
}

/** Fetch full history if the clone is shallow; returns whether it is complete. */
function deepen() {
  if (!isShallow()) return true
  try {
    git(['fetch', '--unshallow', '--quiet'])
  } catch {
    // Checked below: without a remote, fetch can also exit 0 and do nothing.
  }
  if (!isShallow()) return true
  console.warn(
    '⚠ Git history is shallow and could not be deepened. Pages last changed ' +
      'before the clone fall back to their frontmatter date or get none. ' +
      'Set VERCEL_DEEP_CLONE=true on the Vercel project.'
  )
  return false
}

/**
 * Newest commit date per file, from one pass over the history. In a shallow
 * clone the boundary commits appear to add every file they contain, so their
 * dates are ignored rather than reported as the last change.
 */
function gitDates() {
  const shallowFile = git(['rev-parse', '--git-path', 'shallow']).trim()
  const boundary = new Set(
    fs.existsSync(path.resolve(ROOT, shallowFile))
      ? fs.readFileSync(path.resolve(ROOT, shallowFile), 'utf8').split('\n')
      : []
  )
  const dates = new Map()
  let current = null
  const log = git([
    'log',
    '--format=@%H %cs',
    '--name-only',
    '--no-renames',
    '--',
    PAGES_DIR,
  ])
  for (const line of log.split('\n')) {
    if (line.startsWith('@')) {
      const [hash, date] = line.slice(1).split(' ')
      current = boundary.has(hash) ? null : date
    } else if (line && current && !dates.has(line)) {
      dates.set(line, current)
    }
  }
  return dates
}

function main() {
  const files = git(['ls-files', `${PAGES_DIR}/**/*.md`])
    .split('\n')
    .filter(Boolean)

  let fromGit = new Map()
  try {
    deepen()
    fromGit = gitDates()
  } catch (error) {
    console.warn(`⚠ git unavailable (${error.message.split('\n')[0]})`)
  }

  const dates = {}
  let frontmatterCount = 0
  let gitCount = 0
  for (const file of files) {
    const updated = frontmatterUpdated(file)
    const date = updated ?? fromGit.get(file) ?? null
    if (!date) continue
    if (updated) frontmatterCount++
    else gitCount++
    dates[routeForFile(file)] = date
  }

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true })
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(dates, null, 2) + '\n')

  const missing = files.length - frontmatterCount - gitCount
  console.log(
    `✓ Wrote ${path.relative(ROOT, OUTPUT_FILE)}: ${files.length} pages, ` +
      `${frontmatterCount} from frontmatter, ${gitCount} from git, ${missing} without a date`
  )
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}
