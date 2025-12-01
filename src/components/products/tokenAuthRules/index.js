import {
  documentationSection,
  referencesSection
} from '@/shared/sections'
import { LockOpenIcon } from '@heroicons/react/24/solid'
import { Hero } from './Hero'

export const tokenAuthRules = {
  name: 'Token Auth Rules',
  headline: 'NFT permissions',
  description: 'Design custom authorization rules for your NFTs.',
  navigationMenuCatergory: 'Programs',
  path: 'token-auth-rules',
  icon: <LockOpenIcon />,
  github: 'https://github.com/metaplex-foundation/mpl-token-auth-rules',
  className: 'accent-green',
  heroes: [{ path: '/token-auth-rules', component: Hero }],
  deprecated: true,
  sections: [
    {
      ...documentationSection('token-auth-rules'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/token-auth-rules' },
            {
              title: 'Metaplex Rule Sets',
              href: '/token-auth-rules/mplx-rule-sets',
            },
          ],
        },
        {
          title: 'Features',
          links: [
            {
              title: 'Create or Update Rule Sets',
              href: '/token-auth-rules/create-or-update',
            },
            {
              title: 'Validating with a Rule Set',
              href: '/token-auth-rules/validate',
            },
          ],
        },
        {
          title: 'Composite Rules',
          links: [
            {
              title: 'All',
              href: '/token-auth-rules/composite-rules/all',
            },
            {
              title: 'Any',
              href: '/token-auth-rules/composite-rules/any',
            },
            {
              title: 'Not',
              href: '/token-auth-rules/composite-rules/not',
            },
          ],
        },
        {
          title: 'Primitive Rules',
          links: [
            {
              title: 'Additional Signer',
              href: '/token-auth-rules/primitive-rules/additional-signer',
            },
            {
              title: 'Amount',
              href: '/token-auth-rules/primitive-rules/amount',
            },
            {
              title: 'Namespace',
              href: '/token-auth-rules/primitive-rules/namespace',
            },
            {
              title: 'Pass',
              href: '/token-auth-rules/primitive-rules/pass',
            },
            {
              title: 'PDA Match',
              href: '/token-auth-rules/primitive-rules/pda-match',
            },
            {
              title: 'Program Owned',
              href: '/token-auth-rules/primitive-rules/program-owned',
            },
            {
              title: 'Public Key Match',
              href: '/token-auth-rules/primitive-rules/pubkey-match',
            },
          ],
        },
        {
          title: 'Advanced',
          links: [
            { title: 'Rule Set Buffers', href: '/token-auth-rules/buffers' },
          ],
        },
      ],
    },
    {
      ...referencesSection('token-auth-rules'),
      href: 'https://mpl-token-auth-rules.typedoc.metaplex.com/',
      target: '_blank'
    },
  ],
  localizedNavigation: {
    en: {
      headline: 'NFT permissions',
      description: 'Design custom authorization rules for your NFTs.',
      sections: {
        'Introduction': 'Introduction',
        'Features': 'Features',
        'Composite Rules': 'Composite Rules',
        'Primitive Rules': 'Primitive Rules',
        'Advanced': 'Advanced'
      },
      links: {
        'Overview': 'Overview',
        'Metaplex Rule Sets': 'Metaplex Rule Sets',
        'Create or Update Rule Sets': 'Create or Update Rule Sets',
        'Validating with a Rule Set': 'Validating with a Rule Set',
        'All': 'All',
        'Any': 'Any',
        'Not': 'Not',
        'Additional Signer': 'Additional Signer',
        'Amount': 'Amount',
        'Namespace': 'Namespace',
        'Pass': 'Pass',
        'PDA Match': 'PDA Match',
        'Program Owned': 'Program Owned',
        'Public Key Match': 'Public Key Match',
        'Rule Set Buffers': 'Rule Set Buffers'
      }
    },
    ja: {
      headline: 'NFT権限',
      description: 'NFTのカスタム認証ルールを設計。',
      sections: {
        'Introduction': '紹介',
        'Features': '機能',
        'Composite Rules': 'コンポジットルール',
        'Primitive Rules': 'プリミティブルール',
        'Advanced': '高度な機能'
      },
      links: {
        'Overview': '概要',
        'Metaplex Rule Sets': 'Metaplexルールセット',
        'Create or Update Rule Sets': 'ルールセットの作成・更新',
        'Validating with a Rule Set': 'ルールセットでの検証',
        'All': 'All（全て）',
        'Any': 'Any（いずれか）',
        'Not': 'Not（否定）',
        'Additional Signer': '追加署名者',
        'Amount': '数量',
        'Namespace': 'ネームスペース',
        'Pass': 'Pass（通過）',
        'PDA Match': 'PDAマッチ',
        'Program Owned': 'プログラム所有',
        'Public Key Match': '公開鍵マッチ',
        'Rule Set Buffers': 'ルールセットバッファ'
      }
    },
    ko: {
      headline: 'NFT 권한',
      description: 'NFT에 대한 사용자 정의 인증 규칙을 설계하세요.',
      sections: {
        'Introduction': '소개',
        'Features': '기능',
        'Composite Rules': '복합 규칙',
        'Primitive Rules': '원시 규칙',
        'Advanced': '고급 기능'
      },
      links: {
        'Overview': '개요',
        'Metaplex Rule Sets': 'Metaplex 규칙 세트',
        'Create or Update Rule Sets': '규칙 세트 생성 또는 업데이트',
        'Validating with a Rule Set': '규칙 세트로 검증하기',
        'All': 'All (모두)',
        'Any': 'Any (임의)',
        'Not': 'Not (부정)',
        'Additional Signer': '추가 서명자',
        'Amount': '수량',
        'Namespace': '네임스페이스',
        'Pass': 'Pass (통과)',
        'PDA Match': 'PDA 매치',
        'Program Owned': '프로그램 소유',
        'Public Key Match': '공개 키 매치',
        'Rule Set Buffers': '규칙 세트 버퍼'
      }
    }
  }
}
