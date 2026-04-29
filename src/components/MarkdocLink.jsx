import { getLocalizedHref } from '@/config/languages'
import { useLocale } from '@/contexts/LocaleContext'
import Link from 'next/link'

export function MarkdocLink({ href, children, ...props }) {
  const { locale } = useLocale()

  // Use Next.js Link for internal paths so basePath is auto-prepended
  if (href && (href.startsWith('/') || href.startsWith('#'))) {
    return (
      <Link href={getLocalizedHref(href, locale)} {...props}>
        {children}
      </Link>
    )
  }

  // External links open in new tab
  return (
    <a href={href} {...props}>
      {children}
    </a>
  )
}
