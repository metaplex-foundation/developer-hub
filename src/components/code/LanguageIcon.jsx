/**
 * LanguageIcon - Display icon for programming language
 *
 * Shows a visual icon/badge for the given programming language.
 * Uses text badges for now, can be enhanced with SVG icons later.
 *
 * @param {Object} props
 * @param {string} props.language - Programming language (e.g., 'javascript', 'rust')
 * @param {string} props.className - Additional CSS classes
 */
export function LanguageIcon({ language, className = '' }) {
  const languageConfig = {
    javascript: {
      label: 'JS',
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    typescript: {
      label: 'TS',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    },
    rust: {
      label: 'RS',
      color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    },
    python: {
      label: 'PY',
      color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    },
    java: {
      label: 'JAVA',
      color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    },
    kotlin: {
      label: 'KT',
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    },
    csharp: {
      label: 'C#',
      color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    },
    php: {
      label: 'PHP',
      color: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400',
    },
    ruby: {
      label: 'RB',
      color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
    },
    go: {
      label: 'GO',
      color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
    },
    swift: {
      label: 'SWIFT',
      color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    },
    bash: {
      label: 'SH',
      color: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
    },
    shell: {
      label: 'SH',
      color: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
    },
  }

  const config = languageConfig[language.toLowerCase()] || {
    label: language.toUpperCase().slice(0, 4),
    color: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
  }

  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ${config.color} ${className}`}
      title={language}
    >
      {config.label}
    </span>
  )
}

/**
 * Get language display name
 */
export function getLanguageLabel(language) {
  const labels = {
    javascript: 'JavaScript',
    typescript: 'TypeScript',
    rust: 'Rust',
    python: 'Python',
    java: 'Java',
    kotlin: 'Kotlin',
    csharp: 'C#',
    php: 'PHP',
    ruby: 'Ruby',
    go: 'Go',
    swift: 'Swift',
    bash: 'Bash',
    shell: 'Shell',
  }

  return labels[language.toLowerCase()] || language.charAt(0).toUpperCase() + language.slice(1)
}
