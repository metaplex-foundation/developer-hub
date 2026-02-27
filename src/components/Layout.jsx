import Hotjar from '@hotjar/browser'
import clsx from 'clsx'
import Link from 'next/link'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Navigation } from '@/components/Navigation'
import { Prose } from '@/components/Prose'
import { TableOfContent } from '@/components/TableOfContent'
import Badge from '@/components/products/Badge'
import { ProductCardGrid } from '@/components/products/ProductCardGrid'
import { productCategories } from '@/components/products/index'
import { useTranslations } from '@/contexts/LocaleContext'
import { useAccentClass } from '@/shared/useAccentClass'
import { useLightense } from '@/shared/useLightense'

export function Layout({ children, page }) {
  const isHomePage = page.pathname === '/'
  const isCodeViewer = page.pathname === '/code-viewer'
  const isCategoryIndexPage = ['/tokens', '/agents', '/nfts', '/smart-contracts', '/dev-tools'].some(
    path => page.pathname === path || page.pathname.match(new RegExp(`^/(en|ja|ko|zh)${path}$`))
  )
  const hasNavigation = !!page.activeSection?.navigation
  const t = useTranslations('homepage')
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

  const getCategoryName = (category) => {
    const categoryKeys = {
      'Tokens': 'tokens',
      'Agents': 'agents',
      'NFTs': 'nfts',
      'Smart Contracts': 'smartContracts',
      'Dev Tools': 'devTools',
    };
    const key = categoryKeys[category];
    return key ? t(`categories.${key}`, category) : category;
  };

  const getCategoryDescription = (category) => {
    const categoryKeys = {
      'Tokens': 'tokens',
      'Agents': 'agents',
      'NFTs': 'nfts',
      'Smart Contracts': 'smartContracts',
      'Dev Tools': 'devTools',
    };
    const key = categoryKeys[category];
    const defaultDescriptions = {
      'Tokens': 'Create and launch tokens on Solana. Run token generation events (TGE), fair launches, and manage fungible tokens.',
      'Agents': 'Create, register, and run agents. Use the Metaplex Agent skills and agent registry to manage your autonomous agents.',
      'NFTs': 'Create, manage, and trade NFTs on Solana using Metaplex Core and other NFT standards.',
      'Smart Contracts': 'Production-ready on-chain programs for NFTs, tokens, and digital assets on Solana.',
      'Dev Tools': 'SDKs, CLIs, and APIs to build, test, and deploy digital asset applications on Solana.',
    };
    return key ? t(`categoryDescriptions.${key}`, defaultDescriptions[category] || '') : '';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header page={page} />

      {isHomePage && (
        <>
          {productCategories.map((category, index) => (
            <div key={category} className={clsx("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", index === 0 ? "pt-12 pb-12" : "py-12")}>
              <h2 className="mb-2 text-2xl font-bold text-foreground">{getCategoryName(category)}</h2>
              <p className="mb-8 text-sm text-muted-foreground">
                {getCategoryDescription(category)}
              </p>
              <ProductCardGrid category={category} />
            </div>
          ))}
        </>
      )}

      {isCategoryIndexPage && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-12">
          {page.title && (
            <h2 className="mb-2 text-2xl font-bold text-foreground">{page.title}</h2>
          )}
          {page.description && (
            <p className="mb-8 text-sm text-muted-foreground">{page.description}</p>
          )}
          <Prose className="break-words">{children}</Prose>
        </div>
      )}

      {!isHomePage && !isCategoryIndexPage && (
        <div
          className={clsx(
            'relative mx-auto flex max-w-[1800px] sm:px-2 lg:px-8 xl:px-12'
          )}
        >
          {/* Navigation. */}
          {hasNavigation && !page.product.isFallbackProduct && (
            <div className="hidden lg:relative lg:block lg:flex-none scrollbar border-r border-border">
              <div className="sticky top-[73px] -ml-0.5 h-[calc(100vh-73px)] overflow-y-auto overflow-x-hidden py-8 pl-0.5">
                <Navigation
                  product={page.product}
                  navigation={page.activeSection.navigation}
                  sections={page.product.sections}
                  activeSectionId={page.activeSection?.id}
                  className="w-56 pr-8 xl:w-64 xl:pr-12"
                />
              </div>
            </div>
          )}

          {/* Content. */}
          <div
            className={clsx(
              'min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-3xl xl:max-w-4xl mx-auto',
              hasNavigation ? 'lg:pl-8 lg:pr-0 xl:px-16' : 'lg:pl-0 lg:pr-16'
            )}
          >
            <article>
              {!isCodeViewer && (page.title || page.activeSection?.navigationGroup) && (
                <header className="mb-9 space-y-1">
                  {page.activeSection?.navigationGroup && (
                    <p className="font-display text-sm font-medium text-primary">
                      {page.activeSection.navigationGroup.title}
                    </p>
                  )}
                  {page.title && (
                    <h1 className="font-display text-3xl tracking-tight text-foreground">
                      {page.method && <Badge type={page.method.toLowerCase()} className="mr-2 align-middle" />}
                      {page.title}
                    </h1>
                  )}
                  {page.updated && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Last updated{' '}
                      {(() => {
                        // Parse MM-DD-YYYY or YYYY-MM-DD format
                        const dateStr = page.updated
                        let date
                        if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
                          const [month, day, year] = dateStr.split('-')
                          date = new Date(year, month - 1, day)
                        } else {
                          date = new Date(dateStr)
                        }
                        return date.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      })()}
                    </p>
                  )}
                </header>
              )}
              <Prose className="break-words">{children}</Prose>
            </article>
            {!page.product.isFallbackProduct && (page.activeSection?.previousPage || page.activeSection?.nextPage) && (
            <dl className="mt-12 flex border-t border-border pt-6">
              {page.activeSection?.previousPage && (
                <div>
                  <dt className="font-display text-sm font-medium text-foreground">
                    Previous
                  </dt>
                  <dd className="mt-1">
                    <Link
                      href={page.activeSection.previousPage.href}
                      className="text-base font-semibold text-muted-foreground hover:text-foreground"
                    >
                      <span aria-hidden="true">&larr;</span>{' '}
                      {page.activeSection.previousPage.title}
                    </Link>
                  </dd>
                </div>
              )}
              {page.activeSection?.nextPage && (
                <div className="ml-auto text-right">
                  <dt className="font-display text-sm font-medium text-foreground">
                    Next
                  </dt>
                  <dd className="mt-1">
                    <Link
                      href={page.activeSection.nextPage.href}
                      className="text-base font-semibold text-muted-foreground hover:text-foreground"
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
