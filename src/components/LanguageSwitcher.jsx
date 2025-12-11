import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useLocale } from '@/contexts/LocaleContext'

const languages = [
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'ja', label: 'JA', name: '日本語' },
  { code: 'ko', label: 'KO', name: '한국어' },
]

export function LanguageSwitcher() {
  const { locale } = useLocale()
  const { pathname } = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getLocalizedPath = (targetLocale) => {
    // First, normalize the pathname by removing any locale prefix (/en, /ja, /ko)
    let normalizedPath = pathname
    if (pathname.startsWith('/en/') || pathname === '/en') {
      normalizedPath = pathname.slice('/en'.length) || '/'
    } else if (pathname.startsWith('/ja/') || pathname === '/ja') {
      normalizedPath = pathname.slice('/ja'.length) || '/'
    } else if (pathname.startsWith('/ko/') || pathname === '/ko') {
      normalizedPath = pathname.slice('/ko'.length) || '/'
    }

    if (targetLocale === 'en') {
      // For English, return the normalized path (root URL)
      return normalizedPath
    } else {
      // For other locales, add the locale prefix
      return `/${targetLocale}${normalizedPath === '/' ? '' : normalizedPath}`
    }
  }

  const currentLanguage = languages.find(lang => lang.code === locale)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
        aria-label="Select language"
      >
        <span>{currentLanguage?.label}</span>
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 min-w-[120px] bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
          {languages.map((lang) => (
            <Link
              key={lang.code}
              href={getLocalizedPath(lang.code)}
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                locale === lang.code
                  ? 'text-accent-500 font-medium'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>{lang.name}</span>
              <span className="text-xs text-slate-400">{lang.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}