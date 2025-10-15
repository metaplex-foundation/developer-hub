import {
  documentationSection,
  guidesSection,
  referencesSection
} from '@/shared/sections'
import { CodeBracketSquareIcon } from '@heroicons/react/24/solid'
import { Hero } from './Hero'

export const umi = {
  name: 'Umi',
  headline: 'Client wrapper',
  description: 'A collection of core programs for your applications.',
  navigationMenuCatergory: 'Dev Tools',
  path: 'umi',
  icon: <CodeBracketSquareIcon />,
  github: 'https://github.com/metaplex-foundation/umi',
  className: 'accent-pink',
  heroes: [{ path: '/umi', component: Hero }],
  sections: [
    {
      ...documentationSection('umi'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/umi' },
            { 
              title: 'Getting Started', 
              href: '/umi/getting-started' },
            {
              title: 'Metaplex Umi Plugins',
              href: '/umi/metaplex-umi-plugins',
            },
            { title: 'Web3js Differences and Adapters', 
              href: '/umi/web3js-differences-and-adapters' 
            },
            { title: '@solana/kit Adapters', 
              href: '/umi/kit-adapters' 
            },
          ],
        },
        {
          title: 'Features',
          links: [
            { title: 'Accounts', href: '/umi/accounts' },
            { title: 'Helpers', href: '/umi/helpers' },
            { title: 'HTTP Requests', href: '/umi/http-requests' },
            { title: 'Interfaces', href: '/umi/interfaces' },
            { title: 'Implementations', href: '/umi/implementations' },
            { title: 'Kinobi', href: '/umi/kinobi' },
            { title: 'Plugins', href: '/umi/plugins' },
            { title: 'Programs', href: '/umi/programs' },
            {
              title: 'PublicKeys and Signers',
              href: '/umi/public-keys-and-signers',
            },
            { title: 'RPC', href: '/umi/rpc' },
            { title: 'Serializers', href: '/umi/serializers' },
            { title: 'Storage', href: '/umi/storage' },
            { title: 'Transactions', href: '/umi/transactions' },
          ],
        },
        {
          title: 'Toolbox',
          links: [
            { 
              title: 'Overview', 
              href: '/umi/toolbox' 
            },
            { 
              title: 'Create Account', 
              href: '/umi/toolbox/create-account' },
            {
              title: 'Transfer Sol',
              href: '/umi/toolbox/transfer-sol',
            },
            {
              title: 'Token Managment',
              href: '/umi/toolbox/token-managment',
            },
            { 
              title: 'Priority Fees and Compute Managment', 
              href: '/umi/toolbox/priority-fees-and-compute-managment' },
            {
              title: 'Address Lookup Table',
              href: '/umi/toolbox/address-lookup-table',
            },
            { 
              title: 'Transaction Memo', 
              href: '/umi/toolbox/transaction-memo' },
          ],
        },
      ],
    },
    {
      ...guidesSection('umi'),
      navigation: [
        {
          title: 'Guides',
          links: [
            {
              title: 'Optimal transaction landing',
              href: '/umi/guides/optimal-transactions-with-compute-units-and-priority-fees',
              created: '2024-12-01',
              updated: null, // null means it's never been updated
            },
            {
              title: 'Serializing and Deserializing Transactions',
              href: '/umi/guides/serializing-and-deserializing-transactions',
              created: '2024-08-04',
              updated: null, // null means it's never been updated
            },
          ],
        },
      ],
    },
    {
      ...referencesSection('umi'),
      href: `https://umi.typedoc.metaplex.com/`,
      target: '_blank',
    },

  ],
  localizedNavigation: {
    en: {
      headline: 'Client wrapper',
      description: 'A collection of core programs for your applications.',
      sections: {
        'Introduction': 'Introduction',
        'Features': 'Features',
        'Toolbox': 'Toolbox',
        'Guides': 'Guides'
      },
      links: {
        'Overview': 'Overview',
        'Getting Started': 'Getting Started',
        'Metaplex Umi Plugins': 'Metaplex Umi Plugins',
        'Web3js Differences and Adapters': 'Web3js Differences and Adapters',
        '@solana/kit Adapters': '@solana/kit Adapters',
        'Accounts': 'Accounts',
        'Helpers': 'Helpers',
        'HTTP Requests': 'HTTP Requests',
        'Interfaces': 'Interfaces',
        'Implementations': 'Implementations',
        'Kinobi': 'Kinobi',
        'Plugins': 'Plugins',
        'Programs': 'Programs',
        'PublicKeys and Signers': 'PublicKeys and Signers',
        'Create Account': 'Create Account',
        'Transfer Sol': 'Transfer Sol',
        'Token Managment': 'Token Managment',
        'Priority Fees and Compute Managment': 'Priority Fees and Compute Managment',
        'Address Lookup Table': 'Address Lookup Table',
        'Transaction Memo': 'Transaction Memo',
        'Optimal transaction landing': 'Optimal transaction landing',
        'Serializing and Deserializing Transactions': 'Serializing and Deserializing Transactions',
        'RPC': 'RPC',
        'Serializers': 'Serializers',
        'Storage': 'Storage',
        'Transactions': 'Transactions'
      }
    },
    ja: {
      headline: 'クライアントラッパー',
      description: 'アプリケーション用のコアプログラムのコレクション。',
      sections: {
        'Introduction': '紹介',
        'Features': '機能',
        'Toolbox': 'ツールボックス',
        'Guides': 'ガイド'
      },
      links: {
        'Overview': '概要',
        'Getting Started': 'はじめに',
        'Metaplex Umi Plugins': 'Metaplex Umiプラグイン',
        'Web3js Differences and Adapters': 'Web3jsの違いとアダプター',
        '@solana/kit Adapters': '@solana/kitアダプター',
        'Accounts': 'アカウント',
        'Helpers': 'ヘルパー',
        'HTTP Requests': 'HTTPリクエスト',
        'Interfaces': 'インターフェース',
        'Implementations': '実装',
        'Kinobi': 'Kinobi',
        'Plugins': 'プラグイン',
        'Programs': 'プログラム',
        'PublicKeys and Signers': '公開鍵と署名者',
        'RPC': 'RPC',
        'Serializers': 'シリアライザー',
        'Storage': 'ストレージ',
        'Transactions': 'トランザクション',
        'Create Account': 'アカウント作成',
        'Transfer Sol': 'Sol転送',
        'Token Managment': 'トークン管理',
        'Priority Fees and Compute Managment': 'プライオリティ手数料とコンピュート管理',
        'Address Lookup Table': 'アドレスルックアップテーブル',
        'Transaction Memo': 'トランザクションメモ',
        'Optimal transaction landing': '最適なトランザクション着地',
        'Serializing and Deserializing Transactions': 'トランザクションのシリアライズとデシリアライズ'
      }
    },
    ko: {
      headline: '클라이언트 래퍼',
      description: '애플리케이션을 위한 핵심 프로그램 모음집입니다.',
      sections: {
        'Introduction': '소개',
        'Features': '기능',
        'Toolbox': '툴박스',
        'Guides': '가이드'
      },
      links: {
        'Overview': '개요',
        'Getting Started': '시작하기',
        'Metaplex Umi Plugins': 'Metaplex Umi 플러그인',
        'Web3js Differences and Adapters': 'Web3js 차이점 및 어댑터',
        '@solana/kit Adapters': '@solana/kit 어댑터',
        'Accounts': '계정',
        'Helpers': '헬퍼',
        'HTTP Requests': 'HTTP 요청',
        'Interfaces': '인터페이스',
        'Implementations': '구현',
        'Kinobi': 'Kinobi',
        'Plugins': '플러그인',
        'Programs': '프로그램',
        'PublicKeys and Signers': '공개 키 및 서명자',
        'RPC': 'RPC',
        'Serializers': '시리얼라이저',
        'Storage': '스토리지',
        'Transactions': '트랜잭션',
        'Create Account': '계정 생성',
        'Transfer Sol': 'Sol 전송',
        'Token Managment': '토큰 관리',
        'Priority Fees and Compute Managment': '우선 수수료 및 컴퓨트 관리',
        'Address Lookup Table': '주소 조회 테이블',
        'Transaction Memo': '트랜잭션 메모',
        'Optimal transaction landing': '최적의 트랜잭션 착지',
        'Serializing and Deserializing Transactions': '트랜잭션 직렬화 및 역직렬화'
      }
    }
  }
}
