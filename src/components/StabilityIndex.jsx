'use client'

import { useTranslations } from '@/contexts/LocaleContext'

const products = [
  { name: 'Token Metadata', level: 3 },
  { name: 'Token Auth Rules', level: 2 },
  { name: 'Bubblegum', level: 2 },
  { name: 'Candy Machine v3', level: 2 },
  { name: 'Sugar', level: 2 },
  { name: 'Umi', level: 2 },
  { name: 'Amman', level: 2 },
  { name: 'Shank', level: 2 },
  { name: 'Genesis', level: 1 },
  { name: 'Core', level: 1 },
  { name: 'Fusion', level: 1 },
  { name: 'Hydra', level: 1 },
  { name: 'Kinobi', level: 1 },
  { name: 'Gum Drop', level: 1 },
  { name: 'Candy Machine v2', level: 0 },
  { name: 'Candy Machine v1', level: 0 },
  { name: 'Auction House', level: 0 },
  { name: 'Auctioneer', level: 0 },
  { name: 'Auctions', level: 0 },
  { name: 'NFT Packs', level: 0 },
  { name: 'Fair Launch', level: 0 },
  { name: 'Membership Token Sale', level: 0 },
  { name: 'Token Entangler', level: 0 },
  { name: 'Fireball', level: 0 },
]

function StabilityLevelCard({ level, name, description, levelProducts, t }) {
  return (
    <div className="my-6">
      <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        {t('stability', 'Stability')} {level} - {name}
      </h3>
      <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-400">
        {description}
      </p>
      <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700">
        <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
          <thead className="bg-neutral-50 dark:bg-neutral-800">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-neutral-100"
              >
                {t('productName', 'Product Name')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-700 dark:bg-neutral-900">
            {levelProducts.map((product) => (
              <tr key={product.name}>
                <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                  {product.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function StabilityIndex({ level }) {
  const t = useTranslations('stabilityIndex')

  const stabilityLevels = {
    4: {
      name: t('immutable', 'Immutable'),
      description: t('immutableDescription', 'Program is immutable. This allows the program to inherit the full security guarantees of Solana or the SVM.'),
    },
    3: {
      name: t('codeFreeze', 'Code Freeze'),
      description: t('codeFreezeDescription', 'Functionality and features of program are finalized. Security firms perform final audits before upgrade authority is destroyed.'),
    },
    2: {
      name: t('stable', 'Stable'),
      description: t('stableDescription', 'Compatibility with the ecosystem is a high priority.'),
    },
    1: {
      name: t('experimental', 'Experimental'),
      description: t('experimentalDescription', 'The feature may emit warnings. The feature is not subject to Semantic Versioning rules. Non-backward compatible changes or removal may occur in any future release. Use of the feature is not recommended in production or mainnet environments.'),
    },
    0: {
      name: t('deprecated', 'Deprecated'),
      description: t('deprecatedDescription', 'The feature may emit warnings. Backward compatibility is not guaranteed.'),
    },
  }

  // If a specific level is provided, show only that level
  if (level !== undefined) {
    const levelNum = parseInt(level, 10)
    const levelInfo = stabilityLevels[levelNum]
    const levelProducts = products.filter((p) => p.level === levelNum)

    if (!levelInfo) {
      return (
        <div className="my-4 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
          <p className="text-sm text-red-700 dark:text-red-400">
            Stability level &quot;{level}&quot; not found.
          </p>
        </div>
      )
    }

    return (
      <StabilityLevelCard
        level={levelNum}
        name={levelInfo.name}
        description={levelInfo.description}
        levelProducts={levelProducts}
        t={t}
      />
    )
  }

  // Show all levels (in descending order - most stable first)
  const levels = [4, 3, 2, 1, 0]

  return (
    <div>
      {levels.map((lvl) => {
        const levelInfo = stabilityLevels[lvl]
        const levelProducts = products.filter((p) => p.level === lvl)

        if (levelProducts.length === 0) return null

        return (
          <StabilityLevelCard
            key={lvl}
            level={lvl}
            name={levelInfo.name}
            description={levelInfo.description}
            levelProducts={levelProducts}
            t={t}
          />
        )
      })}
    </div>
  )
}
