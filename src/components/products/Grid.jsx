import clsx from 'clsx'
import { LogoWithName } from './Logo'
import { products as allProducts } from './index'
import Link from 'next/link'

export function Grid({
  onClick,
  withoutFallback,
  menuItem,
  numCols = 3,
  ...props
}) {
  console.log('menuItem', menuItem)
  const products = allProducts.filter(
    (product) => menuItem === product.navigationMenuCatergory
  )

  const className = `relative grid-flow-row grid-cols-${numCols} grid-rows-${Math.ceil(
    products.length / numCols
  )}`
  console.log(className)

  return (
    <ul className={className} {...props}>
      {products.map((product) => (
        <li key={product.path}>
          <Link
            href={`/${product.path}`}
            className="block rounded-lg p-3 hover:bg-slate-50 hover:dark:bg-slate-700"
            onClick={onClick}
          >
            <LogoWithName product={product}></LogoWithName>
          </Link>
        </li>
      ))}
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
