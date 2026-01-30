// [IMPORTS]
import { unwrapOptionRecursively } from '@metaplex-foundation/umi';
// [/IMPORTS]

// [SETUP]
// Assuming assetWithToken was fetched using fetchDigitalAssetWithAssociatedToken
// [/SETUP]

// [MAIN]
const ruleSet = unwrapOptionRecursively(
  assetWithToken.metadata.programmableConfig
)?.ruleSet;
// [/MAIN]

// [OUTPUT]
console.log('Rule Set:', ruleSet);
// [/OUTPUT]
