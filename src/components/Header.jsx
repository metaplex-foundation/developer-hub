import clsx from 'clsx'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { MobileNavigation } from '@/components/MobileNavigation'
import { Search } from '@/components/Search'
import { ThemeSelector } from '@/components/ThemeSelector'
import { categoryToColor, IconWithName } from '@/components/products/IconWithName'
import { Sections } from '@/components/products/Sections'
import { SwitcherDialog } from '@/components/products/SwitcherDialog'
import NavList from './NavList'
import { Logo } from './products/global/Logo'

export function Header({ page }) {
  let [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setIsScrolled(window.scrollY > 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <header
      className={clsx(
        'sticky top-0 z-50 bg-white shadow-md shadow-neutral-900/5 transition duration-500 dark:shadow-none',
        isScrolled
          ? 'dark:bg-neutral-900/95 dark:backdrop-blur dark:[@supports(backdrop-filter:blur(0))]:bg-neutral-900/75'
          : 'dark:bg-transparent'
      )}
    >
      <div className="flex flex-wrap items-center justify-between border-b border-neutral-600 px-4 py-5 sm:px-6 lg:px-8">
        <div className="mr-6 flex lg:hidden">
          <MobileNavigation page={page} />
        </div>
        <div className="relative flex flex-grow basis-0 items-center">
          <div className="hidden flex-col sm:flex">
            <Link href={`/`}>
              {/* {React.cloneElement(page.product.icon, {
                color: categoryToColor.get(
                  page.product.navigationMenuCatergory
                ),
                className: 'h-8 w-8 sm:hidden',
              })} */}
              {/* <IconWithName product={page.product} className="hidden sm:flex" /> */}
              {/* {console.log(page.product)} */}
              <div className="flex">
                <Logo className="h-8 w-8" />
                <div className="ml-4 flex flex-1 flex-col justify-center text-left">
                  <div className="text-sm font-medium leading-none text-slate-800 dark:text-white">
                    Bakstag
                  </div>
                  <div className="mt-1 text-sm leading-none text-slate-500 dark:text-slate-400">
                    OTC Market
                  </div>
                </div>
              </div>
            </Link>
          </div>
          {/* <div className="flex flex-col lg:hidden">
            <SwitcherDialog>
              {({ setIsOpen }) => (
                <button
                  onClick={() => setIsOpen(true)}
                  className="-mx-4 -my-2 rounded-lg px-4 py-2"
                >
                  <Logo className="h-8 w-8" />
                  <IconWithName
                    product={page.product}
                    // className="hidden sm:flex"
                    description={true}
                  />
                </button>
              )}
            </SwitcherDialog>
          </div> */}
        </div>

        <NavList />

        <div className="relative flex basis-0 items-center justify-end gap-6 sm:gap-8 lg:flex-grow">
          <div className="-my-5 mr-6 sm:mr-8 lg:mr-0">
            <Search />
          </div>
          <ThemeSelector className="relative z-10" />
          <Link
            href={page.product.github}
            className="group"
            aria-label="GitHub"
            target="_blank"
          >
            <GitHubIcon className="h-6 w-6 fill-slate-400 group-hover:fill-slate-500 dark:group-hover:fill-slate-300" />
          </Link>
        </div>
      </div>

      {!page.product.isJsxPage &&
        page.product.sections &&
        page.product.sections.length > 1 && (
          <div className="flex justify-center px-8 py-2">
            <IconWithName
              product={page.product}
              className="flex items-center sm:flex"
            />

            <Sections
              className="hidden gap-6 px-2 py-2 text-sm sm:px-4 lg:flex lg:px-6 "
              sections={page.product.sections}
              activeSectionId={page.activeSection?.id}
            />
          </div>
        )}
    </header>
  )
}

function GitHubIcon(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" {...props}>
      <path d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" />
    </svg>
  )
}
