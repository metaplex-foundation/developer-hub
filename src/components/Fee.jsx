'use client'

import { products } from '@/components/products'

/**
 * Inline component to display a single fee value from a product's protocolFees.
 *
 * Usage in Markdoc:
 *   {% fee product="genesis" config="launchPool" fee="deposit" /%}
 *   {% fee product="genesis" config="launchPool" fee="deposit" field="payer" /%}
 *
 * @param {string} product - Product name or path (e.g., "genesis", "core")
 * @param {string} config - Fee category (e.g., "launchPool", "presale")
 * @param {string} fee - Specific fee type (e.g., "deposit", "withdraw", "graduation")
 * @param {string} field - Which field to display: "solana" (default), "payer", or "notes"
 */
export function Fee({ product: productName, config, fee, field = 'solana' }) {
  // Find the product by path, path segment, or name
  const product = products.find(
    (p) =>
      p.path === productName ||
      p.path.endsWith(`/${productName}`) ||
      p.name.toLowerCase() === productName.toLowerCase()
  )

  if (!product) {
    return (
      <span className="text-red-600 dark:text-red-400">
        [Product not found: {productName}]
      </span>
    )
  }

  if (!product.protocolFees) {
    return (
      <span className="text-red-600 dark:text-red-400">
        [No fees defined for {product.name}]
      </span>
    )
  }

  // Navigate to the fee value
  const configFees = product.protocolFees[config]
  if (!configFees) {
    return (
      <span className="text-red-600 dark:text-red-400">
        [Config not found: {config}]
      </span>
    )
  }

  const feeData = configFees[fee]
  if (!feeData) {
    return (
      <span className="text-red-600 dark:text-red-400">
        [Fee not found: {fee}]
      </span>
    )
  }

  // Handle both string format (old) and object format (new)
  let value
  if (typeof feeData === 'string') {
    value = feeData
  } else if (typeof feeData === 'object') {
    value = feeData[field]
  }

  if (!value) {
    return (
      <span className="text-red-600 dark:text-red-400">
        [Field not found: {field}]
      </span>
    )
  }

  // Return just the value as inline text
  return <>{value}</>
}
