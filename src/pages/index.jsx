import { ChevronRightIcon } from '@heroicons/react/24/solid'

const Home = () => {
  return (
    <div className="m-auto flex flex-col gap-4">
      {/* <div>
        The Metaplex Developer Hub is a comprehensive resource for developers
        working with the Metaplex Protocol on Solana. It offers extensive
        documentation, tutorials, and tools to facilitate the creation and
        management of decentralized applications and NFTs on Solana. The website
        features API references, SDKs, best practice guidelines, and a community
        forum for collaboration and troubleshooting. Whether you&aposre new to
        blockchain development or an experienced developer, the Metaplex
        Developer Hub provides the essential resources needed to leverage the
        Metaplex Protocol effectively.
      </div> */}
      {/* <div className="text-4xl">I want to...</div> */}
      <div className="flex gap-16">
        <div className="w-1/2">
          <div className="text-2xl">LEARN</div>
          <div className="flex flex-col gap-8">
            <div className="flex bg-neutral-800 w-full flex-col gap-4 rounded-xl border border-neutral-300 p-4 dark:border-neutral-800">
              <div className="flex justify-between">
                <div className="text-xl">Create an NFT</div>
                <ChevronRightIcon className="h-8 w-8" />
              </div>
              <div className="text-sm">
                Learn how to create and manage NFTs on the Solana blockchain
                with Metaplex Protocols.
              </div>
            </div>
            <div className="flex bg-neutral-800 w-full flex-col gap-4 rounded-xl border border-neutral-300 p-4 dark:border-neutral-800">
              <div className="flex justify-between">
                <div className="text-xl">Create a Token</div>
                <ChevronRightIcon className="h-8 w-8" />
              </div>
              <div className="text-sm">
                Learn how to create and manage Solana SPL tokens on the Solana
                blockchain with Metaplex Protocols.
              </div>
            </div>
            <div className="flex bg-neutral-800 w-full flex-col gap-4 rounded-xl border border-neutral-300 p-4 dark:border-neutral-800">
              <div className="flex justify-between">
                <div className="text-xl">
                  Integrate Metaplex Progams into my project
                </div>
                <ChevronRightIcon className="h-8 w-8" />
              </div>
              <div className="text-sm">
                Learn how to create and manage Solana SPL tokens on the Solana
                blockchain with Metaplex Protocols.
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/2">
          <div className="text-2xl">CONNECT</div>
          <div className="flex flex-col gap-8">
            <div className="flex bg-neutral-800 w-full flex-col gap-4 rounded-xl border border-neutral-300 p-4 dark:border-neutral-800">
              <div className="flex justify-between">
                <div className="text-xl">
                  Join the Metaplex Developer community
                </div>
                <ChevronRightIcon className="h-8 w-8" />
              </div>
              <div className="text-sm">
                Learn how to create and manage NFTs on the Solana blockchain
                with Metaplex Protocols.
              </div>
            </div>
            <div className="flex bg-neutral-800 w-full flex-col gap-4 rounded-xl border border-neutral-300 p-4 dark:border-neutral-800">
              <div className="flex justify-between">
                <div className="text-xl">Collaborate with other developers</div>
                <ChevronRightIcon className="h-8 w-8" />
              </div>
              <div className="text-sm text-neutral-500">
                Learn how to create and manage NFTs on the Solana blockchain
                with Metaplex Protocols.
              </div>
            </div>
            <div className="flex bg-neutral-800 w-full flex-col gap-4 rounded-xl border border-neutral-300 p-4 dark:border-neutral-800">
              <div className="flex justify-between">
                <div className="text-xl">
                  Get help and support from the community
                </div>
                <ChevronRightIcon className="h-8 w-8" />
              </div>
              <div className="text-sm">
                Learn how to create and manage NFTs on the Solana blockchain
                with Metaplex Protocols.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
