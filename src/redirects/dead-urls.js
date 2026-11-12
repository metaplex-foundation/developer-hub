/**
 * Redirects for dead docs URLs.
 *
 * These rules apply only to URLs that are not a real page (see
 * scripts/generate-route-manifest.mjs), so they can never shadow a page.
 * They cover old links still out in the wild: docs.metaplex.com paths,
 * renamed pages, a doubled `/docs/docs` prefix and malformed links.
 *
 * Paths here are English public paths without the `/docs` basePath. A
 * `/ja`, `/ko` or `/zh` prefix is kept on the way through, so
 * `/ja/programs/token-metadata` resolves to `/ja/smart-contracts/token-metadata`.
 *
 * Source data: GA "Page Not Found" views, Oct 15 – Nov 11 2026 (DEV-269).
 */

const LOCALES = ['ja', 'ko', 'zh']

// Whole old sections. The rest of the path is kept, so
// `/programs/candy-machine/settings` becomes `/smart-contracts/candy-machine/settings`.
// When the result is not a page, EXACT and the nearest-parent fallback take over.
// Matching is on whole path segments: `/token` does not match `/tokens`.
const PREFIXES = {
  // docs.metaplex.com program paths
  '/programs/candy-machine/available-guards': '/smart-contracts/candy-machine/guards',
  '/programs/candy-machine/how-to-guides': '/smart-contracts/candy-machine/guides',
  '/programs/candy-machine': '/smart-contracts/candy-machine',
  '/programs/token-metadata': '/smart-contracts/token-metadata',
  '/programs/auction-house': '/smart-contracts/auction-house',
  '/programs/core': '/smart-contracts/core',
  '/programs/hydra': '/smart-contracts/hydra',
  '/programs/fixed-price-sale': '/smart-contracts/fixed-price-sale',
  '/programs/gumdrop': '/smart-contracts/gumdrop',
  '/programs/token-entangler': '/smart-contracts/token-entangler',
  '/programs/compression': '/smart-contracts/bubblegum-v2',
  '/programs': '/smart-contracts',
  '/smartcontracts': '/smart-contracts',
  '/architecture': '/smart-contracts',

  // Candy Machine v1/v2 and its CLIs
  '/candy-machine-v2': '/smart-contracts/candy-machine',
  '/candy-machine-v1': '/smart-contracts/candy-machine',
  '/solana/archived/candy-machine-v2': '/smart-contracts/candy-machine',
  '/deprecated/candy-machine-js-cli': '/smart-contracts/candy-machine',
  '/deprecated/candy-machine-v1': '/smart-contracts/candy-machine',
  '/create-candy': '/smart-contracts/candy-machine',

  // Sugar moved under Candy Machine
  '/developer-tools/sugar': '/smart-contracts/candy-machine/sugar',
  '/tools/sugar': '/smart-contracts/candy-machine/sugar',
  '/sugar': '/smart-contracts/candy-machine/sugar',

  // Auction House
  '/solana/auction-house': '/smart-contracts/auction-house',
  '/auction-house': '/smart-contracts/auction-house',

  // The old JS SDK was replaced by Umi
  '/sdks/js': '/dev-tools/umi',
  '/sdk/js': '/dev-tools/umi',
  '/development/clients/js-sdk': '/dev-tools/umi',

  // Aura became the DAS API docs
  '/dev-tools/aura': '/dev-tools/das-api',
  '/aura': '/dev-tools/das-api',

  // Typos and short forms
  '/dev-tool': '/dev-tools',
  '/genesis': '/smart-contracts/genesis',
  // Old versioned spec pages (`/token-metadata/v1.0.0/nft-standard`, after
  // the /token-metadata → /smart-contracts/token-metadata migration)
  '/smart-contracts/token-metadata/versions': '/smart-contracts/token-metadata/token-standard',
  '/smart-contracts/token-metadata/v1.0.0': '/smart-contracts/token-metadata/token-standard',
  '/smart-contracts/token-metadata/v1.1.0': '/smart-contracts/token-metadata/token-standard',

  // Mint addresses: the tokens section is the closest docs page
  '/token': '/tokens',
}

// Single pages. Keys are checked at every step, so a key can be an old path
// or the path a prefix or migration rule produced.
const EXACT = {
  // Top-level pages
  '/nft-standard': '/smart-contracts/token-metadata/token-standard',
  '/airdrops/create-gumdrop': '/smart-contracts/gumdrop',
  '/stability': '/stability-index',
  '/storage-providers': '/smart-contracts/core-candy-machine/preparing-assets',
  '/resources/storage-providers': '/smart-contracts/core-candy-machine/preparing-assets',
  '/community': '/solana',
  '/security-policy': '/security',
  '/protocol/security': '/security',
  '/bounty': '/security',
  '/bounty-program': '/security',
  '/security/bounty-program': '/security',
  '/resources/protocol-fees': '/protocol-fees',
  '/resources/rpc-providers': '/solana/rpcs-and-das',
  '/resources/official-links': '/official-links',
  '/digital-asset-standard': '/dev-tools/das-api',
  '/mpl-404': '/smart-contracts/mpl-hybrid',
  '/tools/android': '/dev-tools/mobile-sdks',
  '/legacy-documentation/solita': '/dev-tools/solita',
  '/overviews/candy_machine_overview': '/smart-contracts/candy-machine',
  '/overviews/metadata_overview': '/smart-contracts/token-metadata',
  '/overviews/metaplex_overview': '/smart-contracts',
  '/solana/cli-wallet': '/solana/solana-keypairs-and-wallets',
  '/solana/burn-nfts': '/nfts/burn-nft',
  '/solana/airdrops': '/solana/general/spl-token-claim-airdrop-using-gumdrop',
  '/solana/javascript/how-to-create-a-compressed-nft': '/smart-contracts/bubblegum-v2/mint-cnfts',
  '/smart-contracts/programs': '/smart-contracts',
  '/products': '/smart-contracts',
  '/smart-contracts/genesis/fees': '/protocol-fees',
  '/smart-contracts/understanding-programs': '/solana/understanding-programs',

  // Token Metadata
  '/smart-contracts/token-metadata/specification': '/smart-contracts/token-metadata/token-standard',
  '/smart-contracts/token-metadata/overview': '/smart-contracts/token-metadata',
  '/smart-contracts/token-metadata/certified-collections': '/smart-contracts/token-metadata/collections',
  '/smart-contracts/token-metadata/nft-escrow': '/smart-contracts/token-metadata/escrow',
  '/smart-contracts/token-metadata/delegated-authorities': '/smart-contracts/token-metadata/delegates',
  '/smart-contracts/token-metadata/minting': '/smart-contracts/token-metadata/mint',
  '/smart-contracts/token-metadata/fees': '/protocol-fees',
  '/smart-contracts/token-metadata/token-auth-rules': '/smart-contracts/token-auth-rules',
  '/smart-contracts/token-metadata/bubblegum': '/smart-contracts/bubblegum-v2',
  '/smart-contracts/token-metadata/create-token': '/tokens/create-a-token',
  '/smart-contracts/token-metadata/create-a-token': '/tokens/create-a-token',
  '/smart-contracts/token-metadata/guides/javascript/create-a-fungible-token': '/tokens/create-a-token',
  '/smart-contracts/token-metadata/guides/javascript/create-a-fungible-spl-token': '/tokens/create-a-token',
  '/smart-contracts/token-metadata/how-to-guides/royalties': '/smart-contracts/token-metadata/creators',

  // Candy Machine (after the /programs and /candy-machine-v2 prefixes)
  '/smart-contracts/candy-machine/minting': '/smart-contracts/candy-machine/mint',
  '/smart-contracts/candy-machine/mint-tokens': '/smart-contracts/candy-machine/mint',
  '/smart-contracts/candy-machine/candy-guards': '/smart-contracts/candy-machine/guards',
  '/smart-contracts/candy-machine/candy-machine-settings': '/smart-contracts/candy-machine/settings',
  '/smart-contracts/candy-machine/configuration': '/smart-contracts/candy-machine/sugar/configuration',
  '/smart-contracts/candy-machine/inserting-items': '/smart-contracts/candy-machine/insert-items',
  '/smart-contracts/candy-machine/managing-candy-machines': '/smart-contracts/candy-machine/manage',
  '/smart-contracts/candy-machine/programmable-nfts': '/smart-contracts/candy-machine/pnfts',
  '/smart-contracts/candy-machine/special-guard-instructions': '/smart-contracts/candy-machine/guard-route',
  '/smart-contracts/candy-machine/creating-candy-machine': '/smart-contracts/candy-machine/getting-started',
  '/smart-contracts/candy-machine/preparing-assets': '/smart-contracts/core-candy-machine/preparing-assets',
  '/smart-contracts/candy-machine/prepare-assets': '/smart-contracts/core-candy-machine/preparing-assets',
  '/smart-contracts/candy-machine/withdraw': '/smart-contracts/candy-machine/sugar/commands/withdraw',
  '/smart-contracts/candy-machine/verify-upload': '/smart-contracts/candy-machine/sugar/commands/verify',
  '/smart-contracts/candy-machine/sign-nfts': '/smart-contracts/candy-machine/sugar/commands/sign',
  '/smart-contracts/candy-machine/update': '/smart-contracts/candy-machine/manage',

  // Sugar (after the Sugar prefixes)
  '/smart-contracts/candy-machine/sugar/overview/installation': '/smart-contracts/candy-machine/sugar/installation',
  '/smart-contracts/candy-machine/sugar/overview/quick-start': '/smart-contracts/candy-machine/sugar/getting-started',
  '/smart-contracts/candy-machine/sugar/quick-start': '/smart-contracts/candy-machine/sugar/getting-started',
  '/smart-contracts/candy-machine/sugar/tutorials/my-first-candy-machine': '/smart-contracts/candy-machine/sugar/getting-started',
  '/smart-contracts/candy-machine/sugar/reference/configuration': '/smart-contracts/candy-machine/sugar/configuration',
  '/smart-contracts/candy-machine/sugar/guides/configuration': '/smart-contracts/candy-machine/sugar/configuration',
  '/smart-contracts/candy-machine/sugar/learning/settings': '/smart-contracts/candy-machine/sugar/configuration',
  '/smart-contracts/candy-machine/sugar/reference/upload-methods': '/smart-contracts/candy-machine/sugar/configuration',
  '/smart-contracts/candy-machine/sugar/learning/upload_methods': '/smart-contracts/candy-machine/sugar/configuration',
  '/smart-contracts/candy-machine/sugar/upload-methods': '/smart-contracts/candy-machine/sugar/configuration',
  '/smart-contracts/candy-machine/sugar/guides/preparing-assets': '/smart-contracts/core-candy-machine/preparing-assets',
  '/smart-contracts/candy-machine/sugar/preparing-assets': '/smart-contracts/core-candy-machine/preparing-assets',

  // Auction House
  '/smart-contracts/auction-house/how-to-guides/manage-auction-house-using-cli': '/smart-contracts/auction-house/manage-using-cli',
  '/smart-contracts/auction-house/cli': '/smart-contracts/auction-house/manage-using-cli',
  '/smart-contracts/auction-house/getting_started': '/smart-contracts/auction-house/getting-started',
  '/smart-contracts/auction-house/trading-assets-on-auction-house': '/smart-contracts/auction-house/trading-assets',
  '/smart-contracts/auction-house/trading': '/smart-contracts/auction-house/trading-assets',
  '/smart-contracts/auction-house/auction-house-receipts': '/smart-contracts/auction-house/receipts',
  '/smart-contracts/auction-house/managing-auction-house': '/smart-contracts/auction-house/manage',
  '/smart-contracts/auction-house/managing-buyer-account': '/smart-contracts/auction-house/buyer-escrow',
  '/smart-contracts/auction-house/auction-house-settings': '/smart-contracts/auction-house/settings',
  '/smart-contracts/auction-house/finding-bids-listings-and-sales': '/smart-contracts/auction-house/find',

  // Core
  '/smart-contracts/core/execute': '/smart-contracts/core/execute-asset-signing',
  '/smart-contracts/core/guides/execute': '/smart-contracts/core/execute-asset-signing',
  '/smart-contracts/core/guides/execute-and-asset-signer': '/smart-contracts/core/execute-asset-signing',
  '/smart-contracts/core/plugins/execute': '/smart-contracts/core/execute-asset-signing',
  '/smart-contracts/core/execute-asset-signinglog-in': '/smart-contracts/core/execute-asset-signing',
  '/smart-contracts/core/asset': '/smart-contracts/core/what-is-an-asset',
  '/smart-contracts/core/plugins/add-blocker': '/smart-contracts/core/plugins/addBlocker',
  '/smart-contracts/core/plugins/immutable-metadata': '/smart-contracts/core/plugins/immutableMetadata',
  '/smart-contracts/core/plugins/plugins-overview': '/smart-contracts/core/plugins',
  '/smart-contracts/core/plugins/lifecycle-hook': '/smart-contracts/core/external-plugins/overview',
  '/smart-contracts/core/external-plugins': '/smart-contracts/core/external-plugins/overview',
  '/smart-contracts/core/external-plugins/oracle-plugin': '/smart-contracts/core/external-plugins/oracle',
  '/smart-contracts/core/transferring-assets': '/smart-contracts/core/transfer',
  '/smart-contracts/core/features/assets/transferring-assets': '/smart-contracts/core/transfer',
  '/smart-contracts/core/updating-assets': '/smart-contracts/core/update',
  '/smart-contracts/core/revoke-plugin-authority': '/smart-contracts/core/plugins/delegating-and-revoking-plugins',
  '/smart-contracts/core/das-api': '/dev-tools/das-api/core-extension',
  '/smart-contracts/core/getting-started/rust': '/smart-contracts/core/sdk/rust',
  '/smart-contracts/core/core-js-sdk-v1-0': '/smart-contracts/core/sdk/javascript',

  // Core Candy Machine
  '/smart-contracts/core-candy-machine/fetching': '/smart-contracts/core-candy-machine/fetching-a-candy-machine',
  '/smart-contracts/core-candy-machine/withdraw': '/smart-contracts/core-candy-machine/withdrawing-a-candy-machine',
  '/smart-contracts/core-candy-machine/guides/create': '/smart-contracts/core-candy-machine/create',

  // Bubblegum
  '/smart-contracts/bubblegum/rpcs': '/solana/rpcs-and-das',
  '/smart-contracts/bubblegum/stored-nft-data': '/smart-contracts/bubblegum-v2/stored-nft-data',
  '/smart-contracts/bubblegum-v2/freeze-thaw': '/smart-contracts/bubblegum-v2/freeze-cnfts',
  '/smart-contracts/bubblegum-v2/freeze-thaw-cnfts': '/smart-contracts/bubblegum-v2/freeze-cnfts',
  '/smart-contracts/bubblegum-v2/freeze-and-soulbound': '/smart-contracts/bubblegum-v2/freeze-cnfts',
  '/smart-contracts/bubblegum-v2/freezing': '/smart-contracts/bubblegum-v2/freeze-cnfts',
  '/smart-contracts/bubblegum-v2/delegates': '/smart-contracts/bubblegum-v2/delegate-cnfts',
  '/smart-contracts/bubblegum-v2/leaf-schema': '/smart-contracts/bubblegum-v2/hashed-nft-data',
  '/smart-contracts/bubblegum-v2/merkle-trees': '/smart-contracts/bubblegum-v2/concurrent-merkle-trees',
  '/smart-contracts/bubblegum-v2/protocol-fees': '/protocol-fees',
  '/smart-contracts/bubblegum-v2/royalties': '/smart-contracts/bubblegum-v2/reading-inherited-royalties',
  '/smart-contracts/bubblegum-v2/transferring': '/smart-contracts/bubblegum-v2/transfer-cnfts',

  // Token Auth Rules and Inscription
  '/smart-contracts/token-auth-rules/primitive-rules/program-owned-list': '/smart-contracts/token-auth-rules/primitive-rules/program-owned',
  '/smart-contracts/token-auth-rules/primitive-rules/pubkey-list-match': '/smart-contracts/token-auth-rules/primitive-rules/pubkey-match',
  '/smart-contracts/inscription/initialize-from-mint': '/smart-contracts/inscription/initialize',

  // Umi and the DAS API
  '/dev-tools/umi/recipes': '/dev-tools/umi/guides',
  '/dev-tools/umi/wallet-adapters': '/dev-tools/umi/getting-started',
  '/dev-tools/umi/connecting-to-an-rpc': '/dev-tools/umi/rpc',
  '/dev-tools/umi/identity-and-signers': '/dev-tools/umi/public-keys-and-signers',
  '/dev-tools/umi/signers': '/dev-tools/umi/public-keys-and-signers',
  '/dev-tools/umi/sending-transactions': '/dev-tools/umi/transactions',
  '/dev-tools/das-api/methods/get-asset-by-creator': '/dev-tools/das-api/methods/get-assets-by-creator',
  '/dev-tools/das-api/methods/get-asset-by-authority': '/dev-tools/das-api/methods/get-assets-by-authority',
  '/dev-tools/das-api/methods/get-asset-by-owner': '/dev-tools/das-api/methods/get-assets-by-owner',
  '/dev-tools/das-api/rpc-providers': '/solana/rpcs-and-das',
}

const MAX_STEPS = 10

function splitLocale(pathname) {
  const match = pathname.match(/^\/(ja|ko|zh)(\/.*)?$/)
  if (match && LOCALES.includes(match[1])) {
    return { locale: `/${match[1]}`, rest: match[2] || '/' }
  }
  return { locale: '', rest: pathname }
}

function joinLocale(locale, rest) {
  if (rest === '/') return locale || '/'
  return `${locale}${rest}`
}

/**
 * Repair a malformed path. Returns the repaired path, or null when the
 * path needs no repair.
 *
 * - `/docs/docs/nfts` and `/docs/en/core`: an extra basePath or locale.
 * - `/bubblegumhttps:/www.npmjs.com/...`, `/deploy](https:/...)`,
 *   `/stored-nft-data]`: a Markdown link pasted into the URL.
 * - `/update.md`, a trailing slash, spaces and uppercase letters.
 */
function cleanPath(pathname) {
  let p = pathname
  try {
    p = decodeURIComponent(p)
  } catch {
    // Keep the raw path when it is not valid percent-encoding.
  }
  p = p.split(/https?:|\]\(|[\])]/)[0]
  p = p.replace(/\s+/g, '')
  while (/^\/(docs|en)(\/|$)/.test(p)) p = p.replace(/^\/(docs|en)/, '') || '/'
  p = p.replace(/\.md$/, '')
  if (p.length > 1) p = p.replace(/\/+$/, '')
  p = p.replace(/\/{2,}/g, '/')
  if (p === '') p = '/'
  if (p !== pathname) return p
  const lower = p.toLowerCase()
  return lower !== p ? lower : null
}

function matchPrefix(rest) {
  let best = null
  for (const prefix of Object.keys(PREFIXES)) {
    const matches =
      rest === prefix ||
      rest.startsWith(`${prefix}/`) ||
      rest.toLowerCase() === prefix ||
      rest.toLowerCase().startsWith(`${prefix}/`)
    if (matches && (!best || prefix.length > best.length)) best = prefix
  }
  if (!best) return null
  return `${PREFIXES[best]}${rest.slice(best.length)}`
}

/**
 * The nearest parent of a path that is a real page, not counting the home
 * page. `/smart-contracts/core/overview` → `/smart-contracts/core`.
 */
function nearestExistingParent(pathname, isRoute) {
  const { locale, rest } = splitLocale(pathname)
  const segments = rest.split('/').filter(Boolean)
  for (let i = segments.length - 1; i >= 1; i--) {
    const candidate = joinLocale(locale, `/${segments.slice(0, i).join('/')}`)
    if (isRoute(candidate)) return candidate
  }
  return null
}

/**
 * Find where a dead URL should go.
 *
 * @param {string} pathname  A path that is not a page, without basePath.
 * @param {object} options
 * @param {(path: string) => boolean} options.isRoute  True for a real page.
 * @param {(path: string) => string|null} options.followRule
 *   The site's other redirect rules (the old-to-new path migrations in
 *   middleware.js). They run before PREFIXES, which only fill the gaps.
 * @returns {string|null}  A real page, or null to serve the 404 page.
 */
export function resolveDeadUrl(pathname, { isRoute, followRule }) {
  let current = pathname
  const seen = new Set()

  for (let step = 0; step < MAX_STEPS; step++) {
    if (isRoute(current)) return current === pathname ? null : current
    if (seen.has(current)) break
    seen.add(current)

    const { locale, rest } = splitLocale(current)
    // Specific answers first: a single-page mapping, a repaired path, then
    // the site's existing migration rules. Whole-section prefixes come last
    // so they never override a more specific rule.
    const next =
      (EXACT[rest] && joinLocale(locale, EXACT[rest])) ||
      cleanPath(current) ||
      followRule(current) ||
      (matchPrefix(rest) && joinLocale(locale, matchPrefix(rest)))

    if (!next || next === current) break
    current = next
  }

  return nearestExistingParent(current, isRoute) || nearestExistingParent(pathname, isRoute)
}

export const deadUrlTables = { PREFIXES, EXACT }
