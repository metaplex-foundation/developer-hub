import { Grid } from '@/components/products/Grid'
import { Popover, Transition } from '@headlessui/react'

export function SwitcherPopover({ children, props }) {
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
            <div className="overflow-hidden rounded-lg bg-white p-4 shadow-xl ring-1 ring-black ring-opacity-5 dark:border dark:border-slate-600 dark:bg-slate-800">
              <Grid
                className="relative md:grid-flow-col md:grid-cols-2 md:grid-rows-4"
                onClick={close}
              />
            </div>
          )}
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
