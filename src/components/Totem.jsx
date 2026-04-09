import { Disclosure } from '@headlessui/react'
import clsx from 'clsx'

import { Icon } from '@/components/icons'

export function Totem({ children }) {
  return <div className="totem overflow-hidden">{children}</div>
}

export function TotemAccordion({ children, title, defaultOpen = false }) {
  return (
    <Disclosure defaultOpen={defaultOpen}>
      {({ open }) => (
        <div>
          <Disclosure.Button className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50">
            {title}
            <Icon
              icon="ChevronRight"
              className={clsx(
                'h-4 w-4 flex-none text-muted-foreground transition-transform duration-200',
                open ? 'rotate-90' : ''
              )}
            />
          </Disclosure.Button>
          <Disclosure.Panel>{children}</Disclosure.Panel>
        </div>
      )}
    </Disclosure>
  )
}

export function TotemProse({ children }) {
  return <div>{children}</div>
}
