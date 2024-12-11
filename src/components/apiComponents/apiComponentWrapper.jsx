'use client'

import apiMethods from '@/lib/api/aura/methods'
import { useEffect, useState } from 'react'
import Spinner from '../icons/spinner'
import ApiParameterDisplay from './apiParams'
import LanguageRenderer from './languageRenderer'
import Responce from './responce'

const ApiComponentWrapper = (args) => {
  const api = apiMethods[args.method]

  const [responce, setResponce] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedExample, setSelectedExample] = useState(-1)
  const [activeEndpoint, setActiveEndpoint] = useState(
    'https://aura-eclipse-mainnet.metaplex.com'
  )

  // const handleSetActiveEndPoint = (name, endpoint) => {
  //   console.log('set active endpoint')
  //   console.log({name, endpoint})
  // }

  const handleSetExample = (index) => {
    console.log(index)

    if (index == -1) {
      console.log('clear')

      setBody((prev) => {
        let newBody = { ...prev }
        newBody.params = {}
        return newBody
      })
      setSelectedExample(index)
      return
    }

    setBody((prev) => {
      let newBody = { ...prev }
      newBody.params = api.examples[index].body.params
      return newBody
    })

    setSelectedExample(index)
  }

  const [body, setBody] = useState({
    jsonrpc: '2.0',
    id: '1',
    method: api.method,
    params: {},
  })

  console.log(body)

  const handleSetParam = (path, value) => {
    setBody((prev) => {
      const newBody = { ...prev }

      // Recursive function to traverse and update or clean up fields
      const updateField = (obj, path) => {
        const key = path[0]

        if (path.length === 1) {
          // If we are at the target field
          if (
            !value ||
            (Array.isArray(value) && value.every((v) => v === ''))
          ) {
            // Delete the field if value is null, undefined, or an empty key-value pair
            delete obj[key]
          } else {
            // Otherwise, set the value
            obj[key] = value
          }
        } else {
          // Ensure the parent key exists and is an object
          if (!obj[key] || typeof obj[key] !== 'object') {
            obj[key] = {}
          }

          // Recurse into the nested object
          updateField(obj[key], path.slice(1))

          // Remove the parent key if it becomes empty after the update
          if (Object.keys(obj[key]).length === 0) {
            delete obj[key]
          }
        }
      }

      updateField(newBody.params, path)

      return newBody
    })
  }

  useEffect(() => {
    console.log(body)
  }, [body])

  const handleTryItOut = async () => {
    setResponce(null)
    setIsLoading(true)

    const res = await fetch(activeEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const resJson = await res.json()

    console.log(resJson)

    setResponce(resJson)

    setIsLoading(false)
  }

  return (
    <div className="flex w-full flex-col-reverse gap-8 2xl:flex-row ">
      <div className="flex w-full flex-col gap-8 2xl:w-1/2">
        {api.examples && (
          <div className="w-full">
            <label
              className="mb-3 text-sm font-medium text-gray-800 dark:text-neutral-400"
              htmlFor="endPoint"
            >
              Loaded Example
            </label>
            <div className="flex w-full gap-2">
              <select
                onChange={(e) => handleSetExample(e.target.value)}
                value={selectedExample}
                className="block w-full rounded-lg border border-gray-200 px-2 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:placeholder-neutral-500"
              >
                <option value={-1}>-</option>
                {api.examples.map((example, index) => {
                  return (
                    <option key={index} value={index}>
                      {example.name}
                    </option>
                  )
                })}
              </select>
              <button
                onClick={() => handleSetExample(-1)}
                className="block rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:placeholder-neutral-500"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        <ApiParameterDisplay
          params={api.params}
          body={body.params}
          setParam={(path, value) => {
            handleSetParam(path, value)
          }}
        />
        <button
          className="block min-w-[150px] rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:placeholder-neutral-500 2xl:hidden"
          onClick={handleTryItOut}
        >
          {isLoading ? <Spinner className="h-6 w-6" /> : 'Try it out'}
        </button>
      </div>

      <div className="flex w-full flex-col items-end 2xl:w-1/2">
        <LanguageRenderer
          api={api}
          body={body}
          activeEndPoint={activeEndpoint}
          setActiveEndPoint={(endpoint) => setActiveEndpoint(endpoint)}
        />
        <button
          className="hidden min-w-[150px] items-center justify-center rounded-lg border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:placeholder-neutral-500 2xl:flex"
          onClick={handleTryItOut}
        >
          {isLoading ? <Spinner className="h-6 w-6" /> : 'Try it out'}
        </button>
        {responce && <Responce responce={responce} />}
      </div>
    </div>
  )
}

export default ApiComponentWrapper
