import Link from 'next/link';
import { IconWithName } from './IconWithName';
import { products as allProducts } from './index';

export function Grid({
  onClick,
  withoutFallback,
  menuItem,
  numCols,
  ...props
}) {
  const products = allProducts.filter(
    (product) => menuItem === product.navigationMenuCatergory
  )

  let className = `relative grid sm:grid-cols-2 grid-cols-1`

  return (
    <ul className={className} {...props}>
      {products.map((product) => (
        <li key={product.path}>
          <Link
            href={`/${product.path}`}
            className="block content-start rounded-lg p-3 hover:bg-slate-50 hover:dark:bg-slate-700"
            onClick={onClick}
          >
            {IconWithName({ product, description: true })}
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
