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
      ko: '대체 가능 토큰',
      zh: '同质化代币'
    },
    descriptionTranslations: {
      ja: 'Solana上で代替可能トークンを作成・管理します。',
      ko: 'Solana에서 대체 가능 토큰을 생성하고 관리합니다.',
      zh: '在Solana上创建和管理同质化代币。'
    },
    sectionKeys: {
      'Introduction': 'sections.introduction',
      'Getting Started': { ja: 'はじめに', ko: '시작하기', zh: '快速入门' }
    },
    linkKeys: {
      'Overview': 'links.overview',
      'Create a Token': { ja: 'トークンの作成', ko: '토큰 생성', zh: '创建代币' },
      'Launch a Token': { ja: 'トークンのローンチ', ko: '토큰 런칭', zh: '发行代币' },
      'Aggregate Token Launches': { ja: 'トークンローンチの集約', ko: '토큰 런칭 집계', zh: '聚合代币发行' },
      'Read Token Data': { ja: 'トークンデータの読み取り', ko: '토큰 데이터 읽기', zh: '读取代币数据' },
      'Mint Tokens': { ja: 'トークンのミント', ko: '토큰 민팅', zh: '铸造代币' },
      'Transfer Tokens': { ja: 'トークンの転送', ko: '토큰 전송', zh: '转移代币' },
      'Update Token Metadata': { ja: 'トークンメタデータの更新', ko: '토큰 메타데이터 업데이트', zh: '更新代币元数据' },
      'Burn Tokens': { ja: 'トークンのバーン', ko: '토큰 소각', zh: '销毁代币' }
    }
  })
}
