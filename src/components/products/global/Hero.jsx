import { Button } from '@/components/Button'
import { Search } from '@/components/Search'
import DiscordLogo from '@/images/logos/discord-mark-white.png'
import GithubLogo from '@/images/logos/github-mark-white.png'
import XLogo from '@/images/logos/x-black.png'

export function Hero({ page }) {
  return (
    <div className="flex h-[50vh] justify-center ">
      {/* <BaseHero
      page={page}
      title="Developer Hub"
      primaryCta={{ title: 'Browse our Products', href: '/programs-and-tools' }}
      light2Off
      light3Off
    >
      <Link href="/core">
        <img src={CoreBanner.src} alt="Developer Hub" className="no-lightense" />
      </Link>
      
    </BaseHero> */}
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="flex flex-col items-center">
          <div className="text-4xl text-neutral-950 dark:text-neutral-300">
            METAPLEX
          </div>
          <div className="gradientTextHeader text-[5rem]">DEVELOPER HUB</div>
        </div>

        <div className="text-2xl text-neutral-600 transition-colors duration-700 dark:text-neutral-400">
          Learn. Create. Connect.
        </div>
        <div className="flex gap-8">
          <Button className="flex gap-4 bg-neutral-950 text-white transition-colors hover:bg-neutral-700">
            <img src={GithubLogo.src} alt="Github" className="h-6 w-6" />
            Github
          </Button>
          <Button className="flex gap-4  bg-indigo-500 text-white transition-colors hover:bg-[#545eca]">
            <img src={DiscordLogo.src} alt="Discord" className="h-6" />
            Discord
          </Button>
          <Button className="flex gap-4  bg-neutral-950 text-white transition-colors hover:bg-neutral-700">
            <img src={XLogo.src} alt="X" className="h-6 invert" />
            @metaplex
          </Button>
        </div>
        <Search />
      </div>
    </div>
  )
}
