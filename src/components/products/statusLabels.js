// Localized labels for product lifecycle status (deprecated / legacy),
// shared by the nav menus, product card grids, and the page banner.
const statusLabels = {
  en: {
    deprecated: 'Deprecated',
    legacy: 'Legacy',
    deprecatedText: (name) =>
      `${name} is deprecated and is no longer actively maintained.`,
    legacyText: (name) =>
      `${name} is a legacy program. It remains supported, but is not recommended for new projects.`,
    useInstead: { before: 'Use ', after: ' instead.' },
  },
  ja: {
    deprecated: '非推奨',
    legacy: 'レガシー',
    deprecatedText: (name) =>
      `${name}は非推奨となり、積極的なメンテナンスは行われていません。`,
    legacyText: (name) =>
      `${name}はレガシープログラムです。引き続きサポートされますが、新規プロジェクトには推奨されません。`,
    useInstead: { before: '代わりに', after: 'を使用してください。' },
  },
  ko: {
    deprecated: '지원 중단',
    legacy: '레거시',
    deprecatedText: (name) =>
      `${name}은(는) 지원이 중단되어 더 이상 적극적으로 유지 관리되지 않습니다.`,
    legacyText: (name) =>
      `${name}은(는) 레거시 프로그램입니다. 계속 지원되지만 새 프로젝트에는 권장되지 않습니다.`,
    useInstead: { before: '대신 ', after: ' 사용을 권장합니다.' },
  },
  zh: {
    deprecated: '已弃用',
    legacy: '旧版',
    deprecatedText: (name) => `${name} 已弃用，不再进行积极维护。`,
    legacyText: (name) =>
      `${name} 是旧版程序。仍受支持，但不建议用于新项目。`,
    useInstead: { before: '请改用', after: '。' },
  },
}

export function getStatusLabels(locale) {
  return statusLabels[locale] ?? statusLabels.en
}
