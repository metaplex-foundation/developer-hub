import { Hero } from './Hero';
import { Logo } from './Logo';

export const global = {
  name: 'Metaplex',
  headline: 'Developer Hub',
  description: 'One place for all Metaplex developer resources.',
  path: '',
  isFallbackProduct: true,
  icon: <Logo />,
  github: 'https://github.com/metaplex-foundation',
  className: 'accent-sky',
  heroes: [{ path: '/', component: Hero }],
  sections: [],
  localizedNavigation: {
    en: {
      headline: 'Developer Hub',
      description: 'One place for all Metaplex developer resources.',
    },
    ja: {
      headline: 'デベロッパーハブ',
      description: 'Metaplexの全開発者リソースを一箇所にまとめたハブ。',
    },
    ko: {
      headline: '개발자 허브',
      description: '모든 Metaplex 개발자 리소스를 한 곳에 모은 허브입니다.',
      sections: {
        'Getting Started': '시작하기',
        'Resources': '리소스',
      },
      links: {
        'Programs and Tools': '프로그램 및 도구',
        'Understanding Programs': '프로그램 이해',
        'Developer Tools': '개발자 도구',
        'RPC Providers': 'RPC 제공업체',
        'Storage Providers': '스토리지 제공업체',
        'Community Guides': '커뮤니티 가이드',
      }
    },
    zh: {
      headline: '开发者中心',
      description: '所有Metaplex开发者资源的集中地。',
      sections: {
        'Getting Started': '快速入门',
        'Resources': '资源',
      },
      links: {
        'Programs and Tools': '程序和工具',
        'Understanding Programs': '理解程序',
        'Developer Tools': '开发者工具',
        'RPC Providers': 'RPC提供商',
        'Storage Providers': '存储提供商',
        'Community Guides': '社区指南',
      }
    }
  }
}
