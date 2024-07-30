'use client'

import { Popover } from '@headlessui/react'
import { useState } from 'react'
import { SwitcherPopover } from './products/SwitcherPopover'
import { productCategories } from './products/index'
import { useRouter } from 'next/router'
import Link from 'next/link'

const NavList = () => {

  return (
    <div className="hidden cursor-pointer  gap-8 lg:flex">
      {productCategories.map((item, index) => {
        return (
          <div className="hidden flex-col lg:flex" key={index}>
            <SwitcherPopover menuItem={productCategories[index]}>
              <Popover.Button
                className="-mx-4 -my-2 rounded-lg px-4 py-2 text-black dark:text-white"
              >
                {item}
              </Popover.Button>
            </SwitcherPopover>
          </div>
        )
      })}
      <div className="hidden flex-col lg:flex">
        <Link href="/guides">
        <div className="-mx-4 -my-2 rounded-lg px-4 py-2 text-black dark:text-white">
          Guides
        </div>
        </Link>
      </div>
    </div>
  )
}

export default NavList
