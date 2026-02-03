import Link from 'next/link'

import { Icon } from '@/components/icons'

export function QuickLinks({ children }) {
  return (
    <div className="not-prose my-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
      {children}
    </div>
  )
}

export function QuickLink({ title, description, href, target, icon }) {
  return (
    <div className="group relative rounded-xl border border-border bg-card transition-colors duration-200 hover:border-foreground">
      <div className="relative overflow-hidden rounded-xl p-6">
        <Icon
          icon={icon}
          className="h-8 w-8 transition-colors duration-200 group-hover:text-primary"
        />
        <h2 className="mt-4 font-display text-base text-card-foreground">
          <Link href={href} target={target}>
            <span className="absolute -inset-px rounded-xl" />
            {title}
          </Link>
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}
