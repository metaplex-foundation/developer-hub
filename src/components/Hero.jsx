import { Button } from '@/components/Button'
import clsx from 'clsx'

export function Hero({
  page,
  title,
  description,
  subDescription,
  primaryCta,
  secondaryCta,
  children,
}) {
  title = title ?? page.product.name
  description = description ?? page.product.description
  primaryCta = primaryCta ?? {
    title: 'Get started',
    href: `/${page.product.path}/sdk`,
  }
  secondaryCta =
    secondaryCta ??
    (page.product.github
      ? {
          title: 'View on GitHub',
          href: page.product.github,
        }
      : undefined)

  return (
    <div>
      <div className="py-12 sm:px-2 lg:px-0 lg:py-16">
        <div
          className={clsx(
            'mx-auto grid max-w-2xl grid-cols-1 items-center px-4 lg:max-w-7xl lg:px-8 xl:px-12',
            { 'gap-x-8 gap-y-12 lg:grid-cols-2 xl:gap-x-16': children }
          )}
        >
          <div className="md:text-center lg:text-left">
            <h1 className="font-display text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h1>
            <p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
              {description}
            </p>
            {subDescription && (
              <p className="mt-2 text-base text-slate-500 dark:text-slate-500">
                {subDescription}
              </p>
            )}
            <div className="mt-6 flex gap-4 md:justify-center lg:justify-start">
              {primaryCta && !primaryCta.disabled && (
                <Button href={primaryCta.href}>{primaryCta.title}</Button>
              )}
              {secondaryCta && !secondaryCta.disabled && (
                <Button
                  href={secondaryCta.href}
                  target="_blank"
                  variant="secondary"
                >
                  {secondaryCta.title}
                </Button>
              )}
            </div>
          </div>
          {children && <div className="xl:pl-10">{children}</div>}
        </div>
      </div>
    </div>
  )
}
