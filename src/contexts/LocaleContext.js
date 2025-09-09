import { createContext, useContext, useMemo, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import enMessages from '@/locales/en.json'
import jpMessages from '@/locales/jp.json'
import krMessages from '@/locales/kr.json'

const LocaleContext = createContext()

const messages = {
  en: enMessages,
  jp: jpMessages,
  kr: krMessages,
}

export function LocaleProvider({ children }) {
  const { pathname, asPath } = useRouter()
  const [clientPath, setClientPath] = useState('')

  // Get the actual browser URL on client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setClientPath(window.location.pathname)
    }
  }, [])

  // Detect locale from pathname, with fallback to client path for 404 pages
  const locale = useMemo(() => {
    let pathToCheck = pathname
    
    // For 404 pages, use different strategies
    if (pathname === '/404') {
      pathToCheck = asPath || clientPath
    }
    
    if (pathToCheck.startsWith('/jp')) return 'jp'
    if (pathToCheck.startsWith('/kr')) return 'kr'
    return 'en' // Default to English for root paths
  }, [pathname, asPath, clientPath])

  // Get messages for current locale, fallback to English
  const currentMessages = messages[locale] || messages.en

  const value = useMemo(() => ({
    locale,
    messages: currentMessages,
    t: (key, fallback = key) => {
      const keys = key.split('.')
      let value = currentMessages
      
      for (const k of keys) {
        value = value?.[k]
        if (value === undefined) break
      }
      
      return value || fallback
    }
  }), [locale, currentMessages])

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}

// Helper hook for translations
export function useTranslations(namespace = '') {
  const { t } = useLocale()
  
  return (key, fallback) => {
    const fullKey = namespace ? `${namespace}.${key}` : key
    return t(fullKey, fallback)
  }
}