// [IMPORTS]
// No additional imports needed - programmableConfig is directly on metadata
// [/IMPORTS]

// [SETUP]
// Assuming assetWithToken was fetched using fetchDigitalAssetWithAssociatedToken
// [/SETUP]

// [MAIN]
// In Kit, options are represented as { __option: 'Some', value: ... } or { __option: 'None' }
const programmableConfig = assetWithToken.metadata.programmableConfig;
const ruleSet = programmableConfig.__option === 'Some'
  ? programmableConfig.value.ruleSet
  : null;
// [/MAIN]

// [OUTPUT]
console.log('Rule Set:', ruleSet);
// [/OUTPUT]
