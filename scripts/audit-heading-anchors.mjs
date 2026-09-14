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

  let fence = null // { char, length } of the delimiter that opened the block

  return lines.map((line, i) => {
    if (inFrontmatter) {
      if (i > 0 && line.trim() === '---') inFrontmatter = false
      return ''
    }
    const m = /^\s*(`{3,}|~{3,})/.exec(line)
    if (m) {
      const char = m[1][0]
      const length = m[1].length
      if (!fence) {
        fence = { char, length }
        return ''
      }
      // A ``` inside a ~~~ block is literal text, not a closing delimiter.
      if (char === fence.char && length >= fence.length) fence = null
      return ''
    }
    return fence ? '' : line
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

  // Collect first, then assign in the same two passes as `assignHeadingIds`
  // in src/shared/usePage.js: h2/h3 claim their slug before h1 and h4-h6, so
  // the audit models exactly what the site renders.
  const headings = []
  lines.forEach((line, i) => {
    const match = /^(#{1,6})\s+(.*)$/.exec(line)
    if (!match) return
    const explicit = /\{%\s*#([^\s%]+)\s*%\}/.exec(match[2])
    headings.push({
      line: i + 1,
      level: match[1].length,
      text: headingText(match[2]),
      explicit: explicit ? explicit[1] : null,
    })
  })

  const assigned = new Map() // heading -> id
  for (const h of headings) {
    if (h.explicit) assigned.set(h, h.explicit)
  }
  for (const isTocPass of [true, false]) {
    for (const h of headings) {
      if (assigned.has(h)) continue
      const isToc = h.level === 2 || h.level === 3
      if (isTocPass !== isToc) continue
      assigned.set(h, slugify(h.text))
    }
  }

  for (const h of headings) {
    const id = assigned.get(h)
    if (!id) empty.push({ line: h.line, text: h.text })
    else if (ids.has(id)) duplicates.push({ line: h.line, id, text: h.text })
    else ids.set(id, h.line)
  }

  // Authored in-page links. Ignore cross-page links that happen to have a hash.
  const broken = []
  const linkRe = /\]\(#([^)\s]+)\)/g
  lines.forEach((line, i) => {
    let m
    while ((m = linkRe.exec(line)) !== null) {
      // A link like `](#rate%off)` is malformed but must not kill the run.
      let anchor
      try {
        anchor = decodeURIComponent(m[1])
      } catch {
        anchor = m[1]
      }
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
const observed = new Map()
for (const r of results) {
  for (const b of r.broken) {
    const key = `${r.file}#${b.anchor}`
    const allowed = baseline[key] ?? 0
    const seen = (observed.get(key) ?? 0) + 1
    observed.set(key, seen)
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
