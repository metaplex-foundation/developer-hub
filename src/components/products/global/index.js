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
          title: 'Overview',
          links: [
            { title: 'Introduction', href: '/' },
            { title: 'Programs and Tools', href: '/programs-and-tools' },
          ],
        },
        {
          title: 'Resources',
          links: [
            { title: 'Official Links', href: '/official-links' },
            { title: 'Developer Tools', href: '/developer-tools' },
            {
              title: 'Understanding Programs',
              href: '/understanding-programs',
            },
            {
              title: 'Metaplex Rust SDKs',
              href: '/guides/rust/metaplex-rust-sdks',
            },
            { title: 'RPC Providers', href: '/rpc-providers' },
            { title: 'Storage Providers', href: '/storage-providers' },
            { title: 'Stability Index', href: '/stability-index' },
            { title: 'Protocol Fees', href: '/protocol-fees' },
            {title: 'Terms and Conditions', target:"_blank", href: 'https://www.metaplex.com/terms-and-conditions'},
          ],
        },
        {
          title: 'Community',
          links: [
            { title: 'Community Guides', href: '/community-guides' },
            { title: 'Security', href: '/security' },
            { title: 'Contact Us', href: '/contact' },
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
        'Overview': 'Overview',
        'Resources': 'Resources',
        'Community': 'Community',
      },
      links: {
        'Introduction': 'Introduction',
        'Programs and Tools': 'Programs and Tools',
        'Official Links': 'Official Links',
        'Developer Tools': 'Developer Tools',
        'Understanding Programs': 'Understanding Programs',
        'Metaplex Rust SDKs': 'Metaplex Rust SDKs',
        'RPC Providers': 'RPC Providers',
        'Storage Providers': 'Storage Providers',
        'Stability Index': 'Stability Index',
        'Protocol Fees': 'Protocol Fees',
        'Terms and Conditions': 'Terms and Conditions',
        'Community Guides': 'Community Guides',
        'Security': 'Security',
        'Contact Us': 'Contact Us',
      }
    },
    ja: {
      headline: 'デベロッパーハブ',
      description: 'Metaplexの全開発者リソースを一箇所にまとめたハブ。',
      sections: {
        'Overview': '概要',
        'Resources': 'リソース',
        'Community': 'コミュニティ',
      },
      links: {
        'Introduction': '紹介',
        'Programs and Tools': 'プログラムとツール',
        'Official Links': '公式リンク',
        'Developer Tools': '開発者ツール',
        'Understanding Programs': 'プログラムの理解',
        'Metaplex Rust SDKs': 'Metaplex Rust SDK',
        'RPC Providers': 'RPCプロバイダー',
        'Storage Providers': 'ストレージプロバイダー',
        'Stability Index': '安定性指標',
        'Protocol Fees': 'プロトコル手数料',
        'Terms and Conditions': '利用規約',
        'Community Guides': 'コミュニティガイド',
        'Security': 'セキュリティ',
        'Contact Us': 'お問い合わせ',
      }
    },
    ko: {
      headline: '개발자 허브',
      description: '모든 Metaplex 개발자 리소스를 한 곳에 모은 허브입니다.',
      sections: {
        'Overview': '개요',
        'Resources': '리소스',
        'Community': '커뮤니티',
      },
      links: {
        'Introduction': '소개',
        'Programs and Tools': '프로그램 및 도구',
        'Official Links': '공식 링크',
        'Developer Tools': '개발자 도구',
        'Understanding Programs': '프로그램 이해',
        'Metaplex Rust SDKs': 'Metaplex Rust SDK',
        'RPC Providers': 'RPC 제공업체',
        'Storage Providers': '스토리지 제공업체',
        'Stability Index': '안정성 지수',
        'Protocol Fees': '프로토콜 수수료',
        'Terms and Conditions': '이용 약관',
        'Community Guides': '커뮤니티 가이드',
        'Security': '보안',
        'Contact Us': '문의하기',
      }
    }
  }
}
