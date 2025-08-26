import {
  documentationSection
} from '@/shared/sections'
import { ServerIcon } from '@heroicons/react/24/solid'
import { Hero } from './Hero'

export const amman = {
  name: 'Amman',
  headline: 'Local Validator Toolkit',
  description:
    'A local validator toolkit for testing Solana programs and applications.',
  path: 'amman',
  navigationMenuCatergory: 'Dev Tools',
  icon: <ServerIcon />,
  github: 'https://github.com/metaplex-foundation/amman',
  className: 'accent-sky',
  heroes: [{ path: '/amman', component: Hero }],
  sections: [
    {
      ...documentationSection('amman'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            { title: 'Overview', href: '/amman' },
            { title: 'Getting Started', href: '/amman/getting-started' },
            { title: 'CLI Commands', href: '/amman/cli-commands' },
            { title: 'Configuration', href: '/amman/configuration' },
            { title: 'Pre-made Configs', href: '/amman/pre-made-configs' },
          ],
        },
      ],
    },
  ],
  localizedNavigation: {
    en: {
      headline: 'Local Validator Toolkit',
      description: 'A local validator toolkit for testing Solana programs and applications.',
      sections: {
        'Introduction': 'Introduction'
      },
      links: {
        'Overview': 'Overview',
        'Getting Started': 'Getting Started',
        'CLI Commands': 'CLI Commands',
        'Configuration': 'Configuration',
        'Pre-made Configs': 'Pre-made Configs'
      }
    },
    jp: {
      headline: 'ローカルバリデーターツールキット',
      description: 'Solanaプログラムとアプリケーションをテストするためのローカルバリデーターツールキット。',
      sections: {
        'Introduction': '紹介'
      },
      links: {
        'Overview': '概要',
        'Getting Started': 'はじめに',
        'CLI Commands': 'CLIコマンド',
        'Configuration': '設定',
        'Pre-made Configs': '事前作成済み設定'
      }
    },
    kr: {
      headline: '로컬 밸리데이터 툴킷',
      description: 'Solana 프로그램과 애플리케이션을 테스트하기 위한 로컬 밸리데이터 툴킷입니다.',
      sections: {
        'Introduction': '소개'
      },
      links: {
        'Overview': '개요',
        'Getting Started': '시작하기',
        'CLI Commands': 'CLI 명령어',
        'Configuration': '설정',
        'Pre-made Configs': '미리 만들어진 설정'
      }
    }
  }
}
