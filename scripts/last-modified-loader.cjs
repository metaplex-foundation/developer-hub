/**
 * Webpack pre-loader for docs pages: adds `lastModified: YYYY-MM-DD` to the
 * frontmatter from src/generated/last-modified.json (written by
 * scripts/generate-last-modified.mjs), so each page carries only its own date
 * instead of every page bundling the whole map.
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const PAGES_DIR = path.join(ROOT, 'src', 'pages')
const DATES_FILE = path.join(ROOT, 'src', 'generated', 'last-modified.json')

function routeFor(resourcePath) {
  const route = path
    .relative(PAGES_DIR, resourcePath)
    .split(path.sep)
    .join('/')
    .replace(/\.md$/, '')
    .replace(/(^|\/)index$/, '')
  return `/${route}`.replace(/\/$/, '') || '/'
}

module.exports = function lastModifiedLoader(source) {
  this.addDependency(DATES_FILE)
  let dates = {}
  try {
    dates = JSON.parse(fs.readFileSync(DATES_FILE, 'utf8'))
  } catch {
    return source
  }

  const date = dates[routeFor(this.resourcePath)]
  if (!date) return source

  const field = `lastModified: '${date}'`
  const frontmatter = /^---\r?\n/.exec(source)
  if (frontmatter) {
    return source.replace(frontmatter[0], `${frontmatter[0]}${field}\n`)
  }
  return `---\n${field}\n---\n${source}`
}
