// [IMPORTS]
import {
  createLaunch,
  registerLaunch,
} from '@metaplex-foundation/genesis'
// [/IMPORTS]

// [SETUP]
// Assumes umi and input from the Easy Mode example.
// [/SETUP]

// [MAIN]
// Step 1: Get unsigned transactions from the API
const createResult = await createLaunch(umi, {}, input)

// Step 2: Sign and send each transaction
for (const tx of createResult.transactions) {
  const signedTx = await umi.identity.signTransaction(tx)
  const signature = await umi.rpc.sendTransaction(signedTx, {
    commitment: 'confirmed',
    preflightCommitment: 'confirmed',
  })
  await umi.rpc.confirmTransaction(signature, {
    commitment: 'confirmed',
    strategy: {
      type: 'blockhash',
      ...createResult.blockhash,
    },
  })
}

// Step 3: Register the launch
const registerResult = await registerLaunch(umi, {}, {
  genesisAccount: createResult.genesisAccount,
  createLaunchInput: input,
})
console.log(`Launch live at: ${registerResult.launch.link}`)
// [/MAIN]

// [OUTPUT]
// [/OUTPUT]
