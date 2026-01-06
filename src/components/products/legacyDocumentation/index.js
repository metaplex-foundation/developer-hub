import {
  changelogSection,
  documentationSection,
  recipesSection,
  referencesSection,
} from '@/shared/sections'
import { Hero } from './Hero'
import { ClockIcon } from '@heroicons/react/24/solid'

export const legacyDocumentation = {
  name: 'Legacy',
  headline: 'Products from our old docs',
  description: 'A collection of documentation of older Programs and Tools which might not be used anymore or deprecated. Migrated from our old docs for documentation for completeness.',
  path: 'legacy-documentation',
  navigationMenuCatergory: 'Dev Tools',
  icon: <ClockIcon />,
  github: '',
  className: 'accent-green',
  sections: [
    {
      ...documentationSection('legacy-documentation'),
      navigation: [
        {
          title: 'Auction House',
          links: [
            { title: 'Overview', href: '/legacy-documentation/auction-house' },
            { title: 'Getting Started', href: '/legacy-documentation/auction-house/getting-started' },
            { title: 'Auction House Settings', href: '/legacy-documentation/auction-house/settings' },
            { title: 'Managing Auction Houses', href: '/legacy-documentation/auction-house/manage' },
            { title: 'Trading Assets', href: '/legacy-documentation/auction-house/trading-assets' },
            { title: 'Managing Buyer Escrow Account', href: '/legacy-documentation/auction-house/buyer-escrow' },
            { title: 'Auction House Receipts', href: '/legacy-documentation/auction-house/receipts' },
            { title: 'Finding Bids, listings, sales', href: '/legacy-documentation/auction-house/find' },
            { title: 'How to manage Auction House using CLI', href: '/legacy-documentation/auction-house/manage-using-cli' },
            { title: 'Timed Auctions with Auctioneers', href: '/legacy-documentation/auction-house/auctioneer' },
            { title: 'FAQ', href: '/legacy-documentation/auction-house/faq' },
          ],
        },
        {
          title: 'Developer Tools',
          links: [
            {
              title: 'Solita',
              href: '/legacy-documentation/developer-tools/solita',
            },
            {
              title: 'Beet',
              href: '/legacy-documentation/developer-tools/beet',
            },
            {
              title: 'Cusper',
              href: '/legacy-documentation/developer-tools/cusper',
            },
            {
              title: 'Rust Bin',
              href: '/legacy-documentation/developer-tools/rust-bin',
            },
          ],
        },
        {
          title: 'Fixed Price Sale',
          links: [
            {
              title: 'Introduction',
              href: '/legacy-documentation/fixed-price-sale',
            },
            {
              title: 'Overview',
              href: '/legacy-documentation/fixed-price-sale/tech-description',
            },
          ],
        },
        {
          title: 'Gumdrop',
          links: [
            {
              title: 'Overview',
              href: '/legacy-documentation/gumdrop',
            },
          ],
        },
        {
          title: 'Mobile SDKs',
          links: [
            {
              title: 'Android SDK',
              href: '/legacy-documentation/mobile-sdks/android',
            },
            {
              title: 'iOS SDK',
              href: '/legacy-documentation/mobile-sdks/ios',
            },
          ],
        },
        {
          title: 'Token Entangler',
          links: [
            {
              title: 'Overview',
              href: '/legacy-documentation/token-entangler',
            },
          ],
        },
      ],
    },
  ],
  localizedNavigation: {
    en: {
      headline: 'Products from our old docs',
      description: 'A collection of documentation of older Programs and Tools which might not be used anymore or deprecated. Migrated from our old docs for documentation for completeness.',
      sections: {
        'Auction House': 'Auction House',
        'Developer Tools': 'Developer Tools',
        'Fixed Price Sale': 'Fixed Price Sale',
        'Gumdrop': 'Gumdrop',
        'Mobile SDKs': 'Mobile SDKs',
        'Token Entangler': 'Token Entangler',
      },
      links: {
        'Overview': 'Overview',
        'Getting Started': 'Getting Started',
        'Auction House Settings': 'Auction House Settings',
        'Managing Auction Houses': 'Managing Auction Houses',
        'Trading Assets': 'Trading Assets',
        'Managing Buyer Escrow Account': 'Managing Buyer Escrow Account',
        'Auction House Receipts': 'Auction House Receipts',
        'Finding Bids, listings, sales': 'Finding Bids, listings, sales',
        'How to manage Auction House using CLI': 'How to manage Auction House using CLI',
        'Timed Auctions with Auctioneers': 'Timed Auctions with Auctioneers',
        'FAQ': 'FAQ',
        'Solita': 'Solita',
        'Beet': 'Beet',
        'Cusper': 'Cusper',
        'Rust Bin': 'Rust Bin',
        'Introduction': 'Introduction',
        'Android SDK': 'Android SDK',
        'iOS SDK': 'iOS SDK',
      }
    },
    ja: {
      headline: '旧ドキュメントの製品',
      description: '現在使用されていないか非推奨の古いプログラムやツールのドキュメントコレクション。完全性のために旧ドキュメントから移行。',
      sections: {
        'Auction House': 'Auction House',
        'Developer Tools': '開発者ツール',
        'Fixed Price Sale': 'Fixed Price Sale',
        'Gumdrop': 'Gumdrop',
        'Mobile SDKs': 'モバイルSDK',
        'Token Entangler': 'Token Entangler',
      },
      links: {
        'Overview': '概要',
        'Getting Started': 'はじめに',
        'Auction House Settings': 'Auction House設定',
        'Managing Auction Houses': 'Auction Houseの管理',
        'Trading Assets': 'アセットの取引',
        'Managing Buyer Escrow Account': '購入者エスクローアカウントの管理',
        'Auction House Receipts': 'Auction Houseレシート',
        'Finding Bids, listings, sales': '入札、リスティング、販売の検索',
        'How to manage Auction House using CLI': 'CLIを使用したAuction Houseの管理方法',
        'Timed Auctions with Auctioneers': 'Auctioneersを使用した時間制オークション',
        'FAQ': 'よくある質問',
        'Solita': 'Solita',
        'Beet': 'Beet',
        'Cusper': 'Cusper',
        'Rust Bin': 'Rust Bin',
        'Introduction': '紹介',
        'Android SDK': 'Android SDK',
        'iOS SDK': 'iOS SDK',
      }
    },
    ko: {
      headline: '기존 문서의 제품',
      description: '더 이상 사용되지 않거나 사용되지 않을 수 있는 이전 프로그램 및 도구의 문서 모음입니다. 완전성을 위해 기존 문서에서 마이그레이션되었습니다.',
      sections: {
        'Auction House': 'Auction House',
        'Developer Tools': '개발자 도구',
        'Fixed Price Sale': 'Fixed Price Sale',
        'Gumdrop': 'Gumdrop',
        'Mobile SDKs': '모바일 SDK',
        'Token Entangler': 'Token Entangler',
      },
      links: {
        'Overview': '개요',
        'Getting Started': '시작하기',
        'Auction House Settings': 'Auction House 설정',
        'Managing Auction Houses': 'Auction House 관리',
        'Trading Assets': '에셋 거래',
        'Managing Buyer Escrow Account': '구매자 에스크로 계정 관리',
        'Auction House Receipts': 'Auction House 영수증',
        'Finding Bids, listings, sales': '입찰, 리스팅, 판매 찾기',
        'How to manage Auction House using CLI': 'CLI를 사용한 Auction House 관리 방법',
        'Timed Auctions with Auctioneers': 'Auctioneers를 사용한 시간제 경매',
        'FAQ': '자주 묻는 질문',
        'Solita': 'Solita',
        'Beet': 'Beet',
        'Cusper': 'Cusper',
        'Rust Bin': 'Rust Bin',
        'Introduction': '소개',
        'Android SDK': 'Android SDK',
        'iOS SDK': 'iOS SDK',
      }
    },
    zh: {
      headline: '旧文档产品',
      description: '可能不再使用或已弃用的旧程序和工具文档集合。为完整性从旧文档迁移而来。',
      sections: {
        'Auction House': 'Auction House',
        'Developer Tools': '开发者工具',
        'Fixed Price Sale': 'Fixed Price Sale',
        'Gumdrop': 'Gumdrop',
        'Mobile SDKs': '移动SDK',
        'Token Entangler': 'Token Entangler',
      },
      links: {
        'Overview': '概述',
        'Getting Started': '快速入门',
        'Auction House Settings': 'Auction House设置',
        'Managing Auction Houses': '管理Auction House',
        'Trading Assets': '交易资产',
        'Managing Buyer Escrow Account': '管理买家托管账户',
        'Auction House Receipts': 'Auction House收据',
        'Finding Bids, listings, sales': '查找出价、列表、销售',
        'How to manage Auction House using CLI': '如何使用CLI管理Auction House',
        'Timed Auctions with Auctioneers': '使用Auctioneers进行定时拍卖',
        'FAQ': '常见问题',
        'Solita': 'Solita',
        'Shank': 'Shank',
        'Beet': 'Beet',
        'Cusper': 'Cusper',
        'Rust Bin': 'Rust Bin',
        'Introduction': '简介',
        'Android SDK': 'Android SDK',
        'iOS SDK': 'iOS SDK',
      }
    }
  }
}
