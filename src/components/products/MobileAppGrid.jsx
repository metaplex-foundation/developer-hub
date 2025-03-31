import clsx from 'clsx'
import { products as allProducts } from './index'
import Link from 'next/link'
import { Grid } from './Grid'
import { IconWithName } from './IconWithName'

export function MobileAppGrid({
  onClick,
  withoutFallback,
  className,
  menuItem,
  ...props
}) {
  const products = allProducts

  const hub = products.find((product) => product.name === 'Metaplex')

  return (
    <ul className={clsx(['grid grid-flow-row gap-5', className])} {...props}>
      <li key={hub.path}>
        <Link
          href={`/${hub.path}`}
          className="sticky block rounded-lg p-3 hover:bg-slate-50 hover:dark:bg-slate-700"
          onClick={onClick}
        >
          <IconWithName product={hub}></IconWithName>
        </Link>
        <hr />
      </li>

      <div className="overflow-y-auto">
        {products
          .filter((product) => product.name != 'Metaplex')
          .map((product) => (
            <li key={product.path}>
              <Link
                href={`/${product.path}`}
                className="block rounded-lg p-3 hover:bg-slate-50 hover:dark:bg-slate-700"
                onClick={onClick}
              >
                <IconWithName product={product}></IconWithName>
              </Link>
            </li>
          ))}
      </div>
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
