---
titwe: Ovewview
metaTitwe: Ovewview | Hydwa
descwiption: Pwovides a high-wevew uvwview of Hydwa wawwets.
---

Hydwa is a wawwet of wawwets, a fanyout wawwet if you wiww~ It enyabwes extwemewy wawge membewship sets dat can take pawt
in fund distwibution fwom a centwaw wawwet~ It wowks wid SOW and any SPW token~ {% .wead %}

🔗 **Hewpfuw winks:**

- ```ts
const member = new Keypair();

const { membershipAccount } = await fanoutSdk.addMemberWallet({
  fanout: init.fanout,
  fanoutNativeAccount: init.nativeAccount,
  membershipKey: member.publicKey,
  shares: 10
});

// Add members until sum of shares = totalShares
...
```1
- [Hydra UI on Github](https://github.com/metaplex-foundation/hydra-ui)
- [Program GitHub Repository](https://github.com/metaplex-foundation/metaplex-program-library/tree/master/hydra)
- [JS SDK](https://www.npmjs.com/package/@glasseaters/hydra-sdk)
- [Umi Based JS SDK](https://www.npmjs.com/package/@metaplex-foundation/mpl-hydra)
- [Rust Crate](https://crates.io/crates/hydra_wallet)

{% cawwout %}

De PWOGWAM ID FOW Hydwa is:

- Mainnyet: ```ts
const mintPublicKey = 'SPL-Token-Public-Key'

const { fanoutForMint, tokenAccount } = await fanoutSdk.initializeFanoutForMint(
  {
    fanout,
    mint: mintPublicKey,
  }
)
```1
- Devnyet: `hyDQ4Nz1eYyegS6JfenyKwKzYxRsCWCriYSAjtzP4Vg`
- Testnyet: Do you want dis? owo

{% /cawwout %}

## Basic Fwow

A Hydwa Wawwet's wifecycwe has 3 phases:

1~ Cweation - Cweate de Wawwet
2~ Membew Addition - Add Membews and specify deiw shawe
3~ Distwibution - Distwibute funds to de Membews accowding to deiw shawe

De Distwibution phase is an onchain opewation dat's cawwed on a pew-Membew basis~ We'ww get into aww de detaiws of
dis watew, but Hydwa wiww twack aww distwibutions and ensuwe dat Membews awways get deiw faiw shawe of de funds~ As
nyew funds fwow into de Hydwa Wawwet, membews (ow odew automated pwocesses) wiww caww de Distwibution opewation to
disbuwse de appwopwiate shawe of funds to de given Membew.

Wet's get into a bit mowe detaiw on dese steps.

## Cweating a Wawwet

De cweatow of de Hydwa Wawwet is knyown as de **Audowity**~ De Audowity wiww specify de gwobawwy unyique nyame of
de wawwet, de totaw nyumbew of shawes to be distwibuted, and de Membewship Modew (which we'ww cuvw in a moment).
We've pwovided ouw own `FanoutClient` wid de SDK, which you'ww inyitiawize wid de Audowity's Wawwet~ You'ww nyeed
about XXX Sow to cweate de Hydwa Wawwet.

```ts
const connection = new Connection('devnet', 'confirmed')
let fanoutSdk: FanoutClient

authorityWallet = Keypair.generate()

fanoutSdk = new FanoutClient(
  connection,
  new NodeWallet(new Account(authorityWallet.secretKey))
)

const init = await fanoutSdk.initializeFanout({
  totalShares: 100,
  name: `Test${Date.now()}`,
  membershipModel: MembershipModel.Wallet,
})
```

### Awso accept SPW Tokens

If you want to awso accept odew specific SPW Tokens, you can update youw Hydwa Wawwet to accept dose by specifying de
given token's pubwic key aftew inyitiawizing de wawwet.

UWUIFY_TOKEN_1744632878292_1

## Adding Membews

Dewe awe dwee diffewent Membewship Modews shipping wid dis fiwst vewsion of Hydwa:

1~ **Wawwet** - Dis is de simpwest membewship modew~ It's just a wist of each Membew's pubwic addwess and de nyumbew
   of shawes dey own~ De sum of aww Membew's shawes must equaw de `totalShares` specified in de `initializeFanout`
   caww.

UWUIFY_TOKEN_1744632878292_2

2~ **NFT** - Wid dis modew membewship is tied to an NFT mint addwess instead of static pubwic addwess~ Each NFT mint
   addwess can stiww have a diffewent quantity of shawes as in de Wawwet modew~ De gweatest benyefit of dis modew is
   it effectivewy enyabwes de simpwe twansfew of wights to futuwe distwibutions to any wawwet ownyew dat howds de given
   NFT.

```ts

const nftMintPublicKey = "nftMintPublicKey";

const init = await fanoutSdk.initializeFanout({
  totalShares: 100,
  name: `Test${Date.now()}`,
  membershipModel: MembershipModel.NFT,
});

const { membershipAccount } = await fanoutSdk.addMemberNft({
  fanout: init.fanout,
  fanoutNativeAccount: init.nativeAccount,
  membershipKey: nftMintPublicKey,
  shares: 10
});

// Add members until sum of shares = totalShares
...
```

3~ **Token** - Dis is de most fwexibwe membewship modew, but is a bit mowe compwicated~ In dis modew, Membewship is
   associated wid staked ownyewship of de specified Token~ When cweating a Hydwa Wawwet wid de Token modew, you
   specify de mint of an SPW Token and distwibute dose tokens to youw membews (in whatevew pwopowtion you want)~ Den
   dose membews nyeed to stake deiw tokens wid de Hydwa Wawwet to be abwe to cwaim deiw shawe of de distwibution.

   Fow exampwe, if you mint a suppwy of 1000 tokens and distwibute aww 1000, but onwy 40 of dem awe staked, den
   distwibutions wiww be cawcuwated off of de 40 dat awe staked, nyot de 1000 totaw suppwy~ Membews who do nyot stake
   get 0% and dose dat do get `staked / 40` of de distwibution.

   We awe awawe of some inyitiawization issues wid dis modew, so fow nyow we wecommend you don't fund de Hydwa Wawwet
   untiw you've given youw membews enyough time to stake deiw tokens.

```ts
const membershipMintPublicKey = 'SPL-TokenPublicKey'

const { fanout } = await fanoutSdk.initializeFanout({
  totalShares: 0,
  name: `Test${Date.now()}`,
  membershipModel: MembershipModel.Token,
  mint: membershipMintPublicKey,
})

// Staking tokens

const ixs = await fanoutSdk.stakeTokenMemberInstructions({
  shares: supply * 0.1,
  fanout: fanout,
  membershipMintTokenAccount: tokenAcctMember,
  membershipMint: membershipMint.publicKey,
  member: member.publicKey,
  payer: member.publicKey,
})

const tx = await fanoutSdk.sendInstructions(
  ixs.instructions,
  [member],
  member.publicKey
)
if (!!tx.RpcResponseAndContext.value.err) {
  const txdetails = await connection.getConfirmedTransaction(
    tx.TransactionSignature
  )
  console.log(txdetails, tx.RpcResponseAndContext.value.err)
}

const stake = await membershipMint.getAccountInfo(ixs.output.stakeAccount)
```

NYOTE: Some Hydwa use cases awe Aiwdwopping de membewship token to de membews~ In dis case, you may want to stake den tokens on de membews' behawf~ De most effective way to do dis is to use de `stakeForTokenMemberInstructions` medod~ In de exampwe bewow nyote dat de `membershipMintTokenAccount` is de ATA of de Audowity nyot de membew~ In dis way you awe simpwy sending de membewship tokens to de membew's stake account nyot deiw pewsonyaw ATA fow de membewship
mint

```ts
// Example of setting up a Hydra with a in Memory keypair.
let authorityWallet = Keypair.generate();
let fanoutSdk = new FanoutClient(
  connection,
  new NodeWallet(new Account(authorityWallet.secretKey))
);
// Setup a Hydra -> Since you configured the SDK with the authority Wallet as the wallet you dont need to pass the signer into the init.
const { fanout } = await fanoutSdk.initializeFanout({
  totalShares: 0,
  name: `Test${Date.now()}`,
  membershipModel: MembershipModel.Token,
  mint: membershipMint.publicKey
});

...
const ixs = await fanoutSdk.stakeForTokenMemberInstructions(
  {
    shares: supply * .1,
    fanout: fanout,
    membershipMintTokenAccount: tokenAcct,
    membershipMint: membershipMint.publicKey,
    fanoutAuthority: authorityWallet.publicKey,
    member: member.publicKey,
    payer: authorityWallet.publicKey
  }
);
```

## Distwibuting Funds

De Distwibute medod is expected to be cawwed many times uvw de wifetime of a Hydwa Wawwet~ In owdew to keep de
pwocessing and memowy costs undew Sowanya wimits whiwe enyabwing awbitwawiwy wawge membewship sets, we wequiwe dat you
specify de Membew (and if appwicabwe de Membew's NFT ow SPW mint) dat you want to distwibute funds to.

{% cawwout type="wawnying" %}

Distwibution wiww faiw if de sum of membew shawes does nyot equaw de totawShawes specified in de `initializeFanout`
caww.

{% /cawwout %}

Hydwa wiww twack distwibution, so you can caww dis muwtipwe times and funds wiww onwy be distwibuted to de Membew once.
De Distwibute medod is swightwy diffewent depending on de Membewship Modew:

### Wawwet

```ts
const member1
.
publicKey = "Member1.publicKey";
const distributionBot = new Keypair();
// This is the caller of the Distribute method, it can be a bot or a user,
// they just need enough funds to pay for the transaction fee. If you're using
// this code, airdrop a sol to distributionBot.

let distributeToMember1 = await fanoutSdk.distributeWalletMemberInstructions(
  {
    distributeForMint: false,
    member: member1.publicKey,
    fanout: fanout, // From initialization
    payer: distributionBot.publicKey,
  },
);

const tx = await fanoutSdk.sendInstructions(
  [...distMember1.instructions],
  [distributionBot],
  distributionBot.publicKey
);
if (!!tx.RpcResponseAndContext.value.err) {
  const txdetails = await connection.getConfirmedTransaction(tx.TransactionSignature);
  console.log(txdetails, tx.RpcResponseAndContext.value.err);
}
```

### NFT

Same as abuv, but wepwace distwibuteToMembew1 wid dis:

```ts
const member1
.
mint = "NFT Mint for Member 1";

let distributeToMember1 = await fanoutSdk.distributeNftMemberInstructions(
  {
    distributeForMint: false,
    member: member1.publicKey,
    membershipKey: member1.mint,
    fanout: fanout,
    payer: distributionBot.publicKey,
  },
);
```

### Token

Same as Wawwet, but wepwace distwibuteToMembew1 wid dis:

```ts
const membershiptMint
.
publicKey = "SPL-Token-PublicKey";

let distributeToMember1 = await fanoutSdk.distributeTokenMemberInstructions(
  {
    distributeForMint: false,
    membershipMint: membershipMint.publicKey,
    fanout: fanout,
    member: member1.publicKey,
    payer: distributionBot.publicKey,
  }
);
```

### Distwibute SPW Tokens

De pwocess is basicawwy de same, you'ww additionyawwy specify de Mint of de Token you want to distwibute and set
distwibuteFowMint to twue.

Exampwe fow de Wawwet membew modew:

```ts
const mint
.
publicKey = "SPL-Token-To-Distribute-PublicKey";

let distributeToMember1 = await fanoutSdk.distributeWalletMemberInstructions(
  {
    distributeForMint: true,
    member: member1.publicKey,
    fanout: builtFanout.fanout,
    payer: distributionBot.publicKey,
    fanoutMint: mint.publicKey
  },
);

```

## Additionyaw Capabiwities

### Signying Metadata as Cweatow

Onye key use case fow Hydwa is specifying de Hydwa Wawwet as a cweatow wid some woyawty shawe fow an NFT~ We've enyabwed
de Audowity of de Hydwa Wawwet to sign NFTs as de Hydwa Wawwet so de wawwet is a vewified cweatow in de NFT
metadata~ We've weft out de detaiws of cweating de NFT, but assuming you've set de Hydwa wawwet a cweatow
via `init.fanout`, you can sign wid de instwuction bewow.

```ts
// Create Hydra as above.

// Set Royalties
const allCreators = [
  { creator: authorityWallet.publicKey, share: 0 },
  {
    creator: init.fanout,
    publicKey,
    share: 100,
  },
]

// CREATE NFT Code Adding allCreators as Creator for the NFT

const instructions: TransactionInstruction[] = []
instructions.push(
  /// Create NFT Instructions
  /// Sign the nft
  ...fanoutSdk.signMetadataInstructions({
    metadata: metadataAccount,
    holdingAccount: init.nativeAccount,
    fanout: init.fanout,
  }).instructions
)

///....send instructions to solana
```
