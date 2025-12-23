import {
  documentationSection
} from '@/shared/sections';
import { MapIcon } from '@heroicons/react/24/solid';
import { Hero } from './Hero';

export const shank = {
  name: 'Shank',
  headline: 'IDL Extraction for Solana Programs',
  description: 'Extract IDLs from Rust Solana program code using attribute macros',
  path: 'dev-tools/shank',
  icon: <MapIcon />,
  navigationMenuCatergory: 'Dev Tools',
  github: 'https://github.com/metaplex-foundation/shank',
  className: 'accent-orange',
  heroes: [{ path: '/dev-tools/shank', component: Hero }],
  sections: [
    {
      ...documentationSection('dev-tools/shank'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/dev-tools/shank' },
            {
              title: 'Getting Started',
              href: '/dev-tools/shank/getting-started',
            },
          ],
        },
        {
          title: 'Reference',
          links: [
            {
              title: 'Macros Reference',
              href: '/dev-tools/shank/macros',
            },
          ],
        },
      ],
    },
  ],
  localizedNavigation: {
    en: {
      headline: 'IDL Extraction for Solana Programs',
      description: 'Extract IDLs from Rust Solana program code using attribute macros',
      sections: {
        'Introduction': 'Introduction',
        'Reference': 'Reference'
      },
      links: {
        'Overview': 'Overview',
        'Getting Started': 'Getting Started',
        'Macros Reference': 'Macros Reference'
      }
    },
    ja: {
      headline: 'SolanaプログラムのIDL抽出',
      description: '属性マクロを使用してRust SolanaプログラムコードからIDLを抽出',
      sections: {
        'Introduction': '紹介',
        'Reference': 'リファレンス'
      },
      links: {
        'Overview': '概要',
        'Getting Started': 'はじめに',
        'Macros Reference': 'マクロリファレンス'
      }
    },
    ko: {
      headline: 'Solana 프로그램용 IDL 추출',
      description: '속성 매크로를 사용하여 Rust Solana 프로그램 코드에서 IDL을 추출',
      sections: {
        'Introduction': '소개',
        'Reference': '참조'
      },
      links: {
        'Overview': '개요',
        'Getting Started': '시작하기',
        'Macros Reference': '매크로 참조'
      }
    },
    zh: {
      headline: 'Solana程序IDL提取',
      description: '使用属性宏从Rust Solana程序代码中提取IDL',
      sections: {
        'Introduction': '简介',
        'Reference': '参考'
      },
      links: {
        'Overview': '概述',
        'Getting Started': '快速入门',
        'Macros Reference': '宏参考'
      }
    }
  }
}