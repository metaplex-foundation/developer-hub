import { documentationSection } from '@/shared/sections'
import { SparklesIcon } from '@heroicons/react/24/solid'
import { buildProductTranslations } from '@/config/navigation-translations'

export const agents = {
  name: 'Agents',
  headline: 'AI Agents on Solana',
  description: 'Give AI agents an onchain identity and wallet so they can launch tokens, earn revenue, and transact autonomously.',
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
        return pathname.startsWith('/agents/')
      },
      navigation: [
        {
          title: 'Introduction',
          links: [
            {
              title: 'Agent Onboarding',
              href: '/agents/agent-onboarding',
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
              title: 'Agent Finance',
              href: '/agents/agent-finance',
            },
            {
              title: 'Agent Commerce',
              href: '/agents/agent-commerce',
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
      ja: 'AIエージェントにオンチェーンのアイデンティティとウォレットを提供し、トークンの発行、収益の獲得、自律的な取引を可能にします。',
      ko: 'AI 에이전트에 온체인 신원과 지갑을 제공하여 토큰을 발행하고, 수익을 얻고, 자율적으로 거래할 수 있도록 합니다.',
      zh: '为 AI Agent 提供链上身份和钱包，使其能够发行代币、赚取收入并自主交易。',
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
      'Agent Onboarding': {
        ja: 'エージェントオンボーディング',
        ko: '에이전트 온보딩',
        zh: 'Agent 入门指南',
      },
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
      'Agent Finance': {
        ja: 'エージェントファイナンス',
        ko: '에이전트 파이낸스',
        zh: 'Agent 金融',
      },
      'Agent Commerce': {
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
