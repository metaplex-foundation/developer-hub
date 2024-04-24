import { Hero as BaseHero } from '@/components/Hero'
import { HeroScreenshot } from '@/components/HeroScreenshot'

export function Hero({ page }) {
  return (
    <BaseHero
      page={page}
      subDescription="Read our documentation to create your own applications or use our Creator Studio to launch your collection in minutes."
      // primaryCta={{ title: 'Sign Up for Creator Studio', href: 'https://studio.metaplex.com/' }}
    >
      <HeroScreenshot
        src="/assets/candy-machine/creator-studio.png"
        alt="A screenshot of a mint page in the Creator Studio web app"
        width={1392}
        height={860}
      />
    </BaseHero>
  )
}
