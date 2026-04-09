import clsx from 'clsx'

import { Icon } from '@/components/icons/dual-tone'

const styles = {
  note: {
    container: 'border-l-2 border-primary bg-muted/50',
    icon: 'text-primary',
    title: 'text-primary',
    body: 'text-muted-foreground prose-a:text-primary prose-code:text-foreground',
  },
  warning: {
    container: 'border-l-2 border-amber-400 bg-amber-50/50 dark:bg-amber-950/20',
    icon: 'text-amber-500 dark:text-amber-400',
    title: 'text-amber-900 dark:text-amber-400',
    body: 'text-amber-800 prose-a:text-amber-900 prose-code:text-amber-900 dark:text-amber-200 dark:prose-a:text-amber-400 dark:prose-code:text-amber-200',
  },
}

const icons = {
  note: (props) => <Icon icon="lightbulb" {...props} />,
  warning: (props) => <Icon icon="warning" color="amber" {...props} />,
}

export function Callout({ type = 'note', title, children }) {
  const safeType = type in styles ? type : 'note'
  const IconComponent = icons[safeType]

  return (
    <div className={clsx('my-6 px-4 py-3', styles[safeType].container)}>
      <div className="flex items-start gap-2">
        {IconComponent && <IconComponent className={clsx('mt-0.5 h-4 w-4 flex-none', styles[safeType].icon)} />}
        <div className="flex-auto">
          {title && (
            <p className={clsx('m-0 text-sm font-semibold', styles[safeType].title)}>
              {title}
            </p>
          )}
          <div className={clsx('prose text-sm', title && 'mt-1', styles[safeType].body)}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
