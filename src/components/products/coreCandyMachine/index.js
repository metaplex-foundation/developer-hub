import { documentationSection, guidesSection, referencesSection } from '@/shared/sections'
import { Square3Stack3DIcon } from '@heroicons/react/24/solid'
import { Hero } from './Hero'

export const coreCandyMachine = {
  name: 'Core Candy Machine',
  headline: 'Core Asset launchpad',
  description: 'Launch your next MPL Core Asset collection on Solana.',
  navigationMenuCatergory: 'MPL',
  path: 'core-candy-machine',
  icon: <Square3Stack3DIcon />,
  github: 'https://github.com/metaplex-foundation/mpl-core-candy-machine',
  className: 'accent-pink',
  heroes: [{ path: '/core-candy-machine', component: Hero }],
  sections: [
    {
      ...documentationSection('core-candy-machine'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/core-candy-machine' },
          ],
        },
        {
          title: 'SDK',
          links: [
            { title: 'Javascript SDK', href: '/core-candy-machine/sdk/javascript' },
            { title: 'Rust SDK', href: '/core-candy-machine/sdk/rust' },
          ],
        },
        {
          title: 'Core Candy Machine',

          links: [
            {
              title: 'Overview',
              href: '/core-candy-machine/overview',
            },
            {
              title: 'Anti-Bot Protection Best Practices',
              href: '/core-candy-machine/anti-bot-protection-best-practices',
            },
            { title: 'Candy Guards', href: '/core-candy-machine/guards' },
            {
              title: 'Preparing Assets',
              href: '/core-candy-machine/preparing-assets',
            },
            {
              title: 'Creating a Candy Machine',
              href: '/core-candy-machine/create',
            },
            {
              title: 'Inserting Items',
              href: '/core-candy-machine/insert-items',
            },
            {
              title: 'Updating a Candy Machine and Guards',
              href: '/core-candy-machine/update',
            },
            {
              title: 'Guard Groups and Phases',
              href: '/core-candy-machine/guard-groups',
            },
            {
              title: 'Special Guard Instructions',
              href: '/core-candy-machine/guard-route',
            },
            {
              title: 'Fetching a Candy Machine',
              href: '/core-candy-machine/fetching-a-candy-machine',
            },
            {
              title: 'Minting from a Candy Machine',
              href: '/core-candy-machine/mint',
            },
            {
              title: 'Withdrawing a Candy Machine',
              href: '/core-candy-machine/withdrawing-a-candy-machine',
            },
          ],
        },
        {
          title: 'Available Guards',
          links: [
            {
              title: 'Address Gate',
              href: '/core-candy-machine/guards/address-gate',
            },
            {
              title: 'Allocation',
              href: '/core-candy-machine/guards/allocation',
            },
            {
              title: 'Allow List',
              href: '/core-candy-machine/guards/allow-list',
            },
            {
              title: 'Asset Burn',
              href: '/core-candy-machine/guards/asset-burn',
            },
            {
              title: 'Asset Burn Multi',
              href: '/core-candy-machine/guards/asset-burn-multi',
            },
            {
              title: 'Asset Gate',
              href: '/core-candy-machine/guards/asset-gate',
            },
            {
              title: 'Asset Payment',
              href: '/core-candy-machine/guards/asset-payment',
            },
            {
              title: 'Asset Payment Multi',
              href: '/core-candy-machine/guards/asset-payment-multi',
            },
            {
              title: 'Asset Mint Limit',
              href: '/core-candy-machine/guards/asset-mint-limit',
            },
            { title: 'Bot Tax', href: '/core-candy-machine/guards/bot-tax' },
            { title: 'End Date', href: '/core-candy-machine/guards/end-date' },
            { title: 'Edition', href: '/core-candy-machine/guards/edition' },
            {
              title: 'Freeze Sol Payment',
              href: '/core-candy-machine/guards/freeze-sol-payment',
            },
            {
              title: 'Freeze Token Payment',
              href: '/core-candy-machine/guards/freeze-token-payment',
            },
            {
              title: 'Gatekeeper',
              href: '/core-candy-machine/guards/gatekeeper',
            },
            {
              title: 'Mint Limit',
              href: '/core-candy-machine/guards/mint-limit',
            },
            { title: 'NFT Burn', href: '/core-candy-machine/guards/nft-burn' },
            { title: 'NFT Gate', href: '/core-candy-machine/guards/nft-gate' },
            {
              title: 'NFT Mint Limit',
              href: '/core-candy-machine/guards/nft-mint-limit',
            },
            {
              title: 'NFT Payment',
              href: '/core-candy-machine/guards/nft-payment',
            },
            {
              title: 'Program Gate',
              href: '/core-candy-machine/guards/program-gate',
            },
            {
              title: 'Redeemed Amount',
              href: '/core-candy-machine/guards/redeemed-amount',
            },
            {
              title: 'Sol Fixed Fee',
              href: '/core-candy-machine/guards/sol-fixed-fee',
            },
            {
              title: 'Sol Payment',
              href: '/core-candy-machine/guards/sol-payment',
            },
            {
              title: 'Start Date',
              href: '/core-candy-machine/guards/start-date',
            },
            {
              title: 'Third Party Signer',
              href: '/core-candy-machine/guards/third-party-signer',
            },
            {
              title: 'Token Burn',
              href: '/core-candy-machine/guards/token-burn',
            },
            {
              title: 'Token Gate',
              href: '/core-candy-machine/guards/token-gate',
            },
            {
              title: 'Token Payment',
              href: '/core-candy-machine/guards/token-payment',
            },
            {
              title: 'Token2022 Payment',
              href: '/core-candy-machine/guards/token2022-payment',
            },
            {
              title: 'Vanity Mint',
              href: '/core-candy-machine/guards/vanity-mint',
            },
          ],
        },
        {
          title: 'Custom Guards',
          links: [
            {
              title: 'Generating Client',
              href: '/core-candy-machine/custom-guards/generating-client',
            },
          ],
        },
      ],
    },
    {
      ...guidesSection('core-candy-machine'),
      navigation: [
        {
          title: 'General',
          links: [
            { 
              title: 'Overview', 
              href: '/core-candy-machine/guides' 
            },
            {
              title: 'Create a Website for minting Assets from your Core Candy Machine',
              href: '/core-candy-machine/guides/create-a-core-candy-machine-ui',
            },
            {
              title: 'Create a Core Candy Machine with Hidden Settings',
              href: '/core-candy-machine/guides/create-a-core-candy-machine-with-hidden-settings',
            },
          ],
        },
      ],
    },
    // {
    //   id: 'sugar',
    //   title: 'Sugar',
    //   icon: 'SolidCake',
    //   href: `/core-candy-machine/sugar`,
    //   navigation: [
    //     {
    //       title: 'Introduction',
    //       links: [
    //         { title: 'Overview', href: '/core-candy-machine/sugar' },
    //         {
    //           title: 'Installation',
    //           href: '/core-candy-machine/sugar/installation',
    //         },
    //         {
    //           title: 'Getting Started',
    //           href: '/core-candy-machine/sugar/getting-started',
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Working with Sugar',
    //       links: [
    //         {
    //           title: 'Configuration File',
    //           href: '/core-candy-machine/sugar/configuration',
    //         },
    //         {
    //           title: 'Cache file',
    //           href: '/core-candy-machine/sugar/cache',
    //         },
    //       ],
    //     },
    //     {
    //       title: 'Commands',
    //       links: [
    //         {
    //           title: 'airdrop',
    //           href: '/core-candy-machine/sugar/commands/airdrop',
    //         },
    //         { title: 'bundlr', href: '/core-candy-machine/sugar/commands/bundlr' },
    //         {
    //           title: 'collection',
    //           href: '/core-candy-machine/sugar/commands/collection',
    //         },
    //         { title: 'config', href: '/core-candy-machine/sugar/commands/config' },
    //         { title: 'deploy', href: '/core-candy-machine/sugar/commands/deploy' },
    //         { title: 'freeze', href: '/core-candy-machine/sugar/commands/freeze' },
    //         { title: 'guard', href: '/core-candy-machine/sugar/commands/guard' },
    //         { title: 'hash', href: '/core-candy-machine/sugar/commands/hash' },
    //         { title: 'launch', href: '/core-candy-machine/sugar/commands/launch' },
    //         { title: 'mint', href: '/core-candy-machine/sugar/commands/mint' },
    //         { title: 'reveal', href: '/core-candy-machine/sugar/commands/reveal' },
    //         { title: 'show', href: '/core-candy-machine/sugar/commands/show' },
    //         { title: 'sign', href: '/core-candy-machine/sugar/commands/sign' },
    //         { title: 'update', href: '/core-candy-machine/sugar/commands/update' },
    //         { title: 'upload', href: '/core-candy-machine/sugar/commands/upload' },
    //         {
    //           title: 'validate',
    //           href: '/core-candy-machine/sugar/commands/validate',
    //         },
    //         { title: 'verify', href: '/core-candy-machine/sugar/commands/verify' },
    //         {
    //           title: 'withdraw',
    //           href: '/core-candy-machine/sugar/commands/withdraw',
    //         },
    //       ],
    //     },
    //     {
    //       title: 'References',
    //       links: [
    //         {
    //           title: 'Bring Your Own Uploader',
    //           href: '/core-candy-machine/sugar/bring-your-own-uploader',
    //         },
    //       ],
    //     },
    //   ],
    // },

    {
      ...referencesSection('core-candy-machine'),
      href: `https://mpl-core-candy-machine.typedoc.metaplex.com/`,
      title: 'Javascript API References',
      icon: 'JavaScript',
      target: '_blank',
    },
    {
      ...referencesSection('core-candy-machine'),
      title: 'Rust API References',
      icon: 'Rust',
      href: `https://docs.rs/mpl-core-candy-machine-core/`,
      target: '_blank',
    },
  ],
  localizedNavigation: {
    en: {
      headline: 'Core Asset launchpad',
      description: 'Launch your next MPL Core Asset collection on Solana.',
      sections: {
        'Introduction': 'Introduction',
        'SDK': 'SDK',
        'Core Candy Machine': 'Core Candy Machine',
        'Available Guards': 'Available Guards',
        'Custom Guards': 'Custom Guards',
        'General': 'General'
      },
      links: {
        'Overview': 'Overview',
        'Javascript SDK': 'Javascript SDK',
        'Rust SDK': 'Rust SDK',
        'Anti-Bot Protection Best Practices': 'Anti-Bot Protection Best Practices',
        'Candy Guards': 'Candy Guards',
        'Preparing Assets': 'Preparing Assets',
        'Creating a Candy Machine': 'Creating a Candy Machine',
        'Inserting Items': 'Inserting Items',
        'Updating a Candy Machine and Guards': 'Updating a Candy Machine and Guards',
        'Guard Groups and Phases': 'Guard Groups and Phases',
        'Special Guard Instructions': 'Special Guard Instructions',
        'Fetching a Candy Machine': 'Fetching a Candy Machine',
        'Minting from a Candy Machine': 'Minting from a Candy Machine',
        'Withdrawing a Candy Machine': 'Withdrawing a Candy Machine',
        'Generating Client': 'Generating Client',
        'Create a Website for minting Assets from your Core Candy Machine': 'Create a Website for minting Assets from your Core Candy Machine',
        'Create a Core Candy Machine with Hidden Settings': 'Create a Core Candy Machine with Hidden Settings'
      }
    },
    ja: {
      headline: 'Core Assetローンチパッド',
      description: 'Solana上で次のMPL Core Assetコレクションを立ち上げましょう。',
      sections: {
        'Introduction': '紹介',
        'SDK': 'SDK',
        'Core Candy Machine': 'Core Candy Machine',
        'Available Guards': '利用可能なガード',
        'Custom Guards': 'カスタムガード',
        'General': '一般'
      },
      links: {
        'Overview': '概要',
        'Javascript SDK': 'JavaScript SDK',
        'Rust SDK': 'Rust SDK',
        'Anti-Bot Protection Best Practices': 'アンチボット保護のベストプラクティス',
        'Candy Guards': 'キャンディガード',
        'Preparing Assets': 'アセットの準備',
        'Creating a Candy Machine': 'キャンディマシンの作成',
        'Inserting Items': 'アイテムの挿入',
        'Updating a Candy Machine and Guards': 'キャンディマシンとガードの更新',
        'Guard Groups and Phases': 'ガードグループとフェーズ',
        'Special Guard Instructions': '特別なガード命令',
        'Fetching a Candy Machine': 'キャンディマシンの取得',
        'Minting from a Candy Machine': 'キャンディマシンからのミント',
        'Withdrawing a Candy Machine': 'キャンディマシンの引き出し',
        'Generating Client': 'クライアントの生成',
        'Create a Website for minting Assets from your Core Candy Machine': 'Core Candy MachineからアセットをミントするWebサイトの作成',
        'Create a Core Candy Machine with Hidden Settings': '隠し設定でCore Candy Machineを作成'
      }
    },
    ko: {
      headline: 'Core Asset 런치패드',
      description: '솔라나에서 다음 MPL Core Asset 컬렉션을 출시하세요.',
      sections: {
        'Introduction': '소개',
        'SDK': 'SDK',
        'Core Candy Machine': 'Core Candy Machine',
        'Available Guards': '사용 가능한 가드',
        'Custom Guards': '커스텀 가드',
        'General': '일반'
      },
      links: {
        'Overview': '개요',
        'Javascript SDK': 'JavaScript SDK',
        'Rust SDK': 'Rust SDK',
        'Anti-Bot Protection Best Practices': '안티 봇 보호 베스트 프랙티스',
        'Candy Guards': '캔디 가드',
        'Preparing Assets': '자산 준비',
        'Creating a Candy Machine': '캔디 머신 생성',
        'Inserting Items': '아이템 삽입',
        'Updating a Candy Machine and Guards': '캔디 머신 및 가드 업데이트',
        'Guard Groups and Phases': '가드 그룹 및 단계',
        'Special Guard Instructions': '특별 가드 명령',
        'Fetching a Candy Machine': '캔디 머신 가져오기',
        'Minting from a Candy Machine': '캔디 머신에서 민팅',
        'Withdrawing a Candy Machine': '캔디 머신 인출',
        'Generating Client': '클라이언트 생성',
        'Create a Website for minting Assets from your Core Candy Machine': 'Core Candy Machine에서 자산을 민팅하는 웹사이트 만들기',
        'Create a Core Candy Machine with Hidden Settings': '숨겨진 설정으로 Core Candy Machine 만들기'
      }
    }
  }
}
