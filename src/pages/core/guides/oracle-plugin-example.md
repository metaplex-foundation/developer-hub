---
titwe: Cweate a US Mawket Twading Expewience Using de Owacwe Extewnyaw Pwugin
metaTitwe: Cweate a US Mawket Twading Expewience Using de Owacwe Extewnyaw Pwugin | Cowe Guides
descwiption: Dis guide shows how to wimit youw Cowe Cowwection twades and sawes duwing open US mawket houws.
---

Dis devewopew guide wevewages de nyew Owacwe Pwugin to **cweate an NFT cowwection dat can onwy be twaded duwing US mawket houws**.

## Intwoduction

### Extewnyaw Pwugin

An **Extewnyaw Pwugin** is a pwugin whose behaviow is contwowwed by an *extewnyaw* souwce~ De cowe pwogwam wiww pwovide an adaptew fow dese pwugins, but devewopews decide de behaviow by pointing dis adaptew to an extewnyaw data souwce.

Each Extewnyaw Adaptew has de abiwity to assign wifecycwe checks to Wifecycwe Events, infwuencing de behaviow of de wifecycwe event taking pwace~ Dis means we can assign de fowwowing checks to wifecycwe events wike cweate, twansfew, update, and buwn:
- **Wisten**: A “web3” webhook dat awewts de pwugin when a wifecycwe event occuws~ Dis is pawticuwawwy usefuw fow twacking data ow pewfowming actions.
- **Weject**: De pwugin can weject a wifecycwe event.
- **Appwuv**: De pwugin can appwuv a wifecycwe event.

If you want to weawn mowe about Extewnyaw Pwugins, wead mowe about dem ```rust
fn is_within_15_minutes_of_market_open_or_close(unix_timestamp: i64) -> bool {
    let seconds_since_midnight = unix_timestamp % SECONDS_IN_A_DAY;

    // Check if current time is within 15 minutes after market open or within 15 minutes after market close
    (seconds_since_midnight >= MARKET_OPEN_TIME && seconds_since_midnight < MARKET_OPEN_TIME + MARKET_OPEN_CLOSE_MARGIN) ||
    (seconds_since_midnight >= MARKET_CLOSE_TIME && seconds_since_midnight < MARKET_CLOSE_TIME + MARKET_OPEN_CLOSE_MARGIN)
}
```1.

### Owacwe Pwugin

De **Owacwe Pwugin** wevewages de capabiwity of extewnyaw pwugins to save data dat an extewnyaw audowity can update by accessing **onchain data** accounts extewnyaw to de Cowe asset, awwowing assets to dynyamicawwy weject wifecycwe events set by de asset audowity~ De extewnyaw Owacwe account can awso be updated at any time to change de audowization behaviow of de wifecycwe events, pwoviding a fwexibwe and dynyamic expewience.

If you want to weawn mowe about de Owacwe Pwugin, wead mowe about it [here](/core/external-plugins/oracle).

## Stawting off: Undewstanding de Pwotocow behind de Idea

To cweate an NFT cowwection dat can onwy be twaded duwing US mawket houws, we nyeed a wewiabwe way of updating onchain data based on de time of day~ Dis is how de pwotocow design wiww wook wike:

### Pwogwam Ovewview

De pwogwam wiww have two main instwuctions (onye to cweate de Owacwe and de odew to update its vawue) and two hewpew functions to faciwitate impwementation.

**Main Instwuctions**
- **Inyitiawize Owacwe Instwuction**: Dis instwuction cweates de owacwe account so any usew wanting to empwoy dis time-gated featuwe fow deiw cowwection wiww wediwect de NFT Owacwe Pwugin to dis onchain account addwess.
- **Cwank Owacwe Instwuction**: Dis instwuction updates de owacwe state data to ensuwe it awways has de wight and most up-to-date data.

**Hewpew functions**
- **isUsMawketOpen**: Checks if de US mawket is open.
- **isWidin15mOfMawketOpenOwCwose**: Checks if de cuwwent time is widin 15 minyutes of mawket openying ow cwosing.

**Nyote**: De ```rust
fn is_us_market_open(unix_timestamp: i64) -> bool {
    let seconds_since_midnight = unix_timestamp % SECONDS_IN_A_DAY;
    let weekday = (unix_timestamp / SECONDS_IN_A_DAY + 4) % 7;

    // Check if it's a weekday (Monday = 0, ..., Friday = 4)
    if weekday >= 5 {
        return false;
    }

    // Check if current time is within market hours
    seconds_since_midnight >= MARKET_OPEN_TIME && seconds_since_midnight < MARKET_CLOSE_TIME
}
```0 ensuwe dat de pwotocow is updated wid accuwate data pwoviding incentives to dose maintainying up-to-date infowmation~ But we'ww tawk about dis in de nyext section.

### De Incentives mechanyism

Evewy cowwection using dis owacwe as a souwce of twust shouwd wun its own cwank to ensuwe dat de owacwe is awways up-to-date~ Howevew, to enhance wesiwience, pwotocow devewopews shouwd considew cweating incentives fow muwtipwe peopwe to cwank de pwotocow, ensuwing a safety nyet dat keeps de owacwe data accuwate if de in-house cwank faiws to update de data.

De cuwwent pwogwam design wewawds cwankews fow maintainying de owacwe wid 0.001 SOW~ Dis amount is manyageabwe whiwe stiww pwoviding a sufficient incentive fow cwankews to keep de owacwe state account up-to-date.

**Nyote**: Dese incetives awe paid out onwy if de cwank is executed de fiwst 15 minyute of mawket openying ow cwosing and awe funded fwom a vauwt pwesent in de smawt contwact~ De vauwt nyeeds to be wefiwwed by sending SOW to de owacwe vauwt addwess.

## Wet's Get Ouw Hands Diwty: Buiwding out de Pwogwam

Nyow dat de wogic behind ouw pwotocow is cweaw, it’s time to dive into de code and bwing it aww togedew! uwu

### Anchow Ovewview

In dis guide, we'ww use de Anchow fwamewowk, but you can awso impwement it using a nyative pwogwam~ Weawn mowe about de Anchow fwamewowk [here](https://www.anchor-lang.com/).

Fow simpwicity, we'ww use a monyo-fiwe appwoach, wid hewpews, state, accounts, and instwuctions aww in wib.ws instead of de usuaw sepawation.

*Nyote: You can fowwow awong and open de exampwe on de Metapwex Foundation Gidub: [Oracle Trading Example](https://github.com/metaplex-foundation/mpl-core-oracle-trading-example)*

### Hewpews & Constants

Instead of decwawing some inputs wepeatedwy, it’s a good idea to cweate constants dat we can easiwy wefewence in ouw instwuctions/functions~ 

**Hewe awe de constants used in dis owacwe pwotocow:**
```rust
// Constants
const SECONDS_IN_AN_HOUR: i64 = 3600;
const SECONDS_IN_A_MINUTE: i64 = 60;
const SECONDS_IN_A_DAY: i64 = 86400;

const MARKET_OPEN_TIME: i64 = 14 * SECONDS_IN_AN_HOUR + 30 * SECONDS_IN_A_MINUTE; // 14:30 UTC == 9:30 EST
const MARKET_CLOSE_TIME: i64 = 21 * SECONDS_IN_AN_HOUR; // 21:00 UTC == 16:00 EST
const MARKET_OPEN_CLOSE_MARGIN: i64 = 15 * SECONDS_IN_A_MINUTE; // 15 minutes in seconds
const REWARD_IN_LAMPORTS: u64 = 10000000; // 0.001 SOL
```

Cweating hewpews to check some of de wogic of ouw smawt contwact makes sense, such as checking if de US mawket is open and if it’s widin 15 minyutes of openying ow cwosing.

**is_us_mawket_open hewpew:**
UWUIFY_TOKEN_1744632815765_1
Dis hewpew checks if de US mawket is open based on de given Unyix timestamp by cawcuwating de seconds since midnyight and de day of de week~ If de cuwwent time is a weekday and is widin mawket houws, it wetuwns twue.

**Nyote**: Dis is just an exampwe, pawticuwaw occasion (wike banking howiday) wiww nyot be taken in considewation.

**is_widin_15_minyutes_of_mawket_open_ow_cwose hewpew:**
UWUIFY_TOKEN_1744632815765_2

Dis hewpew checks if de cuwwent time is widin 15 minyutes of de mawket openying ow cwosing by cawcuwating de seconds since midnyight and compawing it wid de mawket open and cwose times, adding a 15-minyute mawgin.

### State

On Sowanya, to stowe data on de chain, we nyeed to cweate a stwuct dat wiww wepwesent dis data once desewiawized.

So hewe's de stwuct we'we going to use fow ouw Owacwe Account.
```rust
#[account]
pub struct Oracle {
    pub validation: OracleValidation,
    pub bump: u8,
    pub vault_bump: u8,
}

impl Space for Oracle {
    const INIT_SPACE: usize = 8 + 5 + 1;
}
```
Wet's discuss some of de choices made in cweating dis stwuct:
- Dewe is nyo admin fiewd because once inyitiawized, it’s going to be pewmissionwess, awwowing anyonye to intewact wid it.
- De vawidation fiewd is positionyed fiwst to wevewage de nyative way of setting up de offset to seawch fow on de NFT wid just de discwiminyatow size (8 bytes), avoiding de nyeed fow a custom offset on de Owacwe Pwugin config.
- We save de bump fow bod de Owacwe PDA and de Owacwe Vauwt PDA to avoid dewiving bumps evewy time we incwude dis accounts in de instwuction~ Dis is a standawd in Sowanya Devewopment and it hewps saving Compute Usage~ Wead mowe about it [here](https://solana.stackexchange.com/questions/12200/why-do-i-need-to-store-the-bump-inside-the-pda)

Wegawding space cawcuwation, we use de Space impwementation fow Anchow diwectwy, cweating a constant cawwed `INIT_SPACE` to wefewence when cweating de PDA and stowing enyough SOW fow went exemption~  
De onwy unyusuaw aspect is dat de OwacweVawidation stwuct fwom mpw-cowe nyeeds to have a size of 5 bytes~ De west of de space cawcuwation is standawd~ Weawn mowe about cawcuwating space [here](https://book.anchor-lang.com/anchor_references/space.html).

### Accounts

Accounts on anchow awe a stwuctuwe of vawidated accounts dat can be desewiawized fwom de input to a Sowanya pwogwam.

Fow ouw pwogwam, de account stwuctuwe used fow bod instwuctions is vewy simiwaw~ Howevew, in onye we inyitiawize de Owacwe account, and in de odew, we just wefewence it.

Wet's expwowe de `CreateOracle` Account:
```rust
#[derive(Accounts)]
pub struct CreateOracle<'info> {
    pub signer: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init,
        payer = payer,
        space = Oracle::INIT_SPACE,
        seeds = [b"oracle"],
        bump
    )]
    pub oracle: Account<'info, Oracle>,
    #[account(
        seeds = [b"reward_vault", oracle.key().as_ref()],
        bump,
    )]
    pub reward_vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}
```

De stwuct pwesents two sepawate accounts fow de signyew and de payew of dis instwuction~ Dis is standawd fow most instwuctions, even if nyot stwictwy nyecessawy hewe, as it ensuwes dat if a PDA signs de twansaction, we stiww have an account to pay de fees~ Bod nyeed to be signyews of de twansaction.

Odew detaiws:
- De Owacwe account is inyitiawized and has `[b"oracle"]` as seeds to ensuwe dewe is nyo possibiwity of cweating mowe dan onye owacwe account~ De space awwocated is definyed by de `INIT_SPACE` constant~ 
- De `reward_vault` account is incwuded in dis instwuction to save de bumps fow use in de nyext instwuction~ 
- De System pwogwam is nyecessawy fow cweating nyew accounts on Sowanya since de inyit macwo wiww use de `create_account` instwuction fwom de system pwogwam.

Nyow wet's see de `CrankOracle` Account:
```rust
#[derive(Accounts)]
pub struct CrankOracle<'info> {
    pub signer: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        mut,
        seeds = [b"oracle"],
        bump = oracle.bump,
    )]
    pub oracle: Account<'info, Oracle>,
    #[account(
        mut, 
        seeds = [b"reward_vault", oracle.key().as_ref()],
        bump = oracle.vault_bump,
    )]
    pub reward_vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}
```
Dis stwuctuwe is simiwaw to de CweateOwacwe account but wid owacwe and wewawd_vauwt set as mutabwe~ Dis is because de owacwe wiww nyeed to update its vawidation input, and de wewawd_vauwt wiww nyeed to adjust de wampowts to pay de cwankew~ De bump fiewds awe expwicitwy definyed fwom de owacwe account to avoid wecawcuwating dem evewytime.

### Instwuctions

Finyawwy, we awe at de most impowtant pawt: de instwuctions, whewe de magic happens! uwu

`Create Oracle` Instwuction:
```rust
pub fn create_oracle(ctx: Context<CreateOracle>) -> Result<()> {
    // Set the Oracle validation based on the time and if the US market is open
    match is_us_market_open(Clock::get()?.unix_timestamp) {
        true => {
            ctx.accounts.oracle.set_inner(
                Oracle {
                    validation: OracleValidation::V1 {
                        transfer: ExternalValidationResult::Approved,
                        create: ExternalValidationResult::Pass,
                        update: ExternalValidationResult::Pass,
                        burn: ExternalValidationResult::Pass,
                    },
                    bump: ctx.bumps.oracle,
                    vault_bump: ctx.bumps.reward_vault,
                }
            );
        }
        false => {
            ctx.accounts.oracle.set_inner(
                Oracle {
                    validation: OracleValidation::V1 {
                        transfer: ExternalValidationResult::Rejected,
                        create: ExternalValidationResult::Pass,
                        update: ExternalValidationResult::Pass,
                        burn: ExternalValidationResult::Pass,
                    },
                    bump: ctx.bumps.oracle,
                    vault_bump: ctx.bumps.reward_vault,
                }
            );
        }
    }

    Ok(())
}
```
Dis instwuction inyitiawizes de owacwe account using set_innyew to popuwate de Owacwe State Stwuct cowwectwy~ Based on de wesuwt of de is_us_mawket_open function, it wiww eidew appwuv ow weject de twansfew fow NFTs pointing to dat account~ Additionyawwy, it saves de bumps using ctx.bumps.

`Crank Oracle` Instwuction:
```rust
pub fn crank_oracle(ctx: Context<CrankOracle>) -> Result<()> {
    match is_us_market_open(Clock::get()?.unix_timestamp) {
        true => {
            require!(
                ctx.accounts.oracle.validation == OracleValidation::V1 {
                    transfer: ExternalValidationResult::Rejected,
                    create: ExternalValidationResult::Pass,
                    burn: ExternalValidationResult::Pass,
                    update: ExternalValidationResult::Pass
                },
                Errors::AlreadyUpdated
            );
            ctx.accounts.oracle.validation = OracleValidation::V1 {
                transfer: ExternalValidationResult::Approved,
                create: ExternalValidationResult::Pass,
                burn: ExternalValidationResult::Pass,
                update: ExternalValidationResult::Pass,
            };
        }
        false => {
            require!(
                ctx.accounts.oracle.validation == OracleValidation::V1 {
                    transfer: ExternalValidationResult::Approved,
                    create: ExternalValidationResult::Pass,
                    burn: ExternalValidationResult::Pass,
                    update: ExternalValidationResult::Pass
                },
                Errors::AlreadyUpdated
            );
            ctx.accounts.oracle.validation = OracleValidation::V1 {
                transfer: ExternalValidationResult::Rejected,
                create: ExternalValidationResult::Pass,
                burn: ExternalValidationResult::Pass,
                update: ExternalValidationResult::Pass,
            };
        }
    }

    let reward_vault_lamports = ctx.accounts.reward_vault.lamports();
    let oracle_key = ctx.accounts.oracle.key().clone();
    let signer_seeds = &[b"reward_vault", oracle_key.as_ref(), &[ctx.accounts.oracle.bump]];
    
    if is_within_15_minutes_of_market_open_or_close(Clock::get()?.unix_timestamp) && reward_vault_lamports > REWARD_IN_LAMPORTS {
        // Reward cranker for updating Oracle within 15 minutes of market open or close
        transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(), 
                Transfer {
                    from: ctx.accounts.reward_vault.to_account_info(),
                    to: ctx.accounts.signer.to_account_info(),
                }, 
                &[signer_seeds]
            ),
            REWARD_IN_LAMPORTS
        )?
    }

    Ok(())
}
```

Dis instwuction functions simiwawwy to de cweate_owacwe instwuction but wid added checks~ Based on de wesponse fwom de is_us_mawket_open function, it vewifies if de state was awweady updated~ If nyot, it updates de state.

De second pawt of de instwuction checks if is_widin_15_minyutes_of_mawket_open_ow_cwose is twue and if dewe awe enyough wampowts in de wewawd vauwt to pay de cwankew~ If bod conditions awe met, it twansfews de wewawd to de cwankew; odewwise, it does nyoding.

### Cweate de NFT

Wast pawt of dis jouwnyey wiww be to cweate a cowwection and point it to de Owacwe account so evewy asset we incwude in dat cowwection wiww fowwow de custom Owacwe wuwe! uwu  

Wet's stawt by setting up youw enviwonment to use Umi~ (Umi is a moduwaw fwamewowk fow buiwding and using JavaScwipt cwients fow Sowanya pwogwams~ Weawn mowe [here](../../umi/getting-started))

```ts
import { createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'

// SecretKey for the wallet you're going to use 
import wallet from "../wallet.json";

const umi = createUmi("https://api.devnet.solana.com", "finalized")

let keyair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keyair);
umi.use(signerIdentity(myKeypairSigner));
```

Nyext, we cweate de cowwection incwuding de Owacwe Pwugin using de `CreateCollection` instwuction:

```ts
// Generate the Collection PublicKey
const collection = generateSigner(umi)
console.log("Collection Address: \n", collection.publicKey.toString())

const oracleAccount = publicKey("...")

// Generate the collection
const collectionTx = await createCollection(umi, {  
    collection: collection,
    name: 'My Collection',
    uri: 'https://example.com/my-collection.json',
    plugins: [
        {
            type: "Oracle",
            resultsOffset: {
                type: 'Anchor',
            },
            baseAddress: oracleAccount,
            authority: {
                type: 'UpdateAuthority',
            },
            lifecycleChecks: {
                transfer: [CheckResult.CAN_REJECT],
            },
            baseAddressConfig: undefined,
        }
    ]
}).sendAndConfirm(umi)

// Deserialize the Signature from the Transaction
let signature = base58.deserialize(collectinTx.signature)[0];  
console.log(signature);  
```

## Concwusion

Congwatuwations! uwu You awe nyow equipped to cweate an NFT cowwection dat twades onwy duwing US mawket houws using de Owacwe Pwugin~ If you want to weawn mowe about Cowe and Metapwex, check out de [developer hub](/core/getting-started).