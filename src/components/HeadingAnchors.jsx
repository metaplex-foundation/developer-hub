import { useEffect } from 'react'
import { useRouter } from 'next/router'
import slugify from '@sindresorhus/slugify'

// Link icon (lucide "link") rendered as a static SVG string so it can be
// injected into headings created by Markdoc's serialized render tree.
const ICON_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>' +
  '<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>' +
  '</svg>'

// Copy text to the clipboard, falling back to execCommand for non-secure
// contexts (e.g. plain-HTTP previews) where navigator.clipboard is undefined.
// Resolves true on success, false on failure.
async function copyToClipboard(text) {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // fall through to the execCommand fallback
    }
  }
  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(textarea)
    return ok
  } catch {
    return false
  }
}

// A single visually-hidden, polite live region so screen readers announce the
// result of a copy (the visual "Copied!" label is CSS-only and not announced).
function createLiveRegion() {
  const region = document.createElement('div')
  region.setAttribute('aria-live', 'polite')
  region.setAttribute('role', 'status')
  region.style.position = 'absolute'
  region.style.width = '1px'
  region.style.height = '1px'
  region.style.padding = '0'
  region.style.margin = '-1px'
  region.style.overflow = 'hidden'
  region.style.clip = 'rect(0, 0, 0, 0)'
  region.style.whiteSpace = 'nowrap'
  region.style.border = '0'
  document.body.appendChild(region)
  return region
}

/**
 * Injects a hover-revealed anchor link into every heading rendered from
 * Markdoc content. Clicking the anchor copies the section's permalink to the
 * clipboard (and updates the URL hash without a hard jump).
 *
 * This runs client-side because headings are emitted as native <h2>/<h3>
 * elements by Markdoc's transform (the React Heading component is bypassed).
 * Heading `id`s are only assigned (by parseTableOfContents) for h2/h3 on pages
 * that render a table of contents, so this component also assigns ids to any
 * heading that lacks one — making the feature work for h4-h6 and on pages with
 * `tableOfContents: false`.
 */
export function HeadingAnchors() {
  const router = useRouter()
  // Re-run on real page navigations only — not on hash changes (e.g. clicking
  // a table-of-contents link), which would needlessly tear down and rebuild
  // every anchor.
  const path = router.asPath.split('#')[0].split('?')[0]

  useEffect(() => {
    const headings = document.querySelectorAll(
      '.prose :is(h2, h3, h4, h5, h6)'
    )

    // Seed the dedupe set with ids already present anywhere on the page so
    // generated ids never collide with existing ones (or each other).
    const usedIds = new Set()
    document.querySelectorAll('[id]').forEach((el) => usedIds.add(el.id))

    const liveRegion = createLiveRegion()
    const assignedIds = new Set()
    const cleanups = []

    headings.forEach((heading) => {
      // Avoid double-injecting if this effect re-runs for the same DOM.
      if (heading.querySelector(':scope > a.heading-anchor')) return

      // Ensure the heading has a stable id to link to.
      if (!heading.id) {
        const base = slugify(heading.textContent || '') || 'section'
        let candidate = base
        let counter = 1
        while (usedIds.has(candidate)) {
          candidate = `${base}-${counter++}`
        }
        heading.id = candidate
        usedIds.add(candidate)
        assignedIds.add(candidate)
      }

      const anchor = document.createElement('a')
      anchor.className = 'heading-anchor'
      anchor.href = `#${heading.id}`
      anchor.setAttribute('aria-label', 'Copy link to this section')
      anchor.innerHTML = ICON_SVG

      let resetTimer
      const onClick = async (event) => {
        event.preventDefault()
        const url = `${window.location.origin}${window.location.pathname}#${heading.id}`

        window.history.replaceState(null, '', `#${heading.id}`)
        heading.scrollIntoView({ behavior: 'smooth' })

        const copied = await copyToClipboard(url)
        liveRegion.textContent = copied
          ? 'Link copied to clipboard'
          : 'Could not copy link'

        if (copied) {
          anchor.classList.add('copied')
          clearTimeout(resetTimer)
          resetTimer = setTimeout(() => anchor.classList.remove('copied'), 1500)
        }
      }

      anchor.addEventListener('click', onClick)
      heading.appendChild(anchor)

      cleanups.push(() => {
        clearTimeout(resetTimer)
        anchor.removeEventListener('click', onClick)
        anchor.remove()
      })
    })

    // Headings on `tableOfContents: false` pages get their ids assigned above,
    // after the browser's initial scroll-to-hash. If the URL targets a section
    // whose id we just created, scroll to it now that the id exists. (Headings
    // that already had ids were handled natively by the browser.)
    if (window.location.hash) {
      const targetId = decodeURIComponent(window.location.hash.slice(1))
      if (assignedIds.has(targetId)) {
        document.getElementById(targetId)?.scrollIntoView()
      }
    }

    return () => {
      cleanups.forEach((fn) => fn())
      liveRegion.remove()
    }
  }, [path])

  return null
}
