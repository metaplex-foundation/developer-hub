// Recursive component for rendering nested parameters
const ParamRenderer = ({ param, subValue }) => {
  let content

  switch (param.type) {
    case 'string':
      content = (
        <input
          type="text"
          className="block w-full rounded-md border border-gray-200 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-300 dark:placeholder-neutral-500"
          placeholder={param.value}
        />
      )
      break

    case 'number':
      content = (
        <input
          type="number"
          className="block w-full rounded-md border border-gray-200 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-300 dark:placeholder-neutral-500"
          placeholder={param.value}
        />
      )
      break

    case 'object':
      content = (
        <div className="-mx-3 mt-1 flex flex-col">
          {Object.entries(param.value).map(([key, value]) => (
            <ParamRenderer
              key={key}
              param={{ name: key, ...value, subValue: true }}
              subValue={true}
            />
          ))}
        </div>
      )
      break

    case 'array':
      content = (
        <ul className="m-0 pl-4">
          {param.value.map((item, index) => (
            <li key={index} className="mb-0 mt-0 text-sm">
              {item}
            </li>
          ))}
        </ul>
      )
      break

    case 'boolean':
      content = (
        <select className="block w-full rounded-md border border-gray-200 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-300 dark:placeholder-neutral-500">
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      )
      break

    default:
      content = <span className="text-sm">{String(param.value)}</span>
  }

  return (
    <div
      className={`${
        !subValue && 'border-t border-gray-200 py-2 dark:border-neutral-700/50'
      } ${param.type === 'object' ? '' : 'flex flex-col gap-2'}`}
    >
      <div className="px-3">
        <label className="text-sm font-medium text-black dark:text-white">
          {param.name}
        </label>
        <span className="ml-2 inline-block text-xs text-gray-500 dark:text-neutral-400">
          {param.type}
        </span>
        <span className="ml-2 inline-block text-xs text-red-500 dark:text-red-400">
          required
        </span>
      </div>
      <div className="px-3 pb-2">{content}</div>
    </div>
  )
}

// Main component
const ApiParameterDisplay = ({ params }) => {
  console.log(params)

  return (
    <div className="flex w-full max-w-[400px] flex-col gap-4 rounded-xl border border-gray-200 bg-white py-4 pb-0 dark:border-neutral-700/50 dark:bg-neutral-800/50">
      <div className="px-3 text-xs font-semibold uppercase text-gray-500 dark:text-neutral-300">
        Body Params
      </div>
      <div className="flex flex-col">
        {params.map((param) => (
          <ParamRenderer key={param.name} param={param} />
        ))}
      </div>
    </div>
  )
}

export default ApiParameterDisplay
