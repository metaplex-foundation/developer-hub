import { Select } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { useState } from 'react'

export const endpoints = {
  solanaMainnet: {
    name: 'Solana Mainnet',
    uri: 'https://api.mainnet-beta.solana.com',
    value: 'solanaMainnet',
  },
  solanaDevnet: {
    name: 'Solana Devnet',
    uri: 'https://api.devnet.solana.com',
    value: 'solanaDevnet',
  },
  eclipseAuraMainnet: {
    name: 'Eclipse Mainnet',
    uri: 'https://mainnetbeta-rpc.eclipse.xyz',
    value: 'eclipseMainnet',
    value: 'eclipseMainnet',
  },
  custom: {
    name: 'Custom',
    uri: '',
    value: 'custom',
  },
}

const EndPointSelector = ({ setActiveEndpoint, activeEndpoint }) => {
  const [isCustom, setIsCustom] = useState(false)
  const [customEndPoint, setCustomEndPoint] = useState('')

  // read endpoint from local storage

  const handleSelectEndpoint = (e) => {

    if (e.target.name === 'selectEndPoint') {
      if (e.target.value === 'custom') {
        setIsCustom(true)
        const endpoint = localStorage.getItem('customEndPoint') || ''

        setActiveEndpoint({
          name: 'Custom',
          uri: endpoint,
        })
        setCustomEndPoint(endpoint)
      } else {
        setIsCustom(false)
        setActiveEndpoint(endpoints[e.target.value])
      }
    }
    if (e.target.name === 'customEndPoint') {
      setActiveEndpoint({
        name: 'Custom',
        uri: e.target.value,
      })
      setCustomEndPoint(e.target.value)
    }
  }

  return (
    <div className="flex flex-col gap-2 px-1">
      <label
        className="text-sm font-medium text-gray-800 dark:text-neutral-400"
        htmlFor="endPoint"
      >
        Endpoint
      </label>
      <div className="relative flex h-12 w-full">
        <Select
          id="endPoint"
          name="selectEndPoint"
          className={clsx(
            'dark:white block w-full appearance-none rounded-lg border border-black/10 bg-white/5 px-3 py-1.5 text-sm/6 text-black dark:border-white/15 dark:bg-transparent',
            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
            // Make the text of each option black on Windows
            '*:text-black dark:text-white'
          )}
          onChange={(e) => handleSelectEndpoint(e)}
          value={isCustom ? 'custom' : activeEndpoint.value}
        >
          {Object.entries(endpoints).map(([key, value]) => (
            <option key={key} value={key}>
              {value.name}
            </option>
          ))}
        </Select>
        <ChevronDownIcon
          className="group pointer-events-none absolute right-2.5 top-4 my-auto size-4 fill-black/60 dark:fill-white"
          aria-hidden="true"
        />
      </div>

      <input
        type="text"
        name="customEndPoint"
        placeholder="https://"
        className="block w-full rounded-lg border border-gray-200 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:placeholder-neutral-500"
        onChange={(e) => {
          handleSelectEndpoint(e)
          localStorage.setItem('customEndPoint', e.target.value)
        }}
        disabled={!isCustom}
        value={isCustom ? customEndPoint : activeEndpoint.uri}
      />
    </div>
  )
}

export default EndPointSelector
