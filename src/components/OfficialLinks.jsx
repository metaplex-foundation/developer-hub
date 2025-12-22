'use client'

import NextLink from 'next/link'
import { useTranslations, useLocale } from '@/contexts/LocaleContext'

const websiteLinks = [
  { name: 'Main Website', url: 'https://metaplex.com/' },
  { name: 'Documentation', url: 'https://developers.metaplex.com/' },
  { name: 'Github', url: 'https://github.com/metaplex-foundation' },
]

const twitterLinks = [
  { name: 'Metaplex', handle: '@metaplex', url: 'https://twitter.com/metaplex' },
  { name: 'Metaplex Status Updates', handle: '@metaplexstatus', url: 'https://twitter.com/metaplexstatus' },
  { name: 'Metaplex Foundation', handle: '@metaplexfndn', url: 'https://twitter.com/metaplexfndn' },
]

const instagramLinks = [
  { name: 'Metaplex', handle: '@metaplex', url: 'https://instagram.com/metaplex' },
]

const stackExchangeLinks = [
  { tagged: '@metaplex', url: 'https://solana.stackexchange.com/questions/tagged/metaplex' },
]

const stackOverflowLinks = [
  { tagged: '@metaplex', url: 'https://stackoverflow.com/questions/tagged/metaplex' },
]

const programs = [
  { name: 'Token Metadata', programId: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s', github: 'https://github.com/metaplex-foundation/mpl-token-metadata', docs: '/smart-contracts/token-metadata' },
  { name: 'Core', programId: 'CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d', github: 'https://github.com/metaplex-foundation/mpl-core', docs: '/smart-contracts/core' },
  { name: 'Bubblegum v2', programId: 'BGUMzZr2wWfD2yzrXFEMTBqLwfFGaToDgqiSBVP9fSCa', github: 'https://github.com/metaplex-foundation/mpl-bubblegum', docs: '/smart-contracts/bubblegum-v2' },
  { name: 'Bubblegum', programId: 'BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY', github: 'https://github.com/metaplex-foundation/mpl-bubblegum', docs: '/smart-contracts/bubblegum' },
  { name: 'Core Candy Machine', programId: 'CMACYFENjoBMHzapRXyo1JZkVS6EtaDDzkjMrmQLvr4J', github: 'https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-machine-core', docs: '/smart-contracts/core-candy-machine' },
  { name: 'Core Candy Guard', programId: 'CMAGAKJ67e9hRZgfC5SFTbZH8MgEmtqazKXjmkaJjWTJ', github: 'https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard', docs: '/smart-contracts/core-candy-machine/guards' },
  { name: 'Candy Machine v3', programId: 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR', github: 'https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-machine-core', docs: '/smart-contracts/candy-machine' },
  { name: 'Candy Guard', programId: 'Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g', github: 'https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard', docs: '/smart-contracts/candy-machine/guards' },
  { name: 'Genesis', programId: 'GENSxbxqAy7G1fHDtNwbHsMUThb9vpYqoJJrXBbpLZn8', github: 'https://github.com/metaplex-foundation/mpl-genesis', docs: '/smart-contracts/genesis' },
  { name: 'MPL-Hybrid', programId: 'MPL4o4wMzndgh8T1NVDxELQCj5UQfYTYEkabX3wNKtb', github: 'https://github.com/metaplex-foundation/mpl-hybrid', docs: '/smart-contracts/mpl-hybrid' },
  { name: 'Fusion (Trifle)', programId: 'trifMWutwBxkSuatmpPVnEe7NoE3BJKgjVi8sSyoXWX', github: 'https://github.com/metaplex-foundation/mpl-trifle', docs: '/smart-contracts/fusion' },
  { name: 'Token Auth Rules', programId: 'auth9SigNpDKz4sJJ1DfCTuZrZNSAgh9sFD3rboVmgg', github: 'https://github.com/metaplex-foundation/mpl-token-auth-rules', docs: '/smart-contracts/token-auth-rules' },
  { name: 'Hydra', programId: 'hyDQ4Nz1eYyegS6JfenyKwKzYxRsCWCriYSAjtzP4Vg', github: 'https://github.com/metaplex-foundation/mpl-hydra', docs: '/smart-contracts/hydra' },
  { name: 'Inscriptions', programId: '1NSCRfGeyo7wPUazGbaPBUsTM49e1k2aXewHGARfzSo', github: 'https://github.com/metaplex-foundation/mpl-inscription', docs: '/smart-contracts/inscription' },
  { name: 'MPL System Extras', programId: 'SysExL2WDyJi9aRZrXorrjHJut3JwHQ7R9bTyctbNNG', github: 'https://github.com/metaplex-foundation/mpl-toolbox', docs: '/dev-tools/umi/toolbox' },
  { name: 'MPL Token Extras', programId: 'TokExjvjJmhKaRBShsBAsbSvEWMA1AgUNK7ps4SAc2p', github: 'https://github.com/metaplex-foundation/mpl-toolbox', docs: '/dev-tools/umi/toolbox' },
  { name: 'Auction House', programId: 'hausS13jsjafwWwGqZTUQRmWyvyxn9EQpqMwV1PBBmk', github: 'https://github.com/metaplex-foundation/metaplex-program-library/tree/master/auction-house', docs: '/legacy-documentation/auction-house' },
  { name: 'Auctioneer', programId: 'neer8g6yJq2mQM6KbnViEDAD4gr3gRZyMMf4F2p3MEh', github: 'https://github.com/metaplex-foundation/metaplex-program-library/tree/master/auctioneer', docs: '/legacy-documentation/auction-house/auctioneer' },
  { name: 'Gumdrop', programId: 'gdrpGjVffourzkdDRrQmySw4aTHr8a3xmQzzxSwFD1a', github: 'https://github.com/metaplex-foundation/gumdrop', docs: '/legacy-documentation/gumdrop' },
]

const tokensAndNfts = [
  { name: 'MPLX Token', id: 'METAewgxyPbgwsseH8T16a39CQ5VyVxZi9zXiDPY18m' },
  { name: 'Metaplex Whitepaper NFT (collection address)', id: '9q2Ejt1Qubk5t4f3xXaiwRtvjhHrEK8r9EYsH6gwnt39' },
  { name: 'Candy Studio NFT (collection address)', id: '3NauNKfqAbQVhAJyv464Tq14jynV6THSNiGxhf7W6fP9' },
  { name: 'MPLX Token Launch Party NFT (collection address)', id: 'BodU7rcs75cf3J94EBK7vKuxoepgz6ayb2t7oJDbXtWX' },
]

const rulesets = [
  { name: 'Metaplex Foundation Rule Set', id: 'eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9' },
  { name: 'Compatibility Rule Set', id: 'AdH2Utn6Fus15ZhtenW4hZBQnvtLgM1YCW2MfVp7pYS5' },
]

function TableWrapper({ children }) {
  return (
    <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700">
      {children}
    </div>
  )
}

function TableHead({ children }) {
  return (
    <thead className="bg-neutral-50 dark:bg-neutral-800">
      {children}
    </thead>
  )
}

function TableBody({ children }) {
  return (
    <tbody className="divide-y divide-neutral-200 bg-white dark:divide-neutral-700 dark:bg-neutral-900">
      {children}
    </tbody>
  )
}

function Th({ children, className = '' }) {
  return (
    <th
      scope="col"
      className={`px-4 py-3 text-left text-sm font-semibold text-neutral-900 dark:text-neutral-100 ${className}`}
    >
      {children}
    </th>
  )
}

function Td({ children, className = '' }) {
  return (
    <td className={`px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300 ${className}`}>
      {children}
    </td>
  )
}

function Link({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
    >
      {children}
    </a>
  )
}

export function OfficialLinks() {
  const t = useTranslations('officialLinks')
  const { locale } = useLocale()

  // Helper to prefix links with locale (en doesn't need prefix due to rewrites)
  const localePath = (path) => {
    if (locale === 'en') return path
    return `/${locale}${path}`
  }

  return (
    <div>
      {/* Websites */}
      <div className="my-6">
        <h2 className="mb-3 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          {t('websites', 'Websites')}
        </h2>
        <TableWrapper>
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
            <TableHead>
              <tr>
                <Th>{t('name', 'Name')}</Th>
                <Th>{t('link', 'Link')}</Th>
              </tr>
            </TableHead>
            <TableBody>
              {websiteLinks.map((link) => (
                <tr key={link.name}>
                  <Td>{link.name}</Td>
                  <Td>
                    <Link href={link.url}>{link.url}</Link>
                  </Td>
                </tr>
              ))}
            </TableBody>
          </table>
        </TableWrapper>
      </div>

      {/* Twitter */}
      <div className="my-6">
        <h2 className="mb-3 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          {t('twitter', 'Twitter')}
        </h2>
        <TableWrapper>
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
            <TableHead>
              <tr>
                <Th>{t('name', 'Name')}</Th>
                <Th>{t('handle', 'Handle')}</Th>
                <Th>{t('link', 'Link')}</Th>
              </tr>
            </TableHead>
            <TableBody>
              {twitterLinks.map((link) => (
                <tr key={link.name}>
                  <Td>{link.name}</Td>
                  <Td className="font-mono">{link.handle}</Td>
                  <Td>
                    <Link href={link.url}>{link.url}</Link>
                  </Td>
                </tr>
              ))}
            </TableBody>
          </table>
        </TableWrapper>
      </div>

      {/* Instagram */}
      <div className="my-6">
        <h2 className="mb-3 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          {t('instagram', 'Instagram')}
        </h2>
        <TableWrapper>
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
            <TableHead>
              <tr>
                <Th>{t('name', 'Name')}</Th>
                <Th>{t('handle', 'Handle')}</Th>
                <Th>{t('link', 'Link')}</Th>
              </tr>
            </TableHead>
            <TableBody>
              {instagramLinks.map((link) => (
                <tr key={link.name}>
                  <Td>{link.name}</Td>
                  <Td className="font-mono">{link.handle}</Td>
                  <Td>
                    <Link href={link.url}>{link.url}</Link>
                  </Td>
                </tr>
              ))}
            </TableBody>
          </table>
        </TableWrapper>
      </div>

      {/* StackExchange */}
      <div className="my-6">
        <h2 className="mb-3 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          {t('stackExchange', 'StackExchange')}
        </h2>
        <TableWrapper>
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
            <TableHead>
              <tr>
                <Th>{t('tagged', 'Tagged')}</Th>
                <Th>{t('link', 'Link')}</Th>
              </tr>
            </TableHead>
            <TableBody>
              {stackExchangeLinks.map((link) => (
                <tr key={link.tagged}>
                  <Td className="font-mono">{link.tagged}</Td>
                  <Td>
                    <Link href={link.url}>{link.url}</Link>
                  </Td>
                </tr>
              ))}
            </TableBody>
          </table>
        </TableWrapper>
      </div>

      {/* StackOverflow */}
      <div className="my-6">
        <h2 className="mb-3 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          {t('stackOverflow', 'StackOverflow')}
        </h2>
        <TableWrapper>
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
            <TableHead>
              <tr>
                <Th>{t('tagged', 'Tagged')}</Th>
                <Th>{t('link', 'Link')}</Th>
              </tr>
            </TableHead>
            <TableBody>
              {stackOverflowLinks.map((link) => (
                <tr key={link.tagged}>
                  <Td className="font-mono">{link.tagged}</Td>
                  <Td>
                    <Link href={link.url}>{link.url}</Link>
                  </Td>
                </tr>
              ))}
            </TableBody>
          </table>
        </TableWrapper>
      </div>

      {/* Programs */}
      <div className="my-6">
        <h2 className="mb-3 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          {t('programs', 'Programs')}
        </h2>
        <TableWrapper>
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
            <TableHead>
              <tr>
                <Th>{t('name', 'Name')}</Th>
                <Th>{t('programId', 'Program ID')}</Th>
                <Th>{t('github', 'Github')}</Th>
                <Th>{t('documentation', 'Documentation')}</Th>
              </tr>
            </TableHead>
            <TableBody>
              {programs.map((program) => (
                <tr key={program.name}>
                  <Td className="whitespace-nowrap">{program.name}</Td>
                  <Td className="font-mono text-xs">{program.programId}</Td>
                  <Td>
                    <Link href={program.github}>{t('link', 'Link')}</Link>
                  </Td>
                  <Td>
                    <NextLink
                      href={localePath(program.docs)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {t('link', 'Link')}
                    </NextLink>
                  </Td>
                </tr>
              ))}
            </TableBody>
          </table>
        </TableWrapper>
      </div>

      {/* Tokens and NFTs */}
      <div className="my-6">
        <h2 className="mb-3 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          {t('tokensAndNfts', 'Tokens and NFTs')}
        </h2>
        <TableWrapper>
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
            <TableHead>
              <tr>
                <Th>{t('name', 'Name')}</Th>
                <Th>{t('id', 'ID')}</Th>
              </tr>
            </TableHead>
            <TableBody>
              {tokensAndNfts.map((token) => (
                <tr key={token.name}>
                  <Td>{token.name}</Td>
                  <Td className="font-mono text-xs">{token.id}</Td>
                </tr>
              ))}
            </TableBody>
          </table>
        </TableWrapper>
      </div>

      {/* Rulesets */}
      <div className="my-6">
        <h2 className="mb-3 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          {t('rulesets', 'Metaplex Rulesets')}
        </h2>
        <p className="mb-3 text-sm text-neutral-600 dark:text-neutral-400">
          {t('rulesetsDescription', 'To be used with the pNFTs Auth Rules.')}
        </p>
        <TableWrapper>
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
            <TableHead>
              <tr>
                <Th>{t('name', 'Name')}</Th>
                <Th>{t('id', 'ID')}</Th>
              </tr>
            </TableHead>
            <TableBody>
              {rulesets.map((ruleset) => (
                <tr key={ruleset.name}>
                  <Td>{ruleset.name}</Td>
                  <Td className="font-mono text-xs">{ruleset.id}</Td>
                </tr>
              ))}
            </TableBody>
          </table>
        </TableWrapper>
      </div>
    </div>
  )
}
