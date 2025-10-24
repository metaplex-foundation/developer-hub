import Link from 'next/link';
import { IconWithName } from './IconWithName';
import { products as allProducts } from './index';
import { useLocale } from '@/contexts/LocaleContext';
import { getLocalizedHref } from '@/config/languages';

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

  let className = `relative grid sm:grid-cols-2 grid-cols-1`

  return (
    <ul className={className} {...props}>
      {products.map((product) => {
        const localizedProduct = localizeProduct(product)
        return (
          <li key={product.path || product.href}>
            <Link
              href={getLocalizedHref(product.href || product.path, locale)}
              className="block content-start rounded-lg p-3 hover:bg-slate-50 hover:dark:bg-slate-700"
              onClick={onClick}
              {...(product.target && { target: product.target })}
            >
              {IconWithName({ product: localizedProduct, description: true })}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

export function MarkdocGrid() {
  return (
    <div className="not-prose">
      <Grid withoutFallback />
    </div>
  )
}
