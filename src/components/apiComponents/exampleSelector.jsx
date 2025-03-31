import { Select } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'

const ApiExampleSelector = ({
  examples,
  selectedExample,
  handleSetExample,
}) => {
  return (
    <div className="w-full">
      <label
        className="mb-3 text-sm font-medium text-gray-800 dark:text-neutral-400"
        htmlFor="endPoint"
      >
        Example Queries
      </label>
      <div className="relative flex w-full gap-2">
        <div className="relative flex h-12 w-full">
          <Select
            onChange={(e) => handleSetExample(e.target.value)}
            value={selectedExample}
            className={clsx(
              'dark:white block w-full appearance-none rounded-lg border border-black/10 bg-white/5 px-3 py-1.5 text-sm/6 text-black dark:border-white/15 dark:bg-transparent',
              'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
              '*:text-black dark:text-white'
            )}
          >
            <option value={-1}>-</option>
            <optgroup label="Solana Mainnet">
              {examples.map((example, index) => {
                return (
                  <option key={index} value={index}>
                    {example.name}
                  </option>
                )
              })}
            </optgroup>
          </Select>
          <ChevronDownIcon
            className="group pointer-events-none absolute right-2.5 top-4 my-auto size-4 fill-black/60 dark:fill-white"
            aria-hidden="true"
          />
        </div>

        <button
          onClick={() => handleSetExample(-1)}
          className="block rounded-lg border border-gray-200 px-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:placeholder-neutral-500"
        >
          Clear
        </button>
      </div>
    </div>
  )
}

export default ApiExampleSelector
