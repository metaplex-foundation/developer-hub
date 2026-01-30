import { useEffect } from 'react'

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
        className="text-sm font-medium text-muted-foreground"
        htmlFor="endPoint"
      >
        Endpoint
      </label>

      <input
        type="text"
        name="customEndPoint"
        placeholder="https://"
        className="block w-full rounded-lg border border-border bg-card px-2 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:pointer-events-none disabled:opacity-50"
        onChange={handleSelectEndpoint}
        value={activeEndpoint}
      />
    </div>
  )
}

export default EndPointSelector
