import { CircleStackIcon } from '@heroicons/react/24/solid'

export const beet = {
  name: 'Beet',
  headline: 'Borsh serialization for JavaScript',
  description: 'A Borsh-compatible serializer and deserializer for JavaScript and TypeScript. Deprecated.',
  navigationMenuCatergory: 'Dev Tools',
  path: 'dev-tools/beet',
  icon: <CircleStackIcon />,
  github: 'https://github.com/metaplex-foundation/beet',
  className: 'accent-sky',
  deprecated: true,
  sections: [],
  localizedNavigation: {
    ja: {
      headline: 'JavaScript向けBorshシリアライゼーション',
      description: 'JavaScript/TypeScript向けのBorsh互換シリアライザー・デシリアライザー。非推奨。',
    },
    ko: {
      headline: 'JavaScript용 Borsh 직렬화',
      description: 'JavaScript 및 TypeScript용 Borsh 호환 직렬화·역직렬화 도구입니다. 지원 중단됨.',
    },
    zh: {
      headline: '面向JavaScript的Borsh序列化',
      description: '兼容Borsh的JavaScript/TypeScript序列化与反序列化工具。已弃用。',
    },
  },
}
