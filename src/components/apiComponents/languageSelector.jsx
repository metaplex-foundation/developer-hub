import { Icon } from '@/components/icons'

const languages = [
  { name: 'javascript', icon: 'JavaScriptIcon' },
  { name: 'python', icon: 'PythonIcon' },
  { name: 'ruby', icon: 'RubyIcon' },
  { name: 'go', icon: 'GoIcon' },
  { name: 'java', icon: 'JavaIcon' },
  { name: 'csharp', icon: 'CSharpIcon' },
  { name: 'swift', icon: 'SwiftIcon' },
  { name: 'kotlin', icon: 'KotlinIcon' },
  { name: 'php', icon: 'PhpIcon' },
  // { name: 'typescript', icon: 'TypescriptIcon' },
  { name: 'shell', icon: 'ShellIcon' },
  { name: 'curl', icon: 'CurlIcon' },
  { name: 'rust', icon: 'RustIcon' },
]

const LanguageSelector = ({ activeLanguage, setActiveLanguage }) => {
  return (
    <div className="scrollbar flex flex-col gap-2">
      <div className="text-sm font-medium text-gray-800 dark:text-neutral-400">
        Language
      </div>
      <div className="flex overflow-auto">
        {languages
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((language) => (
            <button
              key={language.name}
              className={`min-w-16 -ms-px inline-flex flex-col items-center justify-center gap-1 border border-gray-200 px-10 py-2 text-xs font-medium text-gray-800 shadow-sm transition-colors first:ms-0 first:rounded-s-lg last:rounded-e-lg hover:bg-gray-50 focus:z-10 focus:bg-accent-300 focus:outline-none focus:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800 ${activeLanguage === language.name
                  ? 'bg-accent-300 text-black hover:bg-accent-300 dark:bg-accent-300 dark:text-black dark:hover:bg-accent-300'
                  : ''
                }`}
              onClick={() => setActiveLanguage(language.name)}
            >
              <Icon icon={language.icon} className="h-4 w-4" />
              {language.name}
            </button>
          ))}
      </div>
    </div>
  )
}

export default LanguageSelector
