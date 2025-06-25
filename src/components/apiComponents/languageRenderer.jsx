import { useState } from 'react';
import EndPointSelector from './endPointSelector';
import CSharpRequestRenderer from './languageComponents/cSharpRenderer';
import CurlRequestRenderer from './languageComponents/curlRequestRenderer';
import GoRequestRenderer from './languageComponents/goRequestRenderer';
import JavaRenderer from './languageComponents/javaRenderer';
import JavascriptRequestRenderer from './languageComponents/javascriptRequestRenderer';
import PhpRenderer from './languageComponents/phpRenderer';
import PythonRequestRenderer from './languageComponents/pythonRequestRenderer';
import RubyRenderer from './languageComponents/rubyRenderer';
import RustRequestRenderer from './languageComponents/rustRenderer';
import SwiftRequestRenderer from './languageComponents/swiftRenderer';
import UmiRequestRenderer from './languageComponents/umiRequestRenderer';
import LanguageSelector from './languageSelector';

const LanguageRenderer = ({ api, body, setActiveEndpoint, activeEndpoint }) => {
  const [activeLanguage, setActiveLanguage] = useState('javascript')

  function strToTitleCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const renderLanguage = (activeLanguage) => {
    const headers = api.headers
      ? api.headers
      : { 'Content-Type': 'application/json' }

    switch (activeLanguage) {
      case 'javascript':
        return (
          <div className="flex flex-col">
            <div className="-mb-3 text-sm font-medium text-gray-800 dark:text-neutral-400">
              {strToTitleCase(activeLanguage)} Request Example
            </div>
            <JavascriptRequestRenderer
              method={api.method}
              url={activeEndpoint}
              headers={headers}
              bodyMethod={body.method}
              bodyParams={body.params}
            />
          </div>
        )

      case 'python':
        return (
          <div className="flex flex-col">
            <div className="-mb-3 text-sm font-medium text-gray-800 dark:text-neutral-400">
              {strToTitleCase(activeLanguage)} Request Example
            </div>
            <PythonRequestRenderer
              method={api.method}
              url={activeEndpoint}
              headers={headers}
              bodyMethod={body.method}
              bodyParams={body.params}
            />
          </div>
        )

      case 'curl':
        return (
          <div className="flex flex-col">
            <div className="-mb-3 text-sm font-medium text-gray-800 dark:text-neutral-400">
              {strToTitleCase(activeLanguage)} Request Example
            </div>
            <CurlRequestRenderer
              method={api.method}
              url={activeEndpoint}
              headers={headers}
              bodyMethod={body.method}
              bodyParams={body.params}
            />
          </div>
        )

      case 'go':
        return (
          <div className="flex flex-col">
            <div className="-mb-3 text-sm font-medium text-gray-800 dark:text-neutral-400">
              {strToTitleCase(activeLanguage)} Request Example
            </div>
            <GoRequestRenderer
              method={api.method}
              url={activeEndpoint}
              headers={headers}
              bodyMethod={body.method}
              bodyParams={body.params}
            />
          </div>
        )

      case 'csharp':
        return (
          <div className="flex flex-col">
            <div className="-mb-3 text-sm font-medium text-gray-800 dark:text-neutral-400">
              {strToTitleCase(activeLanguage)} Request Example
            </div>
            <CSharpRequestRenderer
              method={api.method}
              url={activeEndpoint}
              // headers={headers}
              bodyMethod={body.method}
              bodyParams={body.params}
            />
          </div>
        )

      case 'java':
        return (
          <div className="flex flex-col">
            <div className="-mb-3 text-sm font-medium text-gray-800 dark:text-neutral-400">
              {strToTitleCase(activeLanguage)} Request Example
            </div>
            <JavaRenderer
              method={api.method}
              url={activeEndpoint}
              headers={headers}
              bodyMethod={body.method}
              bodyParams={body.params}
            />
          </div>
        )

      case 'php':
        return (
          <div className="flex flex-col">
            <div className="-mb-3 text-sm font-medium text-gray-800 dark:text-neutral-400">
              {strToTitleCase(activeLanguage)} Request Example
            </div>
            <PhpRenderer
              method={api.method}
              url={activeEndpoint}
              headers={headers}
              bodyMethod={body.method}
              bodyParams={body.params}
            />
          </div>
        )
      // case 'kotlin':
      //   return (
      //     <div className="flex flex-col">
      //       <div className="-mb-3 text-sm font-medium text-gray-800 dark:text-neutral-400">
      //         {strToTitleCase(activeLanguage)} Request Example
      //       </div>
      //       <KotlinRenderer
      //         method={api.method}
      //         url={activeEndPoint}
      //         headers={headers}
      //         bodyMethod={body.method}
      //         bodyParams={body.params}
      //       />
      //     </div>
      //   )
      case 'ruby':
        return (
          <div className="flex flex-col">
            <div className="-mb-3 text-sm font-medium text-gray-800 dark:text-neutral-400">
              {strToTitleCase(activeLanguage)} Request Example
            </div>
            <RubyRenderer
              method={api.method}
              url={activeEndpoint}
              headers={headers}
              bodyMethod={body.method}
              bodyParams={body.params}
            />
          </div>
        )
      case 'rust':
        return (
          <div className="flex flex-col">
            <div className="-mb-3 text-sm font-medium text-gray-800 dark:text-neutral-400">
              {strToTitleCase(activeLanguage)} Request Example
            </div>
            <RustRequestRenderer
              method={api.method}
              url={activeEndpoint}
              headers={headers}
              bodyMethod={body.method}
              bodyParams={body.params}
            />
          </div>
        )
      case 'swift':
        return (
          <div className="flex flex-col">
            <div className="-mb-3 text-sm font-medium text-gray-800 dark:text-neutral-400">
              {strToTitleCase(activeLanguage)} Request Example
            </div>
            <SwiftRequestRenderer
              method={api.method}
              url={activeEndpoint}
              headers={headers}
              bodyMethod={body.method}
              bodyParams={body.params}
            />
          </div>
        )
      case 'umi':
        return (
          <div className="flex flex-col">
            <div className="-mb-3 text-sm font-medium text-gray-800 dark:text-neutral-400">
              {strToTitleCase(activeLanguage)} Request Example
            </div>
            <UmiRequestRenderer
              method={api.method}
              url={activeEndpoint}
              headers={headers}
              bodyMethod={body.method}
              bodyParams={body.params}
            />
          </div>
        )
    }
  }

  return (
    <div className="flex w-full flex-col gap-8 overflow-hidden">
      <EndPointSelector
        setActiveEndpoint={(endpoint) => setActiveEndpoint(endpoint)}
        activeEndpoint={activeEndpoint}
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
