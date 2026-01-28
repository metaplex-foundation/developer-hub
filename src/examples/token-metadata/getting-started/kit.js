// [IMPORTS]
import { createSolanaRpc } from '@solana/rpc';
import { createSolanaRpcSubscriptions } from '@solana/rpc-subscriptions';
import { generateKeyPairSigner } from '@solana/signers';
import { pipe } from '@solana/functional';
import {
  appendTransactionMessageInstructions,
  createTransactionMessage,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
} from '@solana/transaction-messages';
import {
  compileTransaction,
  signTransaction,
  sendAndConfirmTransactionFactory,
} from '@solana/kit';
import {
  createNft,
  fetchDigitalAsset,
} from '@metaplex-foundation/mpl-token-metadata-kit';
// [/IMPORTS]

// [SETUP]
// Create RPC connection
const rpc = createSolanaRpc('https://api.devnet.solana.com');
const rpcSubscriptions = createSolanaRpcSubscriptions('wss://api.devnet.solana.com');

// Generate keypairs (or load from wallet)
const authority = await generateKeyPairSigner();
const mint = await generateKeyPairSigner();

// Helper function to send and confirm transactions
async function sendAndConfirm(instructions, signers) {
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

  const transactionMessage = pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayer(signers[0].address, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) => appendTransactionMessageInstructions(instructions, tx)
  );

  const transaction = compileTransaction(transactionMessage);
  const keyPairs = signers.map((s) => s.keyPair);
  const signedTransaction = await signTransaction(keyPairs, transaction);

  const sendAndConfirmTx = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });
  await sendAndConfirmTx(signedTransaction, { commitment: 'confirmed' });
}
// [/SETUP]

// [MAIN]
// Create and mint an NFT using the helper function
const [createIx, mintIx] = await createNft({
  mint,
  authority,
  payer: authority,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: 550, // 5.5%
  tokenOwner: authority.address,
});

// Send transaction
await sendAndConfirm([createIx, mintIx], [mint, authority]);

// Fetch the NFT data
const asset = await fetchDigitalAsset(rpc, mint.address);
// [/MAIN]

// [OUTPUT]
console.log('NFT created successfully!');
console.log('Mint address:', mint.address);
console.log('Name:', asset.metadata.name);
console.log('URI:', asset.metadata.uri);
// [/OUTPUT]
