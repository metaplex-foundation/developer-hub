import Link from 'next/link';
import { IconWithName } from './IconWithName';
import { products as allProducts } from './index';
import { useLocale } from '@/contexts/LocaleContext';

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
    if (locale === 'en' || !product.localizedNavigation) return product

    const localizedProduct = { ...product }
    const productNav = product.localizedNavigation[locale] || product.localizedNavigation['en']
    
    if (productNav.headline) {
      localizedProduct.headline = productNav.headline
    }
    if (productNav.description) {
      localizedProduct.description = productNav.description
    }
    
    return localizedProduct
  }

  const getLocalizedHref = (path) => {
    // Handle external URLs - don't add locale prefix
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) {
      return path
    }
    
    // Handle internal paths
    if (locale === 'en') return `/${path}`
    return `/${locale}/${path}`
  }

  let className = `relative grid sm:grid-cols-2 grid-cols-1`

  return (
    <ul className={className} {...props}>
      {products.map((product) => {
        const localizedProduct = localizeProduct(product)
        return (
          <li key={product.path || product.href}>
            <Link
              href={getLocalizedHref(product.href || product.path)}
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
