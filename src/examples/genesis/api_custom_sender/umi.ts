// [IMPORTS]
import {
  createAndRegisterLaunch,
  SignAndSendOptions,
} from '@metaplex-foundation/genesis'
// [/IMPORTS]

// [SETUP]
// Assumes umi and input from the Easy Mode example.
// [/SETUP]

// [MAIN]
const options: SignAndSendOptions = {
  txSender: async (transactions) => {
    // Custom signing and sending logic
    const signatures: Uint8Array[] = []
    for (const tx of transactions) {
      const signed = await myCustomSign(tx)
      const sig = await myCustomSend(signed)
      signatures.push(sig)
    }
    return signatures
  },
}

const result = await createAndRegisterLaunch(umi, input, options)
// [/MAIN]

// [OUTPUT]
// [/OUTPUT]
