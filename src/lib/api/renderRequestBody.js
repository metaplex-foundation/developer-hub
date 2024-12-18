const renderRequestBody = (params) => {
  const renderParam = (param) => {
    switch (param.type) {
      case 'object':
        return Object.entries(param.value).reduce((acc, [key, value]) => {
          acc[key] = renderParam(value)
          return acc
        }, {})
      case 'array':
        return param.value.map((item) => renderParam(item))
      default:
        // Return the value for primitive types
        return param.value
    }
  }

  return params.reduce((acc, param) => {
    acc[param.name] = renderParam(param)
    return acc
  }, {})
}

export default renderRequestBody
