import { CodeBracketIcon } from '@heroicons/react/24/solid'

export const solita = {
  name: 'Solita',
  headline: 'Generate TypeScript SDKs from IDLs',
  description: 'Generates low-level TypeScript SDKs from Solana program IDLs. Deprecated.',
  navigationMenuCatergory: 'Dev Tools',
  path: 'dev-tools/solita',
  icon: <CodeBracketIcon />,
  github: 'https://github.com/metaplex-foundation/solita',
  className: 'accent-sky',
  deprecated: true,
  sections: [],
  localizedNavigation: {
    ja: {
      headline: 'IDLからTypeScript SDKを生成',
      description: 'SolanaプログラムのIDLから低レベルTypeScript SDKを生成します。非推奨。',
    },
    ko: {
      headline: 'IDL에서 TypeScript SDK 생성',
      description: 'Solana 프로그램 IDL에서 저수준 TypeScript SDK를 생성합니다. 지원 중단됨.',
    },
    zh: {
      headline: '从IDL生成TypeScript SDK',
      description: '从Solana程序IDL生成底层TypeScript SDK。已弃用。',
    },
  },
}
