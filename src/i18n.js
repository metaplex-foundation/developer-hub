import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Can be imported from a shared config
const locales = ['en', 'jp'];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) notFound();

  return {
    messages: (await import(`./locales/${locale}.json`)).default
  };
});