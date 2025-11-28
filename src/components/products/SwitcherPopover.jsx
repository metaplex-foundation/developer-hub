import { Grid } from '@/components/products/Grid'
import { Popover, Transition } from '@headlessui/react'

export function SwitcherPopover({ children, menuItem, ...props }) {
  return (
    <Popover {...props}>
      {children}
      {/* <Transition
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      > */}
      <Popover.Panel className="absolute z-10 m-auto mt-[25px] w-full">
        {({ close }) => (
          <div className="fixed left-0 w-full p-4 ring-1 ring-black ring-opacity-5 dark:border dark:border-slate-600 dark:bg-neutral-900 flex flex-row">
            <div className='flex flex-row max-w-[1200px] w-full m-auto'>
              <div className='max-w-[200px] w-full border-r border-slate-600 pr-4'>
                <h2 className="text-2xl font-bold text-white">{menuItem}</h2>
                <p className='text-sm text-slate-500'>Learn about the Metaplex MPL programs to create and manage Token and NFT projects.</p>
              </div>
              <div className="m-auto w-full overflow-hidden p-4 shadow-xl max-w-[1200px]  ">
                <Grid
                  onClick={close}
                  menuItem={menuItem}
                  numCols={'grid-cols-4'}
                />
              </div>
            </div>
          </div>
        )}
      </Popover.Panel>
      {/* </Transition> */}
    </Popover>
  )
}
