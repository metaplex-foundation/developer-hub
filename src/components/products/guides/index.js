import { documentationSection } from '@/shared/sections';
import { BookOpenIcon } from '@heroicons/react/24/outline';

export const guides = {
  name: 'Guides',
  headline: 'Guides for the Solana Blockchain',
  description: 'Guides for the Solana Blockchain.',
  path: 'guides',
  navigationMenuCatergory: 'Guides',
  icon: <BookOpenIcon className="text-green-500" />,
  github: 'https://github.com/metaplex-foundation/mpl-core',
  className: 'accent-green',
  sections: [
    {
      ...documentationSection('guides'),
      navigation: [
        {
          title: 'Solana Basics',
          links: [
            {
              title: 'What is Solana?',
              href: '/guides/what-is-solana',
              created: '2021-10-01',
              updated: null, // null means it's never been updated
            },
            {
              title: 'Validators and Staking',
              href: '/guides/validators',
              created: '2021-10-01',
              updated: null, // null means it's never been updated
            },
            {
              title: 'RPCs and DAS',
              href: '/guides/rpcs-and-das',
              created: '2021-10-01',
              updated: null, // null means it's never been updated
            },
            {
              title: 'Solana Programs',
              href: '/guides/solana-programs',
              created: '2021-10-01',
              updated: null, // null means it's never been updated
            },
            {
              title: 'Understanding PDAs',
              href: '/guides/understanding-pdas',
              created: '2021-10-01',
              updated: null, // null means it's never been updated
            },
            {
              title: 'Setup a Local Validator',
              href: '/guides/setup-a-local-validator',
              created: '2021-11-6',
              updated: null, // null means it's never been updated
            },
            {
              title: 'How to Diagnose Transaction Errors on Solana',
              href: '/guides/general/how-to-diagnose-solana-transaction-errors',
              created: '2024-08-29',
              updated: null, // null means it's never been updated
            },
          ],
        },
        {
          title: 'General',
          links: [
            {
              title: 'Creating an NFT Collection With Candy Machine',
              href: '/candy-machine/guides/create-an-nft-collection-on-solana-with-candy-machine',
            },
            {
              title: 'Create deterministic Metadata with Turbo',
              href: '/guides/general/create-deterministic-metadata-with-turbo',
            },
            {
              title: 'The Payer-Authority Pattern',
              href: '/guides/general/payer-authority-pattern',
            },
            {
              title: 'Create a claim based airdrop using Gumdrop',
              href: '/guides/general/spl-token-claim-airdrop-using-gumdrop',
              created: '2025-01-06',
              updated: null, // null means it's never been updated
            }
          ]
        },
        {
          title: 'Javascript',
          links: [
            {
              title: 'Creating an NFT',
              href: '/guides/javascript/how-to-create-an-nft-on-solana',
              created: '06-24-2024',
              updated: null, // null means it's never been updated
            },
            {
              title: 'How to Create a Solana Token',
              href: '/guides/javascript/how-to-create-a-solana-token',
              created: '2024-06-16',
              updated: null, // null means it's never been updated
            },
            {
              title: 'How to Add Metadata to a Solana Token',
              href: '/guides/javascript/how-to-add-metadata-to-spl-tokens',
              created: '2024-10-01',
              updated: null, // null means it's never been updated
            },
            {
              title: 'Transferring Tokens',
              href: '/guides/javascript/how-to-transfer-spl-tokens-on-solana',
              created: '2024-06-16',
              updated: '06-22-2024', // null means it's never been updated
            },
            {
              title: 'Transferring SOL',
              href: '/guides/javascript/how-to-transfer-sol-on-solana',
              created: '2024-06-16',
              updated: null, // null means it's never been updated
            },
            {
              title: 'Optimal transaction landing using umi',
              href: '/umi/guides/optimal-transactions-with-compute-units-and-priority-fees',
              created: '2024-12-01',
              updated: null, // null means it's never been updated
            },
            {
              title: 'Serializing and Deserializing Transactions',
              href: '/umi/guides/serializing-and-deserializing-transactions',
            }
          ],
        },
        {
          title: 'Rust',
          links: [
            {
              title: 'Getting Started with Rust',
              href: '/guides/rust/getting-started-with-rust',
              created: '2021-10-01',
              updated: null, // null means it's never been updated
            },
            {
              title: 'Metaplex Rust SDKs',
              href: '/guides/rust/metaplex-rust-sdks',
              created: '07-01-2024',
              updated: null, // null means it's never been updated
            },
            {
              title: 'CPI into a Metaplex Program',
              href: '/guides/rust/how-to-cpi-into-a-metaplex-program',
              created: '07-01-2024',
              updated: null, // null means it's never been updated
            },
          ],
        },
        {
          title: 'Templates',
          links: [
            {
              title: 'NextJs Template',
              href: '/guides/templates/metaplex-nextjs-tailwind-template',
              created: '2024-09-04',
              updated: null, // null means it's never been updated
            },
            {
              title: 'MPL-404 Hybrid UI Template',
              href: '/mpl-hybrid/guides/mpl-404-hybrid-ui-template',
              created: '2024-12-16',
              updated: null, // null means it's never been updated
            },
          ],
        },
        {
          title: 'Metaplex Program Guides',
          links: [
            {
              title: 'Bubblegum',
              href: '/bubblegum/guides/',
              created: '2024-11-13',
              updated: null, // null means it's never been updated
            },
            {
              title: 'Core',
              href: '/core/guides/',
              created: '2021-10-01',
              updated: null, // null means it's never been updated
            },
            {
              title: 'Candy Machine',
              href: '/candy-machine/guides/',
              created: '2021-10-01',
              updated: null, // null means it's never been updated
            },
            {
              title: 'Core Candy Machine',
              href: '/core-candy-machine/guides/',
              created: '2024-09-20',
              updated: null, // null means it's never been updated
            },
            {
              title: 'MPL-Hybrid / MPL-404',
              href: '/mpl-hybrid/guides',
              created: '2025-01-06',
              updated: null, // null means it's never been updated
            },
          ],
        },
        {
          title: 'Translated Guides',
          links: [
            {
              title: 'Japanese 日本語',
              href: '/guides/translated/japanese',
              created: '2024-08-14',
              updated: null, // null means it's never been updated
            },
          ],
        },
      ],
    },
  ],
  localizedNavigation: {
    en: {
      headline: 'Guides for the Solana Blockchain',
      description: 'Guides for the Solana Blockchain.',
      sections: {
        'Solana Basics': 'Solana Basics',
        'General': 'General',
        'Javascript': 'Javascript',
        'Rust': 'Rust',
        'Templates': 'Templates',
        'Metaplex Program Guides': 'Metaplex Program Guides',
        'Translated Guides': 'Translated Guides'
      },
      links: {
        'What is Solana?': 'What is Solana?',
        'Validators and Staking': 'Validators and Staking',
        'RPCs and DAS': 'RPCs and DAS',
        'Solana Programs': 'Solana Programs',
        'Understanding PDAs': 'Understanding PDAs',
        'Setup a Local Validator': 'Setup a Local Validator',
        'How to Diagnose Transaction Errors on Solana': 'How to Diagnose Transaction Errors on Solana',
        'Creating an NFT Collection With Candy Machine': 'Creating an NFT Collection With Candy Machine',
        'Create deterministic Metadata with Turbo': 'Create deterministic Metadata with Turbo',
        'The Payer-Authority Pattern': 'The Payer-Authority Pattern',
        'Create a claim based airdrop using Gumdrop': 'Create a claim based airdrop using Gumdrop',
        'Creating an NFT': 'Creating an NFT',
        'How to Create a Solana Token': 'How to Create a Solana Token',
        'How to Add Metadata to a Solana Token': 'How to Add Metadata to a Solana Token',
        'Transferring Tokens': 'Transferring Tokens',
        'Transferring SOL': 'Transferring SOL',
        'Optimal transaction landing using umi': 'Optimal transaction landing using umi',
        'Serializing and Deserializing Transactions': 'Serializing and Deserializing Transactions',
        'Getting Started with Rust': 'Getting Started with Rust',
        'Metaplex Rust SDKs': 'Metaplex Rust SDKs',
        'CPI into a Metaplex Program': 'CPI into a Metaplex Program',
        'NextJs Template': 'NextJs Template',
        'MPL-404 Hybrid UI Template': 'MPL-404 Hybrid UI Template',
        'Bubblegum': 'Bubblegum',
        'Core': 'Core',
        'Candy Machine': 'Candy Machine',
        'Core Candy Machine': 'Core Candy Machine',
        'MPL-Hybrid / MPL-404': 'MPL-Hybrid / MPL-404',
        'Japanese 日本語': 'Japanese 日本語'
      }
    },
    ja: {
      headline: 'Solanaブロックチェーンのガイド',
      description: 'Solanaブロックチェーンのガイド。',
      sections: {
        'Solana Basics': 'Solanaの基本',
        'General': '一般',
        'Javascript': 'JavaScript',
        'Rust': 'Rust',
        'Templates': 'テンプレート',
        'Metaplex Program Guides': 'Metaplexプログラムガイド',
        'Translated Guides': '翻訳ガイド'
      },
      links: {
        'What is Solana?': 'Solanaとは？',
        'Validators and Staking': 'バリデーターとステーキング',
        'RPCs and DAS': 'RPCとDAS',
        'Solana Programs': 'Solanaプログラム',
        'Understanding PDAs': 'PDAの理解',
        'Setup a Local Validator': 'ローカルバリデーターのセットアップ',
        'How to Diagnose Transaction Errors on Solana': 'Solanaでトランザクションエラーを診断する方法',
        'Creating an NFT Collection With Candy Machine': 'Candy MachineでNFTコレクションを作成',
        'Create deterministic Metadata with Turbo': 'Turboで決定論的メタデータを作成',
        'The Payer-Authority Pattern': 'Payer-Authorityパターン',
        'Create a claim based airdrop using Gumdrop': 'Gumdropを使用したクレームベースのエアドロップを作成',
        'Creating an NFT': 'NFTの作成',
        'How to Create a Solana Token': 'Solanaトークンの作成方法',
        'How to Add Metadata to a Solana Token': 'Solanaトークンにメタデータを追加する方法',
        'Transferring Tokens': 'トークンの転送',
        'Transferring SOL': 'SOLの転送',
        'Optimal transaction landing using umi': 'Umiを使用した最適なトランザクション着地',
        'Serializing and Deserializing Transactions': 'トランザクションのシリアライズとデシリアライズ',
        'Getting Started with Rust': 'Rustを始める',
        'Metaplex Rust SDKs': 'Metaplex Rust SDK',
        'CPI into a Metaplex Program': 'MetaplexプログラムへのCPI',
        'NextJs Template': 'NextJSテンプレート',
        'MPL-404 Hybrid UI Template': 'MPL-404ハイブリッドUIテンプレート',
        'Bubblegum': 'Bubblegum',
        'Core': 'Core',
        'Candy Machine': 'Candy Machine',
        'Core Candy Machine': 'Core Candy Machine',
        'MPL-Hybrid / MPL-404': 'MPL-Hybrid / MPL-404',
        'Japanese 日本語': '日本語'
      }
    },
    ko: {
      headline: 'Solana 블록체인 가이드',
      description: 'Solana 블록체인을 위한 가이드.',
      sections: {
        'Solana Basics': 'Solana 기초',
        'General': '일반',
        'Javascript': 'JavaScript',
        'Rust': 'Rust',
        'Templates': '템플릿',
        'Metaplex Program Guides': 'Metaplex 프로그램 가이드',
        'Translated Guides': '번역된 가이드'
      },
      links: {
        'What is Solana?': 'Solana란 무엇인가?',
        'Validators and Staking': '검증자와 스테이킹',
        'RPCs and DAS': 'RPC와 DAS',
        'Solana Programs': 'Solana 프로그램',
        'Understanding PDAs': 'PDA 이해하기',
        'Setup a Local Validator': '로컬 검증자 설정',
        'How to Diagnose Transaction Errors on Solana': 'Solana에서 트랜잭션 오류 진단 방법',
        'Creating an NFT Collection With Candy Machine': 'Candy Machine으로 NFT 컬렉션 생성',
        'Create deterministic Metadata with Turbo': 'Turbo로 결정론적 메타데이터 생성',
        'The Payer-Authority Pattern': 'Payer-Authority 패턴',
        'Create a claim based airdrop using Gumdrop': 'Gumdrop을 사용한 클레임 기반 에어드롭 생성',
        'Creating an NFT': 'NFT 생성',
        'How to Create a Solana Token': 'Solana 토큰 생성 방법',
        'How to Add Metadata to a Solana Token': 'Solana 토큰에 메타데이터 추가하는 방법',
        'Transferring Tokens': '토큰 전송',
        'Transferring SOL': 'SOL 전송',
        'Optimal transaction landing using umi': 'Umi를 사용한 최적의 트랜잭션 착지',
        'Serializing and Deserializing Transactions': '트랜잭션 직렬화 및 역직렬화',
        'Getting Started with Rust': 'Rust 시작하기',
        'Metaplex Rust SDKs': 'Metaplex Rust SDK',
        'CPI into a Metaplex Program': 'Metaplex 프로그램으로 CPI',
        'NextJs Template': 'NextJS 템플릿',
        'MPL-404 Hybrid UI Template': 'MPL-404 하이브리드 UI 템플릿',
        'Bubblegum': 'Bubblegum',
        'Core': 'Core',
        'Candy Machine': 'Candy Machine',
        'Core Candy Machine': 'Core Candy Machine',
        'MPL-Hybrid / MPL-404': 'MPL-Hybrid / MPL-404',
        'Japanese 日本語': '일본어 日本語'
      }
    }
  }
}
