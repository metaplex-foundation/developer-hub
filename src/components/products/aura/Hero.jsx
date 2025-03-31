import { Hero as BaseHero } from '@/components/Hero';
import { HeroCode } from '@/components/HeroCode';

const codeProps = {
  tabs: [
    { name: 'batch_mint.rs', isActive: true },
  ],
  language: 'rust',
  code: `pub struct BatchMintBuilder {
    pub tree_account: Pubkey,
    pub max_depth: u32,
    pub max_buffer_size: u32,
    pub canopy_depth: u32,
    pub merkle: Box<dyn ITree>,
    pub mints: BTreeMap<u64, BatchMintInstruction>,
    pub last_leaf_hash: [u8; 32],
    pub canopy_leaves: Vec<[u8; 32]>,
    pub collection_config: Option<CollectionConfig>,
}`,
}

export function Hero({ page }) {
  return (
    <BaseHero page={page} primaryCta={{title: "View on Github", href: page.product.github }} secondaryCta={{disabled: true}}>
      <HeroCode {...codeProps}></HeroCode>
    </BaseHero>
  )
}
