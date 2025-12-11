import { getLocalizedHref } from '@/config/languages';
import { useLocale } from '@/contexts/LocaleContext';
import Link from 'next/link';
import { nftMenuCategory, tokenMenuCategory } from '../NavList';
import { products as allProducts } from './index';



export function Grid({
  onClick,
  withoutFallback,
  menuItem,
  numCols,
  ...props
}) {
  const { locale } = useLocale()
  const products = allProducts.filter(
    (product) => menuItem === product.navigationMenuCatergory
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
        if (product.deprecated) {
          return null
        }
        const localizedProduct = localizeProduct(product)
        return (
          <li key={product.path || product.href}>
            <Link
              href={getLocalizedHref(product.href || product.path, locale)}
              className="block content-start rounded-lg p-3 hover:bg-neutral-800"
              onClick={onClick}
              {...(product.target && { target: product.target })}
            >
              <div className="flex flex-1 flex-col justify-center text-left">
                <div className="text-sm font-medium leading-none text-slate-800 dark:text-white">
                  {localizedProduct.name}
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
            <Link href={getLocalizedHref(item.href, locale)} className="block content-start rounded-lg p-3 hover:bg-neutral-800" onClick={onClick}>
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
            <Link href={getLocalizedHref(item.href, locale)} className="block content-start rounded-lg p-3 hover:bg-neutral-800" onClick={onClick}>
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
