import clsx from 'clsx'

import { Icon } from '@/components/icons/dual-tone'

const styles = {
  note: {
    container: 'bg-muted ring-1 ring-border',
    title: 'text-primary',
    body: 'text-muted-foreground prose-a:text-primary prose-code:text-foreground',
  },
  warning: {
    container: 'bg-amber-50 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:ring-amber-900/50',
    title: 'text-amber-900 dark:text-amber-400',
    body: 'text-amber-800 prose-a:text-amber-900 prose-code:text-amber-900 dark:text-amber-200 dark:prose-a:text-amber-400 dark:prose-code:text-amber-200',
  },
}

const icons = {
  note: (props) => <Icon icon="lightbulb" {...props} />,
  warning: (props) => <Icon icon="warning" color="amber" {...props} />,
}

export function Callout({ type = 'note', title, children }) {
  let IconComponent = icons[type]

  return (
    <div className={clsx('my-8 flex rounded-3xl p-6', styles[type].container)}>
      <IconComponent className="h-8 w-8 flex-none" />
      <div className="ml-4 flex-auto">
        <p className={clsx('m-0 font-display text-xl', styles[type].title)}>
          {title}
        </p>
        <div className={clsx('prose mt-2.5', styles[type].body)}>
          {children}
        </div>
      </div>
    </div>
  )
}
