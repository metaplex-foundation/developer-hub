import { useState } from 'react'

const endPoints = {
  solanaAuraMainnet: {
    name: 'Aura Mainnet',
    uri: 'https://aura-mainnet.metaplex.com',
  },
  solanaAuraDevnet: {
    name: 'Aura Devnet',
    uri: 'https://aura-devnet.metaplex.com',
  },
  eclipseAuraMainnet: {
    name: 'Eclipse Mainnet',
    uri: 'https://aura-eclipse-mainnet.metaplex.com',
  },
  eclipseAuraDevnet: {
    name: 'Eclipse Devnet',
    uri: 'https://aura-eclipse-devnet.metaplex.com',
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
