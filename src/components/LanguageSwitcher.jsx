import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useLocale } from '@/contexts/LocaleContext'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'jp', name: '日本語', flag: '🇯🇵' },
  { code: 'kr', name: '한국어', flag: '🇰🇷' },
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
    if (targetLocale === 'en') {
      // For English, remove any locale prefix and return root path
      if (pathname.startsWith('/jp')) {
        return pathname.replace(/^\/jp/, '') || '/'
      }
      if (pathname.startsWith('/kr')) {
        return pathname.replace(/^\/kr/, '') || '/'
      }
      return pathname
    } else {
      // For other locales, add the locale prefix
      if (pathname.startsWith('/jp') || pathname.startsWith('/kr')) {
        // Replace existing locale prefix
        return pathname.replace(/^\/[a-z]{2}/, `/${targetLocale}`)
      } else {
        // Add locale prefix to English path
        return `/${targetLocale}${pathname === '/' ? '' : pathname}`
      }
    }
  }

  const currentLanguage = languages.find(lang => lang.code === locale)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-2 py-1 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-300 transition-colors"
        aria-label="Select language"
      >
        <span className="text-base">{currentLanguage?.flag}</span>
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
        <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
          {languages.map((lang) => (
            <Link
              key={lang.code}
              href={getLocalizedPath(lang.code)}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-2 px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                locale === lang.code
                  ? 'text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}