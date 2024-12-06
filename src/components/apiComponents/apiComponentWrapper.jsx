'use client'

import apiMethods from '@/lib/api/aura/methods'
import { useState } from 'react'
import ApiParameterDisplay from './apiParams'
import LanguageRenderer from './languageRenderer'

const ApiComponentWrapper = (args) => {
  const api = apiMethods[args.method]

  const [playGroundParams, setPlayGroundParams] = useState(api)

  const handleSetParam = (param) => {
    const newParams = playGroundApi.params.map((p) => {
      if (p.name === param.name) {
        return param
      }
      return p
    })

    setPlayGroundApi({ ...playGroundApi, params: newParams })
  }

  console.log(api)
  return (
    <div className="max-width[800px] flex gap-8">
      <ApiParameterDisplay params={api.params} setParam={(param) => {}} />
      <LanguageRenderer api={api} playgroundParams={playGroundParams} />
    </div>
  )
}

export default ApiComponentWrapper
