import { Select } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { TrashIcon } from '@heroicons/react/24/outline'
import { PlusIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import { PluginsIcon } from '../icons/dual-tone/PluginsIcon'

const inputClassName = "block w-full rounded-md border border-border bg-card px-2 py-1 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:pointer-events-none disabled:opacity-50"

const selectClassName = clsx(
  'block w-full appearance-none rounded-lg border border-border bg-card px-3 py-1.5 text-sm/6 text-foreground',
  'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-primary/25',
  '*:text-foreground'
)

// Recursive component for rendering nested parameters
const ParamRenderer = ({ param, subValue, setParam, path = [], value }) => {
  const paramId = `param-${path.join('-')}`
  let content

  switch (param.type) {
    case 'string':
      content = (
        <input
          id={paramId}
          name={param.name}
          type="text"
          className={inputClassName}
          placeholder={param.placeholder}
          onChange={(e) => setParam(path, e.target.value)}
          value={value || ''}
        />
      )
      break

    case 'number':
      content = (
        <input
          id={paramId}
          name={param.name}
          type="number"
          className={inputClassName}
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
                className={inputClassName}
                placeholder={param.placeHolder}
                onChange={(e) => {
                  const newValue = param.value
                  newValue[index] = e.target.value
                  setParam(path, newValue)
                }}
                value={item}
              />
              <TrashIcon
                className="h-6 w-6 cursor-pointer self-center text-muted-foreground"
                onClick={() => {
                  const newValue = param.value
                  newValue.splice(index, 1)
                  setParam(path, newValue)
                }}
              />
            </div>
          ))}
          <PlusIcon
            className="h-6 w-6 cursor-pointer self-end text-muted-foreground"
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
            id={paramId}
            onChange={(e) =>
              setParam(path, e.target.value === 'true' ? true : false)
            }
            className={selectClassName}
          >
            {!param.required && <option value={''} />}
            <option value="true">true</option>
            <option value="false">false</option>
          </Select>
          <ChevronDownIcon
            className="group pointer-events-none absolute right-2.5 top-3 my-auto size-4 fill-muted-foreground"
            aria-hidden="true"
          />
        </div>
      )
      break
    case 'option':
      content = (
        <div className="relative flex h-10 w-full">
          <Select
            id={paramId}
            onChange={(e) => setParam(path, e.target.value)}
            className={selectClassName}
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
            className="group pointer-events-none absolute right-2.5 top-3 my-auto size-4 fill-muted-foreground"
            aria-hidden="true"
          />
        </div>
      )
      break
    case 'arrayKeyValuePair':
      content = (
        <div div className="flex flex-col gap-2">
          <input
            id={paramId}
            name={`${param.name}-key`}
            type="text"
            className={inputClassName}
            placeholder={'key'}
            onChange={(e) => {
              const newValue = [e.target.value, value ? value[1] : '']
              setParam(path, newValue)
            }}
            value={value ? value[0] : ''}
          />
          <input
            id={`${paramId}-value`}
            name={`${param.name}-value`}
            type="text"
            className={inputClassName}
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
        !subValue && 'border-t border-border py-2'
      } ${param.type === 'object' ? '' : 'flex flex-col gap-2'}`}
    >
      <div className="px-3">
        <label htmlFor={paramId} className="text-sm font-medium text-foreground">
          {param.name}
        </label>
        <span className="ml-2 inline-block text-xs text-muted-foreground">
          {param.type}
        </span>
        {param.required && (
          <span className="ml-2 inline-block text-xs text-red-500 dark:text-red-400">
            required
          </span>
        )}
      </div>
      <div className="px-3 text-xs italic text-muted-foreground">{param.description}</div>
      <div className="px-3 pb-2">{content}</div>
    </div>
  )
}

const ApiParameterDisplay = ({ params, setParam, body }) => {
  return (
    <div className="flex w-full flex-col gap-4 rounded-xl border border-border bg-card py-4 pb-0">
      <div className="px-3 text-xs font-semibold uppercase text-muted-foreground">
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
