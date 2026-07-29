import { documentationSection } from '@/shared/sections'
import { DevicePhoneMobileIcon } from '@heroicons/react/24/solid'

export const mobileSdks = {
  name: 'Mobile SDKs',
  headline: 'Android and iOS SDKs',
  description: 'Community Android and iOS SDKs for reading Metaplex NFT data. Deprecated.',
  navigationMenuCatergory: 'Dev Tools',
  path: 'dev-tools/mobile-sdks',
  icon: <DevicePhoneMobileIcon />,
  github: '',
  className: 'accent-sky',
  deprecated: true,
  sections: [
    {
      ...documentationSection('dev-tools/mobile-sdks'),
      navigation: [
        {
          title: 'Mobile SDKs',
          links: [
            { title: 'Overview', href: '/dev-tools/mobile-sdks' },
            { title: 'Android SDK', href: '/dev-tools/mobile-sdks/android' },
            { title: 'iOS SDK', href: '/dev-tools/mobile-sdks/ios' },
          ],
        },
      ],
    },
  ],
  localizedNavigation: {
    ja: {
      headline: 'AndroidとiOSのSDK',
      description: 'Metaplex NFTデータを読み取るためのコミュニティ製Android・iOS SDK。非推奨。',
      sections: { 'Mobile SDKs': 'モバイルSDK' },
      links: { 'Overview': '概要', 'Android SDK': 'Android SDK', 'iOS SDK': 'iOS SDK' },
    },
    ko: {
      headline: 'Android 및 iOS SDK',
      description: 'Metaplex NFT 데이터를 읽기 위한 커뮤니티 Android·iOS SDK입니다. 지원 중단됨.',
      sections: { 'Mobile SDKs': '모바일 SDK' },
      links: { 'Overview': '개요', 'Android SDK': 'Android SDK', 'iOS SDK': 'iOS SDK' },
    },
    zh: {
      headline: 'Android与iOS SDK',
      description: '用于读取Metaplex NFT数据的社区Android和iOS SDK。已弃用。',
      sections: { 'Mobile SDKs': '移动SDK' },
      links: { 'Overview': '概述', 'Android SDK': 'Android SDK', 'iOS SDK': 'iOS SDK' },
    },
  },
}
