'use client'

import { products } from '@/components/products'
import { useTranslations } from '@/contexts/LocaleContext'

function formatFeeType(key) {
  // Convert camelCase to Title Case with spaces
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

function FeesTable({ fees, t }) {
  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700">
      <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
        <thead className="bg-neutral-50 dark:bg-neutral-800">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-neutral-100"
            >
              {t('instruction', 'Instruction')}
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-neutral-100"
            >
              {t('solana', 'Solana')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-700 dark:bg-neutral-900">
          {fees.map(([type, fee]) => {
            // Handle both old format (string) and new format (object with solana)
            const solanaFee =
              typeof fee === 'string' ? fee : fee?.solana || '-'

            return (
              <tr key={type}>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                  {formatFeeType(type)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-mono text-neutral-900 dark:text-neutral-100">
                  {solanaFee}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function ProtocolFees({ program, showTitle = true, config = null }) {
  const t = useTranslations('protocolFees')

  // Find the product by path, path segment, or name
  const product = products.find(
    (p) =>
      p.path === program ||
      p.path.endsWith(`/${program}`) ||
      p.name.toLowerCase() === program.toLowerCase()
  )

  if (!product) {
    return (
      <div className="my-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-sm text-red-700 dark:text-red-400">
          {t('productNotFound', 'Product not found')}: &quot;{program}&quot;
        </p>
      </div>
    )
  }

  if (!product.protocolFees || Object.keys(product.protocolFees).length === 0) {
    return (
      <div className="my-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {t('noFeesDefinedFor', 'No protocol fees defined for')} {product.name}.
        </p>
      </div>
    )
  }

  // Determine which fees to display
  let feesObject = product.protocolFees

  // If config is specified, get the nested config
  if (config && product.protocolFees[config]) {
    feesObject = product.protocolFees[config]
  } else if (config) {
    // Config was specified but not found
    return (
      <div className="my-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-sm text-red-700 dark:text-red-400">
          {t('configNotFound', 'Fee config not found')}: &quot;{config}&quot;
        </p>
      </div>
    )
  } else {
    // No config specified - check if protocolFees has nested configs or flat fees
    // If the first value is an object with 'solana' key, it's a flat structure
    // Otherwise, it's a nested structure and we need a config
    const firstValue = Object.values(product.protocolFees)[0]
    const isNestedStructure = firstValue && typeof firstValue === 'object' && !firstValue.solana

    if (isNestedStructure) {
      // Nested structure but no config specified - show all configs
      return (
        <div className="my-6 space-y-6">
          {Object.entries(product.protocolFees).map(([configName, configFees]) => (
            <div key={configName}>
              {showTitle && (
                <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  {formatFeeType(configName)}
                </h3>
              )}
              <FeesTable fees={Object.entries(configFees)} t={t} />
            </div>
          ))}
        </div>
      )
    }
  }

  const fees = Object.entries(feesObject)

  return (
    <div className="my-6">
      {showTitle && (
        <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {t('title', 'Protocol Fees')}
        </h3>
      )}
      <FeesTable fees={fees} t={t} />
    </div>
  )
}
