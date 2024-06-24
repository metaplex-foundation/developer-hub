import { installationPackages } from './packages.js'

export const PackagesUsed = ({ packages, type }) => {
  console.log({ installationPackages })

  const url = (installationPackage, type) => {
    if (type === 'npm') {
      return `https://www.npmjs.com/package/${installationPackages[installationPackage].npm}`
    } else if (type === 'rust') {
      return `https://crates.io/crates/${installationPackages[installationPackage].crate}`
    } else if (type === 'github') {
      return installationPackage.github
    }
  }

  const packageName = (installationPackage) => {
    const metaplexPackage = installationPackages[installationPackage]

    if (metaplexPackage) {
      if (type == 'npm' && metaplexPackage.npm) {
        return metaplexPackage.npm
      } else if (type == 'crates' && metaplexPackage.crate) {
        return metaplexPackage.crate
      }
    } else {
      return installationPackage
    }
  }

  const packageList = packages.map((installationPackage, index) => {
    return (
      <div
        key={index}
        className="dark:text-neutral-300 rounded-lg bg-neutral-300 p-2 text-neutral-700 shadow-md dark:bg-neutral-800"
      >
        <div className="text-xs">{packageName(installationPackage)}</div>
        {/* <p className="text-sm text-gray-500">{packageName}</p> */}
        {/* <a
          href={url(installationPackage, type)}
          className="text-blue-500 hover:underline"
        >
          View Package
        </a> */}
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
