import { Grid } from './Grid'
import { productCategories } from './index'

export function MarkdocGrid() {
  return (
    <div className="not-prose">
      {productCategories.map((item, index) => {

        console.log(item)

        if (item === 'Aura') return

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
