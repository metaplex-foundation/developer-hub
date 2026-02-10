'use client'

import NextLink from 'next/link'
import { useTranslations, useLocale } from '@/contexts/LocaleContext'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

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
  { name: 'Bubblegum v2', programId: 'BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY', github: 'https://github.com/metaplex-foundation/mpl-bubblegum', docs: '/smart-contracts/bubblegum-v2' },
  { name: 'Bubblegum', programId: 'BGUMAp9Gq7iTEuizy4pqaxsTyUCBK68MDfK752saRPUY', github: 'https://github.com/metaplex-foundation/mpl-bubblegum', docs: '/smart-contracts/bubblegum' },
  { name: 'Core Candy Machine', programId: 'CMACYFENjoBMHzapRXyo1JZkVS6EtaDDzkjMrmQLvr4J', github: 'https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-machine-core', docs: '/smart-contracts/core-candy-machine' },
  { name: 'Core Candy Guard', programId: 'CMAGAKJ67e9hRZgfC5SFTbZH8MgEmtqazKXjmkaJjWTJ', github: 'https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard', docs: '/smart-contracts/core-candy-machine/guards' },
  { name: 'Candy Machine v3', programId: 'CndyV3LdqHUfDLmE5naZjVN8rBZz4tqhdefbAnjHG3JR', github: 'https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-machine-core', docs: '/smart-contracts/candy-machine' },
  { name: 'Candy Guard', programId: 'Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g', github: 'https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard', docs: '/smart-contracts/candy-machine/guards' },
  { name: 'Genesis', programId: 'GENSxbxqAy7G1fHDtNwbHsMUThb9vpYqoJJrXBbpLZn8', docs: '/smart-contracts/genesis' },
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

function Link({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:text-primary/80"
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
        <h2 className="mb-3 text-xl font-semibold text-foreground">
          {t('websites', 'Websites')}
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('name', 'Name')}</TableHead>
              <TableHead>{t('link', 'Link')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {websiteLinks.map((link) => (
              <TableRow key={link.name}>
                <TableCell>{link.name}</TableCell>
                <TableCell>
                  <Link href={link.url}>{link.url}</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Twitter */}
      <div className="my-6">
        <h2 className="mb-3 text-xl font-semibold text-foreground">
          {t('twitter', 'Twitter')}
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('name', 'Name')}</TableHead>
              <TableHead>{t('handle', 'Handle')}</TableHead>
              <TableHead>{t('link', 'Link')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {twitterLinks.map((link) => (
              <TableRow key={link.name}>
                <TableCell>{link.name}</TableCell>
                <TableCell className="font-mono">{link.handle}</TableCell>
                <TableCell>
                  <Link href={link.url}>{link.url}</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Instagram */}
      <div className="my-6">
        <h2 className="mb-3 text-xl font-semibold text-foreground">
          {t('instagram', 'Instagram')}
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('name', 'Name')}</TableHead>
              <TableHead>{t('handle', 'Handle')}</TableHead>
              <TableHead>{t('link', 'Link')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instagramLinks.map((link) => (
              <TableRow key={link.name}>
                <TableCell>{link.name}</TableCell>
                <TableCell className="font-mono">{link.handle}</TableCell>
                <TableCell>
                  <Link href={link.url}>{link.url}</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* StackExchange */}
      <div className="my-6">
        <h2 className="mb-3 text-xl font-semibold text-foreground">
          {t('stackExchange', 'StackExchange')}
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('tagged', 'Tagged')}</TableHead>
              <TableHead>{t('link', 'Link')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stackExchangeLinks.map((link) => (
              <TableRow key={link.tagged}>
                <TableCell className="font-mono">{link.tagged}</TableCell>
                <TableCell>
                  <Link href={link.url}>{link.url}</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* StackOverflow */}
      <div className="my-6">
        <h2 className="mb-3 text-xl font-semibold text-foreground">
          {t('stackOverflow', 'StackOverflow')}
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('tagged', 'Tagged')}</TableHead>
              <TableHead>{t('link', 'Link')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stackOverflowLinks.map((link) => (
              <TableRow key={link.tagged}>
                <TableCell className="font-mono">{link.tagged}</TableCell>
                <TableCell>
                  <Link href={link.url}>{link.url}</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Programs */}
      <div className="my-6">
        <h2 className="mb-3 text-xl font-semibold text-foreground">
          {t('programs', 'Programs')}
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('name', 'Name')}</TableHead>
              <TableHead>{t('programId', 'Program ID')}</TableHead>
              <TableHead>{t('github', 'Github')}</TableHead>
              <TableHead>{t('documentation', 'Documentation')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programs.map((program) => (
              <TableRow key={program.name}>
                <TableCell className="whitespace-nowrap">{program.name}</TableCell>
                <TableCell className="font-mono text-xs">{program.programId}</TableCell>
                <TableCell>
                  {program.github ? (
                    <Link href={program.github}>{t('link', 'Link')}</Link>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <NextLink
                    href={localePath(program.docs)}
                    className="text-primary hover:text-primary/80"
                  >
                    {t('link', 'Link')}
                  </NextLink>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Tokens and NFTs */}
      <div className="my-6">
        <h2 className="mb-3 text-xl font-semibold text-foreground">
          {t('tokensAndNfts', 'Tokens and NFTs')}
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('name', 'Name')}</TableHead>
              <TableHead>{t('id', 'ID')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokensAndNfts.map((token) => (
              <TableRow key={token.name}>
                <TableCell>{token.name}</TableCell>
                <TableCell className="font-mono text-xs">{token.id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Rulesets */}
      <div className="my-6">
        <h2 className="mb-3 text-xl font-semibold text-foreground">
          {t('rulesets', 'Metaplex Rulesets')}
        </h2>
        <p className="mb-3 text-sm text-muted-foreground">
          {t('rulesetsDescription', 'To be used with the pNFTs Auth Rules.')}
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('name', 'Name')}</TableHead>
              <TableHead>{t('id', 'ID')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rulesets.map((ruleset) => (
              <TableRow key={ruleset.name}>
                <TableCell>{ruleset.name}</TableCell>
                <TableCell className="font-mono text-xs">{ruleset.id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
