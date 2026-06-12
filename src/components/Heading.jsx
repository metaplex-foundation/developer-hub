import React, { useState } from 'react'
import slugifyLib from '@sindresorhus/slugify'

function getTextFromChildren(children) {
  if (typeof children === 'string') {
    return children
  }
  if (Array.isArray(children)) {
    return children.map(getTextFromChildren).join('')
  }
  if (children?.props?.children) {
    return getTextFromChildren(children.props.children)
  }
  return ''
}

function AnchorLink({ id, label }) {
  const [copied, setCopied] = useState(false)

  const handleClick = (event) => {
    // Update the URL hash without triggering a full navigation/jump.
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}${window.location.pathname}#${id}`
      window.history.replaceState(null, '', `#${id}`)

      // Copy the direct section link to the clipboard when possible.
      if (navigator?.clipboard?.writeText) {
        event.preventDefault()
        navigator.clipboard.writeText(url).then(
          () => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          },
          () => {}
        )
      }
    }
  }

  return (
    <a
      href={`#${id}`}
      onClick={handleClick}
      aria-label={`Copy link to section: ${label}`}
      title={copied ? 'Link copied!' : 'Copy link to this section'}
      className="not-prose absolute -ml-6 mt-1 flex w-6 items-center justify-center text-muted-foreground no-underline opacity-0 transition-opacity duration-150 hover:text-primary focus:opacity-100 focus:outline-none group-hover:opacity-100"
    >
      {copied ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4 text-primary"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
          <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
        </svg>
      )}
    </a>
  )
}

export function Heading({ level, id, children }) {
  const Tag = `h${level}`

  const label = getTextFromChildren(children)
  // Generate ID from text content if not provided, using same slugify as TOC
  const headingId = id || slugifyLib(label)

  // Skip the anchor on the page-title h1; it links to the top of the page.
  const showAnchor = level > 1

  return (
    <Tag id={headingId} className={showAnchor ? 'group relative' : undefined}>
      {showAnchor && <AnchorLink id={headingId} label={label} />}
      {children}
    </Tag>
  )
}
