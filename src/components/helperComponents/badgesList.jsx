export const badgesList = ({ badges }) => {
  const packageList = badges.map((badge, index) => {
    return (
      <div key={index} className="rounded-lg bg-neutral-800 p-2 shadow-md">
        <div className="text-xs">{badge}</div>
      </div>
    )
  })

  return (
    <div className="flex flex-col gap-4">
      <div>{type}</div>
      <div className="flex flex-wrap gap-2">
        {packageList}
        {/* {JSON.stringify(installationPackages, null, 2)} */}
      </div>
    </div>
  )
}
