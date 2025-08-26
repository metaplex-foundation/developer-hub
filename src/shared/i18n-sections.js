import { useTranslations } from 'next-intl';

export const useI18nSections = () => {
  const t = useTranslations('sections');
  
  return {
    documentationSection: (productSlug) => ({
      id: 'documentation',
      title: t('documentation'),
      icon: 'SolidBookOpen',
      href: `/${productSlug}`,
      isFallbackSection: true,
    }),

    referencesSection: (productSlug) => ({
      id: 'references',
      title: t('references'),
      icon: 'SolidCodeBracketSquare',
      href: `/${productSlug}/references`,
    }),

    guidesSection: (productSlug) => ({
      id: 'guides',
      title: t('guides'),
      icon: 'SolidRectangleStack',
      href: `/${productSlug}/guides`,
    }),

    recipesSection: (productSlug) => ({
      id: 'recipes',
      title: 'Recipes', // Not translated yet
      icon: 'SolidRectangleStack',
      href: `/${productSlug}/recipes`,
    }),

    changelogSection: (productSlug) => ({
      id: 'changelog',
      title: t('changelog'),
      icon: 'SolidClock',
      href: `/${productSlug}/changelog`,
    }),
  };
};

// Server-side versions for static generation
export const getI18nSections = (t) => ({
  documentationSection: (productSlug) => ({
    id: 'documentation',
    title: t('sections.documentation'),
    icon: 'SolidBookOpen',
    href: `/${productSlug}`,
    isFallbackSection: true,
  }),

  referencesSection: (productSlug) => ({
    id: 'references',
    title: t('sections.references'),
    icon: 'SolidCodeBracketSquare',
    href: `/${productSlug}/references`,
  }),

  guidesSection: (productSlug) => ({
    id: 'guides',
    title: t('sections.guides'),
    icon: 'SolidRectangleStack',
    href: `/${productSlug}/guides`,
  }),

  recipesSection: (productSlug) => ({
    id: 'recipes',
    title: 'Recipes', // Not translated yet
    icon: 'SolidRectangleStack',
    href: `/${productSlug}/recipes`,
  }),

  changelogSection: (productSlug) => ({
    id: 'changelog',
    title: t('sections.changelog'),
    icon: 'SolidClock',
    href: `/${productSlug}/changelog`,
  }),
});