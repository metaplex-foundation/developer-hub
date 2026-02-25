import { Dialog } from '@headlessui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { Navigation } from '@/components/Navigation'
import { Sections } from '@/components/products/Sections'
import { getLocalizedHref } from '@/config/languages'
import { useLocale, useTranslations } from '@/contexts/LocaleContext'
import {
  BookOpenIcon,
  ComputerDesktopIcon,
  DocumentTextIcon,
  HomeIcon,
  PhotoIcon,
  SparklesIcon,
} from '@heroicons/react/20/solid'

function MenuIcon(props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      {...props}
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

function CloseIcon(props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      {...props}
    >
      <path d="M5 5l14 14M19 5l-14 14" />
    </svg>
  )
}

export function MobileNavigation({ page }) {
  let router = useRouter()
  let [isOpen, setIsOpen] = useState(false)
  const t = useTranslations('header')
  const { locale } = useLocale()

  useEffect(() => {
    if (!isOpen) return

    function onRouteChange() {
      setIsOpen(false)
    }

    router.events.on('routeChangeComplete', onRouteChange)
    router.events.on('routeChangeError', onRouteChange)

    return () => {
      router.events.off('routeChangeComplete', onRouteChange)
      router.events.off('routeChangeError', onRouteChange)
    }
  }, [router, isOpen])

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative"
        aria-label="Open navigation"
      >
        <MenuIcon className="h-6 w-6 stroke-muted-foreground" />
      </button>
      <Dialog
        open={isOpen}
        onClose={setIsOpen}
        className="fixed inset-0 z-50 flex items-start overflow-y-auto bg-background/50 pr-10 backdrop-blur lg:hidden"
        aria-label="Navigation"
      >
        <Dialog.Panel className="min-h-full w-full max-w-sm border-r border-border bg-sidebar px-4 pb-12 pt-5 sm:px-6">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close navigation"
            >
              <CloseIcon className="h-6 w-6 stroke-muted-foreground" />
            </button>
            <Link href={getLocalizedHref('/', locale)} className="ml-6" aria-label="Home page">
              <img
                src="/metaplex-logo-white.png"
                alt="Metaplex"
                className="h-4 w-auto"
              />
            </Link>
          </div>
          <Link
            href={getLocalizedHref('/', locale)}
            className="mt-12 flex items-center gap-2 text-foreground transition-colors hover:text-primary"
          >
            <HomeIcon height={20} /> {t('home', 'Home')}
          </Link>
          <Link
            href={getLocalizedHref('/tokens', locale)}
            className="mt-4 flex items-center gap-2 text-foreground transition-colors hover:text-primary"
          >
            <SparklesIcon height={20} /> {t('tokens', 'Tokens')}
          </Link>
          <Link
            href={getLocalizedHref('/agents', locale)}
            className="mt-4 flex items-center gap-2 text-foreground transition-colors hover:text-primary"
          >
            <SparklesIcon height={20} /> {t('agents', 'Agents')}
          </Link>
          <Link
            href={getLocalizedHref('/nfts', locale)}
            className="mt-4 flex items-center gap-2 text-foreground transition-colors hover:text-primary"
          >
            <PhotoIcon height={20} /> {t('nfts', 'NFTs')}
          </Link>
          <Link
            href={getLocalizedHref('/smart-contracts', locale)}
            className="mt-4 flex items-center gap-2 text-foreground transition-colors hover:text-primary"
          >
            <DocumentTextIcon height={20} /> {t('smartContracts', 'Smart Contracts')}
          </Link>
          <Link
            href={getLocalizedHref('/dev-tools', locale)}
            className="mt-4 flex items-center gap-2 text-foreground transition-colors hover:text-primary"
          >
            <ComputerDesktopIcon height={20} /> {t('devTools', 'Dev Tools')}
          </Link>

          <Link
            href={getLocalizedHref('/guides', locale)}
            className="mt-4 flex items-center gap-2 text-foreground transition-colors hover:text-primary"
          >
            <BookOpenIcon height={20} /> {t('solana', 'Solana')}
          </Link>

          {/* Only show product-specific navigation when not on the global/home pages */}
          {!page.product.isFallbackProduct && (
            <>
              <hr className="mt-8 border-border" />
              <div className="mt-6 text-xl font-bold text-foreground">
                {page.product.name}
              </div>

              {page.product.sections && page.product.sections.length > 1 && (
                <Sections
                  className="-ml-2 mt-4 flex flex-col gap-2"
                  sections={page.product.sections}
                  activeSectionId={page.activeSection?.id}
                />
              )}
              <Navigation
                product={page.product}
                navigation={page.activeSection?.navigation ?? []}
                className="mt-6 px-1"
                hideProductHeader
              />
            </>
          )}
        </Dialog.Panel>
      </Dialog>
    </>
  )
}
