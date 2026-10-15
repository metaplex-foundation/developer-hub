import { documentationSection } from '@/shared/sections';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { buildProductTranslations } from '@/config/navigation-translations';

export const api = {
  name: 'Metaplex API',
  headline: 'Public REST API',
  description:
    'The public REST API at api.metaplex.com — Genesis launch data, launch creation, and the agent registry.',
  navigationMenuCatergory: 'Dev Tools',
  path: 'api',
  icon: <GlobeAltIcon />,
  className: 'accent-green',
  sections: [
    {
      ...documentationSection('api'),
      isFallbackSection: false,
      isPageFromSection: ({ pathname }) => {
        return pathname === '/api' || pathname.startsWith('/api/');
      },
      navigation: [
        {
          title: 'Introduction',
          links: [
            {
              title: 'Overview',
              href: '/api',
            },
          ],
        },
        {
          title: 'Launches',
          links: [
            {
              title: 'Get Launch',
              href: '/api/get-launch',
              method: 'get',
            },
            {
              title: 'Get Launches by Token',
              href: '/api/get-launches-by-token',
              method: 'get',
            },
            {
              title: 'List Launches',
              href: '/api/list-launches',
              method: 'get',
            },
            {
              title: 'Get Spotlight',
              href: '/api/get-spotlight',
              method: 'get',
            },
            {
              title: 'Create Launch',
              href: '/api/create-launch',
              method: 'post',
            },
            {
              title: 'Register Launch',
              href: '/api/register',
              method: 'post',
            },
            {
              title: 'Verify Twitter',
              href: '/api/verify-twitter',
              method: 'post',
            },
            {
              title: 'Claim Creator Rewards',
              href: '/api/claim-creator-rewards',
              method: 'post',
            },
          ],
        },
        {
          title: 'Agents',
          links: [
            {
              title: 'List Agents',
              href: '/api/list-agents',
              method: 'get',
            },
            {
              title: 'Get Agent',
              href: '/api/get-agent',
              method: 'get',
            },
            {
              title: 'Get Agent Card',
              href: '/api/get-agent-card',
              method: 'get',
            },
            {
              title: 'Mint Agent',
              href: '/api/mint-agent',
              method: 'post',
            },
            {
              title: 'Fund Agent',
              href: '/api/fund-agent',
              method: 'post',
            },
            {
              title: 'Withdraw from Agent',
              href: '/api/withdraw-agent',
              method: 'post',
            },
          ],
        },
      ],
    },
  ],
  localizedNavigation: buildProductTranslations({
    headlineTranslations: {
      ja: '公開REST API',
      ko: '공개 REST API',
      zh: '公共 REST API',
    },
    descriptionTranslations: {
      ja: 'api.metaplex.com の公開REST API — Genesisローンチデータ、ローンチ作成、エージェントレジストリ。',
      ko: 'api.metaplex.com의 공개 REST API — Genesis 런치 데이터, 런치 생성, 에이전트 레지스트리.',
      zh: 'api.metaplex.com 的公共 REST API — Genesis 发行数据、发行创建和 Agent 注册表。',
    },
    sectionKeys: {
      'Introduction': 'sections.introduction',
      'Launches': {
        ja: 'ローンチ',
        ko: '런치',
        zh: '发行',
      },
      'Agents': {
        ja: 'エージェント',
        ko: '에이전트',
        zh: 'Agent',
      },
    },
    linkKeys: {
      'Overview': {
        ja: '概要',
        ko: '개요',
        zh: '概览',
      },
      'Get Launch': {
        ja: 'ローンチ取得',
        ko: '런치 조회',
        zh: '获取发行',
      },
      'Get Launches by Token': {
        ja: 'トークンによるローンチ取得',
        ko: '토큰별 런치 조회',
        zh: '按代币获取发行',
      },
      'List Launches': {
        ja: 'ローンチ一覧',
        ko: '런치 목록',
        zh: '发行列表',
      },
      'Get Spotlight': {
        ja: 'スポットライト取得',
        ko: '스포트라이트 조회',
        zh: '获取精选',
      },
      'Create Launch': {
        ja: 'ローンチ作成',
        ko: '런치 생성',
        zh: '创建发行',
      },
      'Register Launch': {
        ja: 'ローンチ登録',
        ko: '런치 등록',
        zh: '注册发行',
      },
      'Verify Twitter': {
        ja: 'Twitter認証',
        ko: 'Twitter 인증',
        zh: '验证 Twitter',
      },
      'Claim Creator Rewards': {
        ja: 'クリエイター報酬の請求',
        ko: '창작자 보상 청구',
        zh: '认领创作者奖励',
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
};
