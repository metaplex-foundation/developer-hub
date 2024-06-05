import { Popover } from '@headlessui/react'
import { useState } from 'react'
import { SwitcherPopover } from './products/SwitcherPopover'
import { productCategories } from './products/index'

const NavList = () => {
  const [active, setActive] = useState()

  return (
    <div className="hidden cursor-pointer  gap-8 lg:flex">
      {productCategories.map((item, index) => {
        return (
          <div className="hidden flex-col lg:flex" key={index}>
            <SwitcherPopover menuItem={productCategories[index]}>
              <Popover.Button
                className="-mx-4 -my-2 rounded-lg px-4 py-2 text-black dark:text-white"
                onClick={() => setActive(index)}
              >
                {item}
              </Popover.Button>
            </SwitcherPopover>
          </div>
        )
      })}
    </div>
  )
}

export default NavList
