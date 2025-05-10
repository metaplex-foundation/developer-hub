import { Hero as BaseHero } from '@/components/Hero';
import { HeroCode } from '@/components/HeroCode';

const codeProps = {
  tabs: [
    { name: 'getAsset', isActive: true },
  ],
  language: 'json',
  code: `{
  "jsonrpc": "2.0",
  "result": {
    "interface": "MplCoreAsset",
    "id": "5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa",
    "content": {
      "$schema": "https://schema.metaplex.com/nft1.0.json",
      "json_uri": "https://arweave.net/2xl-wNjCDAnCEtPbtUZRlXypSP6boMVTt5On8F7NPoc",
`,
}

export function Hero({ page }) {
  return (
    <BaseHero page={page} primaryCta={{title: "View on Github", href: page.product.github }} secondaryCta={{disabled: true}}>
      <HeroCode {...codeProps}></HeroCode>
    </BaseHero>
  )
}
