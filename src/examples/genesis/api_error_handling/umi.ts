// [IMPORTS]
import {
  createAndRegisterLaunch,
  isGenesisApiError,
  isGenesisApiNetworkError,
  isGenesisValidationError,
} from '@metaplex-foundation/genesis'
// [/IMPORTS]

// [SETUP]
// Assumes umi and input from the Easy Mode example.
// [/SETUP]

// [MAIN]
try {
  const result = await createAndRegisterLaunch(umi, {}, input)
  console.log(`Launch live at: ${result.launch.link}`)
} catch (err) {
  if (isGenesisValidationError(err)) {
    console.error(`Invalid input "${err.field}":`, err.message)
  } else if (isGenesisApiError(err)) {
    console.error('API error:', err.statusCode, err.responseBody)
  } else if (isGenesisApiNetworkError(err)) {
    console.error('Network error:', err.cause.message)
  } else {
    throw err
  }
}
// [/MAIN]

// [OUTPUT]
// [/OUTPUT]
