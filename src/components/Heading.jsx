import React from 'react'
import { slugifyHeading } from '@/shared/slugifyHeading'

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

export function Heading({ level, id, children }) {
  const Tag = `h${level}`

  // Generate ID from text content if not provided, using same slugifier as the
  // TOC and the client-side anchors so all three agree on every locale.
  const headingId = id || slugifyHeading(getTextFromChildren(children))

  return <Tag id={headingId}>{children}</Tag>
}
