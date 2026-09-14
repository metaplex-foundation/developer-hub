import { documentationSection } from '@/shared/sections'
import { GiftIcon } from '@heroicons/react/24/outline'

export const mplDistro = {
  name: 'MPL-Distro',
  headline: 'Merkle-based token distributions.',
  description:
    'A Solana program for distributing existing SPL tokens to wallets or legacy NFT holders through verifiable Merkle claims.',
  navigationMenuCatergory: 'Smart Contracts',
  path: 'smart-contracts/mpl-distro',
  icon: <GiftIcon />,
  github: 'https://github.com/metaplex-foundation/mpl-distro',
  className: 'accent-amber',
  protocolFees: {
    claim: {
      protocolFee: {
        label: 'distribute / distributeToLegacyNft',
        solana: '0.002 SOL',
        notes: 'Receipt subsidies do not cover this fee.',
      },
    },
  },
  sections: [
    {
      ...documentationSection('smart-contracts/mpl-distro'),
      title: '',
      navigation: [
        {
          title: 'Introduction',
          links: [
            {
              title: 'Overview',
              href: '/smart-contracts/mpl-distro',
            },
            {
              title: 'Getting Started',
              href: '/smart-contracts/mpl-distro/getting-started',
            },
            {
              title: 'Production Delivery',
              href: '/smart-contracts/mpl-distro/production-delivery',
            },
          ],
        },
        {
          title: 'Distribution Types',
          links: [
            {
              title: 'Wallet Distribution',
              href: '/smart-contracts/mpl-distro/wallet-distribution',
            },
            {
              title: 'Legacy NFT Distribution',
              href: '/smart-contracts/mpl-distro/legacy-nft-distribution',
            },
          ],
        },
        {
          title: 'Operations',
          links: [
            {
              title: 'Funding and Recovery',
              href: '/smart-contracts/mpl-distro/funding-and-recovery',
            },
            {
              title: 'Updates',
              href: '/smart-contracts/mpl-distro/updates',
            },
          ],
        },
        {
          title: 'SDK',
          links: [
            {
              title: 'JavaScript SDK',
              href: '/smart-contracts/mpl-distro/sdk/javascript',
            },
            {
              title: 'CLI',
              href: '/dev-tools/cli/distro',
            },
          ],
        },
      ],
    },
  ],
  localizedNavigation: {
    en: {
      headline: 'Merkle-Based Token Distributions',
      description:
        'Distribute existing SPL tokens to wallets or legacy NFT holders through verifiable Merkle claims.',
      sections: {
        Introduction: 'Introduction',
        'Distribution Types': 'Distribution Types',
        Operations: 'Operations',
        SDK: 'SDK',
      },
      links: {
        Overview: 'Overview',
        'Getting Started': 'Getting Started',
        'Production Delivery': 'Production Delivery',
        'Wallet Distribution': 'Wallet Distribution',
        'Legacy NFT Distribution': 'Legacy NFT Distribution',
        'Funding and Recovery': 'Funding and Recovery',
        Updates: 'Updates',
        'JavaScript SDK': 'JavaScript SDK',
        CLI: 'CLI',
      },
    },
    ja: {
      headline: 'Merkleベースのトークン配布',
      description:
        '検証可能なMerkleクレームを通じて、既存のSPLトークンをウォレットまたはレガシーNFT保有者に配布します。',
      sections: {
        Introduction: '紹介',
        'Distribution Types': '配布タイプ',
        Operations: '操作',
        SDK: 'SDK',
      },
      links: {
        Overview: '概要',
        'Getting Started': 'はじめに',
        'Production Delivery': '本番での配布',
        'Wallet Distribution': 'ウォレット配布',
        'Legacy NFT Distribution': 'レガシーNFT配布',
        'Funding and Recovery': '資金調達と回収',
        Updates: '更新',
        'JavaScript SDK': 'JavaScript SDK',
        CLI: 'CLI',
      },
    },
    ko: {
      headline: 'Merkle 기반 토큰 배포',
      description:
        '검증 가능한 Merkle 클레임을 통해 기존 SPL 토큰을 지갑 또는 레거시 NFT 보유자에게 배포합니다.',
      sections: {
        Introduction: '소개',
        'Distribution Types': '배포 유형',
        Operations: '작업',
        SDK: 'SDK',
      },
      links: {
        Overview: '개요',
        'Getting Started': '시작하기',
        'Production Delivery': '프로덕션 배포',
        'Wallet Distribution': '지갑 배포',
        'Legacy NFT Distribution': '레거시 NFT 배포',
        'Funding and Recovery': '자금 조달 및 회수',
        Updates: '업데이트',
        'JavaScript SDK': 'JavaScript SDK',
        CLI: 'CLI',
      },
    },
    zh: {
      headline: '基于 Merkle 的代币分发',
      description:
        '通过可验证的 Merkle 领取，将现有 SPL 代币分发给钱包或旧版 NFT 持有者。',
      sections: {
        Introduction: '简介',
        'Distribution Types': '分发类型',
        Operations: '操作',
        SDK: 'SDK',
      },
      links: {
        Overview: '概述',
        'Getting Started': '快速入门',
        'Production Delivery': '生产环境分发',
        'Wallet Distribution': '钱包分发',
        'Legacy NFT Distribution': '旧版 NFT 分发',
        'Funding and Recovery': '注资与回收',
        Updates: '更新',
        'JavaScript SDK': 'JavaScript SDK',
        CLI: 'CLI',
      },
    },
  },
}
