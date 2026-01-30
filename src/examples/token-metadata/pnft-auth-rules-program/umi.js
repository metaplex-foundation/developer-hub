// [IMPORTS]
import { getMplTokenAuthRulesProgramId } from '@metaplex-foundation/mpl-token-auth-rules';
// [/IMPORTS]

// [SETUP]
// [/SETUP]

// [MAIN]
const authorizationRulesProgram = getMplTokenAuthRulesProgramId(umi);
// [/MAIN]

// [OUTPUT]
console.log('Auth Rules Program:', authorizationRulesProgram);
// [/OUTPUT]
