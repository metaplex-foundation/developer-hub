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
    // Replace myCustomSign / myCustomSend with your own
    // signing and sending implementation.
    const signatures: Uint8Array[] = []
    for (const tx of transactions) {
      const signed = await myCustomSign(tx)   // your signer
      const sig = await myCustomSend(signed)   // your sender
      signatures.push(sig)
    }
    return signatures
  },
}

const result = await createAndRegisterLaunch(umi, input, options)
// [/MAIN]

// [OUTPUT]
// [/OUTPUT]
