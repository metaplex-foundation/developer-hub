import {
  changelogSection,
  documentationSection,
  guidesSection,
  referencesSection,
} from '@/shared/sections';
import { StopCircleIcon } from '@heroicons/react/24/solid';
import { Hero } from './Hero';

export const core = {
  name: 'Core',
  headline: 'Next gen NFT standard',
  description: 'Next generation Solana NFT standard.',
  navigationMenuCatergory: 'MPL',
  path: 'core',
  icon: <StopCircleIcon />,
  github: 'https://github.com/metaplex-foundation/mpl-core',
  className: 'accent-green',
  heroes: [{ path: '/core', component: Hero }],
  sections: [
    {
      ...documentationSection('core'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            {
              title: 'Overview',
              href: '/core',
            },
            {
              title: 'What is an Asset?',
              href: '/core/what-is-an-asset',
            },
            {
              title: 'JSON Schema',
              href: '/core/json-schema',
            },
            {
              title: 'Token Metadata Differences',
              href: '/core/tm-differences',
            },
            {
              title: 'Ecosystem Support',
              href: '/core/ecosystem-support',
            },
            {
              title: 'Anchor',
              href: '/core/using-core-in-anchor',
            },
            {
              title: 'FAQ',
              href: '/core/faq',
            },
          ],
        },
        {
          title: 'SDK',
          links: [
            {
              title: 'Javascript SDK',
              href: '/core/sdk/javascript',
            },
            {
              title: 'Rust SDK',
              href: '/core/sdk/rust',
            },
          ],
        },
        {
          title: 'Features',
          links: [
            {
              title: 'Creating Assets',
              href: '/core/create-asset',
            },
            {
              title: 'Fetching Assets',
              href: '/core/fetch',
            },
            {
              title: 'Updating Assets',
              href: '/core/update',
            },
            {
              title: 'Transferring Assets',
              href: '/core/transfer',
            },
            {
              title: 'Burning Assets',
              href: '/core/burn',
            },
            {
              title: 'Collection Management',
              href: '/core/collections',
            },
            {
              title: 'Execute Asset Signing',
              href: '/core/execute-asset-signing',
            },
            {
              title: 'Helpers',
              href: '/core/helpers',
            },
            {
              title: 'Deserializing Assets',
              href: '/core/deserialization',
            },
          ],
        },
        {
          title: 'Plugins',
          links: [
            {
              title: 'Overview',
              href: '/core/plugins',
            },
            {
              title: 'Adding Plugins',
              href: '/core/plugins/adding-plugins',
            },
            {
              title: 'Updating Plugins',
              href: '/core/plugins/update-plugins',
            },
            {
              title: 'Removing Plugins',
              href: '/core/plugins/removing-plugins',
            },
            {
              title: 'Delegating and Revoking Plugins',
              href: '/core/plugins/delegating-and-revoking-plugins',
            },
            {
              title: 'Autograph Plugin',
              href: '/core/plugins/autograph',
            },
            {
              title: 'Transfer Delegate Plugin',
              href: '/core/plugins/transfer-delegate',
            },
            {
              title: 'Freeze Delegate Plugin',
              href: '/core/plugins/freeze-delegate',
            },
            {
              title: 'Freeze Execute Plugin',
              href: '/core/plugins/freeze-execute',
            },
            {
              title: 'Burn Delegate Plugin',
              href: '/core/plugins/burn-delegate',
            },
            {
              title: 'Royalties Plugin',
              href: '/core/plugins/royalties',
            },
            {
              title: 'Update Delegate Plugin',
              href: '/core/plugins/update-delegate',
              updated: '06-19-2024',
            },
            {
              title: 'Attribute Plugin',
              href: '/core/plugins/attribute',
            },
            {
              title: 'AddBlocker Plugin',
              href: '/core/plugins/addBlocker',
            },
            {
              title: 'Bubblegum Plugin',
              href: '/core/plugins/bubblegum',
            },
            {
              title: 'Edition Plugin',
              href: '/core/plugins/edition',
            },
            {
              title: 'Immutable Metadata Plugin',
              href: '/core/plugins/immutableMetadata',
            },
            {
              title: 'Master Edition Plugin',
              href: '/core/plugins/master-edition',
            },
            {
              title: 'Permanent Transfer Plugin',
              href: '/core/plugins/permanent-transfer-delegate',
            },
            {
              title: 'Permanent Freeze Delegate Plugin',
              href: '/core/plugins/permanent-freeze-delegate',
            },
            {
              title: 'Permanent Burn Delegate Plugin',
              href: '/core/plugins/permanent-burn-delegate',
            },
            {
              title: 'Verified Creators Plugin',
              href: '/core/plugins/verified-creators',
            },
          ],
        },
        {
          title: 'External Plugins',
          links: [
            { title: 'Overview', href: '/core/external-plugins/overview' },
            {
              title: 'Adding External Plugin Adapters',
              href: '/core/external-plugins/adding-external-plugins',
            },
            {
              title: 'Removing External Plugin Adapters',
              href: '/core/external-plugins/removing-external-plugins',
            },

            // {
            //   title: 'Removing External Plugins',
            //   href: '/core/plugins/removing-plugins',
            // },
            // {
            //   title: 'Delegating and Revoking External Plugins',
            //   href: '/core/plugins/delegating-and-revoking-plugins',
            // },
            {
              title: 'Oracle Plugin',
              href: '/core/external-plugins/oracle',
            },
            {
              title: 'AppData Plugin',
              href: '/core/external-plugins/app-data',
              created: '2024-06-19',
            },
          ],
        },
      ],
    },
    {
      ...guidesSection('core'),
      navigation: [
        {
          title: 'General',
          links: [
            {
              title: 'Overview',
              href: '/core/guides',
            },
            {
              title: 'Immutability',
              href: '/core/guides/immutability',
            },
            {
              title: 'Soulbound Assets',
              href: '/core/guides/create-soulbound-nft-asset',
              created: '2024-12-06',
              updated: null, // null means it's never been updated
            },
            {
              title: 'Print Editions',
              href: '/core/guides/print-editions',
            },
            {
              title: 'Oracle Plugin Example',
              href: '/core/guides/oracle-plugin-example',
            },
            {
              title: 'Appdata Plugin Example',
              href: '/core/guides/onchain-ticketing-with-appdata',
            },
          ],
        },
        {
          title: 'Javascript',
          links: [
            {
              title: 'How to Create a Core Asset with Javascript',
              href: '/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript',
            },
            {
              title: 'How to Create a Core Collection with JavaScript',
              href: '/core/guides/javascript/how-to-create-a-core-collection-with-javascript',
            },
            {
              title: 'Web2 typescript Staking Example',
              href: '/core/guides/javascript/web2-typescript-staking-example',
            },
          ],
        },
        {
          title: 'Program Concepts',
          links: [
            {
              title: 'Loyalty Card Concept Guide',
              href: '/core/guides/loyalty-card-concept-guide',
            },
          ],
        },
        {
          title: 'Anchor',
          links: [
            {
              title: 'How to Create a Core Asset with Anchor',
              href: '/core/guides/anchor/how-to-create-a-core-nft-asset-with-anchor',
            },
            {
              title: 'How to Create a Core Collection with Anchor',
              href: '/core/guides/anchor/how-to-create-a-core-collection-with-anchor',
            },
            {
              title: 'Anchor Staking Example',
              href: '/core/guides/anchor/anchor-staking-example',
            },
          ],
        },
      ],
    },
    {
      ...referencesSection('core'),
      href: `https://mpl-core.typedoc.metaplex.com/`,
      target: '_blank',
    },
  ],
  localizedNavigation: {
    en: {
      headline: 'Next gen NFT standard',
      description: 'Next generation Solana NFT standard.',
      sections: {
        'Introduction': 'Introduction',
        'SDK': 'SDK', 
        'Features': 'Features',
        'Plugins': 'Plugins',
        'External Plugins': 'External Plugins',
        'General': 'General',
        'JavaScript': 'JavaScript',
        'Program Concepts': 'Program Concepts',
        'Anchor': 'Anchor',
      },
      links: {
        'Overview': 'Overview',
        'What is an Asset?': 'What is an Asset?',
        'JSON Schema': 'JSON Schema', 
        'Token Metadata Differences': 'Token Metadata Differences',
        'Ecosystem Support': 'Ecosystem Support',
        'Anchor': 'Anchor',
        'FAQ': 'FAQ',
        'Javascript SDK': 'Javascript SDK',
        'Rust SDK': 'Rust SDK',
        'Creating Assets': 'Creating Assets',
        'Fetching Assets': 'Fetching Assets',
        'Updating Assets': 'Updating Assets',
        'Transferring Assets': 'Transferring Assets',
        'Burning Assets': 'Burning Assets',
        'Collection Management': 'Collection Management',
        'Execute Asset Signing': 'Execute Asset Signing',
        'Helpers': 'Helpers',
        'Deserializing Assets': 'Deserializing Assets',
        'Adding Plugins': 'Adding Plugins',
        'Removing Plugins': 'Removing Plugins',
        'Delegating and Revoking Plugins': 'Delegating and Revoking Plugins',
        'Immutability': 'Immutability',
        'Soulbound Assets': 'Soulbound Assets',
        'Print Editions': 'Print Editions',
        'Oracle Plugin Example': 'Oracle Plugin Example',
        'Appdata Plugin Example': 'Appdata Plugin Example',
      }
    },
    ja: {
      headline: '次世代NFT標準',
      description: '次世代Solana NFT標準。',
      sections: {
        'Introduction': '紹介',
        'SDK': 'SDK',
        'Features': '機能', 
        'Plugins': 'プラグイン',
        'External Plugins': '外部プラグイン',
        'General': '一般',
        'JavaScript': 'JavaScript',
        'Program Concepts': 'プログラムコンセプト',
        'Anchor': 'Anchor',
      },
      links: {
        'Overview': '概要',
        'What is an Asset?': 'アセットとは？',
        'JSON Schema': 'JSONスキーマ',
        'Token Metadata Differences': 'Token Metadataとの違い',
        'Ecosystem Support': 'エコシステムサポート',
        'Anchor': 'Anchor',
        'FAQ': 'よくある質問',
        'Javascript SDK': 'JavaScript SDK',
        'Rust SDK': 'Rust SDK', 
        'Creating Assets': 'アセットの作成',
        'Fetching Assets': 'アセットの取得',
        'Updating Assets': 'アセットの更新',
        'Transferring Assets': 'アセットの転送',
        'Burning Assets': 'アセットのバーン',
        'Collection Management': 'コレクション管理',
        'Execute Asset Signing': 'アセット署名の実行',
        'Helpers': 'ヘルパー',
        'Deserializing Assets': 'アセットのデシリアライズ',
        'Adding Plugins': 'プラグインの追加',
        'Removing Plugins': 'プラグインの削除',
        'Delegating and Revoking Plugins': 'プラグインの委任と取り消し',
        'Immutability': '不変性',
        'Soulbound Assets': 'ソウルバウンドアセット',
        'Print Editions': 'プリントエディション',
        'Oracle Plugin Example': 'Oracleプラグインの例',
        'Appdata Plugin Example': 'Appdataプラグインの例',
      }
    },
    ko: {
      headline: '차세대 NFT 표준',
      description: '차세대 Solana NFT 표준.',
      sections: {
        'Introduction': '소개',
        'SDK': 'SDK',
        'Features': '기능',
        'Plugins': '플러그인',
        'External Plugins': '외부 플러그인',
        'General': '일반',
        'JavaScript': 'JavaScript',
        'Program Concepts': '프로그램 개념',
        'Anchor': 'Anchor',
      },
      links: {
        'Overview': '개요',
        'What is an Asset?': '에셋이란?',
        'JSON Schema': 'JSON 스키마',
        'Token Metadata Differences': 'Token Metadata 차이점',
        'Ecosystem Support': '생태계 지원',
        'Anchor': 'Anchor',
        'FAQ': '자주 묻는 질문',
        'Javascript SDK': 'JavaScript SDK',
        'Rust SDK': 'Rust SDK',
        'Creating Assets': '에셋 생성',
        'Fetching Assets': '에셋 가져오기',
        'Updating Assets': '에셋 업데이트',
        'Transferring Assets': '에셋 전송',
        'Burning Assets': '에셋 소각',
        'Collection Management': '컬렉션 관리',
        'Execute Asset Signing': '에셋 서명 실행',
        'Helpers': '헬퍼',
        'Deserializing Assets': '에셋 역직렬화',
        'Adding Plugins': '플러그인 추가',
        'Removing Plugins': '플러그인 제거',
        'Delegating and Revoking Plugins': '플러그인 위임 및 취소',
        'Immutability': '불변성',
        'Soulbound Assets': '소울바운드 에셋',
        'Print Editions': '프린트 에디션',
        'Oracle Plugin Example': 'Oracle 플러그인 예제',
        'Appdata Plugin Example': 'Appdata 플러그인 예제',
      }
    }
  }
}
