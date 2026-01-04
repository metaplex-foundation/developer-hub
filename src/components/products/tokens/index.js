import { documentationSection } from '@/shared/sections'
import { SparklesIcon } from '@heroicons/react/24/solid'
import { Hero } from './Hero'
import { buildProductTranslations } from '@/config/navigation-translations'

export const tokens = {
  name: 'Tokens',
  headline: 'Fungible Tokens',
  description: 'Create and manage fungible tokens on Solana.',
  navigationMenuCatergory: undefined,
  path: 'tokens',
  icon: <SparklesIcon />,
  github: 'https://github.com/metaplex-foundation/mpl-token-metadata',
  className: 'accent-amber',
  heroes: [{ path: '/tokens', component: Hero }],
  sections: [
    {
      ...documentationSection('tokens'),
      // Don't show navigation on the index page (like smart-contracts and dev-tools)
      isFallbackSection: false,
      isPageFromSection: ({ pathname }) => {
        // Match subpages but not the exact index
        return pathname.startsWith('/tokens/') && pathname !== '/tokens'
      },
      navigation: [
        {
          title: 'Introduction',
          links: [
            {
              title: 'Overview',
              href: '/tokens',
            },
          ],
        },
        {
          title: 'Getting Started',
          links: [
            {
              title: 'Create a Token',
              href: '/tokens/create-a-token',
            },
            {
              title: 'Launch a Token',
              href: '/tokens/launch-token',
            },
            {
              title: 'Aggregate Token Launches',
              href: '/smart-contracts/genesis/aggregation',
            },
            {
              title: 'Read Token Data',
              href: '/tokens/read-token',
            },
            {
              title: 'Mint Tokens',
              href: '/tokens/mint-tokens',
            },
            {
              title: 'Transfer Tokens',
              href: '/tokens/transfer-a-token',
            },
            {
              title: 'Update Token Metadata',
              href: '/tokens/update-token',
            },
            {
              title: 'Burn Tokens',
              href: '/tokens/burn-tokens',
            },
          ],
        },
      ],
    },
  ],
  localizedNavigation: buildProductTranslations({
    headlineTranslations: {
      ja: '代替可能トークン',
      ko: '대체 가능 토큰'
    },
    descriptionTranslations: {
      ja: 'Solana上で代替可能トークンを作成・管理します。',
      ko: 'Solana에서 대체 가능 토큰을 생성하고 관리합니다.'
    },
    sectionKeys: {
      'Introduction': 'sections.introduction',
      'Getting Started': { ja: 'はじめに', ko: '시작하기' }
    },
    linkKeys: {
      'Overview': 'links.overview',
      'Create a Token': { ja: 'トークンの作成', ko: '토큰 생성' },
      'Launch a Token': { ja: 'トークンのローンチ', ko: '토큰 런칭' },
      'Aggregate Token Launches': { ja: 'トークンローンチの集約', ko: '토큰 런칭 집계' },
      'Read Token Data': { ja: 'トークンデータの読み取り', ko: '토큰 데이터 읽기' },
      'Mint Tokens': { ja: 'トークンのミント', ko: '토큰 민팅' },
      'Transfer Tokens': { ja: 'トークンの転送', ko: '토큰 전송' },
      'Update Token Metadata': { ja: 'トークンメタデータの更新', ko: '토큰 메타데이터 업데이트' },
      'Burn Tokens': { ja: 'トークンのバーン', ko: '토큰 소각' }
    }
  })
}
