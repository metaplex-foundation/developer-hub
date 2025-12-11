import { products } from '@/components/products'

export function FeeTable({ product: productKey }) {
  const product = products.find((p) => p.name.toLowerCase() === productKey?.toLowerCase())
  const fees = product?.fees

  if (!fees || fees.length === 0) {
    return null
  }

  return (
    <div className="not-prose my-8">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 dark:border-slate-700">
          <tr>
            <th className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">
              Instruction
            </th>
            <th className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">
              Payer
            </th>
            <th className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">
              Amount
            </th>
            <th className="py-3 font-semibold text-slate-900 dark:text-white">
              Notes
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {fees.map((fee, index) => (
            <tr key={index}>
              <td className="py-3 pr-4 font-mono text-sm text-slate-700 dark:text-slate-300">
                {fee.instruction}
              </td>
              <td className="py-3 pr-4 text-slate-600 dark:text-slate-400">
                {fee.payer}
              </td>
              <td className="py-3 pr-4 font-mono text-slate-600 dark:text-slate-400">
                {fee.amount}
              </td>
              <td className="py-3 text-slate-600 dark:text-slate-400">
                {fee.notes || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
