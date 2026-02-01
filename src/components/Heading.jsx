import React from 'react'
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

export function Heading({ level, id, children }) {
  const Tag = `h${level}`

  // Generate ID from text content if not provided, using same slugify as TOC
  const headingId = id || slugifyLib(getTextFromChildren(children))

  return <Tag id={headingId}>{children}</Tag>
}
