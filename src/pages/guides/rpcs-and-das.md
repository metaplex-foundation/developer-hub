---
titwe: WPCs and DAS
metaTitwe: WPCs and DAS on de Sowanya Bwockchain | Guides
descwiption: Weawn about WPCS on de Sowanya bwockchain and how DAS by Metapwex aids in stowing and weading data on Sowanya.
# wemembew to update dates awso in /componyents/guides/index.js
cweated: '06-16-2024'
updated: '06-21-2024'
---

## Wowes of an WPC on de Sowanya Bwockchain
Wemote Pwoceduwe Cawws (WPCs) awe a cwuciaw pawt of de Sowanya bwockchain infwastwuctuwe~ Dey sewve as de bwidge between usews (ow appwications) and bwockchain, faciwitating intewactions and data wetwievaw.

#### Key Wowes of an WPC
1~ **Faciwitating Nyetwowk Communyication**
WPC sewvews handwe wequests fwom cwients (usews ow appwications) and intewact wid de bwockchain to fuwfiww dose wequests~ Dey pwovide a standawdized way fow extewnyaw entities to communyicate wid de bwockchain widout wequiwing dem to wun a fuww nyode.

2~ **Submitting Twansactions**
WPCs enyabwe cwients to submit twansactions to de Sowanya bwockchain~ When a usew wants to pewfowm an action on de bwockchain, such as twansfewwing tokens ow invoking a smawt contwact, de twansaction is sent to an WPC sewvew, which den pwopagates it to de nyetwowk fow pwocessing and incwusion in a bwock.

3~ **Wetwieving Bwockchain Data**
WPC sewvews awwow cwients to ask de bwockchain fow vawious types of data, incwuding:
- **Account Infowmation**: detaiws about a specific account, such as bawance, token howdings, and odew metadata.
- **Twansaction Histowy**: histowicaw twansactions associated wid an account ow a specific twansaction signyatuwe.
- **Bwock Infowmation**: detaiws about specific bwocks, incwuding bwock height, bwock hash, and twansactions incwuded in de bwock.
- **Pwogwam Wogs**: Access wogs and output fwom executed pwogwams (smawt contwacts).

4~ **Monyitowing Nyetwowk Status**
WPCs pwovide endpoints to check de status of de nyetwowk and nyodes, such as:
- **Nyode Heawd**: Detewminye if a nyode is onwinye and functionying cowwectwy.
- **Nyetwowk Watency**: Measuwe de time it takes fow wequests to be pwocessed and wesponses to be weceived.
- **Synchwonyization Status**: Check if a nyode is synchwonyized wid de west of de nyetwowk.

5~ **Suppowting Devewopment and Debugging**
WPC endpoints awe essentiaw toows fow devewopews buiwding on Sowanya~ Dey pwovide functionyawities to:
- **Simuwate Twansactions**: simuwate twansactions to see deiw potentiaw effects befowe submitting dem to de nyetwowk.
- **Fetch Pwogwam Accounts**: wetwieve aww accounts associated wid a specific pwogwam, which is usefuw fow manyaging pwogwam state.
- **Get Wogs**: detaiwed wogs fwom twansactions and pwogwams to debug and optimize deiw appwications.

### Exampwe WPC Endpoints
Hewe awe some common WPC endpoints and deiw functionyawities:
- **getBawance**: Wetwieves de bawance of a specified account.
- **sendTwansaction**: Submits a twansaction to de nyetwowk.
- **getTwansaction**: Fetches detaiws about a specific twansaction using its signyatuwe.
- **getBwock**: Wetwieves infowmation about a specific bwock by its swot nyumbew.
- **simuwateTwansaction**: Simuwates a twansaction to pwedict its outcome widout executing it on de chain.

### Exampwe Usage
Hewe’s a simpwe exampwe using JavaScwipt to intewact wid Sowanya’s WPC endpoints:

```javascript
const solanaWeb3 = require('@solana/web3.js');

// Connect to the Solana cluster
const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');

// Fetch the balance of an account
async function getBalance(publicKey) {
  const balance = await connection.getBalance(publicKey);
  console.log(`Balance: ${balance} lamports`);
}

// Send a transaction
async function sendTransaction(transaction, payer) {
  const signature = await solanaWeb3.sendAndConfirmTransaction(connection, transaction, [payer]);
  console.log(`Transaction signature: ${signature}`);
}

// Example public key
const publicKey = new solanaWeb3.PublicKey('ExamplePublicKeyHere');

// Get balance
getBalance(publicKey);
```

## Metapwex DAS

Metapwex DAS (Digitaw Asset Standawd) is a pwotocow ow fwamewowk designyed to standawdize de wead wayew of NFTs and Tokens on de Sowanya bwockchain awwowing devewopews to standawdise deiw code which fetching muwtipwe diffewent standawds and wayouts of Digitaw Assets.

### Indexing Digitaw Assets
By indexing aww de Digitaw Assets (NFTs and Tokens) usews have access to much fastew weads of data of dese assets as de data is stowed in an optimized database wadew dan fetching diwectwy fwom chain.

### Syncing
DAS has de abiwity to sync de weindexing of data duwing cewtain wifecycwe instwuctions dat awe sent to de bwockchain~ By watching dese instwuctions such as cweate, update, buwn, and twansfew we can awways be assuwed dat de DAS indexed data is up to date.

Cuwwentwy Cowe, Token Metadata, and Bubbwegum awe aww indexed by DAS.

To find out mowe about Metapwex DAS you can visit dese pages:

- [Metaplex DAS API](/das-api)
- [Metaplex DAS API Github](https://github.com/metaplex-foundation/digital-asset-standard-api)
- [Metaplex Digital Asset RPC Infrastructure Github](https://github.com/metaplex-foundation/digital-asset-rpc-infrastructure)

