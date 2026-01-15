import clsx from 'clsx'
import Link from 'next/link'
import { Icon } from '@/components/icons'

export function Sections({ sections, activeSectionId, className, props }) {
  return (
    <div className={clsx(className, 'flex')} {...props}>
      {sections.filter((section) => section.title).map((section) => {
        const isExternal = typeof section.href === 'string' && section.href.startsWith('http')
        const content = (
          <>
            <Icon
              icon={section.icon}
              className={clsx(
                'h-5 w-5',
                section.id === activeSectionId
                  ? 'text-slate-500 dark:text-slate-200'
                  : 'text-slate-400'
              )}
            />
            <span className="leading-tight">{section.title}</span>
          </>
        )

        const classNames = clsx(
          'flex items-center gap-2 rounded-lg px-2 py-1',
          'hover:bg-slate-50 hover:ring-1 hover:ring-inset hover:ring-slate-800/5',
          'dark:hover:bg-slate-800/75 dark:hover:ring-1 dark:hover:ring-inset dark:hover:ring-white/5',
          section.id === activeSectionId
            ? 'font-medium text-slate-800 dark:text-white'
            : 'text-slate-500 dark:text-slate-400'
        )

        return isExternal ? (
          <a
            key={section.id}
            href={section.href}
            className={classNames}
            target={section.target || '_blank'}
            rel="noopener noreferrer"
          >
            {content}
          </a>
        ) : (
          <Link key={section.id} href={section.href} className={classNames} target={section.target}>
            {content}
          </Link>
        )
      })}
    </div>
  )
}
