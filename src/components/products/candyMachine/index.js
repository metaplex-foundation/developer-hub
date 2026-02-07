import {
  documentationSection,
  guidesSection,
  referencesSection
} from '@/shared/sections'
import { Square2StackIcon } from '@heroicons/react/24/solid'

export const candyMachine = {
  name: 'Candy Machine',
  headline: 'TM NFT launchpad',
  description: 'Launch your next NFT collection on Solana.',
  navigationMenuCatergory: 'Smart Contracts',
  path: 'smart-contracts/candy-machine',
  icon: <Square2StackIcon />,
  github: 'https://github.com/metaplex-foundation/mpl-candy-machine',
  className: 'accent-pink',
  deprecated: true,
  sections: [
    {
      ...documentationSection('smart-contracts/candy-machine'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/smart-contracts/candy-machine' },
            {
              title: 'Getting Started',
              href: '/smart-contracts/candy-machine/getting-started',
              // Subpages: /js /rust, etc.
            },
          ],
        },
        {
          title: 'Features',
          links: [
            {
              title: 'Candy Machine Settings',
              href: '/smart-contracts/candy-machine/settings',
            },
            { title: 'Managing Candy Machines', href: '/smart-contracts/candy-machine/manage' },
            { title: 'Inserting Items', href: '/smart-contracts/candy-machine/insert-items' },
            { title: 'Candy Guards', href: '/smart-contracts/candy-machine/guards' },
            { title: 'Guard Groups', href: '/smart-contracts/candy-machine/guard-groups' },
            {
              title: 'Special Guard Instructions',
              href: '/smart-contracts/candy-machine/guard-route',
            },
            { title: 'Minting', href: '/smart-contracts/candy-machine/mint' },
            { title: 'Programmable NFTs', href: '/smart-contracts/candy-machine/pnfts' },
          ],
        },
        {
          title: 'Available Guards',
          links: [
            {
              title: 'Address Gate',
              href: '/smart-contracts/candy-machine/guards/address-gate',
            },
            { title: 'Allocation', href: '/smart-contracts/candy-machine/guards/allocation' },
            { title: 'Allow List', href: '/smart-contracts/candy-machine/guards/allow-list' },
            { title: 'Bot Tax', href: '/smart-contracts/candy-machine/guards/bot-tax' },
            { title: 'End Date', href: '/smart-contracts/candy-machine/guards/end-date' },
            {
              title: 'Freeze Sol Payment',
              href: '/smart-contracts/candy-machine/guards/freeze-sol-payment',
            },
            {
              title: 'Freeze Token Payment',
              href: '/smart-contracts/candy-machine/guards/freeze-token-payment',
            },
            { title: 'Gatekeeper', href: '/smart-contracts/candy-machine/guards/gatekeeper' },
            { title: 'Mint Limit', href: '/smart-contracts/candy-machine/guards/mint-limit' },
            { title: 'NFT Burn', href: '/smart-contracts/candy-machine/guards/nft-burn' },
            { title: 'NFT Gate', href: '/smart-contracts/candy-machine/guards/nft-gate' },
            { title: 'NFT Payment', href: '/smart-contracts/candy-machine/guards/nft-payment' },
            {
              title: 'Program Gate',
              href: '/smart-contracts/candy-machine/guards/program-gate',
            },
            {
              title: 'Redeemed Amount',
              href: '/smart-contracts/candy-machine/guards/redeemed-amount',
            },
            { title: 'Sol Payment', href: '/smart-contracts/candy-machine/guards/sol-payment' },
            { title: 'Start Date', href: '/smart-contracts/candy-machine/guards/start-date' },
            {
              title: 'Third Party Signer',
              href: '/smart-contracts/candy-machine/guards/third-party-signer',
            },
            { title: 'Token Burn', href: '/smart-contracts/candy-machine/guards/token-burn' },
            { title: 'Token Gate', href: '/smart-contracts/candy-machine/guards/token-gate' },
            {
              title: 'Token Payment',
              href: '/smart-contracts/candy-machine/guards/token-payment',
            },
            {
              title: 'Token2022 Payment',
              href: '/smart-contracts/candy-machine/guards/token2022-payment',
            },
          ],
        },
        {
          title: 'Custom Guards',
          links: [
            {
              title: 'Generating Client',
              href: '/smart-contracts/candy-machine/custom-guards/generating-client',
            },
          ],
        },
      ],
    },
    {
      ...guidesSection('smart-contracts/candy-machine'),
      navigation: [
        {
          title: 'Candy Machine Guides',
          links: [
            { title: 'Mint NFTs to Another Wallet - Airdrop example', href: '/smart-contracts/candy-machine/guides/airdrop-mint-to-another-wallet' },
            { title: 'Create an NFT Collection on Solana with Candy Machine', href: '/smart-contracts/candy-machine/guides/create-an-nft-collection-on-solana-with-candy-machine' }
          ],
        },
      ],
    },
    {
      id: 'sugar',
      title: 'Sugar',
      icon: 'SolidCommandLine',
      href: `/smart-contracts/candy-machine/sugar`,
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/smart-contracts/candy-machine/sugar' },
            {
              title: 'Installation',
              href: '/smart-contracts/candy-machine/sugar/installation',
            },
            {
              title: 'Getting Started',
              href: '/smart-contracts/candy-machine/sugar/getting-started',
            },
          ],
        },
        {
          title: 'Working with Sugar',
          links: [
            {
              title: 'Configuration File',
              href: '/smart-contracts/candy-machine/sugar/configuration',
            },
            {
              title: 'Cache file',
              href: '/smart-contracts/candy-machine/sugar/cache',
            },
          ],
        },
        {
          title: 'Commands',
          links: [
            { title: 'airdrop', href: '/smart-contracts/candy-machine/sugar/commands/airdrop' },
            { title: 'bundlr', href: '/smart-contracts/candy-machine/sugar/commands/bundlr' },
            {
              title: 'collection',
              href: '/smart-contracts/candy-machine/sugar/commands/collection',
            },
            { title: 'config', href: '/smart-contracts/candy-machine/sugar/commands/config' },
            { title: 'deploy', href: '/smart-contracts/candy-machine/sugar/commands/deploy' },
            { title: 'freeze', href: '/smart-contracts/candy-machine/sugar/commands/freeze' },
            { title: 'guard', href: '/smart-contracts/candy-machine/sugar/commands/guard' },
            { title: 'hash', href: '/smart-contracts/candy-machine/sugar/commands/hash' },
            { title: 'launch', href: '/smart-contracts/candy-machine/sugar/commands/launch' },
            { title: 'mint', href: '/smart-contracts/candy-machine/sugar/commands/mint' },
            { title: 'reveal', href: '/smart-contracts/candy-machine/sugar/commands/reveal' },
            { title: 'show', href: '/smart-contracts/candy-machine/sugar/commands/show' },
            { title: 'sign', href: '/smart-contracts/candy-machine/sugar/commands/sign' },
            { title: 'update', href: '/smart-contracts/candy-machine/sugar/commands/update' },
            { title: 'upload', href: '/smart-contracts/candy-machine/sugar/commands/upload' },
            {
              title: 'validate',
              href: '/smart-contracts/candy-machine/sugar/commands/validate',
            },
            { title: 'verify', href: '/smart-contracts/candy-machine/sugar/commands/verify' },
            {
              title: 'withdraw',
              href: '/smart-contracts/candy-machine/sugar/commands/withdraw',
            },
          ],
        },
        {
          title: 'References',
          links: [
            {
              title: 'Bring Your Own Uploader',
              href: '/smart-contracts/candy-machine/sugar/bring-your-own-uploader',
            },
          ],
        },
      ],
    },
    {
      ...referencesSection('smart-contracts/candy-machine'),
      href: `https://mpl-candy-machine.typedoc.metaplex.com/`,
      target: '_blank',
    }
  ],
  localizedNavigation: {
    en: {
      headline: 'TM NFT launchpad',
      description: 'Launch your next NFT collection on Solana.',
      sections: {
        'Introduction': 'Introduction',
        'Features': 'Features', 
        'Available Guards': 'Available Guards',
        'Custom Guards': 'Custom Guards',
        'Candy Machine Guides': 'Candy Machine Guides'
      },
      links: {
        'Overview': 'Overview',
        'Getting Started': 'Getting Started',
        'Candy Machine Settings': 'Candy Machine Settings',
        'Managing Candy Machines': 'Managing Candy Machines',
        'Inserting Items': 'Inserting Items',
        'Candy Guards': 'Candy Guards',
        'Guard Groups': 'Guard Groups',
        'Special Guard Instructions': 'Special Guard Instructions',
        'Minting': 'Minting',
        'Programmable NFTs': 'Programmable NFTs'
      }
    },
    ja: {
      headline: 'TM NFTローンチパッド',
      description: 'Solana上で次のNFTコレクションを立ち上げましょう。',
      sections: {
        'Introduction': '紹介',
        'Features': '機能',
        'Available Guards': '利用可能なガード',
        'Custom Guards': 'カスタムガード',
        'Candy Machine Guides': 'Candy Machineガイド'
      },
      links: {
        'Overview': '概要',
        'Getting Started': 'はじめに',
        'Candy Machine Settings': 'Candy Machine設定',
        'Managing Candy Machines': 'Candy Machineの管理',
        'Inserting Items': 'アイテムの挿入',
        'Candy Guards': 'Candy Guards',
        'Guard Groups': 'ガードグループ',
        'Special Guard Instructions': '特別ガード指示',
        'Minting': 'ミンティング',
        'Programmable NFTs': 'プログラマブルNFT'
      }
    },
    ko: {
      headline: 'TM NFT 런치패드',
      description: '솔라나에서 다음 NFT 컬렉션을 출시하세요.',
      sections: {
        'Introduction': '소개',
        'Features': '기능',
        'Available Guards': '사용 가능한 가드',
        'Custom Guards': '커스텀 가드',
        'Candy Machine Guides': 'Candy Machine 가이드'
      },
      links: {
        'Overview': '개요',
        'Getting Started': '시작하기',
        'Candy Machine Settings': 'Candy Machine 설정',
        'Managing Candy Machines': 'Candy Machine 관리',
        'Inserting Items': '아이템 삽입',
        'Candy Guards': 'Candy Guards',
        'Guard Groups': '가드 그룹',
        'Special Guard Instructions': '특별 가드 지침',
        'Minting': '민팅',
        'Programmable NFTs': '프로그래밍 가능한 NFT'
      }
    },
    zh: {
      headline: 'TM NFT发行平台',
      description: '在Solana上发行您的下一个NFT合集。',
      sections: {
        'Introduction': '简介',
        'Features': '功能',
        'Available Guards': '可用守卫',
        'Custom Guards': '自定义守卫',
        'Candy Machine Guides': 'Candy Machine指南'
      },
      links: {
        'Overview': '概述',
        'Getting Started': '快速入门',
        'Candy Machine Settings': 'Candy Machine设置',
        'Managing Candy Machines': '管理Candy Machine',
        'Inserting Items': '插入项目',
        'Candy Guards': 'Candy Guards',
        'Guard Groups': '守卫组',
        'Special Guard Instructions': '特殊守卫指令',
        'Minting': '铸造',
        'Programmable NFTs': '可编程NFT'
      }
    }
  }
}
