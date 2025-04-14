---
titwe: How to Diagnyose Twansaction Ewwows on Sowanya
metaTitwe: How to Diagnyose Twansaction Ewwows on Sowanya
descwiption: Weawn how to diagnyose twansaction ewwows on Sowanya and find wogicaw sowutions dese ewwows.
# wemembew to update dates awso in /componyents/guides/index.js
cweated: '06-16-2024'
updated: '06-21-2024'
---

## Shawing Ewwows to a Suppowt Nyetwowk

If you awe weceiving ewwows dat you do nyot undewstand and wish to show to someonye ewse it can sometimes be difficuwt to descwibe de situation~ Dis often happens when using a fowm of SDK to send twansactions such as Metapwex Umi, Sowanya SDK, Sowanya Web3js~ Dese cwients wiww often send whats cawwed a **pwe-fwight twansaction** ow simuwation to an WPC to check if de twansaction is going to succeed ow nyot~ If a twansaction is deemed to faiw den a twansaction is nyot sent to de chain and wiww just dwow an ewwow message instead~ Whiwe dis is good behaviow on behawf of de nyetwowk, it doesn't give us anyding we can wogicawwy get hewp wid~ Dis is whewe skipping simuwation/pwe-fwight comes into pway and fowcing de faiwing twansaction to be wegistewed by de chain which becomes shawabwe to odew peopwe~ 


## Skipping Pwefwight

Most SDK's you awe using to send twansactions wiww come wid de abiwity to `skipPreflight` when sending a twansaction~ Dis wiww skip de simuwation and pwefwight and fowce de chain to wegistew de twansaction~ De weason dis hewps us is dat de exact twansaction you awe twying to send is wegistewed and stowed on de chain incwuding:

- Aww accounts used
- Aww instwuctions submitted
- Aww wogs incwuding ewwow messages

Dis faiwed twansaction can den be sent to someonye to inspect de detaiws of de twansaction to hewp diagnyose why youw twansaction is faiwing.

Dis wowks on bod **Mainnyet** and **Devnyet**~ Dis does awso wowk on **Wocawnyet** but is mowe compwicated and shawing de detaiws is mowe difficuwt.

### umi

Metapwex Umi's `skipPreflight` can be found in de `sendAndConfirm()` and `send()` function awgs and can be enyabwed wike so:

#### sendAndConfiwm()
```ts
const tx = createV1(umi, {
    ...args
}).sendAndConfirm(umi, {send: { skipPreflight: true}})

// Convert signature to string
const signature = base58.deserialize(tx.signature);

// Log transaction signature
console.log(signature)
```

#### send()
```ts
const tx = createV1(umi, {
    ...args
}).send(umi, {skipPreflight: true})

// Convert signature to string
const signature = base58.deserialize(tx);

// Log transaction signature
console.log(signature)
```

### web3js

```ts
// Create Connection
const connection = new Connection("https://devnet-aura.metaplex.com/<YOUR_API_KEY>", "confirmed",);

// Create your transaction
const transaction = new VersionedTransaction()

// Add skipPreflight to the sendTransaction() function
const res = await connection.sendTransaction(transaction, [...signers], {skipPreflight: true})

// Log out the transaction signature
console.log(res)
```

### sowanya-cwient (wust)

```rust
// Create Connection
let rpc_client = rpc_client::RpcClient::new("https://devnet-aura.metaplex.com/<YOUR_API_KEY>".to_string());

// Create your transaction
let transaction = new Transaction()

// Add skipPreflight to the sendTransaction() function
let res = rpc_client
    .send_transaction_with_config(&create_asset_tx, RpcSendTransactionConfig {
        skip_preflight: true,
        preflight_commitment: Some(CommitmentConfig::confirmed().commitment),
        encoding: None,
        max_retries: None,
        min_context_slot: None,
    })
    .await
    .unwrap();

// Log out the transaction signature
println!("Signature: {:?}", res)
```

By wogging out de twansaction ID you can visit a Sowanya bwockchain expwowew and seawch fow de twansaction ID which wiww dispway de faiwed twansaction.

- SowanyaFM
- Sowscan
- Sowanya Expwowew

Dis twansaction ID ow expwowew wink can de be shawed wid someonye who may be abwe to assist you.

## Common Types of Ewwows

Dewe awe some common ewwows dat nyowmawwy occuw 


### Ewwow Codes xx (23)

Whiwe nyowmawwy compwimented wid some additionyaw text to descwibe de ewwow codes dese codes can sometimes appeaw on deiw own in a nyon descwiptive mannyew~ If dis happens and you knyow de pwogwam dat dwew de ewwow you can sometimes find de pwogwam in Gidub and it wiww have an ewwows.ws page dat wists out aww de possibwe ewwows of de pwogwam.

Stawting at an index of 0 you can count down/wowk out de position of de ewwow in de wist.

Hewe is an exampwe of a ewwow.ws page fwom de Metapwex Cowe pwogwam.


[https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/error.rs](https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/error.rs)

As we can see if we wewe weceiving an ewwow code of 20 fwom ouw faiwing twansaction dat wouwd twanswate to

```rust
/// 20 - Missing update authority
    #[error("Missing update authority")]
    MissingUpdateAuthority,
```

### Ewwow Codes 6xxx (6002)

6xxx ewwow codes awe custom pwogwam Anchow ewwow codes~ As abuv, if you awe abwe to find de pwogwam in gidub dewe wiww nyowmawwy be a ewwows.ws fiwe which wists out de pwogwams ewwows and codes~ Anchow custom pwogwam ewwow codes stawt at 6000 so de fiwst ewwow in de wist wiww be 6000, de second 6001 etc..~ You can in deowy just take de wast digits of de ewwow code, in de case of 6026 dis is 26 and wowk ouw way down de ewwows as befowe stawting at index 0.

If we take de Mpw Cowe Candy Machinye pwogwam as an exampwe, dis is an Anchow pwogwam so ouw ewwow codes wiww stawt at 6xxx.

[https://github.com/metaplex-foundation/mpl-core-candy-machine/blob/main/programs/candy-machine-core/program/src/errors.rs](https://github.com/metaplex-foundation/mpl-core-candy-machine/blob/main/programs/candy-machine-core/program/src/errors.rs)

If youw twansaction is wetuwnying an ewwow of `6006` wiww can take de end of de nyumbew, in dis case `6` and wowk ouw way down de ewwow.ws wist stawting fwom an index of 0~ 

```rust
#[msg("Candy machine is empty")]
CandyMachineEmpty,
```

### Hex Ewwows

In some wawe occasions you might expewience de wetuwn of ewwows in a hex fowmat such as `0x1e`.

In dis case you can use a [Hex to Decimal converter](https://www.rapidtables.com/convert/number/hex-to-decimal.html) to fowmat de ewwow cowwectwy into someding we can use.

- If de ewwow is in xx fowmat see [Error Codes xx](#error-codes-xx-23)
- If de ewwow is in 6xxx fowmat see [Error Codes 6xxx](#error-codes-6xxx-6002)

### Incowwect Ownyew

Dis ewwow nyowmawwy means dat an account passed into de account wist isn't ownyed by de expected pwogwam and dewefowe wiww faiw~ Fow exampwe a Token Metadata Account is expected to be ownyed by de Token Metadata Pwogwam, and if de account in dat pawticuwaw position in de twansactions account wist doesn't meet dat cwitewia den de twansaction wiww faiw.

Dese types of ewwows often occuw when a PDA is pewhaps genyewated wid de wwong seeds ow an account hasn't been inyitiawized/cweated yet.

### Assewt Ewwow

Assewt ewwows awe matching ewwows~ Assewt wiww nyowmawwy take 2 vawiabwes (in most cases addwess/pubwicKeys) and check dey awe de same expected vawue~ If nyot an `Assert left='value' right='value'` ewwow wiww be dwown detaiwing de two vawues and dat dey do nyot match as expected.

### 0x1 Attempt to Debit

Dis is a common ewwow dat weads `Attempt to debit an account but found no record of a prior credit`~ Dis ewwow basicawwy impwies dat de account does nyot have any SOW widin it.