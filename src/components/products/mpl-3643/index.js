import { documentationSection } from '@/shared/sections';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

export const mpl3643 = {
  name: 'MPL-3643',
  skill: true,
  headline: 'Permissioned token standard for RWAs.',
  description:
    'A suite of onchain programs that enables the issuance, management, and transfer of permissioned tokens on Solana, built on Token-2022, Token ACL, and the Solana Attestation Service.',
  navigationMenuCatergory: 'Smart Contracts',
  path: 'smart-contracts/mpl-3643',
  icon: <ShieldCheckIcon />,
  className: 'accent-sky',
  protocolFees: {
    assetConfiguration: {
      label: 'Asset configuration (once per configuration or amendment)',
      solana: '0.063 SOL',
      payer: 'Issuer',
      notes: null,
    },
    holderAccountActivation: {
      label: 'Holder account activation (once per holder)',
      solana: '0.034 SOL',
      payer: 'Issuer',
      notes: null,
    },
    distributionExecution: {
      label: 'Distribution execution (once per recipient)',
      solana: '0.00085 SOL',
      payer: 'Issuer',
      notes: null,
    },
  },
  sections: [
    {
      ...documentationSection('smart-contracts/mpl-3643'),
      title: '',
      navigation: [
        {
          title: 'Introduction',
          links: [
            {
              title: 'Overview',
              href: '/smart-contracts/mpl-3643',
            },
            {
              title: 'Getting Started',
              href: '/smart-contracts/mpl-3643/getting-started',
            },
          ],
        },
      ],
    },
  ],
  localizedNavigation: {
    en: {
      headline: 'Permissioned token standard for RWAs.',
      description:
        'A suite of onchain programs that enables the issuance, management, and transfer of permissioned tokens on Solana, built on Token-2022, Token ACL, and the Solana Attestation Service.',
      sections: {
        Introduction: 'Introduction',
      },
      links: {
        Overview: 'Overview',
        'Getting Started': 'Getting Started',
      },
    },
    ja: {
      headline: 'RWAのためのパーミッションドトークン標準',
      description:
        'Token-2022、Token ACL、Solana Attestation Service上に構築された、Solana上でパーミッションドトークンの発行・管理・移転を可能にするオンチェーンプログラム群。',
      sections: {
        Introduction: '紹介',
      },
      links: {
        Overview: '概要',
        'Getting Started': 'はじめに',
      },
    },
    ko: {
      headline: 'RWA를 위한 허가형 토큰 표준',
      description:
        'Token-2022, Token ACL, Solana Attestation Service 위에 구축되어 Solana에서 허가형 토큰의 발행, 관리, 전송을 지원하는 온체인 프로그램 모음입니다.',
      sections: {
        Introduction: '소개',
      },
      links: {
        Overview: '개요',
        'Getting Started': '시작하기',
      },
    },
    zh: {
      headline: '面向 RWA 的许可型代币标准',
      description:
        '基于 Token-2022、Token ACL 和 Solana Attestation Service 构建的链上程序套件，支持在 Solana 上发行、管理和转移许可型代币。',
      sections: {
        Introduction: '简介',
      },
      links: {
        Overview: '概述',
        'Getting Started': '快速入门',
      },
    },
  },
};
