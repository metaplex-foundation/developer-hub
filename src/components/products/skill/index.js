import {
  documentationSection
} from '@/shared/sections'
import { SparklesIcon } from '@heroicons/react/24/solid'

export const skill = {
  name: 'Skill',
  headline: 'AI Agent Knowledge Base',
  description: 'Give AI coding agents full knowledge of Metaplex programs, CLI commands, and SDK patterns.',
  path: 'agents/skill',
  navigationMenuCatergory: undefined,
  icon: <SparklesIcon />,
  github: 'https://github.com/metaplex-foundation/skill',
  className: 'accent-purple',
  sections: [
    {
      ...documentationSection('agents/skill'),
      navigation: [
        {
          title: 'Getting Started',
          links: [
            { title: 'Overview', href: '/agents/skill' },
            { title: 'Installation', href: '/agents/skill/installation' },
          ],
        },
        {
          title: 'Details',
          links: [
            { title: 'How It Works', href: '/agents/skill/how-it-works' },
            { title: 'Programs & Operations', href: '/agents/skill/programs-and-operations' },
          ],
        },
      ],
    },
  ],
  localizedNavigation: {
    en: {
      headline: 'AI Agent Knowledge Base',
      description: 'Give AI coding agents full knowledge of Metaplex programs, CLI commands, and SDK patterns.',
      sections: {
        'Getting Started': 'Getting Started',
        'Details': 'Details'
      },
      links: {
        'Overview': 'Overview',
        'Installation': 'Installation',
        'How It Works': 'How It Works',
        'Programs & Operations': 'Programs & Operations'
      }
    },
    ja: {
      headline: 'AIエージェントの知識ベース',
      description: 'AIコーディングエージェントにMetaplexプログラム、CLIコマンド、SDKパターンの完全な知識を付与します。',
      sections: {
        'Getting Started': 'はじめに',
        'Details': '詳細'
      },
      links: {
        'Overview': '概要',
        'Installation': 'インストール',
        'How It Works': '仕組み',
        'Programs & Operations': 'プログラムとオペレーション'
      }
    },
    ko: {
      headline: 'AI 에이전트 지식 베이스',
      description: 'AI 코딩 에이전트에게 Metaplex 프로그램, CLI 명령어, SDK 패턴에 대한 완전한 지식을 제공합니다.',
      sections: {
        'Getting Started': '시작하기',
        'Details': '세부사항'
      },
      links: {
        'Overview': '개요',
        'Installation': '설치',
        'How It Works': '작동 방식',
        'Programs & Operations': '프로그램 및 작업'
      }
    },
    zh: {
      headline: 'AI代理知识库',
      description: '为AI编码代理提供Metaplex程序、CLI命令和SDK模式的完整知识。',
      sections: {
        'Getting Started': '入门',
        'Details': '详情'
      },
      links: {
        'Overview': '概述',
        'Installation': '安装',
        'How It Works': '工作原理',
        'Programs & Operations': '程序与操作'
      }
    }
  }
}
