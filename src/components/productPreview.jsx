import Link from 'next/link'

const ProductPreview = ({ productPreviewActions, accent, title, description }) => {
  const PreviewCard = ({ action }) => {
    return (
      <Link
        href={action.href}
        key={action.name}
        className="group relative flex flex-col rounded-xl border border-slate-700 bg-slate-800/50 p-6 transition-all duration-200 hover:border-accent-500 hover:bg-slate-800"
      >
        <h3 className="text-lg font-semibold text-slate-900 group-hover:text-accent-600 dark:text-white dark:group-hover:text-accent-400">
          {action.name}
        </h3>
        <p className="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-400">
          {action.headline || action.description}
        </p>
        <span className="mt-4 inline-flex items-center text-sm font-medium text-accent-600 dark:text-accent-400">
          Learn more
          <svg
            className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </Link>
    )
  }

  return (
    <div className={`${accent}`}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-center text-2xl font-bold text-slate-900 dark:text-white">
          {title}
        </h2>
        <p className="mb-8 text-center text-sm text-slate-600 dark:text-slate-400">
          {description}
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {productPreviewActions.map((action) => (
            <PreviewCard key={action.name} action={action} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductPreview
