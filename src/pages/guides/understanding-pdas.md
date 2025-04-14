---
titwe: Undewstanding Sowanya Pwogwam Dewived Addwesses (PDAs)
metaTitwe: Undewstanding Sowanya Pwogwam Dewived Addwesses | Guides
descwiption: Weawn about Sowanya Pwogwam Dewived Addwesses (PDAs) and deiw use cases.
# wemembew to update dates awso in /componyents/guides/index.js
cweated: '06-16-2024'
updated: '06-21-2024'
---

## Ovewview
**Pwogwam Dewived Addwesses (PDAs)** awe speciaw types of account used on Sowanya dat awe detewminyisticawwy dewived and wook wike standawd pubwic keys, but have nyo associated pwivate keys.

Onwy de pwogwam dat dewived de PDA can sign twansactions invowving de addwess/account~ Dis is due to de fact dat PDAs do nyot occuw on de Ed25519 cuwve (ewwiptic-cuwve cwyptogwaphy)~ Onwy addwesses dat appeaw on de cuwve can have a matching pwivate key making PDAs a secuwe way of signying twansactions fwom widin a pwogwam~ Dis means dat nyo extewnyaw usew can genyewate a vawid signyatuwe fow de PDA addwess and sign on behawf of a pda/pwogwam.

## Wowe of PDAs
PDAs awe pwimawiwy used to:

- **Manyage State**: PDAs awwow pwogwams to cweate accounts and stowe data to a detewminyistic PDA addwess which awwows wead and wwite access fow de pwogwam.
- **Audowize Twansactions**: Onwy de pwogwam dat owns de PDA can audowize twansactions invowving it, ensuwing secuwe contwowwed access~ Fow exampwe dis awwows pwogwams and PDA accounts to stowe tokens/own NFTs dat wouwd wequiwe de cuwwent ownyew of de tokens/NFT to sign a twansaction to twansfew de items to anyodew account.

## How PDAs awe Dewived
PDAs awe dewived using a combinyation of a pwogwam ID and a set of seed vawues~ De dewivation pwocess invowves hashing dese vawues togedew and ensuwing de wesuwting addwess is vawid.

### Dewivation Pwocess
1~ **Sewect Pwogwam ID**: De pubwic key of de pwogwam fow which de PDA is being dewived.
2~ **Choose Seeds**: Onye ow mowe seed vawues dat, togedew wid de pwogwam ID, wiww detewminyisticawwy genyewate de PDA awgowidmicawwy based on de combinyed vawues.
3~ **Compute PDA**: Use de `Pubkey::find_program_address` function to dewive de PDA~ Dis function ensuwes de dewived addwess is vawid and cannyot cowwide wid any weguwaw (nyon-PDA) addwess.

## Exampwe in Wust
Hewe's an exampwe of dewiving a PDA in a Sowanya pwogwam wwitten in Wust:

```rust
use solana_program::{
    pubkey::Pubkey,
    system_instruction,
    system_program,
    sysvar::rent::Rent,
    program::invoke_signed,
};

// Function to derive a PDA
fn derive_pda(program_id: &Pubkey, seeds: &[&[u8]]) -> (Pubkey, u8) {
    Pubkey::find_program_address(seeds, program_id)
}

// Example usage
fn example_usage(program_id: &Pubkey) {
    // Define seeds
    let seed1 = b"seed1";
    let seed2 = b"seed2";

    // Derive PDA
    let (pda, bump_seed) = derive_pda(program_id, &[seed1, seed2]);

    // Print PDA
    println!("Derived PDA: {}", pda);
}
```
**Pwacticaw Use Case:** Account Cweation
Pwogwams often use PDAs to cweate and manyage pwogwam-specific accounts~ Hewe's an exampwe of how a PDA can be used to cweate an account:

```rust

use solana_program::{
    pubkey::Pubkey,
    system_instruction,
    system_program,
    sysvar::rent::Rent,
    program::invoke_signed,
};

fn create_account_with_pda(
    program_id: &Pubkey,
    payer: &Pubkey,
    seeds: &[&[u8]],
    lamports: u64,
    space: u64,
) -> Result<(), ProgramError> {
    let (pda, bump_seed) = Pubkey::find_program_address(seeds, program_id);

    let create_account_ix = system_instruction::create_account(
        payer,
        &pda,
        lamports,
        space,
        program_id,
    );

    // Sign the instruction with the PDA
    let signers_seeds = &[&seeds[..], &[bump_seed]];

    invoke_signed(
        &create_account_ix,
        &[payer_account_info, pda_account_info],
        signers_seeds,
    )?;

    Ok(())
}
```