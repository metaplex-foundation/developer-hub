import slugify from '@sindresorhus/slugify'

/**
 * `@sindresorhus/slugify` transliterates to ASCII and drops anything it cannot
 * map, so every CJK heading collapses to an empty string. That silently breaks
 * the "On this page" TOC, in-page jump links, and heading anchor copy-links on
 * Japanese, Korean, and Chinese pages.
 *
 * This module is the single source of truth for heading ids. It must be used by
 * every call site that derives an id from heading text, otherwise the TOC, the
 * server-rendered heading, and the client-side anchor drift out of sync.
 */

const NON_ASCII = /[^\x00-\x7F]/

/**
 * Invisible characters that carry no meaning in a slug but are categorised as
 * combining marks or format characters, so they survive the `\p{M}` allowance
 * below. Variation selectors are the common case: `⚙️` is `⚙` + U+FE0F, and
 * keeping the selector after the emoji is stripped yields a stray leading
 * hyphen.
 */
const INVISIBLE = /[︀-️​-‍⁠﻿]/g

/**
 * Typographic punctuation folded to its ASCII equivalent. Headings that differ
 * from ASCII only by an em dash or a curly quote should keep taking the legacy
 * path, so their long-standing English slugs do not shift.
 */
const TYPOGRAPHIC = [
  [/[‐-―]/g, '-'], // hyphens and dashes
  [/[‘’‚‛]/g, "'"],
  [/[“”„‟]/g, '"'],
  [/…/g, '...'],
  [/ /g, ' '],
]

function normalize(value) {
  return value.normalize('NFC').replace(INVISIBLE, '')
}

/**
 * Folds typographic punctuation to ASCII. Only used to decide whether a
 * heading can stay on the legacy path, and to feed it when it can — never on
 * the Unicode path, where an em dash should disappear the way GitHub-style
 * anchors expect rather than becoming a hyphen.
 */
function foldTypographic(value) {
  let text = value
  for (const [pattern, replacement] of TYPOGRAPHIC) {
    text = text.replace(pattern, replacement)
  }
  return text
}

/**
 * GitHub-style slug that preserves Unicode letters, numbers, and combining
 * marks instead of transliterating them away.
 */
function unicodeSlug(value) {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\p{M}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Derives a heading id from heading text.
 *
 * Pure-ASCII headings keep the existing `slugify` behaviour so the ~5,245
 * English slugs already indexed and deep-linked stay byte-identical. Anything
 * containing a non-ASCII character falls back to a Unicode-preserving slug,
 * which is what authored in-page links already assume.
 */
export function slugifyHeading(value) {
  const raw = typeof value === 'string' ? value : String(value ?? '')
  if (!raw.trim()) return ''
  const text = normalize(raw)
  if (!text.trim()) return ''
  const folded = foldTypographic(text)
  // A heading that is ASCII once curly quotes and dashes are folded keeps the
  // legacy slug, so long-standing English anchors do not move.
  return NON_ASCII.test(folded) ? unicodeSlug(text) : slugify(folded)
}

/**
 * Stateful variant matching `slugifyWithCounter`: the first occurrence of a
 * slug is returned as-is, subsequent ones get `-1`, `-2`, and so on.
 *
 * Headings that slugify to nothing at all (pure emoji or punctuation) fall back
 * to `section` so they still receive a unique, linkable id rather than sharing
 * an empty one.
 */
export function slugifyHeadingWithCounter() {
  const counts = new Map()

  return function slugifyHeadingCounted(value) {
    const base = slugifyHeading(value) || 'section'
    const seen = counts.get(base) ?? 0
    counts.set(base, seen + 1)
    return seen === 0 ? base : `${base}-${seen}`
  }
}
