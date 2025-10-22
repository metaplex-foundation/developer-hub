import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { SUPPORTED_LANGUAGES } from './config/languages';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!SUPPORTED_LANGUAGES.includes(locale)) notFound();

  return {
    messages: (await import(`./locales/${locale}.json`)).default
  };
});