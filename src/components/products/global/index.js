import { documentationSection } from '@/shared/sections';
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
  sections: [
    {
      ...documentationSection(''),
      navigation: [
        {
          title: 'Getting Started',
          links: [
            { title: 'Programs and Tools', href: '/programs-and-tools' },
            { title: 'Understanding Programs', href: '/understanding-programs' },
          ],
        },
        {
          title: 'Resources',
          links: [
            { title: 'Developer Tools', href: '/developer-tools' },
            { title: 'RPC Providers', href: '/rpc-providers' },
            { title: 'Storage Providers', href: '/storage-providers' },
            { title: 'Community Guides', href: '/community-guides' },
          ],
        },
      ],
    },
  ],
  localizedNavigation: {
    en: {
      headline: 'Developer Hub',
      description: 'One place for all Metaplex developer resources.',
      sections: {
        'Getting Started': 'Getting Started',
        'Resources': 'Resources',
      },
      links: {
        'Programs and Tools': 'Programs and Tools',
        'Understanding Programs': 'Understanding Programs',
        'Developer Tools': 'Developer Tools',
        'RPC Providers': 'RPC Providers',
        'Storage Providers': 'Storage Providers',
        'Community Guides': 'Community Guides',
      }
    },
    ja: {
      headline: 'デベロッパーハブ',
      description: 'Metaplexの全開発者リソースを一箇所にまとめたハブ。',
      sections: {
        'Getting Started': 'はじめに',
        'Resources': 'リソース',
      },
      links: {
        'Programs and Tools': 'プログラムとツール',
        'Understanding Programs': 'プログラムの理解',
        'Developer Tools': '開発者ツール',
        'RPC Providers': 'RPCプロバイダー',
        'Storage Providers': 'ストレージプロバイダー',
        'Community Guides': 'コミュニティガイド',
      }
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
    }
  }
}
