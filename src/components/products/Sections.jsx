import clsx from 'clsx'
import Link from 'next/link'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
import { Icon } from '@/components/icons'

export function Sections({ sections, activeSectionId, className, props }) {
  return (
    <div className={clsx(className, 'flex')} {...props}>
      {sections.filter((section) => section.title).map((section) => {
        const isActive = section.id === activeSectionId
        const isExternal = typeof section.href === 'string' && section.href.startsWith('http')
        const content = (
          <>
            <Icon
              icon={section.icon}
              className={clsx(
                'h-4 w-4 flex-none',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            />
            <span className="leading-tight">{section.title}</span>
            {isExternal && (
              <ArrowTopRightOnSquareIcon className="h-3 w-3 flex-none opacity-50" />
            )}
          </>
        )

        const classNames = clsx(
          'flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm',
          'hover:bg-muted',
          isActive
            ? 'bg-primary/10 font-medium text-primary'
            : 'text-muted-foreground hover:text-foreground'
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
