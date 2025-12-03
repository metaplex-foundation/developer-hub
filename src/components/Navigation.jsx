import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useLocale } from '@/contexts/LocaleContext'
import { getLocalizedHref } from '@/config/languages'
import Badge from './products/Badge'

export function Navigation({ product, navigation, className }) {
  let router = useRouter()
  const { locale } = useLocale()

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

  return (
    <nav className={clsx('text-base lg:text-sm', className)}>
      {product?.name && (
        <div className="mb-8">
          <Link
            href={getLocalizedHref(`/${product.path}`, locale)}
            className="font-display text-lg font-bold text-slate-900 hover:text-accent-500 dark:text-white dark:hover:text-accent-400"
          >
            {product.name}
          </Link>
          {product.headline && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {product.headline}
            </p>
          )}
        </div>
      )}
      <ul role="list" className="space-y-9">
        {navigation.map((section) => (
          <li key={`${product.name}-${section.title}`}>
            <h2 className="font-display font-medium text-slate-900 dark:text-white">
              {section.title}
            </h2>
            <ul
              role="list"
              className="mt-2 space-y-2 border-l border-slate-100 dark:border-slate-800 lg:mt-4 lg:space-y-4 lg:border-slate-200"
            >
              {section.links.map((link) => {
                // link.href is already localized by localizeProduct() in usePage.js
                const currentPath = normalizePath(router.asPath)
                const linkPath = normalizePath(link.href)
                const isActive = linkPath === currentPath

                return (
                  <li key={`${link.title}-${link.href}`} className="relative">
                    <Link
                      href={link.href}
                      className={clsx(
                        'block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-[2px] before:top-1/2 before:h-4 before:w-[3px] before:-translate-y-1/2 before:rounded',
                        isActive
                          ? 'font-semibold text-accent-500 before:bg-accent-500'
                          : 'text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300'
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
