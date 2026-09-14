#!/usr/bin/env node
/**
 * Audits every in-page heading anchor across src/pages.
 *
 * Fails when a heading renders with an empty or duplicate id, or when an
 * authored in-page link (`](#some-anchor)`) points at a heading that does not
 * exist. CJK headings used to produce empty ids silently, which broke the TOC
 * and every jump link on 91% of localized pages without failing any build.
 *
 * Empty and duplicate ids always fail. Broken in-page links are compared
 * against a checked-in baseline so the known backlog of localized pages that
 * still link to English anchors does not block CI, while any newly introduced
 * broken link does.
 *
 * Usage:
 *   node scripts/audit-heading-anchors.mjs                   # audit, exit 1 on new failures
 *   node scripts/audit-heading-anchors.mjs --json            # machine-readable report
 *   node scripts/audit-heading-anchors.mjs --all             # ignore the baseline
 *   node scripts/audit-heading-anchors.mjs --update-baseline # re-record the backlog
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { slugifyHeadingWithCounter } from '../src/shared/slugifyHeading.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PAGES_DIR = path.join(ROOT, 'src', 'pages')

const asJson = process.argv.includes('--json')
const ignoreBaseline = process.argv.includes('--all')
const updateBaseline = process.argv.includes('--update-baseline')

const BASELINE_PATH = path.join(ROOT, 'scripts', 'heading-anchors-baseline.json')

/** Broken links are keyed by file and anchor, counted to catch duplicates. */
function tally(files) {
  const counts = {}
  for (const f of files) {
    for (const b of f.broken) {
      const key = `${f.file}#${b.anchor}`
      counts[key] = (counts[key] ?? 0) + 1
    }
  }
  return counts
}

function loadBaseline() {
  if (ignoreBaseline || !fs.existsSync(BASELINE_PATH)) return {}
  try {
    return JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8')).brokenLinks ?? {}
  } catch {
    return {}
  }
}

function walk(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full))
    else if (entry.name.endsWith('.md')) out.push(full)
  }
  return out
}

/**
 * Blanks out frontmatter and fenced code blocks so neither is parsed as
 * content. Lines are blanked rather than removed so reported line numbers still
 * match the original file.
 */
function stripNonProse(source) {
  const lines = source.split('\n')
  let inFrontmatter = lines[0]?.trim() === '---'
  let inFence = false

  return lines.map((line, i) => {
    if (inFrontmatter) {
      if (i > 0 && line.trim() === '---') inFrontmatter = false
      return ''
    }
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence
      return ''
    }
    return inFence ? '' : line
  })
}

/** Removes inline markdown/markdoc decoration so heading text matches render. */
function headingText(raw) {
  return raw
    .replace(/\{%\s*#[^%]*%\}/g, '') // explicit anchor annotation
    .replace(/\{%[^%]*%\}/g, '') // any other inline markdoc tag
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    .trim()
}

const results = []

for (const file of walk(PAGES_DIR).sort()) {
  const rel = path.relative(ROOT, file)
  const lines = stripNonProse(fs.readFileSync(file, 'utf8'))

  const slugify = slugifyHeadingWithCounter()
  const ids = new Map() // id -> first line number
  const empty = []
  const duplicates = []

  lines.forEach((line, i) => {
    const match = /^(#{1,6})\s+(.*)$/.exec(line)
    if (!match) return

    const explicit = /\{%\s*#([^\s%]+)\s*%\}/.exec(match[2])
    const text = headingText(match[2])
    const id = explicit ? explicit[1] : slugify(text)

    if (!id) empty.push({ line: i + 1, text })
    else if (ids.has(id)) duplicates.push({ line: i + 1, id, text })
    else ids.set(id, i + 1)
  })

  // Authored in-page links. Ignore cross-page links that happen to have a hash.
  const broken = []
  const linkRe = /\]\(#([^)\s]+)\)/g
  lines.forEach((line, i) => {
    let m
    while ((m = linkRe.exec(line)) !== null) {
      const anchor = decodeURIComponent(m[1])
      if (!ids.has(anchor)) broken.push({ line: i + 1, anchor })
    }
  })

  if (empty.length || duplicates.length || broken.length) {
    results.push({ file: rel, empty, duplicates, broken })
  }
}

const totals = results.reduce(
  (acc, r) => ({
    empty: acc.empty + r.empty.length,
    duplicates: acc.duplicates + r.duplicates.length,
    broken: acc.broken + r.broken.length,
  }),
  { empty: 0, duplicates: 0, broken: 0 }
)

const current = tally(results)

if (updateBaseline) {
  const sorted = Object.fromEntries(Object.entries(current).sort(([a], [b]) => (a < b ? -1 : 1)))
  fs.writeFileSync(
    BASELINE_PATH,
    JSON.stringify(
      {
        comment:
          'Known-broken in-page anchor links, mostly localized pages that link to English ' +
          'anchors while their headings are translated. CI fails on anything not listed here. ' +
          'Regenerate with: node scripts/audit-heading-anchors.mjs --update-baseline',
        total: Object.values(sorted).reduce((a, b) => a + b, 0),
        brokenLinks: sorted,
      },
      null,
      2
    ) + '\n'
  )
  console.log(`Baseline written: ${Object.keys(sorted).length} entries.`)
  process.exit(0)
}

const baseline = loadBaseline()

// A broken link is "new" when it is absent from the baseline, or occurs more
// often than the baseline recorded.
const newBroken = []
for (const r of results) {
  for (const b of r.broken) {
    const key = `${r.file}#${b.anchor}`
    const allowed = baseline[key] ?? 0
    const seen = (newBroken.filter((n) => n.key === key).length ?? 0) + 1
    if (seen > allowed) newBroken.push({ key, file: r.file, ...b })
  }
}

if (asJson) {
  console.log(JSON.stringify({ totals, newBroken, files: results }, null, 2))
} else {
  for (const r of results) {
    const lines = []
    for (const e of r.empty) lines.push(`  :${e.line} empty id for heading "${e.text}"`)
    for (const d of r.duplicates) lines.push(`  :${d.line} duplicate id "${d.id}" ("${d.text}")`)
    for (const b of r.broken) {
      const isNew = newBroken.some((n) => n.file === r.file && n.anchor === b.anchor)
      if (isNew || ignoreBaseline) {
        lines.push(`  :${b.line} link to #${b.anchor} matches no heading${isNew ? ' (NEW)' : ''}`)
      }
    }
    if (lines.length) console.log(`\n${r.file}\n${lines.join('\n')}`)
  }
  console.log(
    `\n${totals.empty} empty id(s), ${totals.duplicates} duplicate id(s), ` +
      `${totals.broken} broken in-page link(s) ` +
      `(${newBroken.length} new, ${totals.broken - newBroken.length} in baseline).`
  )
}

const failed = totals.empty + totals.duplicates + newBroken.length
if (failed > 0 && !asJson) {
  console.error(
    '\nFAIL: fix the problems above, or run --update-baseline if a broken link is ' +
      'intentionally deferred.'
  )
}
process.exit(failed > 0 ? 1 : 0)
