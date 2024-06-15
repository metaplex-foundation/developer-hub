export function InstallComponent({ packages }) {
  const installCommands = packages.map((packageItem) => {
    return (
      <div>
        ```ts 
        npm i @metaplex-foundation/{packageItem}
        ```
      </div>
    )
  })

  return <div>Test{installCommands}</div>
}
