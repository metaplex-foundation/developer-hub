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
          <div className="hidden flex-col lg:flex">
            <Link href={`/`}>
              {React.cloneElement(page.product.icon, {
                color: categoryToColor.get(
                  page.product.navigationMenuCatergory
                ),
                className: 'h-8 w-8 sm:hidden',
              })}
              <div className="flex">
                <Logo className="h-8 w-8" />
                <div className="ml-4 flex flex-1 flex-col justify-center text-left">
                  <div className="text-sm font-medium leading-none text-slate-800 dark:text-white">
                    Metaplex
                  </div>
                  <div className="mt-1 text-sm leading-none text-slate-500 dark:text-slate-400">
                    Developer Hub
                  </div>
                </div>
              </div>
            </Link>
          </div>
          <div className="flex flex-col lg:hidden">
            <IconWithName
              product={page.product}
              className="flex"
              description={false}
            />
          </div>
        </div>

        <NavList />

        <div className="relative flex basis-0 items-center justify-end gap-6 sm:gap-8 lg:flex-grow">
          <div className="-my-5">
            <Search />
          </div>
          <ThemeSelector className="relative z-10" />
          <Link
            href={page.product.github}
            className="group hidden sm:block"
            aria-label="GitHub"
            target="_blank"
          >
            <GitHubIcon className="h-6 w-6 fill-slate-400 group-hover:fill-slate-500 dark:group-hover:fill-slate-300" />
          </Link>
          <Link
            href={'https://discord.com/invite/metaplex'}
            className="group hidden sm:block"
            aria-label="Discord"
            target="_blank"
          >
            <DiscordIcon className="h-6 w-6 fill-slate-400 group-hover:fill-slate-500 dark:group-hover:fill-slate-300" />
          </Link>
          <Link
            href={'https://x.com/metaplex'}
            className="group hidden sm:block"
            aria-label="X"
            target="_blank"
          >
            <XIcon className="h-6 w-6 fill-slate-400 group-hover:fill-slate-500 dark:group-hover:fill-slate-300" />
          </Link>
        </div>
      </div>

      {!page.product.isJsxPage &&
        page.product.sections &&
        page.product.sections.length > 1 && (
          <div className="hidden justify-center px-8 py-2 md:flex">
            <IconWithName
              product={page.product}
              className="hidden items-center lg:flex"
            />

            <Sections
              className="flex gap-6 px-2 py-2 text-sm sm:px-4 lg:px-6 "
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

function DiscordIcon(props) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" {...props}>
      <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
    </svg>
  )
}

function XIcon(props) {
  return (
    <svg {...props} viewBox="0 0 16 16" aria-hidden="true">
      <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
    </svg>
  )
}
