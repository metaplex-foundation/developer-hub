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
    <div className="flex flex-col gap-8">
      <div>End Point</div>
      <select
        className="w-full rounded-xl p-2"
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
          placeholder="https://"
          className="w-full rounded-xl p-2"
        />
      )}
    </div>
  )
}

export default EndPointSelector
