import { getLocalizedHref } from '@/config/languages'
import { useLocale } from '@/contexts/LocaleContext'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Badge from './products/Badge'

export function Navigation({ product, navigation, className, hideProductHeader = false }) {
  let router = useRouter()
  const { locale } = useLocale()
  const [currentPath, setCurrentPath] = useState('')

  // Update currentPath after hydration when router is ready
  useEffect(() => {
    if (router.isReady) {
      setCurrentPath(router.asPath.split('?')[0].split('#')[0].replace(/\/$/, '') || '/')
    }
  }, [router.isReady, router.asPath])

  const isRecent = (date) => {
    const guideDate = new Date(date)
    const now = new Date()

    // If the guide was updated or created in the last week, it's recent.

    return now - guideDate < 1000 * 60 * 60 * 24 * 7
  }

  // Normalize path by removing trailing slashes and query/hash
  const normalizePath = (path) => {
    return path.split('?')[0].split('#')[0].replace(/\/$/, '') || '/'
  }

  // Check if a link is active
  const isLinkActive = (linkHref) => {
    if (!currentPath) return false
    return normalizePath(linkHref) === currentPath
  }

  return (
    <nav className={clsx('text-base lg:text-sm text-muted-foreground', className)}>
      {!hideProductHeader && product?.name && (
        <div className="mb-8">
          <Link
            href={getLocalizedHref(`/${product.path}`, locale)}
            className="font-display text-lg font-bold text-foreground hover:text-primary"
          >
            {product.name}
          </Link>
          {product.headline && (
            <p className="mt-1 text-sm text-muted-foreground">
              {product.headline}
            </p>
          )}
        </div>
      )}
      <ul role="list" className="space-y-9">
        {navigation.map((section) => (
          <li key={`${product.name}-${section.title}`}>
            <h2 className="font-display font-medium text-foreground">
              {section.title}
            </h2>
            <ul
              role="list"
              className="mt-2 space-y-2 border-l border-sidebar-border lg:mt-4 lg:space-y-4"
            >
              {section.links.map((link) => {
                // link.href is already localized by localizeProduct() in usePage.js
                const isActive = isLinkActive(link.href)

                return (
                  <li key={`${link.title}-${link.href}`} className="relative">
                    <Link
                      href={link.href}
                      className={clsx(
                        'block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-[2px] before:top-1/2 before:h-4 before:w-[3px] before:-translate-y-1/2 before:rounded',
                        isActive
                          ? 'font-semibold text-primary before:bg-primary'
                          : 'text-muted-foreground before:hidden before:bg-primary hover:text-foreground hover:before:block'
                      )}
                    >
                      {link.title}{' '}
                      {link.updated && isRecent(link.updated) && (
                        <Badge type="updated" />
                      )}
                      {link.created && isRecent(link.created) && (
                        <Badge type="new" />
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  )
}
