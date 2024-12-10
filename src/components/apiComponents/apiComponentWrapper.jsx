'use client'

import apiMethods from '@/lib/api/aura/methods'
import { useEffect, useState } from 'react'
import ApiParameterDisplay from './apiParams'
import LanguageRenderer from './languageRenderer'
import Responce from './responce'

const ApiComponentWrapper = (args) => {
  const api = apiMethods[args.method]

  const [selectedExample, setSelectedExample] = useState(0)
  const [activeEndpoint, setActiveEndpoint] = useState(
    'https://eclipse-aura-mainnet.metaplex.com'
  )
  useEffect(() => {
    //load endpoint from local storage

    const endPoint = localStorage.getItem('endPoint')

    if (endPoint) {
      setActiveEndpoint(endPoint)
    }
  }, [])

  const handleSetActiveEndPoint = (name, endpoint) => {
    console.log('set active endpoint')
    console.log({name, endpoint})
  }

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
    id: '0',
    method: api.method,
    params:
      api.examples && api.examples[0].body.params
        ? api.examples[0].body.params
        : {},
  })

  const [responce, setResponce] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  console.log(body)

  const handleSetParam = (path, value) => {
    console.log(path)
    console.log(value)

    setBody((prev) => {
      let newBody = { ...prev }

      if (path.length === 1) {
        newBody.params[path[0]] = value
      } else {
        let current = newBody.params

        for (let i = 0; i < path.length; i++) {
          if (i === path.length - 1) {
            current[path[i]] = value
          } else {
            if (!current[path[i]]) {
              current[path[i]] = {}
            }
            current = current[path[i]]
          }
        }
      }

      return newBody
    })
  }

  useEffect(() => {
    console.log(body)
  }, [body])

  const handleTryItOut = async () => {
    const res = await fetch(
      'https://mainnet.helius-rpc.com/?api-key=555f20ad-afaf-4a78-a889-244f281ab399',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )

    const resJson = await res.json()

    console.log(resJson)

    setResponce(resJson)
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
                  return <option value={index}>{example.name}</option>
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
          className="bg-primary rounded-md border px-4 py-2 text-white 2xl:hidden"
          onClick={handleTryItOut}
        >
          Try it out
        </button>
      </div>

      <div className="flex w-full flex-col items-end 2xl:w-1/2">
        <LanguageRenderer
          api={api}
          body={body}
          activeEndPoint={activeEndpoint}
          setActiveEndPoint={(name, endpoint) => handleSetActiveEndPoint(name, endpoint)}
        />
        <button
          className="bg-primary hidden rounded-md border px-4 py-2 text-white 2xl:block"
          onClick={handleTryItOut}
        >
          Try it out
        </button>
        {responce && <Responce responce={responce} />}
      </div>
    </div>
  )
}

export default ApiComponentWrapper
