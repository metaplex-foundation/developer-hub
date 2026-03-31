import { documentationSection } from '@/shared/sections'
import { SparklesIcon } from '@heroicons/react/24/solid'

export const agents = {
  name: 'Agents',
  headline: 'AI Agents on Solana',
  description: 'Register agent identity, delegate execution, and give AI agents knowledge of Metaplex programs.',
  navigationMenuCatergory: undefined,
  path: 'agents',
  icon: <SparklesIcon />,
  github: 'https://github.com/metaplex-foundation',
  className: 'accent-purple',
  sections: [
    {
      ...documentationSection('agents'),
      isFallbackSection: false,
      isPageFromSection: ({ pathname }) => {
        return pathname.startsWith('/agents/') && pathname !== '/agents'
      },
      navigation: [
        {
          title: 'Introduction',
          links: [
            {
              title: 'Overview',
              href: '/agents',
            },
            {
              title: 'What Is an Agent?',
              href: '/agents/what-is-an-agent',
            },
          ],
        },
        {
          title: 'Getting Started',
          links: [
            {
              title: 'Skill',
              href: '/agents/skill',
            },
            {
              title: 'Create an Agent',
              href: '/agents/create-agent',
            },
            {
              title: 'Read Agent Data',
              href: '/agents/run-agent',
            },
            {
              title: 'Run an Agent',
              href: '/agents/run-an-agent',
            },
          ],
        },
      ],
    },
  ],
  localizedNavigation: {
    en: {
      headline: 'AI Agents on Solana',
      description: 'Register agent identity, delegate execution, and give AI agents knowledge of Metaplex programs.',
      sections: {
        'Introduction': 'Introduction',
        'Getting Started': 'Getting Started'
      },
      links: {
        'Overview': 'Overview',
        'What Is an Agent?': 'What Is an Agent?',
        'Skill': 'Skill',
        'Create an Agent': 'Create an Agent',
        'Read Agent Data': 'Read Agent Data',
        'Run an Agent': 'Run an Agent'
      }
    },
    ja: {
      headline: 'Solana上のAIエージェント',
      description: 'エージェントIDの登録、実行委任、AIエージェントへのMetaplexプログラムの知識付与。',
      sections: {
        'Introduction': 'はじめに',
        'Getting Started': 'スタートガイド'
      },
      links: {
        'Overview': '概要',
        'What Is an Agent?': 'エージェントとは？',
        'Skill': 'スキル',
        'Create an Agent': 'エージェントを作成',
        'Read Agent Data': 'エージェントデータを読み取る',
        'Run an Agent': 'エージェントを実行'
      }
    },
    ko: {
      headline: 'Solana의 AI 에이전트',
      description: '에이전트 신원 등록, 실행 위임, AI 에이전트에 Metaplex 프로그램 지식 제공.',
      sections: {
        'Introduction': '소개',
        'Getting Started': '시작하기'
      },
      links: {
        'Overview': '개요',
        'What Is an Agent?': '에이전트란?',
        'Skill': '스킬',
        'Create an Agent': '에이전트 생성',
        'Read Agent Data': '에이전트 데이터 읽기',
        'Run an Agent': '에이전트 실행'
      }
    },
    zh: {
      headline: 'Solana上的AI代理',
      description: '注册代理身份、委托执行，为AI代理提供Metaplex程序知识。',
      sections: {
        'Introduction': '简介',
        'Getting Started': '入门'
      },
      links: {
        'Overview': '概述',
        'What Is an Agent?': '什么是代理？',
        'Skill': '技能',
        'Create an Agent': '创建代理',
        'Read Agent Data': '读取代理数据',
        'Run an Agent': '运行代理'
      }
    },
  },
}
