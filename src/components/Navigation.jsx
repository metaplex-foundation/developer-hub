import { getLocalizedHref } from '@/config/languages'
import { useLocale } from '@/contexts/LocaleContext'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Badge from './products/Badge'
import { Sections } from './products/Sections'

export function Navigation({ product, navigation, className, hideProductHeader = false, sections, activeSectionId }) {
  let router = useRouter()
  const { locale } = useLocale()
  const [currentPath, setCurrentPath] = useState('')
  const [openSubmenus, setOpenSubmenus] = useState(() => {
    const initial = {}
    if (navigation) {
      navigation.forEach(section => {
        section.links.forEach(link => {
          if (link.children && (link.collapsible === false || link.defaultOpen)) {
            initial[link.title] = true
          }
        })
      })
    }
    return initial
  })

  // Update currentPath after hydration when router is ready
  useEffect(() => {
    if (router.isReady) {
      setCurrentPath(router.asPath.split('?')[0].split('#')[0].replace(/\/$/, '') || '/')
    }
  }, [router.isReady, router.asPath])

  // Auto-open submenus: non-collapsible and defaultOpen items always open,
  // collapsible items open when a child is active
  useEffect(() => {
    if (!navigation) return
    const toOpen = {}
    navigation.forEach(section => {
      section.links.forEach(link => {
        if (link.children) {
          if (link.collapsible === false || link.defaultOpen) {
            toOpen[link.title] = true
          } else if (currentPath) {
            const isParentActive = link.href && normalizePath(link.href) === currentPath
            const hasActiveChild = link.children.some(
              child => normalizePath(child.href) === currentPath
            )
            if (isParentActive || hasActiveChild) toOpen[link.title] = true
          }
        }
      })
    })
    if (Object.keys(toOpen).length > 0) {
      setOpenSubmenus(prev => ({ ...prev, ...toOpen }))
    }
  }, [currentPath, navigation])

  const isRecent = (date) => {
    const guideDate = new Date(date)
    const now = new Date()
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

  const toggleSubmenu = (key) => {
    setOpenSubmenus(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <nav className={clsx('text-base lg:text-sm text-muted-foreground', className)}>
      {!hideProductHeader && product?.name && (
        <div className="mb-6">
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
      {/* Section tabs (Documentation, Guides, API References) */}
      {sections && sections.length > 1 && (
        <Sections
          className="mb-8 flex flex-col gap-1"
          sections={sections}
          activeSectionId={activeSectionId}
        />
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
                // Accordion item: link has children
                if (link.children) {
                  const isOpen = !!openSubmenus[link.title]
                  const isParentActive = link.href ? isLinkActive(link.href) : false
                  const isCollapsible = link.collapsible !== false

                  return (
                    <li key={`${link.title}-${link.href ?? link.title}`} className="relative">
                      <div className={clsx(
                        'relative flex items-center pl-3.5 before:pointer-events-none before:absolute before:-left-[2px] before:top-1/2 before:h-4 before:w-[3px] before:-translate-y-1/2',
                        isParentActive
                          ? 'before:bg-primary'
                          : 'before:hidden before:bg-primary hover:before:block'
                      )}>
                        {link.href ? (
                          <Link
                            href={link.href}
                            className={clsx(
                              'flex-1',
                              isParentActive
                                ? 'font-semibold text-primary'
                                : 'text-muted-foreground hover:text-foreground'
                            )}
                          >
                            {link.title}
                          </Link>
                        ) : isCollapsible ? (
                          <button
                            type="button"
                            onClick={() => toggleSubmenu(link.title)}
                            className="flex flex-1 items-center justify-between text-left text-muted-foreground hover:text-foreground"
                            aria-expanded={isOpen}
                            aria-controls={`submenu-${link.title}`}
                          >
                            {link.title}
                            <ChevronRightIcon className={clsx(
                              'h-3 w-3 shrink-0 transition-transform duration-200',
                              isOpen && 'rotate-90'
                            )} />
                          </button>
                        ) : (
                          <span className="flex-1 text-muted-foreground">
                            {link.title}
                          </span>
                        )}
                        {isCollapsible && link.href && (
                          <button
                            type="button"
                            onClick={() => toggleSubmenu(link.title)}
                            className="p-1 text-muted-foreground hover:text-foreground"
                            aria-expanded={isOpen}
                            aria-controls={`submenu-${link.title}`}
                            aria-label={isOpen ? 'Collapse submenu' : 'Expand submenu'}
                          >
                            <ChevronRightIcon className={clsx(
                              'h-3 w-3 transition-transform duration-200',
                              isOpen && 'rotate-90'
                            )} />
                          </button>
                        )}
                      </div>
                      {isOpen && (
                        <ul id={`submenu-${link.title}`} role="list" className="ml-3.5 mt-2 space-y-2 lg:space-y-2">
                          {link.children.map(child => {
                            const isChildActive = isLinkActive(child.href)
                            return (
                              <li key={`${child.title}-${child.href}`} className="relative">
                                <Link
                                  href={child.href}
                                  className={clsx(
                                    'block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-4 before:top-1/2 before:h-4 before:w-[3px] before:-translate-y-1/2',
                                    isChildActive
                                      ? 'font-semibold text-primary before:bg-primary'
                                      : 'text-muted-foreground before:hidden before:bg-primary hover:text-foreground hover:before:block'
                                  )}
                                >
                                  {child.title}
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </li>
                  )
                }

                // Regular link (existing behavior)
                // link.href is already localized by localizeProduct() in usePage.js
                const isActive = isLinkActive(link.href)

                return (
                  <li key={`${link.title}-${link.href}`} className="relative">
                    <Link
                      href={link.href}
                      className={clsx(
                        'block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-[2px] before:top-1/2 before:h-4 before:w-[3px] before:-translate-y-1/2',
                        isActive
                          ? 'font-semibold text-primary before:bg-primary'
                          : 'text-muted-foreground before:hidden before:bg-primary hover:text-foreground hover:before:block'
                      )}
                    >
                      {link.method && (
                        <Badge type={link.method} className="mr-1.5" />
                      )}
                      {link.title}{' '}
                      {link.updated && isRecent(link.updated) && (
                        <Badge type="updated" className="ml-1.5" />
                      )}
                      {link.created && isRecent(link.created) && (
                        <Badge type="new" className="ml-1.5" />
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
