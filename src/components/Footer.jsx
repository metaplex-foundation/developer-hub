'use client'

import { DiscordIcon, GitHubIcon, XIcon } from '@/components/icons/SocialIcons';
import { useLocale, useTranslations } from '@/contexts/LocaleContext';
import { getLocalizedHref } from '@/config/languages';
import Link from 'next/link';

export function Footer() {
  const t = useTranslations('footer')
  const { locale } = useLocale()

  return (
    <footer className="border-t border-neutral-800 bg-neutral-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo and copyright */}
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
            <Link href={getLocalizedHref('/', locale)} className="flex items-center gap-3">
              <img
                src="/metaplex-logo-white.png"
                alt="Metaplex"
                className="h-4 w-auto"
              />
            </Link>
            <p className="text-sm text-neutral-400">
              &copy; {new Date().getFullYear()} Metaplex Foundation.
              <br />{t('allRightsReserved', 'All rights reserved.')}
            </p>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-white">
              {t('resources', 'Resources')}
            </h3>
            <div className="flex flex-col gap-2 text-sm text-neutral-400">
              <Link
                href={getLocalizedHref('/official-links', locale)}
                className="hover:text-neutral-200 transition-colors"
              >
                {t('officialLinks', 'Official Links')}
              </Link>
              <Link
                href={getLocalizedHref('/smart-contracts/security', locale)}
                className="hover:text-neutral-200 transition-colors"
              >
                {t('security', 'Security')}
              </Link>
              <Link
                href={getLocalizedHref('/protocol-fees', locale)}
                className="hover:text-neutral-200 transition-colors"
              >
                {t('protocolFees', 'Protocol Fees')}
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-white">
              {t('legal', 'Legal')}
            </h3>
            <div className="flex flex-col gap-2 text-sm text-neutral-400">
              <Link
                href="https://www.metaplex.com/terms-and-conditions"
                target="_blank"
                className="hover:text-neutral-200 transition-colors"
              >
                {t('termsAndConditions', 'Terms & Conditions')}
              </Link>
              <Link
                href="https://www.metaplex.com/privacy-policy"
                target="_blank"
                className="hover:text-neutral-200 transition-colors"
              >
                {t('privacyPolicy', 'Privacy Policy')}
              </Link>
            </div>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-white">
              {t('connect', 'Connect')}
            </h3>
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/metaplex-foundation"
                className="group"
                aria-label="GitHub"
                target="_blank"
              >
                <GitHubIcon className="h-5 w-5 fill-neutral-400 transition-colors group-hover:fill-neutral-200" />
              </Link>
              <Link
                href="https://discord.com/invite/metaplex"
                className="group"
                aria-label="Discord"
                target="_blank"
              >
                <DiscordIcon className="h-5 w-5 fill-neutral-400 transition-colors group-hover:fill-neutral-200" />
              </Link>
              <Link
                href="https://x.com/metaplex"
                className="group"
                aria-label="X"
                target="_blank"
              >
                <XIcon className="h-5 w-5 fill-neutral-400 transition-colors group-hover:fill-neutral-200" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
