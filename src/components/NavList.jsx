import { Popover } from '@headlessui/react'
import { Logo, LogoWithName } from './products/Logo'
import { SwitcherDialog } from './products/SwitcherDialog'
import { SwitcherPopover } from './products/SwitcherPopover'

const menuItems = ['ACM', 'Commerce', 'Utility', 'Dev Tools']

const NavList = () => {
  return (
    <div className="hidden cursor-pointer  gap-8 lg:flex">
      {menuItems.map((item, index) => {
        return (
          <>
            <div className="hidden flex-col lg:flex">
              <SwitcherPopover menuItem={menuItems[index]}>
                <Popover.Button className="-mx-4 -my-2 rounded-lg px-4 py-2 text-white">
                  {item}
                  {/* <Logo product={page.product} className="h-8 w-8 sm:hidden" />
                <LogoWithName
                  product={page.product}
                  className="hidden sm:flex"
                /> */}
                </Popover.Button>
              </SwitcherPopover>
            </div>
          </>
        )
      })}
    </div>
  )
}

export default NavList
