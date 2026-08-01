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
        {
          title: 'API Reference',
          links: [
            {
              title: 'Overview',
              href: '/agents/api',
            },
            {
              title: 'List Agents',
              href: '/agents/api/list-agents',
              method: 'get',
            },
            {
              title: 'Get Agent',
              href: '/agents/api/get-agent',
              method: 'get',
            },
            {
              title: 'Get Agent Card',
              href: '/agents/api/get-agent-card',
              method: 'get',
            },
            {
              title: 'Mint Agent',
              href: '/agents/api/mint-agent',
              method: 'post',
            },
            {
              title: 'Fund Agent',
              href: '/agents/api/fund-agent',
              method: 'post',
            },
            {
              title: 'Withdraw from Agent',
              href: '/agents/api/withdraw-agent',
              method: 'post',
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
      'API Reference': {
        ja: 'APIリファレンス',
        ko: 'API 레퍼런스',
        zh: 'API 参考',
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
      'Create an Agent Token': {
        ja: 'エージェントトークンの作成',
        ko: '에이전트 토큰 생성',
        zh: '创建 Agent 代币',
      },
      'Run an Agent': {
        ja: 'エージェントの実行',
        ko: '에이전트 실행',
        zh: '运行 Agent',
      },
      'Overview': {
        ja: '概要',
        ko: '개요',
        zh: '概览',
      },
      'List Agents': {
        ja: 'エージェント一覧',
        ko: '에이전트 목록',
        zh: '列出 Agent',
      },
      'Get Agent': {
        ja: 'エージェントの取得',
        ko: '에이전트 조회',
        zh: '获取 Agent',
      },
      'Get Agent Card': {
        ja: 'エージェントカードの取得',
        ko: '에이전트 카드 조회',
        zh: '获取 Agent 卡片',
      },
      'Mint Agent': {
        ja: 'エージェントのミント',
        ko: '에이전트 민팅',
        zh: '铸造 Agent',
      },
      'Fund Agent': {
        ja: 'エージェントへの入金',
        ko: '에이전트 자금 입금',
        zh: '为 Agent 注资',
      },
      'Withdraw from Agent': {
        ja: 'エージェントからの出金',
        ko: '에이전트 자금 출금',
        zh: '从 Agent 提款',
      },
    },
  }),
}
