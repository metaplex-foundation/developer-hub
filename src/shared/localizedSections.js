// Localized section helpers that work with our locale context

export const getLocalizedSections = (locale) => {
  const translations = {
    en: {
      documentation: 'Documentation',
      references: 'API References',
      guides: 'Guides',
      recipes: 'Recipes',
      changelog: 'Changelog'
    },
    ja: {
      documentation: 'ドキュメント',
      references: 'APIリファレンス',
      guides: 'ガイド',
      recipes: 'レシピ',
      changelog: '変更履歴'
    },
    ko: {
      documentation: '문서',
      references: 'API 참조',
      guides: '가이드',
      recipes: '레시피',
      changelog: '변경 로그'
    },
    zh: {
      documentation: '文档',
      references: 'API参考',
      guides: '指南',
      recipes: '示例',
      changelog: '更新日志'
    }
  }

  const t = translations[locale] || translations.en

  return {
    documentationSection: (productSlug) => ({
      id: 'documentation',
      title: t.documentation,
      icon: 'SolidBookOpen',
      href: `/${productSlug}`,
      isFallbackSection: true,
    }),

    referencesSection: (productSlug) => ({
      id: 'references',
      title: t.references,
      icon: 'SolidCodeBracketSquare',
      href: `/${productSlug}/references`,
    }),

    guidesSection: (productSlug) => ({
      id: 'guides',
      title: t.guides,
      icon: 'SolidRectangleStack',
      href: `/${productSlug}/guides`,
    }),

    recipesSection: (productSlug) => ({
      id: 'recipes',
      title: t.recipes,
      icon: 'SolidRectangleStack',
      href: `/${productSlug}/recipes`,
    }),

    changelogSection: (productSlug) => ({
      id: 'changelog',
      title: t.changelog,
      icon: 'SolidClock',
      href: `/${productSlug}/changelog`,
    }),
  }
}

