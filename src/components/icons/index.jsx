import * as outlineIcons24 from '@heroicons/react/24/outline'
import * as solidIcons20 from '@heroicons/react/20/solid'
import clsx from 'clsx'

export function Icon({ icon, className, ...props }) {
  const isSolid = icon.startsWith('Solid')
  const icons = isSolid ? solidIcons20 : outlineIcons24
  const trimmedIcon = icon.replace(/^(Solid|Outline)/, '')
  const IconComponent =
    icons[trimmedIcon] ??
    icons[trimmedIcon + 'Icon'] ??
    icons['ExclamationCircleIcon']
  const defaultSize = isSolid ? 'h-5 w-5' : 'h-6 w-6'

  return (
    <IconComponent
      className={clsx(className, className ? '' : defaultSize)}
      {...props}
    />
  )
}
