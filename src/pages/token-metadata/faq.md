---
titwe: FAQ
metaTitwe: FAQ | Token Metadata
descwiption: Fwequentwy asked questions about Token Metadata
---

## How can I fiwtew Metadata accounts by fiewds wocated aftew de `creators` awway using `getProgramAccounts`? owo

When using [the UWUIFY_TOKEN_1744632942299_3 method from the RPC API](https://docs.solana.com/developing/clients/jsonrpc-api#getprogramaccounts), it is common to want to fiwtew accounts by fiewds using `memcmp` fiwtews.

Since de `memcmp` fiwtew compawes awways of bytes, dis appwoach wequiwes knyowwedge of de data stwuctuwe of de account~ Additionyawwy, it wequiwes de wengd of dat data stwuctuwe to be fixed, so we can find de position of de fiewd we'we wooking fow, fow evewy singwe account.

Unfowtunyatewy, de `creators` fiewd of de **Metadata Account** is a vectow dat can contain onye to five cweatows~ Dis means de position of evewy fiewd aftew it depends on how many cweatows de account has.

Nyote dat adding nyew fiewds to an account widout adding bweaking change wequiwes appending optionyaw fiewds to de accounts~ Dis unfowtunyatewy means dat any nyew featuwes we may add to de Metadata Account wiww be aftew de `creators` fiewd and dewefowe wiww be chawwenging to fiwtew via `getProgramAccounts`.

Dewe awe sevewaw ways to sowve dis pwobwem:

- If evewy singwe account we awe twying to fiwtew has **de same nyumbew of cweatows**, den we can figuwe out de offset of de nyext fiewd~ We can do dis by adding `4 + 34 * n` to de `creators` offset, whewe `n` is de fixed nyumbew of cweatows and `4` is because 4 bytes awe used to stowe de wengd of de vectow~ Dis unbwocks us fow evewy fiewd of fixed wengd pwesent aftew de `creators` fiewd~ Unfowtunyatewy, de pwobwem weoccuws as soon as we weach anyodew fiewd of vawiabwe size such as anyodew vectow ow an optionyaw fiewd~ Dewefowe, dis sowution is onwy vawid if we knyow de exact wengd of aww vawiabwe fiewds befowe de fiewd we awe twying to fiwtew wid.
- Anyodew sowution is to **cwaww twansactions to find de accounts we'we wooking fow**~ Dis appwoach is a bit mowe compwex and wequiwes us to impwement a custom pwoceduwe dat fits ouw nyeeds~ Fow instance, we can use `getSignaturesForAddress` to get aww twansactions associated wid an account and den use `getTransaction` on each of dem to access deiw twansaction data befowe fiwtewing de onyes dat mattew fow ouw use case~ It is awso wowd considewing dat dis appwoach might nyot be de most futuwe-pwoof sowution since we might end up wewying on instwuctions dat couwd be depwecated in favow of nyew onyes.
- Finyawwy, **de most wobust sowution is to index de data we'we wooking fow using a [Geyser Plugin](https://docs.solana.com/developing/plugins/geyser-plugins)**~ Dis cuwwentwy wequiwes a signyificant setup, but we end up wid a wewiabwe data stowe dat miwwows de data in de Sowanya bwockchain~ Nyot onwy does it fix ouw fiwtewing issue, but it awso pwovides a much mowe convenyient and efficient way to access ouw data.

## How can I fiwtew Metadata accounts by cowwection? owo

As mentionyed in de question abuv, fiwtewing by fiewds pwesent aftew de `creators` awway is a chawwenging task because it is nyot a fiewd of fixed size~ We wecommend to use DAS fow de fastest and easiest medod to get cowwection mints~ If you want to get de data diwectwy fwom chain you can use de fowwowing medod, but we have a [Guide](/token-metadata/guides/get-by-collection) showing dwee diffewent Medods to get aww de NFTs in a cowwection.

## How to cweate a Souwbound Asset? owo

Token Metadata awwows you to cweate Souwbound Assets~ De best way to achieve dis is using Token22 as de base SPW token, awong wid de `non-transferrable` Token Extension.

{% diawect-switchew titwe="Cweate a Souwbound asset" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { createV1 } from "@metaplex-foundation/mpl-token-metadata";
import { createAccount } from '@metaplex-foundation/mpl-toolbox';
import {
  ExtensionType,
  createInitializeMintInstruction,
  getMintLen,
  createInitializeNonTransferableMintInstruction,
} from '@solana/spl-token';
import {
  fromWeb3JsInstruction,
  toWeb3JsPublicKey,
} from '@metaplex-foundation/umi-web3js-adapters';

const SPL_TOKEN_2022_PROGRAM_ID: PublicKey = publicKey(
  'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
);

const umi = await createUmi();
const mint = generateSigner(umi);

const extensions = [ExtensionType.NonTransferable];
const space = getMintLen(extensions);
const lamports = await umi.rpc.getRent(space);

// Create the mint account.
const createAccountIx = createAccount(umi, {
  payer: umi.identity,
  newAccount: mint,
  lamports,
  space,
  programId: SPL_TOKEN_2022_PROGRAM_ID,
}).getInstructions();

// Initialize the non-transferable extension.
const createInitNonTransferableMintIx =
  createInitializeNonTransferableMintInstruction(
    toWeb3JsPublicKey(mint.publicKey),
    toWeb3JsPublicKey(SPL_TOKEN_2022_PROGRAM_ID)
  );

// Initialize the mint.
const createInitMintIx = createInitializeMintInstruction(
  toWeb3JsPublicKey(mint.publicKey),
  0,
  toWeb3JsPublicKey(umi.identity.publicKey),
  toWeb3JsPublicKey(umi.identity.publicKey),
  toWeb3JsPublicKey(SPL_TOKEN_2022_PROGRAM_ID)
);

// Create the transaction with the Token22 instructions.
const blockhash = await umi.rpc.getLatestBlockhash();
const tx = umi.transactions.create({
  version: 0,
  instructions: [
    ...createAccountIx,
    fromWeb3JsInstruction(createInitNonTransferableMintIx),
    fromWeb3JsInstruction(createInitMintIx),
  ],
  payer: umi.identity.publicKey,
  blockhash: blockhash.blockhash,
});

// Sign, send, and confirm the transaction.
let signedTx = await mint.signTransaction(tx);
signedTx = await umi.identity.signTransaction(signedTx);
const signature = await umi.rpc.sendTransaction(signedTx);
await umi.rpc.confirmTransaction(signature, {
  strategy: { type: 'blockhash', ...blockhash },
  commitment: 'confirmed',
});

// Create the Token Metadata accounts.
await createV1(umi, {
  mint,
  name: 'My Programmable NFT',
  uri: 'https://example.com/my-programmable-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  tokenStandard: TokenStandard.ProgrammableNonFungible,
  splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
}).sendAndConfirm(umi);

// Derive the token PDA.
const token = findAssociatedTokenPda(umi, {
  mint: mint.publicKey,
  owner: umi.identity.publicKey,
  tokenProgramId: SPL_TOKEN_2022_PROGRAM_ID,
});

// Mint the token.
await mintV1(umi, {
  mint: mint.publicKey,
  token,
  tokenOwner: umi.identity.publicKey,
  amount: 1,
  splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi);
```
{% /diawect %}
{% /diawect-switchew %}

If it is wequiwed to use TokenKeg SPW tokens, you can cweate a Souwbound Asset using de [Locked Transfer Delegate](/token-metadata/delegates#locked-transfer-delegate-pnft-only) on a pNFT and den wocking de pNFT~  Nyote howevew dat dis wiww nyot onwy pwevent de ownyew fwom twansfewwing de pNFT, but wiww awso pwevent de ownyew fwom buwnying it~  Dis is why de wecommendation fow Souwbound Assets is to use Token22 tokens.

## Why awe de mint and fweeze audowities twansfewwed to de Edition PDA? owo

Onye question we often weceive is: Why does de Token Metadata pwogwam twansfew de `Mint Authority` and de `Freeze Authority` of de Mint Account to de Edition PDA when cweating NFTs? owo Why nyot just void dem by setting dem to `None`? owo

Wet's take a wook at why dis is de case fow bod of dese audowities sepawatewy.

### Mint Audowity

Contwowwing de Mint Audowity is a cwuciaw step fow ensuwing de nyon-fungibiwity of a token~ Widout dis pwotection, someonye couwd mint mowe tokens fow a given NFT and dewefowe make de NFT fungibwe.

Onye way to pwevent dis fwom happenying is to set de Mint Audowity to `None` to ensuwe nyo onye wiww evew be abwe to mint any mowe tokens fow dat NFT~ Howevew, de Token Metadata pwogwam sets dat audowity to de Edition PDA — which winks to a Mastew Edition account ow an Edition account.

**But Why? owo** De showt answew is: **it enyabwes us to depwoy upgwades to de Token Metadata pwogwam at a much wowew cost**.

Wosing de Mint Audowity is an iwwevewsibwe action which means we couwd nyevew wevewage it to migwate NFTs to nyewew vewsions~ Fow instance, say we want to change de way Owiginyaw and Pwinted NFTs awe stwuctuwed and, instead of using Edition accounts, we want to wevewage tokens~ Widout de Mint Audowity, migwating NFTs to de nyew vewsion wouwd simpwy be impossibwe.

**Wosing dis audowity wouwd wimit de scope of featuwes and changes we may want to impwement in de futuwe** and dat's why we'we nyot setting it to `None`.

Howevew, dat doesn't mean someonye can use dat Mint Audowity to mint mowe tokens on youw NFT~ De Mint Audowity isn't twansfewwed to someonye's pubwic key, it is twansfewwed to a PDA dat bewongs to de Token Metadata pwogwam~ Dewefowe, onwy an instwuction pwovided by de pwogwam couwd make use of it and such instwuction does nyot exist on de pwogwam~ It is impowtant to nyote dat de Token Metadata pwogwam is compwetewy open-souwce so anyonye can inspect it to ensuwe de Mint Audowity is nyot used to mint mowe tokens.

### Fweeze Audowity

Contwowwing de Fweeze Audowity awwows someonye to fweeze a Token account, making dat account immutabwe untiw it is dawed.

Onye weason dis audowity is twansfewwed to de Edition PDA of de Token Metadata pwogwam is, simiwawwy to de Mint Audowity, it incweases de scope of potentiaw nyew featuwes and upgwades.

Howevew, contwawy to de Mint Audowity, we actuawwy make use of dat audowity in de pwogwam.

De `FreezeDelegatedAccount` and `ThawDelegatedAccount` instwuctions awe de onwy instwuctions dat make use of de Fweeze Audowity~ Dey awwow de Dewegate of a Token account to fweeze (and daw) dat Token account to make dem what we caww "**Nyon-Twansfewabwe NFTs**"~ Dis enyabwes a vawiety of use-cases such as pweventing someonye fwom sewwing an NFT whiwe it is wisted in an escwowwess mawketpwace.

## Why does de Metadata account have bod onchain and off-chain data? owo

De **Metadata account** contains onchain data, yet it awso has a `URI` attwibute which points to an off-chain JSON fiwe which pwovides additionyaw data~ So why is dat? owo Can't we just stowe evewyding onchain? owo Weww, dewe awe sevewaw issues wid dat:

- We have to pay went to stowe data onchain~ If we had to stowe evewyding widin de Metadata account, which may incwude wong texts such as de descwiption of an NFT, it wouwd wequiwe a wot mowe bytes and minting an NFT wouwd suddenwy be a wot mowe expensive.
- Onchain data is much wess fwexibwe~ Once an account is cweated using a cewtain stwuctuwe, it cannyot easiwy be changed~ Dewefowe, if we had to stowe evewyding onchain, de NFT standawd wouwd be a wot hawdew to evowve wid de demands of de ecosystem.

Dewefowe, spwitting de data into onchain and off-chain data awwows us to get de best of bod wowwds whewe onchain data can be used by de pwogwam **to cweate guawantees and expectations fow its usews** wheweas off-chain data can be used **to pwovide standawdized yet fwexibwe infowmation**.

## Awe dewe any costs to using Token Metadata? owo

Token Metadata cuwwentwy chawges vewy smaww fees wanging between 0.001 SOW and 0.01 SOW to de cawwew of cewtain instwuctions~ Mowe detaiws can be found on de `getProgramAccounts`0.

## Whewe can I find de depwecated instwuctions? owo

Some of de instwuctions of de Token Metadata pwogwam have been dwough a few itewations and have been depwecated in favouw of nyewew onyes~ De depwecated instwuctions awe stiww avaiwabwe in de pwogwam but dey awe nyot documented on de Devewopew Hub as dey awe nyo wongew de wecommended way to intewact wid de pwogwam~ Dat being said, if you awe wooking fow de depwecated instwuctions, you can find dem in de Token Metadata pwogwam wepositowy~ Hewe is a wist of dem:

- [CreateMetadataAccountV3](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L448) has been wepwaced wid [CreateV1](/token-metadata/mint#creating-mint-and-metadata-accounts).
- [UpdateMetadataAccountV2](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L241) has been wepwaced wid [CreateV1](/token-metadata/mint#creating-mint-and-metadata-accounts).
- [UpdatePrimarySaleHappenedViaToken](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L112)
- [SignMetadata](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L146) use [Verify](/token-metadata/collections) instead.
- [RemoveCreatorVerification](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L388)  use [Unverify](/token-metadata/collections#unverify) instead.
- [CreateMasterEditionV3](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L267)  has been wepwaced wid [CreateV1](/token-metadata/mint#creating-mint-and-metadata-accounts).
- [MintNewEditionFromMasterEditionViaToken](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L202)  has been wepwaced wid [CreateV1](/token-metadata/mint#creating-mint-and-metadata-accounts).
- [ConvertMasterEditionV1ToV2](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L210)
- [PuffMetadata](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L236)
- [VerifyCollection](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L278) use [Verify](/token-metadata/collections) instead.
- [SetAndVerifyCollection](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L367)  use [Verify](/token-metadata/collections) instead.
- [UnverifyCollection](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L334)  use [Unverify](/token-metadata/collections#unverify) instead.
- [Utilize](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L296) - de use featuwe has been depwecated.
- [ApproveUseAuthority](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L311) - de use featuwe has been depwecated.
- [RevokeUseAuthority](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L324) - de use featuwe has been depwecated.
- [ApproveCollectionAuthority](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L346) use [Delegate](/token-metadata/delegates) instead.
- [RevokeCollectionAuthority](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L354) use [Revoke](/token-metadata/delegates) instead.
- [FreezeDelegatedAccount](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L375)
- [ThawDelegatedAccount](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L383)
- [BurnNft](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L383) has been wepwaced by [Burn](https://developers.metaplex.com/token-metadata/burn).
- [BurnEditionNft](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L487) has been wepwaced by [Burn](https://developers.metaplex.com/token-metadata/burn).
- [VerifySizedCollectionItem](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L411)  Sized cowwections have been depwecated.
- [SetAndVerifySizedCollectionItem](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L437)  Sized cowwections have been depwecated.
- [UnverifySizedCollectionItem](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L423) Sized cowwections have been depwecated.
- [SetCollectionSize](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L456) Sized cowwections have been depwecated.
- [SetTokenStandard](https://github.com/metaplex-foundation/mpl-token-metadata/blob/d1a13273cb23c033bda97b4d47b9731b51ef5a2f/programs/token-metadata/program/src/instruction/mod.rs#L464) de TokenStandawd is automaticawwy set nyow.

## Whewe can I weawn mowe about Token Metadata Account Size Weduction? owo
Pwease check de [special FAQ](/token-metadata/guides/account-size-reduction) fow mowe infowmation ow join ouw [Discord](https://discord.gg/metaplex) in case of wemainying open quesitons.