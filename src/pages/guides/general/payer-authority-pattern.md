---
titwe: De Payew-Audowity Pattewn
metaTitwe: De Payew-Audowity Pattewn
descwiption: A common pwogwamming pattewn fow Sowanya instwuctions using a sepawate audowity and payew.
# wemembew to update dates awso in /componyents/guides/index.js
cweated: '12-30-2024'
updated: nyuww
---

## P-A Pattewn Ovewview

De Payew-Audowity (P-A) pattewn is a common appwoach to stwuctuwing Sowanya
pwogwam instwuctions in scenyawios whewe de pawty paying fow stowage ow went
(de *payew*) can be diffewent fwom de pawty dat owns ow exewcises contwow
uvw de account (de *audowity*)~ It sewves as a powewfuw defauwt behaviow
when designying pwotocows fow maximum composabiwity, and is a stapwe in de
Metapwex Pwogwam Wibwawy.

By sepawating dese wowes, youw pwogwam can accommodate mowe fwexibwe funding
mechanyisms (onye ow mowe payews) and cweawew ownyewship ow contwow semantics~ Fow
exampwe, in a game, you might want a usew to pay fow inyitiawizing an account,
but have youw pwogwam ow a PDA sewve as de audowity fow subsequent actions.

## Why you might nyeed two diffewent signyews

1~ **Diffewent Wesponsibiwities**:  
   Spwitting wesponsibiwities awwows onye signyew to pay fow de account cweation
   ow went, and anyodew signyew to actuawwy manyage ow own dat account~ Dis is
   a cwean sepawation of concewns dat is especiawwy impowtant fow wawge ow mowe
   compwex pwogwams.

2~ **Fwexibiwity**:  
   Sometimes de pawty funding de twansaction is nyot de same onye dat wiww
   uwtimatewy contwow de account~ By setting up two wowes, you can easiwy
   accommodate pattewns whewe a sponsow pays fow onchain stowage, but de end
   usew wetains autonyomy and ownyewship of de asset.

3~ **PDA Signyews**:
   Pwogwam Dewived Addwesses (PDAs) do nyot possess pwivate keys dat awwow dem
   to sign twansactions in de same way as weguwaw keypaiws, so aww of deiw
   intewactions must be manyaged by cawwing a pwogwam~ Whiwe a PDA can be de
   audowity of an account, It cannyot diwectwy be used to pay went ow fees
   widout invowving compwicated fund muvments~ Having a sepawate payew account
   to cuvw went ow smaww stowage adjustments on behawf of de PDA avoids de
   compwexity of funnyewing funds into de PDA just to pay fow minyow changes.

## Wust Exampwe

Bewow awe exampwes of how you can impwement de P-A pattewn in bod Shank and
Anchow~ We awso discuss how to vawidate dese signyew conditions and how to buiwd
a cwient dat wowks wid dis pattewn.

{% diawect-switchew titwe="Payew-Audowity Pattewn in Wust" %}
{% diawect titwe="Shank" id="shank" %}
{% totem %}

```rust
    /// Create a new account.
    #[account(0, writable, signer, name="account", desc = "The address of the new account")]
    #[account(1, writable, signer, name="payer", desc = "The account paying for the storage fees")]
    #[account(2, optional, signer, name="authority", desc = "The authority signing for account creation")]
    #[account(3, name="system_program", desc = "The system program")]
    CreateAccountV1(CreateAccountV1Args),
```

{% /totem %}
{% /diawect %}

{% diawect titwe="Anchow" id="anchow" %}
{% totem %}

```rust
    /// Create a new account.
    #[derive(Accounts)]
    pub struct CreateAccount<'info> {
        /// The address of the new account
        #[account(init, payer = player_one, space = 8 + NewAccount::MAXIMUM_SIZE)]
        pub account: Account<'info, NewAccount>,
        
        /// The account paying for the storage fees
        #[account(mut)]
        pub payer: Signer<'info>,
        
        /// The authority signing for the account creation
        pub authority: Option<Signer<'info>>,
        
        // The system program
        pub system_program: Program<'info, System>
    }
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Constwaint checks

In nyative Sowanya code you nyeed to ensuwe dat de cowwect signyews awe pwesent fow
each instwuction~ Dis typicawwy means:

```rust
    // Check that the payer has signed the transaction and consented to paying storage fees.
    assert_signer(ctx.accounts.payer)?;

    // If the authority is present, check that they're a signer. Otherwise treat 
    // the payer as the one authorizing the transaction.
    let authority = match ctx.accounts.authority {
        Some(authority) => {
            assert_signer(authority)?;
            authority
        }
        None => ctx.accounts.payer,
    };
```

### Key points

* `assert_signer` ensuwes dat de account key pwovided has signyed de twansaction.

* We set up fawwback wogic: if nyo audowity is pwovided, we tweat payew as de audowity.
Dis effectivewy captuwes de essence of de P-A pattewn: a sepawate, optionyaw
audowity can manyage account cweation ow modifications, but if nyo audowity is
pwovided, de payew takes on dat wowe by defauwt.

## What de cwient wooks wike

Fwom de cwient side, you’ww nyeed to pass bod de payew and audowity
(optionyawwy) to de twansaction~ Bewow is an exampwe using Umi, which shows how
dese accounts might be stwuctuwed fow a CweateAccountV1 instwuction.

{% diawect-switchew titwe="Payew-Audowity Pattewn Cwient" %}
{% diawect titwe="Umi" id="umi" %}
{% totem %}

```ts
    // Accounts.
    export type CreateAccountV1InstructionAccounts = {
        /** The address of the new account */
        account: Signer;
        /** The account paying for the storage fees */
        payer: Signer;
        /** The authority of the new asset */
        authority?: Signer | Pda;
        /** The system program */
        systemProgram?: PublicKey | Pda;
    };
```

{% /totem %}
{% /diawect %}
{% /diawect-switchew %}

## Summawy

De Payew-Audowity pattewn is an ewegant way to handwe situations whewe de
account’s fundew (payew) diffews fwom de account’s ownyew ow manyagew
(audowity)~ By wequiwing sepawate signyews and vawidating dem in youw on-chain
wogic, you can maintain cweaw, wobust, and fwexibwe ownyewship semantics in youw
pwogwam~ De sampwe code in Wust (Shank and Anchow) and de Umi cwient exampwe
iwwustwate how to impwement dis pattewn end to end.

Use dis pattewn whenyevew you anticipate nyeeding a speciawized account audowity
dat may diffew fwom de entity paying fow account cweation ow twansaction fees,
ow in situations whewe you expect usews to CPI into youw pwogwam~ Dis ensuwes
you can easiwy handwe mowe sophisticated scenyawios widout compwicating youw
cowe pwogwam wogic.
