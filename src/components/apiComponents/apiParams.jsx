import { Select } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { TrashIcon } from '@heroicons/react/24/outline'
import { PlusIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import { PluginsIcon } from '../icons/dual-tone/PluginsIcon'

// Recursive component for rendering nested parameters
const ParamRenderer = ({ param, subValue, setParam, path = [], value }) => {
  let content

  switch (param.type) {
    case 'string':
      content = (
        <input
          name={param.name}
          type="text"
          className="block w-full rounded-md border border-gray-200 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-300 dark:placeholder-neutral-500"
          placeholder={param.placeholder}
          onChange={(e) => setParam(path, e.target.value)}
          value={value || ''}
        />
      )
      break

    case 'number':
      content = (
        <input
          name={param.name}
          type="number"
          className="block w-full rounded-md border border-gray-200 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-300 dark:placeholder-neutral-500"
          placeholder={param.value}
          onChange={(e) => setParam(path, Number.parseInt(e.target.value))}
          value={value || ''}
        />
      )
      break

    case 'object':
      content = (
        <div className="-mx-3 ml-2 mt-1 flex flex-col">
          {Object.entries(param.value).map(([key, value]) => (
            <ParamRenderer
              path={[...path, key]}
              key={key}
              param={{ name: key, ...value, subValue: true }}
              subValue={true}
              setParam={(path, value) => setParam(path, value)}
            />
          ))}
        </div>
      )
      break

    case 'array':
      content = (
        <div className="m-0 flex flex-col gap-2">
          {param.value.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                className="block w-full rounded-md border border-gray-200 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-300 dark:placeholder-neutral-500"
                placeholder={param.placeHolder}
                onChange={(e) => {
                  const newValue = param.value
                  newValue[index] = e.target.value
                  setParam(path, newValue)
                }}
                value={item}
              />
              <TrashIcon
                className=" h-6 w-6 cursor-pointer self-center text-gray-500 dark:text-neutral-400"
                onClick={() => {
                  const newValue = param.value
                  newValue.splice(index, 1)
                  setParam(path, newValue)
                }}
              />
            </div>
          ))}
          <PlusIcon
            className=" h-6 w-6 cursor-pointer self-end text-gray-500 dark:text-neutral-400"
            onClick={() => {
              // add item to array
              const newValue = param.value
              newValue.push('')
              setParam(path, newValue)
            }}
          />
        </div>
      )
      break

    case 'boolean':
      content = (
        <div className="relative flex h-10 w-full">
        <Select
          onChange={(e) => setParam(path, e.target.value)}
          className={clsx(
            'dark:white block w-full appearance-none rounded-lg border border-black/10 bg-white/5 px-3 py-1.5 text-sm/6 text-black dark:border-white/15 dark:bg-transparent',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
            '*:text-black dark:text-white'
          )}
        >
          {!param.required && <option value={''} />}
          <option value="true">true</option>
          <option value="false">false</option>
        </Select>
        <ChevronDownIcon
            className="group pointer-events-none absolute right-2.5 top-3 my-auto size-4 fill-black/60 dark:fill-white"
            aria-hidden="true"
          />
        </div>
      )
      break
    case 'option':
      content = (
        <div className="relative flex h-10 w-full">
          <Select
            onChange={(e) => setParam(path, e.target.value)}
            className={clsx(
              'dark:white block w-full appearance-none rounded-lg border border-black/10 bg-white/5 px-3 py-1.5 text-sm/6 text-black dark:border-white/15 dark:bg-transparent',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
              '*:text-black dark:text-white'
            )}
          >
            {!param.required && <option value={''} />}
            {param.value.map((choice, index) => {
              return (
                <option key={index} value={choice}>
                  {choice}
                </option>
              )
            })}
          </Select>
          <ChevronDownIcon
            className="group pointer-events-none absolute right-2.5 top-3 my-auto size-4 fill-black/60 dark:fill-white"
            aria-hidden="true"
          />
        </div>
      )
      break
    case 'arrayKeyValuePair':
      content = (
        <div div className="flex flex-col gap-2">
          <input
            name={`${param.name}-key`}
            type="text"
            className="block w-full rounded-md border border-gray-200 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-300 dark:placeholder-neutral-500"
            placeholder={'key'}
            onChange={(e) => {
              const newValue = [e.target.value, value ? value[1] : '']
              setParam(path, newValue)
            }}
            value={value ? value[0] : ''}
          />
          <input
            name={`${param.name}-value`}
            type="text"
            className="block w-full rounded-md border border-gray-200 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-300 dark:placeholder-neutral-500"
            placeholder={'value'}
            onChange={(e) => {
              const newValue = [value ? value[0] : '', e.target.value]
              setParam(path, newValue)
            }}
            value={value ? value[1] : ''}
          />
        </div>
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
        {param.required && (
          <span className="ml-2 inline-block text-xs text-red-500 dark:text-red-400">
            required
          </span>
        )}
      </div>
      <div className="px-3 text-xs italic">{param.description}</div>
      <div className="px-3 pb-2">{content}</div>
    </div>
  )
}

const ApiParameterDisplay = ({ params, setParam, body }) => {
  console.log(body)

  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-gray-200 bg-white py-4 pb-0 dark:border-neutral-700/50 dark:bg-neutral-800/50">
      <div className="px-3 text-xs font-semibold uppercase text-gray-500 dark:text-neutral-300">
        Body Params
      </div>
      <div className="flex flex-col">
        {params.map((param) => (
          <ParamRenderer
            value={body[param.name]}
            path={[param.name]}
            key={param.name}
            param={param}
            setParam={(path, value) => setParam(path, value)}
          />
        ))}
      </div>
    </div>
  )
}

export default ApiParameterDisplay
