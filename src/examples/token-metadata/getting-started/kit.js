// [IMPORTS]
import {
  appendTransactionMessageInstructions,
  assertIsTransactionWithinSizeLimit,
  compileTransaction,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  generateKeyPairSigner,
  getSignatureFromTransaction,
  type Instruction,
  type KeyPairSigner,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransaction,
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
async function sendAndConfirm(instructions: Instruction[], signers: KeyPairSigner[]) {
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
  if (signers.length === 0) {
    throw new Error('At least one signer is required for fee payer.');
  }

  const transaction = pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayer(signers[0].address, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) => appendTransactionMessageInstructions(instructions, tx),
    (tx) => compileTransaction(tx),
  );

  const keyPairs = signers.map((s) => s.keyPair);
  const signedTransaction = await signTransaction(keyPairs, transaction);

  const sendAndConfirmTx = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });
  assertIsTransactionWithinSizeLimit(signedTransaction);
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
const sx = await sendAndConfirm([createIx, mintIx], [mint, authority]);

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
