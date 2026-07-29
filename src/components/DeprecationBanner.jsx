import {
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/solid'
import clsx from 'clsx'
import Link from 'next/link'

import { getStatusLabels } from '@/components/products/statusLabels'
import { getLocalizedHref } from '@/config/languages'
import { useLocale } from '@/contexts/LocaleContext'

// Shown at the top of every page belonging to a product flagged
// `deprecated: true` (warning style) or `legacy: true` (muted info style)
// in its config under src/components/products/. When the config provides a
// `replacement: { name, href }`, the banner links to it.
export function DeprecationBanner({ product }) {
  const { locale } = useLocale()
  if (!product || (!product.deprecated && !product.legacy)) return null

  const labels = getStatusLabels(locale)
  const isDeprecated = !!product.deprecated
  const Icon = isDeprecated ? ExclamationTriangleIcon : InformationCircleIcon
  const text = isDeprecated
    ? labels.deprecatedText(product.name)
    : labels.legacyText(product.name)

  return (
    <div
      className={clsx(
        'mb-8 flex items-start gap-3 rounded-lg border p-4 text-sm',
        isDeprecated
          ? 'border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200'
          : 'border-border bg-muted/50 text-muted-foreground'
      )}
    >
      <Icon
        className={clsx(
          'mt-0.5 h-5 w-5 flex-none',
          isDeprecated ? 'text-amber-500' : 'text-slate-400'
        )}
      />
      <p>
        {text}
        {product.replacement && (
          <>
            {' '}
            {labels.useInstead.before}
            <Link
              href={getLocalizedHref(product.replacement.href, locale)}
              className="font-medium underline underline-offset-2 hover:opacity-80"
            >
              {product.replacement.name}
            </Link>
            {labels.useInstead.after}
          </>
        )}
      </p>
    </div>
  )
}
