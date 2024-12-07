// Recursive component for rendering nested parameters
const ParamRenderer = ({ param, subValue, setParam, path = [] }) => {
  let content

  switch (param.type) {
    case 'string':
      content = (
        <input
          name={param.name}
          type="text"
          className="w-full rounded px-2"
          placeholder={param.value}
          onChange={(e) => setParam({ [param.name]: e.target.value })}
        />
      )
      break

    case 'number':
      content = (
        <input
          name={param.name}
          type="number"
          className="w-full rounded px-2"
          placeholder={param.value}
        />
      )
      break

    case 'object':
      content = (
        <div className="flex flex-col gap-4">
          {Object.entries(param.value).map(([key, value]) => (
            <ParamRenderer
              path={[...path, key]}
              key={key}
              param={{ name: key, ...value, subValue: true }}
              setParam={(param) => setParam(param)}
            />
          ))}
        </div>
      )
      break

    case 'array':
      content = (
        <ul>
          {param.value.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )
      break

    case 'boolean':
      content = (
        <select name={param.name} className="w-full rounded px-2">
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      )
      break

    default:
      content = <span>{String(param.value)}</span>
  }

  return (
    <div
      className={`${!subValue && 'border-t border-white'} py-4 ${
        param.type === 'object' ? '' : 'flex gap-2'
      }`}
    >
      <strong>{param.name} </strong>({param.type}) {content}
    </div>
  )
}

// Main component
const ApiParameterDisplay = ({ params, setParam }) => {
  console.log(params)

  return (
    <div
      className={`flex w-full max-w-[400px] flex-col gap-4 rounded-xl border border-white p-4`}
    >
      <div>Body</div>
      <div className="flex w-full flex-col">
        {params.map((param) => (
          <ParamRenderer
            path={[param.name]}
            key={param.name}
            param={param}
            setParam={(param) => setParam(param)}
          />
        ))}
      </div>
    </div>
  )
}

export default ApiParameterDisplay
