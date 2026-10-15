import Link from 'next/link'

export function MarkdocLink({ href, children, ...props }) {
  // Use Next.js Link for internal paths so basePath is auto-prepended
  if (href && (href.startsWith('/') || href.startsWith('#'))) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    )
  }

  // External links open in a new tab; mailto: and other schemes do not
  const isExternal = /^https?:\/\//i.test(href ?? '')

  return (
    <a
      href={href}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    >
      {children}
    </a>
  )
}
