import clsx from 'clsx'

export function LogoWithName({ product, ...props }) {
  const name = product?.name ?? 'Metaplex'
  const headline = product?.headline ?? 'Developer Hub'

  return (
    <div className="flex items-center" {...props}>
      <Logo product={product} className="h-8 w-8 shrink-0" />
      <div className="ml-4 flex flex-1 flex-col justify-center text-left">
        <div className="text-sm font-medium leading-none text-slate-800 dark:text-white">
          {name}
        </div>
        <div className="text-sm leading-none mt-1 text-slate-500 dark:text-slate-400">
          {headline}
        </div>
      </div>
    </div>
  )
}

export function Logo({ product, className, ...props }) {
  if (!product)
    return (
      <svg
        width="112"
        height="112"
        viewBox="0 0 112 112"
        xmlns="http://www.w3.org/2000/svg"
        className={clsx('fill-slate-900 dark:fill-slate-100', className)}
        {...props}
      >
        <path d="M111.712 89.3819C112.649 90.9852 111.492 92.9998 109.634 92.9998H88.7318C87.8777 92.9998 87.0879 92.5474 86.656 91.8105L46.0955 22.6205C45.1557 21.0173 46.3123 19 48.1712 19H69.1906C70.0457 19 70.8366 19.4537 71.2679 20.1916L111.712 89.3819Z" />
        <path d="M55.5027 70.5526C55.9845 71.3624 55.9481 72.3784 55.4101 73.1519L43.7707 89.8792C42.7676 91.3206 40.6051 91.2377 39.7162 89.7231L0.333968 22.6189C-0.606477 21.0165 0.550995 19 2.41125 19H23.4572C24.3066 19 25.0932 19.4469 25.5271 20.176L55.5027 70.5526Z" />
        <path d="M18.9993 88.7289C19.9512 90.334 18.7947 92.3647 16.9287 92.3647H2.49828C1.16868 92.3647 0.0908203 91.2868 0.0908203 89.9575V65.6304C0.0908203 63.1823 3.31983 62.2966 4.56882 64.4021L18.9993 88.7289Z" />
      </svg>
    )

  const LogoComponent = product.logo
  return <LogoComponent className={className} {...props} />
}
