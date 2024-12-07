import { useState } from 'react'
import EndPointSelector from './endPointSelector'
import CSharpRequestRenderer from './languageComponents/cSharpRenderer'
import CurlRequestRenderer from './languageComponents/curlRequestRenderer'
import GoRequestRenderer from './languageComponents/goRequestRenderer'
import JavaRenderer from './languageComponents/javaRenderer'
import JavascriptRequestRenderer from './languageComponents/javascriptRequestRenderer'
import PhpRenderer from './languageComponents/phpRenderer'
import PythonRequestRenderer from './languageComponents/pythonRequestRenderer'
import LanguageSelector from './languageSelector'

const LanguageRenderer = ({ api, playgroundParams }) => {
  const [activeEndpoint, setActiveEndpoint] = useState(
    'https://aura-mainnet.metaplex.com'
  )
  const [activeLanguage, setActiveLanguage] = useState('javascript')

  function strToTitleCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const [responce, setResponce] = useState('')

  const renderLanguage = (activeLanguage) => {
    switch (activeLanguage) {
      case 'javascript':
        return (
          <div className="flex flex-col">
            <div className="-mb-3 text-sm font-medium text-gray-800 dark:text-neutral-400">
              {strToTitleCase(activeLanguage)} Request
            </div>
            <JavascriptRequestRenderer
              method={api.method}
              url={activeEndpoint}
              headers={api.headers}
              body={api.params}
            />
          </div>
        )

      case 'python':
        return (
          <div className="flex flex-col">
            <div className="-mb-3 text-sm font-medium text-gray-800 dark:text-neutral-400">
              {strToTitleCase(activeLanguage)} Request
            </div>
            <PythonRequestRenderer
              method={api.method}
              url={activeEndpoint}
              headers={api.headers}
              body={api.params}
            />
          </div>
        )

      case 'curl':
        return (
          <div className="flex flex-col">
            <div className="-mb-3 text-sm font-medium text-gray-800 dark:text-neutral-400">
              {strToTitleCase(activeLanguage)} Request
            </div>
            <CurlRequestRenderer
              method={api.method}
              url={activeEndpoint}
              headers={api.headers}
              body={api.params}
            />
          </div>
        )

      case 'go':
        return (
          <div className="flex flex-col">
            <div className="-mb-3 text-sm font-medium text-gray-800 dark:text-neutral-400">
              {strToTitleCase(activeLanguage)} Request
            </div>
            <GoRequestRenderer
              method={api.method}
              url={activeEndpoint}
              headers={api.headers}
              body={api.params}
            />
          </div>
        )

      case 'csharp':
        return (
          <div className="flex flex-col">
            <div className="-mb-3 text-sm font-medium text-gray-800 dark:text-neutral-400">
              {strToTitleCase(activeLanguage)} Request
            </div>
            <CSharpRequestRenderer
              method={api.method}
              url={activeEndpoint}
              headers={api.headers}
              body={api.params}
            />
          </div>
        )

      case 'java':
        return (
          <div className="flex flex-col">
            <div className="-mb-3 text-sm font-medium text-gray-800 dark:text-neutral-400">
              {strToTitleCase(activeLanguage)} Request
            </div>
            <JavaRenderer
              method={api.method}
              url={activeEndpoint}
              headers={api.headers}
              body={api.params}
            />
          </div>
        )

      case 'php':
        return (
          <div className="flex flex-col">
            <div className="-mb-3 text-sm font-medium text-gray-800 dark:text-neutral-400">
              {strToTitleCase(activeLanguage)} Request
            </div>
            <PhpRenderer
              method={api.method}
              url={activeEndpoint}
              headers={api.headers}
              body={api.params}
            />
          </div>
        )
    }
  }

  return (
    <div className="flex w-full flex-col gap-8 overflow-hidden">
      <EndPointSelector
        setActiveEndpoint={(endpoint) => setActiveEndpoint(endpoint)}
      />
      <LanguageSelector
        activeLanguage={activeLanguage}
        setActiveLanguage={(language) => setActiveLanguage(language)}
      />
      {renderLanguage(activeLanguage)}
    </div>
  )
}

export default LanguageRenderer
