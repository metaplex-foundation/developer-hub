'use client'

import { Popover } from '@headlessui/react'
import Link from 'next/link'
import { SwitcherPopover } from './products/SwitcherPopover'
import { productCategories } from './products/index'
import { useTranslations, useLocale } from '@/contexts/LocaleContext'
import { getLocalizedHref } from '@/config/languages'

const NavList = () => {
  const t = useTranslations('header')
  const { locale } = useLocale()

  const getTranslatedCategory = (category) => {
    const categoryMap = {
      'MPL': t('mpl', 'MPL'),
      'Dev Tools': t('devTools', 'Dev Tools'),
      'Aura': t('aura', 'Aura')
    }
    return categoryMap[category] || category
  }

  return (
    <div className="hidden cursor-pointer  gap-8 lg:flex">
      {productCategories.map((item, index) => {
        if (item === 'Aura') {
          return (
            <Link href={getLocalizedHref("/aura", locale)} key={index}>
              <div className="-mx-4 -my-2 rounded-lg px-4 py-2 text-black dark:text-white">
                {getTranslatedCategory(item)}
              </div>
            </Link>
          )
        }

        return (
          <div className="hidden flex-col lg:flex" key={index}>
            <SwitcherPopover menuItem={productCategories[index]}>
              <Popover.Button className="-mx-4 -my-2 rounded-lg px-4 py-2 text-black dark:text-white">
                {getTranslatedCategory(item)}
              </Popover.Button>
            </SwitcherPopover>
          </div>
        )
      })}
      <div className="hidden flex-col lg:flex">
        <Link href={getLocalizedHref("/guides", locale)}>
          <div className="-mx-4 -my-2 rounded-lg px-4 py-2 text-black dark:text-white">
            {t('guides', 'Guides')}
          </div>
        </Link>
      </div>
    </div>
  )
}

export default NavList
