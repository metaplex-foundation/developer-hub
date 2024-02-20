import { Dialog } from '@headlessui/react'
import { useState } from 'react'
import { MobileAppGrid } from './MobileAppGrid'

export function SwitcherDialog({ children, props }) {
  let [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {children({ isOpen, setIsOpen })}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
        {...props}
      >
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <div
          className="fixed inset-0 bg-neutral-900/50 backdrop-blur"
          aria-hidden="true"
        />

        {/* Full-screen scrollable container */}
        <div className=" fixed max-h-screen h-full inset-x-0 top-0
        l-0">
          {/* Container to center the panel */}
          <div className="relative flex max-h-[95vh]  p-4">
            {/* The actual dialog panel  */}
            <Dialog.Panel className="relative mx-auto w-full rounded-xl bg-white p-4 shadow-xl ring-1 ring-black ring-opacity-5 dark:border dark:border-slate-600 dark:bg-neutral-900 overflow-auto">
              <div
                className="absolute right-5 z-50 text-black hover:cursor-pointer dark:text-white"
                onClick={(e) => {
                  e.stopPropagation, setIsOpen(false)
                }}
              >
                
              </div>

              <MobileAppGrid
                className="relative grid-rows-1"
                onClick={() => setIsOpen(false)}
              />
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  )
}
