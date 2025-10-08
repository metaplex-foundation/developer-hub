import { documentationSection } from '@/shared/sections';
import { SparklesIcon } from '@heroicons/react/24/outline';
import { Hero } from './Hero';

export const aura = {
  name: 'Aura',
  headline: 'Indexing and Data Availability Network',
  description:
    'A data network that extends Solana and the Solana Virtual Machine (SVM)',
  navigationMenuCatergory: 'Dev Tools',
  path: 'aura',
  icon: <SparklesIcon />,
  github: 'https://github.com/metaplex-foundation/aura/',
  className: 'accent-pink',
  primaryCta: {
    disabled: true,
  },
  heroes: [{ path: '/aura', component: Hero }],
  sections: [
    {
      ...documentationSection('aura'),
      navigation: [
        {
          title: 'Introduction',
          links: [
            {
              title: 'Overview',
              href: '/aura',
            },
            {
              title: 'FAQ',
              href: '/aura/faq',
            },
          ],
        },
        {
          title: 'Features',
          links: [
            {
              title: 'Reading Solana and SVM Data',
              href: '/aura/reading-solana-and-svm-data',
            },
          ],
        }
      ],
    },
  ],
  localizedNavigation: {
    en: {
      headline: 'Indexing and Data Availability Network',
      description: 'A data network that extends Solana and the Solana Virtual Machine (SVM)',
      sections: {
        'Introduction': 'Introduction',
        'Features': 'Features'
      },
      links: {
        'Overview': 'Overview',
        'FAQ': 'FAQ',
        'Reading Solana and SVM Data': 'Reading Solana and SVM Data'
      }
    },
    jp: {
      headline: 'インデックス作成・データ可用性ネットワーク',
      description: 'SolanaとSolana Virtual Machine（SVM）を拡張するデータネットワーク',
      sections: {
        'Introduction': '紹介',
        'Features': '機能'
      },
      links: {
        'Overview': '概要',
        'FAQ': 'よくある質問',
        'Reading Solana and SVM Data': 'SolanaとSVMデータの読み取り'
      }
    },
    kr: {
      headline: '인덱싱 및 데이터 가용성 네트워크',
      description: 'Solana와 Solana Virtual Machine(SVM)을 확장하는 데이터 네트워크',
      sections: {
        'Introduction': '소개',
        'Features': '기능'
      },
      links: {
        'Overview': '개요',
        'FAQ': '자주 묻는 질문',
        'Reading Solana and SVM Data': 'Solana 및 SVM 데이터 읽기'
      }
    }
  }
}
