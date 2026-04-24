import { documentationSection } from '@/shared/sections'
import { SparklesIcon } from '@heroicons/react/24/solid'
import { buildProductTranslations } from '@/config/navigation-translations'

export const agents = {
  name: 'Agents',
  headline: 'AI Agents on Solana',
  description: 'Register agent identity, delegate execution, and give AI agents knowledge of Metaplex programs.',
  skill: true,
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
              title: 'Mint an Agent',
              href: '/agents/mint-agent',
            },
            {
              title: 'Register an Agent',
              href: '/agents/register-agent',
            },
            {
              title: 'Read Agent Data',
              href: '/agents/read-agent-data',
            },
            {
              title: 'Agentic Commerce',
              href: '/agents/agentic-commerce',
            },
            {
              title: 'Create an Agent Token',
              href: '/agents/create-agent-token',
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
  localizedNavigation: buildProductTranslations({
    headlineTranslations: {
      ja: 'Solana上のAIエージェント',
      ko: 'Solana의 AI 에이전트',
      zh: 'Solana 上的 AI Agent',
    },
    descriptionTranslations: {
      ja: 'エージェントのアイデンティティを登録し、実行を委任し、AIエージェントにMetaplexプログラムの知識を提供します。',
      ko: '에이전트 신원을 등록하고, 실행을 위임하며, AI 에이전트에 Metaplex 프로그램에 대한 지식을 부여합니다.',
      zh: '注册 Agent 身份、委托执行，并为 AI Agent 提供 Metaplex 程序的知识。',
    },
    sectionKeys: {
      'Introduction': 'sections.introduction',
      'Getting Started': {
        ja: 'はじめに',
        ko: '시작하기',
        zh: '快速入门',
      },
    },
    linkKeys: {
      'Overview': 'links.overview',
      'What Is an Agent?': {
        ja: 'エージェントとは？',
        ko: '에이전트란?',
        zh: '什么是 Agent？',
      },
      'Skill': {
        ja: 'Skill',
        ko: 'Skill',
        zh: 'Skill',
      },
      'Mint an Agent': {
        ja: 'エージェントのミント',
        ko: '에이전트 민팅',
        zh: '铸造 Agent',
      },
      'Register an Agent': {
        ja: 'エージェントの登録',
        ko: '에이전트 등록',
        zh: '注册 Agent',
      },
      'Read Agent Data': {
        ja: 'エージェントデータの読み取り',
        ko: '에이전트 데이터 읽기',
        zh: '读取 Agent 数据',
      },
      'Agentic Commerce': {
        ja: 'エージェントコマース',
        ko: '에이전트 커머스',
        zh: 'Agent 商业',
      },
      'Run an Agent': {
        ja: 'エージェントの実行',
        ko: '에이전트 실행',
        zh: '运行 Agent',
      },
    },
  }),
}
