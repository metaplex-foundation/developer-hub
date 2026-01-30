import clsx from 'clsx'
import Link from 'next/link'
import { Icon } from '@/components/icons'

export function Sections({ sections, activeSectionId, className, props }) {
  return (
    <div className={clsx(className, 'flex')} {...props}>
      {sections.map((section) => {
        const isExternal = typeof section.href === 'string' && section.href.startsWith('http')
        const content = (
          <>
            <Icon
              icon={section.icon}
              className={clsx(
                'h-5 w-5',
                section.id === activeSectionId
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}
            />
            <span className="leading-tight">{section.title}</span>
          </>
        )

        const classNames = clsx(
          'flex items-center gap-2 rounded-lg px-2 py-1',
          'hover:bg-muted hover:ring-1 hover:ring-inset hover:ring-border',
          section.id === activeSectionId
            ? 'font-medium text-foreground'
            : 'text-muted-foreground'
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
