import Link from 'next/link.js'
import { installationPackages } from './packages.js'

export const PackagesUsed = ({ packages, type }) => {
  console.log({ installationPackages })

  const url = (installationPackage) => {
    if (type === 'npm') {
      if (installationPackages[installationPackage] && installationPackages[installationPackage].npm) {
        console.log(installationPackage)
        return `https://www.npmjs.com/package/${installationPackages[installationPackage].npm}`
      }
      return `https://www.npmjs.com/package/${installationPackage}`
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
        className="rounded-lg bg-neutral-300 p-2 text-neutral-700 shadow-md dark:bg-neutral-700 dark:text-neutral-300"
      >
        <Link href={url(installationPackage)} target="_blank">
          <div className="text-xs">{packageName(installationPackage)}</div>
        </Link>
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
