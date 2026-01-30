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
      <div className="text-sm font-medium text-muted-foreground">
        Language
      </div>
      <div className="flex overflow-auto">
        {languages.map((language) => {
          const isUmiDisabled = noUmi && language.name === 'umi';
          return (
            <button
              key={language.name}
              className={`-ms-px inline-flex min-w-16 flex-col items-center justify-center gap-1 border border-border bg-card px-10 py-2 text-xs font-medium text-foreground shadow-sm transition-colors first:ms-0 first:rounded-s-lg last:rounded-e-lg hover:bg-muted focus:z-10 focus:bg-primary focus:outline-none focus:ring-1 disabled:pointer-events-none disabled:opacity-50 ${
                activeLanguage === language.name
                  ? 'bg-primary text-primary-foreground hover:bg-primary'
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
                  <span className="text-xs text-muted-foreground">Coming Soon</span>
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
