// [IMPORTS]
import {
  appendTransactionMessageInstructions,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  generateKeyPairSigner,
  getSignatureFromTransaction,
  type Instruction,
  type TransactionSigner,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
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
// Works with any signer type - signers are automatically extracted from instruction accounts
async function sendAndConfirm(options: {
  instructions: Instruction[];
  payer: TransactionSigner;
}) {
  const { instructions, payer } = options;
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

  const transactionMessage = pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayer(payer.address, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) => appendTransactionMessageInstructions(instructions, tx),
  );

  // Sign with all signers attached to instruction accounts
  const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);

  const sendAndConfirmTx = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });
  await sendAndConfirmTx(signedTransaction, { commitment: 'confirmed' });

  return getSignatureFromTransaction(signedTransaction);
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
const sx = await sendAndConfirm({
  instructions: [createIx, mintIx],
  payer: authority,
});

// Fetch the NFT data
const asset = await fetchDigitalAsset(rpc, mint.address);
// [/MAIN]

// [OUTPUT]
console.log('NFT created successfully!');
console.log('Mint address:', mint.address);
console.log('Signature:', sx);
console.log('Name:', asset.metadata.name);
console.log('URI:', asset.metadata.uri);
// [/OUTPUT]
