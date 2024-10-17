'use client'

import { Popover } from '@headlessui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { SwitcherPopover } from './products/SwitcherPopover'
import { productCategories } from './products/index'

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
      <Link href="https://bakstag-landing.vercel.app/" target='_blank'>
        <div className="-mx-4 -my-2 rounded-lg px-4 py-2 text-black dark:text-white">
          Explore
        </div>
      </Link>
      <Link href="https://bakstag-frontend.vercel.app/" target='_blank'>
        <div className="-mx-4 -my-2 rounded-lg px-4 py-2 text-black dark:text-white">
          Exchange
        </div>
      </Link>
    </div>
  )
}

export default NavList
