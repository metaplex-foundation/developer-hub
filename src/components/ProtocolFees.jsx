'use client'

import { products } from '@/components/products'
import { useTranslations } from '@/contexts/LocaleContext'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function formatFeeType(key) {
  // Convert camelCase to Title Case with spaces
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim()
}

function FeesTable({ fees, t }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('instruction', 'Instruction')}</TableHead>
          <TableHead>{t('solana', 'Solana')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fees.map(([type, fee]) => {
          // Handle both old format (string) and new format (object with solana)
          const solanaFee =
            typeof fee === 'string' ? fee : fee?.solana || '-'

          return (
            <TableRow key={type}>
              <TableCell className="whitespace-nowrap">{formatFeeType(type)}</TableCell>
              <TableCell className="whitespace-nowrap font-mono">{solanaFee}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
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
      <div className="my-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">
          {t('productNotFound', 'Product not found')}: &quot;{program}&quot;
        </p>
      </div>
    )
  }

  if (!product.protocolFees || Object.keys(product.protocolFees).length === 0) {
    return (
      <div className="my-4 rounded-lg border border-border bg-muted p-4">
        <p className="text-sm text-muted-foreground">
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
      <div className="my-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">
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
                <h3 className="mb-3 text-lg font-semibold text-foreground">
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
        <h3 className="mb-3 text-lg font-semibold text-foreground">
          {t('title', 'Protocol Fees')}
        </h3>
      )}
      <FeesTable fees={fees} t={t} />
    </div>
  )
}
