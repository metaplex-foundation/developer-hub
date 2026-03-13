import clsx from 'clsx'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { MobileNavigation } from '@/components/MobileNavigation'
import { Search } from '@/components/Search'
// import { ThemeSelector } from '@/components/ThemeSelector'
import { DiscordIcon } from '@/components/icons/SocialIcons'
import { getLocalizedHref } from '@/config/languages'
import { useLocale } from '@/contexts/LocaleContext'
import NavList from './NavList'

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
        'sticky top-0 z-50 border-b border-border bg-background shadow-foreground/5 transition duration-500 dark:shadow-none',
        isScrolled
          ? 'dark:bg-background/95 dark:backdrop-blur dark:[@supports(backdrop-filter:blur(0))]:bg-background/75'
          : 'dark:bg-transparent'
      )}
    >
      <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between px-4 py-5 sm:px-6 lg:px-8 xl:px-12">
        <div className="mr-6 flex lg:hidden">
          <MobileNavigation page={page} />
        </div>
        <div className="relative flex flex-grow basis-0 items-center gap-12">
          <div className="flex flex-shrink-0 flex-col">
            <Link href={getLocalizedHref('/', locale)}>
              <img
                src="/docs/metaplex-logo-white.png"
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
            className="hidden items-center gap-2 whitespace-nowrap rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-all duration-200 hover:brightness-110 md:flex"
          >
            <DiscordIcon className="h-4 w-4 fill-current" />
            Dev Support
          </Link>
          <Search iconOnly />
          <LanguageSwitcher />
          {/* <ThemeSelector className="relative z-10" /> */}
        </div>
      </div>

    </header>
  )
}
