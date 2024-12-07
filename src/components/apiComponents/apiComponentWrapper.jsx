'use client'

import apiMethods from '@/lib/api/aura/methods'
import renderRequestBody from '@/lib/api/renderRequestBody'
import { useEffect, useState } from 'react'
import ApiParameterDisplay from './apiParams'
import LanguageRenderer from './languageRenderer'

const ApiComponentWrapper = (args) => {
  const api = apiMethods[args.method]

  const [body, setBody] = useState({
    jsonrpc: '2.0',
    id: '0',
    method: api.method,
    params: {},
  })

  console.log(body)

  const handleSetParam = (param) => {
    console.log(param)

    // Extract the key and value from the param object
    const [key, value] = Object.entries(param)[0]

    setBody((prev) => {
      return {
        ...prev,
        params: {
          ...prev.params,
          [key]: value, // Use the extracted key and value
        },
      }
    })
  }

  useEffect(() => {
    console.log(body)
  }, [body])

  // const handleTryItOut = async () => {
  //   const res = await fetch('https://aura-mainnet.metaplex.com', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: {
  //       jsonrpc: '2.0',
  //       id: '0',
  //       method: api.method,
  //       params: playGroundParams,
  //     },
  //   })

  //   const resJson = await res.json()

  //   setResponce(resJson)
  // }

  return (
    <div className="max-width[800px] flex gap-8">
      <div className="max-w[400px] relative w-full">
        <ApiParameterDisplay
          params={api.params}
          setParam={(param) => {
            handleSetParam(param)
          }}
        />
      </div>
      <div className="flex w-full max-w-[500px] flex-col items-end">
        <LanguageRenderer api={api} playgroundParams={body} />
        <button className="bg-primary rounded-md border px-4 py-2 text-white">
          Try it out
        </button>
      </div>
    </div>
  )
}

export default ApiComponentWrapper
