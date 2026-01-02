import React from 'react'

export const categoryToColor = new Map([
  ['Programs', '#BEF264'],
  ['Smart Contracts', '#BEF264'],
  ['Dev Tools', '#7DEDFC'],
])

export function IconWithName({ product, description, ...props }) {
  const iconColor = categoryToColor.get(product.navigationMenuCatergory) || '#FFFFFF'
  return (
    <div className="flex" {...props}>
      {React.cloneElement(product.icon, {
        color: iconColor,
        className: 'h-8 w-8 shrink-0',
      })}
      <div className="ml-4 flex flex-1 flex-col justify-center text-left">
        <div className="text-sm font-medium leading-none text-white">
          {product.name}
        </div>
        {description && (
          <div className="mt-1 text-sm leading-none text-slate-400">
            {product.headline}
          </div>
        )}
      </div>
    </div>
  )
}

export function Logo({ product, className, ...props }) {
  const LogoComponent = product.logo
  return <LogoComponent className={className} {...props} />
}
