import { Grid } from '@/components/products/Grid'
import { Popover, Transition } from '@headlessui/react'

export function SwitcherPopover({ children, menuItem, ...props }) {
  console.log('menuItem', menuItem)
  return (
    <Popover className="relative" {...props}>
      {children}
      <Transition
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute z-10 mt-4 w-max">
          {({ close }) => (
            <div className="absolute -left-[225px] w-[530px] overflow-hidden rounded-lg bg-white p-4 shadow-xl ring-1 ring-black ring-opacity-5 dark:border dark:border-slate-600 dark:bg-slate-800">
              <Grid
                className="relative md:grid-flow-row md:grid-cols-2"
                onClick={close}
                menuItem={menuItem}
              />
            </div>
          )}
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
