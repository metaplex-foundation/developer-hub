import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import Badge from './products/Badge'

export function Navigation({ product, navigation, className }) {
  let router = useRouter()

  // const recentList = navigation.filter((link) => {
  //   const guideDate = new Date(link.updated || link.created)
  //   const now = new Date()

  //   return now - guideDate < 1000 * 60 * 60 * 24 * 7
  // })

  const isRecent = (date) => {
    const guideDate = new Date(date)
    const now = new Date()

    // If the guide was updated or created in the last week, it's recent.

    return now - guideDate < 1000 * 60 * 60 * 24 * 7
  }

  return (
    <nav className={clsx('text-base lg:text-sm', className)}>
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
              {section.links.map((link) => (
                <li key={`${link.title}-${link.href}`} className="relative">
                  <Link
                    href={link.href}
                    className={clsx(
                      'block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-[2px] before:top-1/2 before:h-4 before:w-[3px] before:-translate-y-1/2 before:rounded',
                      link.href === router.pathname
                        ? 'font-semibold text-accent-500 before:bg-accent-500'
                        : 'text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300'
                    )}
                  >
                    {link.title}{' '}
                    {link.created && isRecent(link.created) && (
                      <Badge type="new" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  )
}
