import clsx from 'clsx'
import { LogoWithName } from './Logo'
import { products as allProducts, productCategories } from './index'
import Link from 'next/link'
import { Grid } from './Grid'

export function MarkdocGrid() {
  return (
    <div className="not-prose">
      {productCategories.map((item, index) => {
        return (
          <>
            <h2 key={index} className="mb-4 mt-8 text-2xl font-bold">
              {productCategories[index]}
            </h2>
            <Grid
              key={index}
              withoutFallback
              menuItem={productCategories[index]}
            />
          </>
        )
      })}
    </div>
  )
}
