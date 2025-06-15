import { Select } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { useEffect, useState } from 'react'

const EndPointSelector = ({ setActiveEndpoint, activeEndpoint }) => {
  useEffect(() => {
    // Load saved endpoint from localStorage on component mount
    const savedEndpoint = localStorage.getItem('customEndPoint')
    if (savedEndpoint) {
      setActiveEndpoint(savedEndpoint)
    }
  }, [])

  const handleSelectEndpoint = (e) => {
    const newEndpoint = e.target.value
    setActiveEndpoint(newEndpoint)
    localStorage.setItem('customEndPoint', newEndpoint)
  }

  return (
    <div className="flex flex-col gap-2 px-1">
      <label
        className="text-sm font-medium text-gray-800 dark:text-neutral-400"
        htmlFor="endPoint"
      >
        Endpoint
      </label>

      <input
        type="text"
        name="customEndPoint"
        placeholder="https://"
        className="block w-full rounded-lg border border-gray-200 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:placeholder-neutral-500"
        onChange={handleSelectEndpoint}
        value={activeEndpoint}
      />
    </div>
  )
}

export default EndPointSelector
