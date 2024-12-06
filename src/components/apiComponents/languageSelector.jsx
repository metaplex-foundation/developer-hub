const languages = [
  'javascript',
  'python',
  'ruby',
  'go',
  'java',
  'csharp',
  'swift',
  'kotlin',
  'php',
  'typescript',
  'shell',
  'curl',
]

const LanguageSelector = ({ activeLanguage, setActiveLanguage }) => {
  return (
    <div className="flex flex-col gap-2">
        <div>Language Selector</div>
      <div className="flex gap-4 overflow-auto py-2">
        {languages
          .sort((a, b) => a.localeCompare(b))
          .map((language) => (
            <button
              key={language}
              className={`rounded-md px-4 py-2 ${
                activeLanguage === language
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
              onClick={() => setActiveLanguage(language)}
            >
              {language}
            </button>
          ))}
      </div>
    </div>
  )
}

export default LanguageSelector
