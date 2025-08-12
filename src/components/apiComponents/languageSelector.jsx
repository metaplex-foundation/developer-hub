import { Icon } from '@/components/icons';

const languages = [
  { name: 'umi', icon: 'SolidCodeBracketSquare' },
  { name: 'curl', icon: 'CurlIcon' },
  { name: 'javascript', icon: 'JavaScriptIcon' },
  { name: 'python', icon: 'PythonIcon' },
  { name: 'php', icon: 'PhpIcon' },
  { name: 'go', icon: 'GoIcon' },
  // { name: 'ruby', icon: 'RubyIcon' },
  // { name: 'kotlin', icon: 'KotlinIcon' },
  { name: 'java', icon: 'JavaIcon' },
  // { name: 'swift', icon: 'SwiftIcon' },
  { name: 'rust', icon: 'RustIcon' },
  { name: 'csharp', icon: 'CSharpIcon' },
]

const LanguageSelector = ({ activeLanguage, setActiveLanguage, noUmi }) => {
  return (
    <div className="scrollbar flex flex-col gap-2">
      <div className="text-sm font-medium text-gray-800 dark:text-neutral-400">
        Language
      </div>
      <div className="flex overflow-auto">
        {languages.map((language) => {
          const isUmiDisabled = noUmi && language.name === 'umi';
          return (
            <button
              key={language.name}
              className={`-ms-px inline-flex min-w-16 flex-col items-center justify-center gap-1 border border-gray-200 px-10 py-2 text-xs font-medium text-gray-800 shadow-sm transition-colors first:ms-0 first:rounded-s-lg last:rounded-e-lg hover:bg-gray-50 focus:z-10 focus:bg-accent-300 focus:outline-none focus:ring-1 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800 ${
                activeLanguage === language.name
                  ? 'bg-accent-300 text-black hover:bg-accent-300 dark:bg-accent-300 dark:text-black dark:hover:bg-accent-300'
                  : ''
              } ${isUmiDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !isUmiDisabled && setActiveLanguage(language.name)}
              disabled={isUmiDisabled}
              title={isUmiDisabled ? 'UMI support coming soon' : ''}
            >
              <Icon icon={language.icon} className="h-4 w-4" />
              <div className="flex flex-col items-center">
                <span>{language.name}</span>
                {isUmiDisabled && (
                  <span className="text-xs text-gray-500 dark:text-neutral-500">Coming Soon</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  )
}

export default LanguageSelector
