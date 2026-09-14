import { WrenchScrewdriverIcon } from '@heroicons/react/24/solid'

export const rustBin = {
  name: 'Rust Bin',
  headline: 'Manage Rust binaries from npm',
  description: 'Manages Rust binary versions for npm packages that depend on Rust tooling. Deprecated.',
  navigationMenuCatergory: 'Dev Tools',
  path: 'dev-tools/rust-bin',
  icon: <WrenchScrewdriverIcon />,
  github: 'https://github.com/metaplex-foundation/rustbin',
  className: 'accent-sky',
  deprecated: true,
  sections: [],
  localizedNavigation: {
    ja: {
      headline: 'npmからRustバイナリを管理',
      description: 'Rustツールに依存するnpmパッケージのRustバイナリバージョンを管理します。非推奨。',
    },
    ko: {
      headline: 'npm에서 Rust 바이너리 관리',
      description: 'Rust 도구에 의존하는 npm 패키지의 Rust 바이너리 버전을 관리합니다. 지원 중단됨.',
    },
    zh: {
      headline: '从npm管理Rust二进制文件',
      description: '为依赖Rust工具链的npm包管理Rust二进制版本。已弃用。',
    },
  },
}
