import { getLocalizedHref } from '@/config/languages';
import { useLocale } from '@/contexts/LocaleContext';
import Link from 'next/link';
import { nftMenuCategory, tokenMenuCategory } from '../NavList';
import { products as allProducts } from './index';
import { getStatusLabels } from './statusLabels';

export function StatusChip({ label }) {
  return (
    <span className="ml-1.5 inline-block rounded bg-slate-200 px-1.5 py-0.5 align-middle text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:bg-slate-700/60 dark:text-slate-400">
      {label}
    </span>
  )
}

export function Grid({
  onClick,
  withoutFallback,
  menuItem,
  numCols,
  ...props
}) {
  const { locale } = useLocale()
  const statusLabels = getStatusLabels(locale)
  const categoryProducts = allProducts.filter(
    (product) => menuItem === product.navigationMenuCatergory
  )
  const products = categoryProducts.filter((product) => !product.deprecated)
  const deprecatedProducts = categoryProducts.filter(
    (product) => product.deprecated
  )

  const tokenMenuItems = tokenMenuCategory.filter(
    (item) => menuItem === item.navigationMenuCatergory
  )

  const nftMenuItems = nftMenuCategory.filter(
    (item) => menuItem === item.navigationMenuCatergory
  )

  // Localize product headlines and descriptions
  const localizeProduct = (product) => {
    if (locale === 'en' || !product.localizedNavigation || !product.localizedNavigation[locale]) {
      return product
    }

    const localizedProduct = { ...product }
    const productNav = product.localizedNavigation[locale]

    if (productNav.headline) {
      localizedProduct.headline = productNav.headline
    }
    if (productNav.description) {
      localizedProduct.description = productNav.description
    }

    return localizedProduct
  }

  let className = `relative grid ${numCols || 'sm:grid-cols-2 grid-cols-1 '}`

  return (
    <ul className={className} {...props}>
      {products.map((product) => {
        const localizedProduct = localizeProduct(product)
        return (
          <li key={product.path || product.href}>
            <Link
              href={getLocalizedHref(product.href || product.path, locale)}
              className="block content-start p-3 hover:bg-neutral-800"
              onClick={onClick}
              {...(product.target && { target: product.target })}
            >
              <div className="flex flex-1 flex-col justify-center text-left">
                <div className="text-sm font-medium leading-none text-slate-800 dark:text-white">
                  {localizedProduct.name}
                  {product.legacy && <StatusChip label={statusLabels.legacy} />}
                </div>
                <div className="mt-1 text-sm leading-none text-slate-500 dark:text-slate-400">
                  {localizedProduct.headline || localizedProduct.description}
                </div>
              </div>
            </Link>
          </li>
        )
      })}
      {tokenMenuItems.map((item) => {
        return (
          <li key={item.href}>
            <Link href={getLocalizedHref(item.href, locale)} className="block content-start p-3 hover:bg-neutral-800" onClick={onClick}>
              <div className="flex flex-1 flex-col justify-center text-left">
                <div className="text-sm font-medium leading-none text-slate-800 dark:text-white">
                  {item.name}
                </div>
                <div className="mt-1 text-sm leading-none text-slate-500 dark:text-slate-400">
                  {item.description}
                </div>
              </div>
            </Link>
          </li>
        )
      })}
      {nftMenuItems.map((item) => {
        return (
          <li key={item.href}>
            <Link href={getLocalizedHref(item.href, locale)} className="block content-start p-3 hover:bg-neutral-800" onClick={onClick}>
              <div className="flex flex-1 flex-col justify-center text-left">
                <div className="text-sm font-medium leading-none text-slate-800 dark:text-white">
                  {item.name}
                </div>
                <div className="mt-1 text-sm leading-none text-slate-500 dark:text-slate-400">
                  {item.description}
                </div>
              </div>
            </Link>
          </li>
        )
      })}
      {deprecatedProducts.length > 0 && (
        <>
          <li
            aria-hidden="true"
            className="col-span-full mt-2 border-t border-slate-200 px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:border-slate-700/60 dark:text-slate-500"
          >
            {statusLabels.deprecated}
          </li>
          {deprecatedProducts.map((product) => {
            const localizedProduct = localizeProduct(product)
            return (
              <li key={product.path || product.href}>
                <Link
                  href={getLocalizedHref(product.href || product.path, locale)}
                  className="block content-start p-3 opacity-70 hover:bg-neutral-800 hover:opacity-100"
                  onClick={onClick}
                  {...(product.target && { target: product.target })}
                >
                  <div className="flex flex-1 flex-col justify-center text-left">
                    <div className="text-sm font-medium leading-none text-slate-600 dark:text-slate-300">
                      {localizedProduct.name}
                    </div>
                    <div className="mt-1 text-sm leading-none text-slate-500 dark:text-slate-400">
                      {product.replacement
                        ? `→ ${product.replacement.name}`
                        : localizedProduct.headline ||
                          localizedProduct.description}
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </>
      )}
    </ul>
  )
}

export function MarkdocGrid({ category }) {
  return (
    <div className="not-prose">
      <Grid withoutFallback menuItem={category} />
    </div>
  )
}
