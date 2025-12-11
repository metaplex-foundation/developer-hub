import clsx from 'clsx'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { MobileNavigation } from '@/components/MobileNavigation'
import { Search } from '@/components/Search'
// import { ThemeSelector } from '@/components/ThemeSelector'
import { IconWithName } from '@/components/products/IconWithName'
import { Sections } from '@/components/products/Sections'
import { DiscordIcon } from '@/components/icons/SocialIcons'
import NavList from './NavList'
import { useLocale } from '@/contexts/LocaleContext'
import { getLocalizedHref } from '@/config/languages'

export function Header({ page }) {
  let [isScrolled, setIsScrolled] = useState(false)
  const { locale } = useLocale()

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
        <div className="relative flex flex-grow basis-0 items-center gap-12">
          <div className="flex flex-shrink-0 flex-col">
            <Link href={getLocalizedHref('/', locale)}>
              <img
                src="/metaplex-logo-white.png"
                alt="Metaplex"
                className="h-4 w-auto no-lightense"
              />
            </Link>
          </div>
          <NavList />
        </div>

        

        <div className="relative flex basis-0 items-center justify-end gap-4 sm:gap-6 lg:flex-grow">
          <Link
            href="https://discord.com/invite/metaplex"
            target="_blank"
            className="hidden items-center gap-2 whitespace-nowrap rounded-lg bg-[#5865F2] px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-[#4752C4] md:flex"
          >
            <DiscordIcon className="h-4 w-4 fill-current" />
            Dev Support
          </Link>
          <Search iconOnly />
          <LanguageSwitcher />
          {/* <ThemeSelector className="relative z-10" /> */}
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
