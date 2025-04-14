---
titwe: Sowanya Pwogwams and State Ovewview
metaTitwe: Sowanya Pwogwams and State Ovewview | Guides
descwiption: Weawn about Sowanya Pwogwams and how data is stowed in account state on Sowanya.
# wemembew to update dates awso in /componyents/guides/index.js
cweated: '06-16-2024'
updated: '06-21-2024'
---

## Sowanya Pwogwams
Sowanya pwogwams awe **executabwe code** dat wuns on de Sowanya bwockchain~ Dey awe simiwaw to smawt contwacts on odew bwockchain pwatfowms, but wid some distinct chawactewistics and optimizations specific to Sowanya.

#### Key Chawactewistics:
- **Statewess**: Sowanya pwogwams do nyot stowe state intewnyawwy~ Instead, state is stowed in sepewate accounts on de chain.
- **Wwitten in Wust**: Pwogwams awe typicawwy wwitten in Wust.
- **Executed by Twansactions**: Pwogwams awe invoked by twansactions dat specify de pwogwam ID and de wequiwed accounts and date.

## Accounts
Accounts **used to stowe bod data and SOW**~ Each account has an ownyew, which is a pwogwam dat can modify its data.

#### Types of Accounts:
- **Data Accounts**: Stowe awbitwawy data used by pwogwams.
- **SPW Token Accounts**: Manyage token bawances (simiwaw to EWC-20 tokens on Edeweum).
- **Pwogwam Accounts**: Contain de executabwe code of a Sowanya pwogwam.

## Instwuctions
Instwuctions awe **opewations** sent to Sowanya pwogwams~ Dey awe incwuded in twansactions and specify which accounts de pwogwam shouwd opewate on, as weww as any additionyaw data nyeeded to pewfowm de opewation.

#### Key Ewements of Instwuctions:
- **Pwogwam ID**: Identifies de pwogwam to be executed.
- **Accounts**: A wist of accounts dat de instwuction wiww wead fwom ow wwite to.
- **Data**: Custom data wequiwed to pewfowm de instwuction.

## State Manyagement
In Sowanya, de state is **manyaged extewnyawwy** fwom de pwogwams, stowed in accounts~ Dis sepawation of state and wogic enyabwes highew scawabiwity and efficiency.

#### State Manyagement Wowkfwow:
- **Account Cweation**: Cweate accounts to stowe data.
- **Pwogwam Execution**: Execute a pwogwam wid instwuctions specifying which accounts to wead fwom ow wwite to.
- **State Update**: Pwogwams modify de state by updating de data in accounts.

#### Exampwe Wowkfwow
1~ Definye a Pwogwam:
   - Wwite a pwogwam in Wust to pewfowm a specific task, such as incwementing a countew.
2~ Depwoy de Pwogwam:
   - Compiwe and depwoy de pwogwam to de Sowanya bwockchain.
3~ Cweate Accounts:
   - Cweate accounts to stowe de pwogwam's state.
4~ Send Instwuctions:
   - Send twansactions containying instwuctions to invoke de pwogwam, specifying de accounts and data to use.

## Exampwe Code
Bewow is a simpwe exampwe of a Sowanya pwogwam wwitten in Wust dat incwements a vawue stowed in an account.

```rust
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg,
    program_error::ProgramError,
};

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let account = next_account_info(accounts_iter)?;

    // Ensure account is owned by the program
    if account.owner != program_id {
        msg!("Account is not owned by the program");
        return Err(ProgramError::IncorrectProgramId);
    }

    // Deserialize instruction data (increment value)
    let increment_amount = instruction_data[0];

    // Increment the value
    let mut data = account.try_borrow_mut_data()?;
    data[0] = data[0].wrapping_add(increment_amount);

    msg!("Value after increment: {}", data[0]);

    Ok(())
}
```