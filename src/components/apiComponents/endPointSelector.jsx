import { useState } from 'react'

const endPoints = {
  eclipseAuraMainnet: {
    name: 'Eclipse Mainnet',
    uri: 'https://aura-eclipse-mainnet.metaplex.com',
  },
  custom: {
    name: 'Custom',
    uri: 'custom',
  },
}

const EndPointSelector = ({ setActiveEndpoint }) => {
  const [isCustom, setIsCustom] = useState(false)

  return (
    <div className="flex flex-col gap-2 px-1">
      <label
        className="text-sm font-medium text-gray-800 dark:text-neutral-400"
        htmlFor="endPoint"
      >
        End Point
      </label>
      <select
        id="endPoint"
        className="block rounded-lg border border-gray-200 px-2 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:placeholder-neutral-500"
        onChange={(e) => {
          if (e.target.value === 'custom') {
            setIsCustom(true)
          } else {
            setIsCustom(false)
            setActiveEndpoint(e.target.value)
          }
        }}
      >
        {Object.entries(endPoints).map(([key, value]) => (
          <option key={key} value={value.uri}>
            {value.name}
          </option>
        ))}
      </select>
      {isCustom && (
        <input
          type="text"
          name="customEndPoint"
          placeholder="https://"
          className="block w-full rounded-lg border border-gray-200 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:placeholder-neutral-500"
          onChange={(e) => setActiveEndpoint("custom", e.target.value)}
        />
      )}
    </div>
  )
}

export default EndPointSelector
