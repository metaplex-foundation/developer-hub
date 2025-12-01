import Hotjar from '@hotjar/browser'
import clsx from 'clsx'
import Link from 'next/link'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Navigation } from '@/components/Navigation'
import { nftMenuCategory, tokenMenuCategory } from '@/components/NavList'
import { Prose } from '@/components/Prose'
import { TableOfContent } from '@/components/TableOfContent'
import { Grid } from '@/components/products/Grid'
import { useAccentClass } from '@/shared/useAccentClass'
import { useLightense } from '@/shared/useLightense'

import ProductPreview from '@/components/productPreview'
export function Layout({ children, page }) {
  const isHomePage = page.pathname === '/'
  const isCodeViewer = page.pathname === '/code-viewer'
  const hasNavigation = !!page.activeSection?.navigation
  const Hero = page.activeHero
  useLightense()
  useAccentClass(page.product)
  if (
    process.env.NEXT_PUBLIC_HOTJAR_ID &&
    process.env.NEXT_PUBLIC_HOTJAR_VERSION
  ) {
    Hotjar.init(
      process.env.NEXT_PUBLIC_HOTJAR_ID,
      process.env.NEXT_PUBLIC_HOTJAR_VERSION
    )
  }

  return (
    <div className="min-h-screen">
      <Header page={page} />

      

      {Hero && <Hero page={page} />}

      {isHomePage && (
        <>
        <ProductPreview
          productPreviewActions={tokenMenuCategory}
          accent={page.product.accent}
          title="Tokens"
          description="Create, read, update, burn, and transfer tokens on the Solana blockchain using Metaplex SDKs."
        />
        <ProductPreview
          productPreviewActions={nftMenuCategory}
          accent={page.product.accent}
          title="NFTs"
          description="Create, read, update, burn, and transfer NFTs on the Solana blockchain using Metaplex SDKs."
        />
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-2xl font-bold text-white">Programs</h2>
          <p className="mb-8 text-sm text-neutral-400">
            On-chain programs for creating and managing digital assets on Solana.
          </p>
          <Grid menuItem="Programs" numCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="mb-2 text-2xl font-bold text-white">Developer Tools</h2>
          <p className="mb-8 text-sm text-neutral-400">
            Tools and utilities to help you build with Metaplex programs.
          </p>
          <Grid menuItem="Dev Tools" numCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />
        </div>
        </>
      )}

      {!isHomePage && (
        <div
          className={clsx(
            'relative mx-auto flex justify-center sm:px-2 lg:px-8 xl:px-12'
          )}
        >
          {/* Navigation. */}
          {hasNavigation && !page.product.isFallbackProduct && (
            <div className="hidden lg:relative lg:block lg:flex-none scrollbar">
              <div className="absolute inset-y-0 right-0 w-[50vw] bg-slate-50 dark:hidden" />
              <div className="absolute bottom-0 right-0 top-16 hidden h-12 w-px bg-gradient-to-t from-slate-800 dark:block" />
              <div className="absolute bottom-0 right-0 top-28 hidden w-px bg-slate-800 dark:block" />
              <div className="sticky top-[133px] -ml-0.5 h-[calc(100vh-133px)] overflow-y-auto overflow-x-hidden py-16 pl-0.5">
                <Navigation
                  product={page.product}
                  navigation={page.activeSection.navigation}
                  className="w-64 pr-8 xl:w-72 xl:pr-16"
                />
              </div>
            </div>
          )}

          {/* Content. */}
          <div
            className={clsx(
              'min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-[1200px]',
              hasNavigation ? 'lg:pl-8 lg:pr-0 xl:px-16' : 'lg:pl-0 lg:pr-16'
            )}
          >
            <article>
              {!isCodeViewer && (page.title || page.activeSection?.navigationGroup) && (
                <header className="mb-9 space-y-1">
                  {page.activeSection?.navigationGroup && (
                    <p className="font-display text-sm font-medium text-accent-500">
                      {page.activeSection.navigationGroup.title}
                    </p>
                  )}
                  {page.title && (
                    <h1 className="font-display text-3xl tracking-tight text-slate-900 dark:text-white">
                      {page.title}
                    </h1>
                  )}
                </header>
              )}
              <Prose className="break-words">{children}</Prose>
            </article>
            {!page.product.isFallbackProduct && (
            <dl className="mt-12 flex border-t border-slate-200 pt-6 dark:border-slate-800">
              {page.activeSection?.previousPage && (
                <div>
                  <dt className="font-display text-sm font-medium text-slate-900 dark:text-white">
                    Previous
                  </dt>
                  <dd className="mt-1">
                    <Link
                      href={page.activeSection.previousPage.href}
                      className="text-base font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
                    >
                      <span aria-hidden="true">&larr;</span>{' '}
                      {page.activeSection.previousPage.title}
                    </Link>
                  </dd>
                </div>
              )}
              {page.activeSection?.nextPage && (
                <div className="ml-auto text-right">
                  <dt className="font-display text-sm font-medium text-slate-900 dark:text-white">
                    Next
                  </dt>
                  <dd className="mt-1">
                    <Link
                      href={page.activeSection.nextPage.href}
                      className="text-base font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
                    >
                      {page.activeSection.nextPage.title}{' '}
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </dd>
                </div>
              )}
            </dl>
            )}
          </div>

          {/* Table of contents. */}
          {page.tableOfContents.length > 0 && !page.product.isFallbackProduct && (
            <div
              className={clsx(
                'hidden',
                hasNavigation
                  ? 'xl:sticky xl:top-[7rem] xl:-mr-6 xl:block xl:h-[calc(100vh-7rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6'
                  : 'lg:sticky lg:top-[7rem] lg:-mr-6 lg:block lg:h-[calc(100vh-7rem)] lg:flex-none lg:overflow-y-auto lg:py-16 lg:pr-6'
              )}
            >
              <TableOfContent tableOfContents={page.tableOfContents} />
            </div>
          )}
        </div>
      )}

      <Footer />
    </div>
  )
}
