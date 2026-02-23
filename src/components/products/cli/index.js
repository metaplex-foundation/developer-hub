import { documentationSection } from '@/shared/sections';
import { CommandLineIcon, SparklesIcon } from '@heroicons/react/24/outline';

export const cli = {
  name: 'CLI',
  headline: 'MPLX CLI',
  description:
    'A CLI for the MPLX ecosystem',
  navigationMenuCatergory: 'Dev Tools',
  path: 'dev-tools/cli',
  icon: <CommandLineIcon />,
  github: 'https://github.com/metaplex-foundation/cli/',
  className: 'accent-green',
  primaryCta: {
    disabled: false,
  },
  sections: [
    {
      ...documentationSection('dev-tools/cli'),
      navigation: [
        {
          title: 'Getting Started',
          links: [
            {
              title: 'Introduction',
              href: '/dev-tools/cli',
            },
            {
              title: 'Installation',
              href: '/dev-tools/cli/installation',
            },
          ],
        },
        {
          title: 'Configuration',
          links: [
            {
              title: 'Wallets',
              href: '/dev-tools/cli/config/wallets',
            },
            {
              title: 'RPCs',
              href: '/dev-tools/cli/config/rpcs',
            },
            {
              title: 'Explorer',
              href: '/dev-tools/cli/config/explorer',
            },
          ],
        },
        {
          title: 'Genesis Commands',
          links: [
            {
              title: 'Overview',
              href: '/dev-tools/cli/genesis',
            },
            {
              title: 'Create Genesis Account',
              href: '/dev-tools/cli/genesis/create',
            },
            {
              title: 'Launch Pool',
              href: '/dev-tools/cli/genesis/launch-pool',
            },
            {
              title: 'Presale',
              href: '/dev-tools/cli/genesis/presale',
            },
            {
              title: 'Manage',
              href: '/dev-tools/cli/genesis/manage',
            },
          ],
        },
        {
          title: 'Core Commands',
          links: [
            {
              title: 'Create Asset',
              href: '/dev-tools/cli/core/create-asset',
            },
            {
              title: 'Create Collection',
              href: '/dev-tools/cli/core/create-collection',
            },
            {
              title: 'Update Asset',
              href: '/dev-tools/cli/core/update-asset',
            },
            {
              title: 'Burn Asset',
              href: '/dev-tools/cli/core/burn-asset',
            },
            {
              title: 'Fetch Asset or Collection',
              href: '/dev-tools/cli/core/fetch',
            },
            {
              title: 'Add and Update Plugins',
              href: '/dev-tools/cli/core/plugins',
            },
          ],
        },
        {
          title: 'Candy Machine Commands',
          links: [
            {
              title: 'Overview',
              href: '/cli/cm',
            },
            {
              title: 'Create Candy Machine',
              href: '/cli/cm/create',
            },
            {
              title: 'Upload Assets',
              href: '/cli/cm/upload',
            },
            {
              title: 'Insert Items',
              href: '/cli/cm/insert',
            },
            {
              title: 'Validate Cache',
              href: '/cli/cm/validate',
            },
            {
              title: 'Fetch Information',
              href: '/cli/cm/fetch',
            },
            {
              title: 'Withdraw',
              href: '/cli/cm/withdraw',
            },
          ],
        },        {
          title: 'Bubblegum (Compressed NFTs)',
          links: [
            {
              title: 'Overview',
              href: '/dev-tools/cli/bubblegum',
            },
            {
              title: 'Create Tree',
              href: '/dev-tools/cli/bubblegum/create-tree',
            },
            {
              title: 'List Trees',
              href: '/dev-tools/cli/bubblegum/list-trees',
            },
            {
              title: 'Create Compressed NFT',
              href: '/dev-tools/cli/bubblegum/create-cnft',
            },
            {
              title: 'Fetch Compressed NFT',
              href: '/dev-tools/cli/bubblegum/fetch-cnft',
            },
            {
              title: 'Update Compressed NFT',
              href: '/dev-tools/cli/bubblegum/update-cnft',
            },
            {
              title: 'Transfer Compressed NFT',
              href: '/dev-tools/cli/bubblegum/transfer-cnft',
            },
            {
              title: 'Burn Compressed NFT',
              href: '/dev-tools/cli/bubblegum/burn-cnft',
            },
          ],
        },
        {
          title: 'Toolbox',
          links: [
            {
              title: 'Token Creation',
              href: '/dev-tools/cli/toolbox/token-create',
            },
            {
              title: 'Add Metadata to Token',
              href: '/dev-tools/cli/toolbox/add-metadata-to-token',
            },
            {
              title: 'Update Token Metadata',
              href: '/dev-tools/cli/toolbox/update-token-metadata',
            },
            {
              title: 'Token Transfer',
              href: '/dev-tools/cli/toolbox/token-transfer',
            },
            {
              title: 'SOL Airdrop',
              href: '/dev-tools/cli/toolbox/sol-airdrop',
            },
            {
              title: 'SOL Balance',
              href: '/dev-tools/cli/toolbox/sol-balance',
            },
            {
              title: 'SOL Transfer',
              href: '/dev-tools/cli/toolbox/sol-transfer',
            },
          ],
        },
      ],
    },
  ],
  localizedNavigation: {
    en: {
      headline: 'MPLX CLI',
      description: 'A CLI for the MPLX ecosystem',
      sections: {
        'Introduction': 'Introduction',
        'Configuration': 'Configuration',
        'Core Commands': 'Core Commands',
        'Genesis Commands': 'Genesis Commands',
        'Bubblegum (Compressed NFTs)': 'Bubblegum (Compressed NFTs)',
        'Toolbox': 'Toolbox'
      },
      links: {
        'Overview': 'Overview',
        'Installation': 'Installation',
        'Wallets': 'Wallets',
        'RPCs': 'RPCs',
        'Explorer': 'Explorer',
        'Create Genesis Account': 'Create Genesis Account',
        'Launch Pool': 'Launch Pool',
        'Presale': 'Presale',
        'Manage': 'Manage',
        'Create Tree': 'Create Tree',
        'List Trees': 'List Trees',
        'Create Compressed NFT': 'Create Compressed NFT',
        'Fetch Compressed NFT': 'Fetch Compressed NFT',
        'Update Compressed NFT': 'Update Compressed NFT',
        'Transfer Compressed NFT': 'Transfer Compressed NFT',
        'Burn Compressed NFT': 'Burn Compressed NFT',
        'Add Metadata to Token': 'Add Metadata to Token',
        'Update Token Metadata': 'Update Token Metadata'
      }
    },
    ja: {
      headline: 'MPLX CLI',
      description: 'MPLXエコシステム用のCLI',
      sections: {
        'Introduction': '紹介',
        'Configuration': '設定',
        'Core Commands': 'Coreコマンド',
        'Genesis Commands': 'Genesisコマンド',
        'Bubblegum (Compressed NFTs)': 'Bubblegum（圧縮NFT）',
        'Toolbox': 'ツールボックス'
      },
      links: {
        'Overview': '概要',
        'Installation': 'インストール',
        'Wallets': 'ウォレット',
        'RPCs': 'RPC',
        'Explorer': 'エクスプローラー',
        'Create Genesis Account': 'Genesisアカウント作成',
        'Launch Pool': 'ローンチプール',
        'Presale': 'プレセール',
        'Manage': '管理',
        'Create Tree': 'ツリー作成',
        'List Trees': 'ツリー一覧',
        'Create Compressed NFT': '圧縮NFT作成',
        'Fetch Compressed NFT': '圧縮NFT取得',
        'Update Compressed NFT': '圧縮NFT更新',
        'Transfer Compressed NFT': '圧縮NFT転送',
        'Burn Compressed NFT': '圧縮NFTバーン',
        'Add Metadata to Token': 'トークンメタデータ追加',
        'Update Token Metadata': 'トークンメタデータ更新'
      }
    },
    ko: {
      headline: 'MPLX CLI',
      description: 'MPLX 에코시스템을 위한 CLI',
      sections: {
        'Introduction': '소개',
        'Configuration': '구성',
        'Core Commands': 'Core 명령어',
        'Genesis Commands': 'Genesis 명령어',
        'Bubblegum (Compressed NFTs)': 'Bubblegum (압축 NFT)',
        'Toolbox': '툴박스'
      },
      links: {
        'Overview': '개요',
        'Installation': '설치',
        'Wallets': '지갑',
        'RPCs': 'RPC',
        'Explorer': '익스플로러',
        'Create Genesis Account': 'Genesis 계정 생성',
        'Launch Pool': '런치 풀',
        'Presale': '프리세일',
        'Manage': '관리',
        'Create Tree': '트리 생성',
        'List Trees': '트리 목록',
        'Create Compressed NFT': '압축 NFT 생성',
        'Fetch Compressed NFT': '압축 NFT 조회',
        'Update Compressed NFT': '압축 NFT 업데이트',
        'Transfer Compressed NFT': '압축 NFT 전송',
        'Burn Compressed NFT': '압축 NFT 소각',
        'Add Metadata to Token': '토큰 메타데이터 추가',
        'Update Token Metadata': '토큰 메타데이터 업데이트'
      }
    },
    zh: {
      headline: 'MPLX CLI',
      description: 'MPLX生态系统的命令行工具',
      sections: {
        'Getting Started': '快速入门',
        'Configuration': '配置',
        'Core Commands': 'Core命令',
        'Candy Machine Commands': 'Candy Machine命令',
        'Genesis Commands': 'Genesis命令',
        'Bubblegum (Compressed NFTs)': 'Bubblegum（压缩NFT）',
        'Toolbox': '工具箱'
      },
      links: {
        'Introduction': '简介',
        'Installation': '安装',
        'Wallets': '钱包',
        'RPCs': 'RPC',
        'Explorer': '浏览器',
        'Create Asset': '创建资产',
        'Create Collection': '创建合集',
        'Update Asset': '更新资产',
        'Burn Asset': '销毁资产',
        'Fetch Asset or Collection': '获取资产或合集',
        'Add and Update Plugins': '添加和更新插件',
        'Overview': '概述',
        'Create Candy Machine': '创建Candy Machine',
        'Upload Assets': '上传资产',
        'Insert Items': '插入项目',
        'Validate Cache': '验证缓存',
        'Fetch Information': '获取信息',
        'Withdraw': '提取',
        'Create Tree': '创建树',
        'List Trees': '树列表',
        'Create Compressed NFT': '创建压缩NFT',
        'Fetch Compressed NFT': '获取压缩NFT',
        'Update Compressed NFT': '更新压缩NFT',
        'Transfer Compressed NFT': '转移压缩NFT',
        'Burn Compressed NFT': '销毁压缩NFT',
        'Token Creation': '创建代币',
        'Add Metadata to Token': '添加代币元数据',
        'Update Token Metadata': '更新代币元数据',
        'Token Transfer': '转移代币',
        'SOL Airdrop': 'SOL空投',
        'SOL Balance': 'SOL余额',
        'SOL Transfer': 'SOL转账',
        'Create Genesis Account': '创建Genesis账户',
        'Launch Pool': '发行池',
        'Presale': '预售',
        'Manage': '管理'
      }
    }
  }
}
