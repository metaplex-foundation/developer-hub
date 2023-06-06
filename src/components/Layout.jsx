import Link from 'next/link'

import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Navigation } from '@/components/Navigation'
import { Prose } from '@/components/Prose'
import { TableOfContent } from '@/components/TableOfContent'
import clsx from 'clsx'

export function Layout({ children, page }) {
  const hasNavigation = !!page.activeSection?.navigation

  return (
    <>
      <Header page={page} />

      {page.isIndexPage && <Hero page={page} />}

      <div className={clsx(
        "relative mx-auto flex justify-center sm:px-2 lg:px-8 xl:px-12",
        hasNavigation ? 'max-w-8xl' : 'max-w-6xl'
      )}>
        {/* Navigation. */}
        { hasNavigation && (
          <div className="hidden lg:relative lg:block lg:flex-none">
            <div className="absolute inset-y-0 right-0 w-[50vw] bg-slate-50 dark:hidden" />
            <div className="absolute bottom-0 right-0 top-16 hidden h-12 w-px bg-gradient-to-t from-slate-800 dark:block" />
            <div className="absolute bottom-0 right-0 top-28 hidden w-px bg-slate-800 dark:block" />
            <div className="sticky top-[7rem] -ml-0.5 h-[calc(100vh-7rem)] overflow-y-auto overflow-x-hidden py-16 pl-0.5">
              <Navigation
                navigation={page.activeSection.navigation}
                className="w-64 pr-8 xl:w-72 xl:pr-16"
              />
            </div>
          </div>
        )}

        {/* Content. */}
        <div className={clsx(
          "min-w-0 max-w-2xl flex-auto lg:max-w-none px-4 py-16",
          hasNavigation ? 'lg:pl-8 lg:pr-0 xl:px-16' : 'lg:pl-0 lg:pr-16'
        )}>
          <article>
            {(page.title || page.activeSection?.navigationGroup) && (
              <header className="mb-9 space-y-1">
                {page.activeSection?.navigationGroup && (
                  <p className="font-display text-sm font-medium text-sky-500">
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
            <Prose>{children}</Prose>
          </article>
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
        </div>

        {/* Table of contents. */}
        <div className={clsx(
          "hidden",
          hasNavigation
            ? 'xl:sticky xl:top-[7rem] xl:-mr-6 xl:block xl:h-[calc(100vh-7rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6'
            : 'lg:sticky lg:top-[7rem] lg:-mr-6 lg:block lg:h-[calc(100vh-7rem)] lg:flex-none lg:overflow-y-auto lg:py-16 lg:pr-6'
        )}>
          <TableOfContent
            tableOfContents={page.tableOfContents}
          ></TableOfContent>
        </div>
      </div>
    </>
  )
}
