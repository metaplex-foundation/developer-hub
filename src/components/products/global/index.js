import { Hero } from './Hero';
import { Logo } from './Logo';

export const global = {
  name: 'Metaplex',
  headline: 'Developer Hub',
  description: 'One place for all Metaplex developer resources.',
  path: '',
  isFallbackProduct: true,
  icon: <Logo />,
  github: 'https://github.com/metaplex-foundation',
  className: 'accent-sky',
  heroes: [{ path: '/', component: Hero }],
  sections: [],
  localizedNavigation: {
    en: {
      headline: 'Developer Hub',
      description: 'One place for all Metaplex developer resources.',
    },
    ja: {
      headline: 'デベロッパーハブ',
      description: 'Metaplexの全開発者リソースを一箇所にまとめたハブ。',
    },
    ko: {
      headline: '개발자 허브',
      description: '모든 Metaplex 개발자 리소스를 한 곳에 모은 허브입니다.',
    }
  }
}
