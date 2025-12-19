import { products } from '@/components/products'

function formatFeeType(key) {
  // Convert camelCase to Title Case with spaces
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

export function ProtocolFees({ program, showTitle = true }) {
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
          Product &quot;{program}&quot; not found.
        </p>
      </div>
    )
  }

  if (!product.protocolFees || Object.keys(product.protocolFees).length === 0) {
    return (
      <div className="my-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          No protocol fees defined for {product.name}.
        </p>
      </div>
    )
  }

  const fees = Object.entries(product.protocolFees)

  return (
    <div className="my-6">
      {showTitle && (
        <h3 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Protocol Fees
        </h3>
      )}
      <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
          <thead className="bg-neutral-50 dark:bg-neutral-800">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-neutral-100"
              >
                Instruction
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-neutral-100"
              >
                Solana
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
    </div>
  )
}
