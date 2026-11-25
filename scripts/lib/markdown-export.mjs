/**
 * Shared helpers for exporting docs pages as plain Markdown for AI agents.
 *
 * Used by:
 *   - scripts/generate-markdown-pages.mjs  (public/<page>.md for every page)
 *   - scripts/generate-llms-txt.mjs        (llms.txt, llms-full.txt, per-product llms.txt)
 *
 * The page sources are Markdoc. This module turns them into Markdown an agent
 * can read without rendering: frontmatter becomes a title/description header,
 * imported code examples are inlined from src/examples, partials are inlined,
 * diagrams and UI-only widgets are dropped, and relative links become absolute.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..', '..')

export const SITE_URL = 'https://www.metaplex.com/docs'
export const PAGES_DIR = path.join(ROOT, 'src', 'pages', 'en')
export const PUBLIC_DIR = path.join(ROOT, 'public')
const EXAMPLES_DIR = path.join(ROOT, 'src', 'examples')
const PARTIALS_DIR = path.join(ROOT, 'markdoc', 'partials')

// Deprecated program and tool docs, left out of llms.txt for cleaner output
// (formerly under /legacy-documentation). Their .md pages are still generated.
export const DEPRECATED_PATHS = [
  '/smart-contracts/auction-house',
  '/smart-contracts/fixed-price-sale',
  '/smart-contracts/gumdrop',
  '/smart-contracts/token-entangler',
  '/dev-tools/solita',
  '/dev-tools/beet',
  '/dev-tools/cusper',
  '/dev-tools/rust-bin',
  '/dev-tools/mobile-sdks',
]

export function isDeprecated(urlPath) {
  return DEPRECATED_PATHS.some((p) => urlPath === p || urlPath.startsWith(`${p}/`))
}

/**
 * Parse flat frontmatter keys (title, metaTitle, description).
 * Nested YAML lists are ignored; only single-line scalars are read.
 */
export function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}
  const frontmatter = {}
  for (const line of match[1].split(/\r?\n/)) {
    if (/^\s/.test(line)) continue
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim()
      let value = line.slice(colonIndex + 1).trim().replace(/\r$/, '')
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      frontmatter[key] = value
    }
  }
  return frontmatter
}

export function stripFrontmatter(content) {
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
}

export function getMarkdownFiles(dir) {
  const files = []
  if (!fs.existsSync(dir)) return files
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...getMarkdownFiles(fullPath))
    else if (entry.name.endsWith('.md')) files.push(fullPath)
  }
  return files
}

/** src/pages/en/smart-contracts/core/index.md -> /smart-contracts/core */
export function filePathToUrlPath(filePath) {
  let urlPath = path.relative(PAGES_DIR, filePath).replace(/\\/g, '/').replace(/\.md$/, '')
  if (urlPath.endsWith('/index')) urlPath = urlPath.slice(0, -6)
  if (urlPath === 'index') urlPath = ''
  return '/' + urlPath
}

/** /smart-contracts/core -> /smart-contracts/core.md, / -> /index.md */
export function urlPathToMarkdownPath(urlPath) {
  return urlPath === '/' || urlPath === '' ? '/index.md' : `${urlPath}.md`
}

/** Collect every English page with a title. */
export function collectPages() {
  const pages = []
  for (const filePath of getMarkdownFiles(PAGES_DIR)) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const frontmatter = parseFrontmatter(content)
      if (!frontmatter.title && !frontmatter.metaTitle) continue
      const title = frontmatter.title || frontmatter.metaTitle.split('|')[0].trim()
      const urlPath = filePathToUrlPath(filePath)
      pages.push({
        filePath,
        urlPath,
        markdownPath: urlPathToMarkdownPath(urlPath),
        title,
        description: frontmatter.description || '',
        content,
      })
    } catch (error) {
      console.warn(`Warning: Could not parse ${filePath}: ${error.message}`)
    }
  }
  return pages
}

// --- Markdoc -> Markdown ---------------------------------------------------

function parseAttributes(str) {
  const attrs = {}
  const re = /([a-zA-Z_-]+)=("([^"]*)"|'([^']*)'|(\S+))/g
  let m
  while ((m = re.exec(str))) attrs[m[1]] = m[3] ?? m[4] ?? m[5]
  return attrs
}

const FRAMEWORK_FILES = {
  umi: { files: ['umi.ts', 'umi.js'], lang: 'ts', label: 'Umi' },
  kit: { files: ['kit.ts', 'kit.js'], lang: 'ts', label: 'Kit' },
  shank: { files: ['shank.rs'], lang: 'rust', label: 'Rust (Shank)' },
  anchor: { files: ['anchor.rs'], lang: 'rust', label: 'Rust (Anchor)' },
  cli: { files: ['cli.sh'], lang: 'bash', label: 'CLI' },
}

function cleanExampleSource(code) {
  return code
    .split('\n')
    .filter((line) => !/^\s*(\/\/|#)\s*\[\/?(IMPORTS|SETUP|MAIN|OUTPUT)\]\s*$/.test(line))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function renderImportedCode(attrs) {
  const dir = path.join(EXAMPLES_DIR, attrs.from || '')
  if (!attrs.from || !fs.existsSync(dir)) return ''
  const frameworks = (attrs.frameworks || 'kit,umi,shank,anchor').split(',').map((f) => f.trim())
  const blocks = []
  for (const fw of frameworks) {
    const spec = FRAMEWORK_FILES[fw]
    if (!spec) continue
    const file = spec.files.map((f) => path.join(dir, f)).find((f) => fs.existsSync(f))
    if (!file) continue
    const code = cleanExampleSource(fs.readFileSync(file, 'utf-8'))
    if (!code) continue
    blocks.push(`${spec.label}:\n\n\`\`\`${spec.lang}\n${code}\n\`\`\``)
  }
  return blocks.join('\n\n')
}

function renderPartial(attrs) {
  const file = path.join(PARTIALS_DIR, attrs.file || '')
  if (!attrs.file || !fs.existsSync(file)) return ''
  return stripFrontmatter(fs.readFileSync(file, 'utf-8')).trim()
}

function absoluteUrl(href) {
  if (href.startsWith('/')) return `${SITE_URL}${href}`
  return href
}

// Block tags whose contents are dropped (visual diagrams).
const DROPPED_BLOCKS = ['diagram']

/**
 * Convert one Markdoc page source into agent-friendly Markdown.
 */
export function markdocToMarkdown(source, { title, description, urlPath }) {
  let body = stripFrontmatter(source)

  // Protect fenced code blocks so tag rewriting never touches code.
  // Fence info strings may carry Markdoc attributes ({% title="x" %}); keep only the language.
  const fences = []
  body = body.replace(/^([ \t]*)(```|~~~)([^\n]*)\n([\s\S]*?)^\1\2[ \t]*$/gm, (_, indent, fence, info, code) => {
    const lang = info.replace(/\{%[\s\S]*?%\}/g, '').trim()
    fences.push(`${indent}${fence}${lang}\n${code}${indent}${fence}`)
    return `\u0000FENCE${fences.length - 1}\u0000`
  })

  for (const tag of DROPPED_BLOCKS) {
    body = body.replace(new RegExp(`\\{%\\s*${tag}\\b[\\s\\S]*?\\{%\\s*/${tag}\\s*%\\}`, 'g'), '')
  }

  // Self-closing tags with content we can inline.
  body = body.replace(/\{%\s*([a-zA-Z-]+)((?:(?!%\}).)*?)\/%\}/gs, (_, name, rawAttrs) => {
    const attrs = parseAttributes(rawAttrs)
    switch (name) {
      case 'code-tabs-imported':
        return renderImportedCode(attrs)
      case 'partial':
        return renderPartial(attrs)
      case 'quick-link':
        return `- [${attrs.title || attrs.href}](${absoluteUrl(attrs.href || '')})${attrs.description ? `: ${attrs.description}` : ''}`
      case 'image':
      case 'figure':
        return attrs.src ? `![${attrs.alt || ''}](${absoluteUrl(attrs.src)})` : ''
      default:
        // Everything else (fees, API renderers, calculators, diagram nodes) is UI-only.
        return ''
    }
  })

  // Opening tags: keep titles as bold labels, drop the rest of the wrapper.
  body = body.replace(/\{%\s*([a-zA-Z-]+)(\s(?:(?!%\}).)*?)?%\}/gs, (_, name, rawAttrs = '') => {
    const attrs = parseAttributes(rawAttrs)
    switch (name) {
      case 'callout':
        return `> **${attrs.title || (attrs.type ? attrs.type[0].toUpperCase() + attrs.type.slice(1) : 'Note')}:**`
      case 'dialect':
      case 'totem-accordion':
        return attrs.title ? `**${attrs.title}**` : ''
      default:
        return ''
    }
  })

  // Closing tags and inline annotations ({% .lead %}, {% #id %}).
  body = body.replace(/\{%\s*\/[a-zA-Z-]+\s*%\}/g, '')
  body = body.replace(/\{%\s*[.#][^%]*%\}/g, '')

  // Relative links -> absolute site URLs.
  body = body.replace(/\]\((\/[^)\s]*)\)/g, (_, href) => `](${SITE_URL}${href})`)

  body = body.replace(/\u0000FENCE(\d+)\u0000/g, (_, i) => fences[Number(i)])

  // Tidy whitespace left behind by removed tags.
  body = body
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  const header = [`# ${title}`, '']
  if (description) header.push(`> ${description}`, '')
  header.push(`Source: ${SITE_URL}${urlPath === '/' ? '' : urlPath}`, '')
  return `${header.join('\n')}\n${body}\n`
}

export function pageToMarkdown(page) {
  return markdocToMarkdown(page.content, page)
}
