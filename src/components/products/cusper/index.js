import { ExclamationCircleIcon } from '@heroicons/react/24/solid'

export const cusper = {
  name: 'Cusper',
  headline: 'Resolve custom program errors',
  description: 'Resolves custom program errors from Solana transaction logs into typed errors. Deprecated.',
  navigationMenuCatergory: 'Dev Tools',
  path: 'dev-tools/cusper',
  icon: <ExclamationCircleIcon />,
  github: 'https://github.com/metaplex-foundation/cusper',
  className: 'accent-sky',
  deprecated: true,
  sections: [],
  localizedNavigation: {
    ja: {
      headline: 'カスタムプログラムエラーの解決',
      description: 'Solanaトランザクションログのカスタムプログラムエラーを型付きエラーに解決します。非推奨。',
    },
    ko: {
      headline: '커스텀 프로그램 오류 해석',
      description: 'Solana 트랜잭션 로그의 커스텀 프로그램 오류를 타입이 지정된 오류로 해석합니다. 지원 중단됨.',
    },
    zh: {
      headline: '解析自定义程序错误',
      description: '将Solana交易日志中的自定义程序错误解析为类型化错误。已弃用。',
    },
  },
}
