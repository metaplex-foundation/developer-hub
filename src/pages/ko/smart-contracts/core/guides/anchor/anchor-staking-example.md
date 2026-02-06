---
title: Anchor로 Staking 프로그램 만들기
metaTitle: Anchor로 Staking 프로그램 만들기 | Core 가이드
description: 이 가이드에서는 Metaplex Core 디지털 Asset 표준을 사용하여 FreezeDelegate와 Attribute Plugin을 활용한 Staking 프로그램을 만드는 방법을 보여줍니다!
updated: '01-31-2026'
keywords:
  - NFT staking
  - Anchor staking
  - staking smart contract
  - freeze delegate staking
about:
  - Staking programs
  - Anchor development
  - On-chain staking
proficiencyLevel: Advanced
programmingLanguage:
  - Rust
howToSteps:
  - mpl-core 의존성으로 Anchor 프로젝트 설정하기
  - Freeze와 Attribute Plugin을 추가하는 stake 명령어 생성하기
  - 해동하고 스테이킹 기간을 계산하는 unstake 명령어 생성하기
  - devnet에 스테이킹 프로그램 배포 및 테스트하기
howToTools:
  - Anchor framework
  - mpl-core Rust crate
  - Solana CLI
---
이 개발자 가이드는 `Attribute`와 `Freeze Delegate` Plugin을 활용하여 Anchor로 컬렉션용 Staking 프로그램을 만드는 방법을 설명합니다. 이 접근 방식은 시간 계산과 Asset 상태(staking/unstaking) 관리와 같은 스테이킹 로직에 스마트 컨트랙트를 사용하지만, Core 이전 표준처럼 데이터가 PDA에 저장되지 않고 Asset 자체에 저장됩니다. {% .lead %}

## 시작하기: 프로그램 로직 이해하기

이 프로그램은 모든 필요한 매크로가 lib.rs 파일에 있는 단일 파일 접근 방식을 활용하는 표준 Anchor로 작동합니다:

- declare_id: 프로그램의 온체인 주소를 지정합니다.
- #[program]: 프로그램의 명령어 로직을 포함하는 모듈을 지정합니다.
- #[derive(Accounts)]: 명령어에 필요한 계정 목록을 나타내기 위해 구조체에 적용됩니다.
- #[account]: 프로그램 특정 커스텀 계정 유형을 생성하기 위해 구조체에 적용됩니다.
**이 예제를 구현하려면 다음 구성 요소가 필요합니다:**
- **Asset**
- **Collection** (선택 사항이지만 이 예제에서는 관련됨)
- **FreezeDelegate Plugin**
- **Attribute Plugin**

### Freeze Delegate Plugin

**Freeze Delegate Plugin**은 **소유자 관리 Plugin**이며, 이는 Asset에 적용하려면 소유자의 서명이 필요함을 의미합니다.
이 Plugin은 **delegate가 Asset을 동결하고 해동하여 전송을 방지**할 수 있게 합니다. Asset 소유자 또는 Plugin 권한자는 언제든지 이 Plugin을 취소할 수 있지만, Asset이 동결된 경우에는 취소 전에 해동해야 합니다.
**이 Plugin을 사용하는 것은 가볍습니다.** Asset을 동결/해동하는 것은 Plugin 데이터의 불리언 값만 변경하면 됩니다 (유일한 인수는 Frozen: bool입니다).
_자세한 내용은 [여기](/ko/smart-contracts/core/plugins/freeze-delegate)에서 확인하세요._

### Attribute Plugin

**Attribute Plugin**은 **권한자 관리 Plugin**이며, 이는 Asset에 적용하려면 권한자의 서명이 필요함을 의미합니다. Collection에 포함된 Asset의 경우, Asset의 권한자 필드가 Collection 주소로 차지되어 있으므로 Collection 권한자가 권한자 역할을 합니다.
이 Plugin은 **데이터를 Asset에 직접 저장하여 온체인 속성이나 특성으로 기능**합니다. 이러한 특성은 mpl-token-metadata 프로그램처럼 오프체인에 저장되지 않기 때문에 온체인 프로그램에서 직접 접근할 수 있습니다.
**이 Plugin은 AttributeList 필드를 허용**하며, 이는 키와 값 쌍의 배열로 구성되고 둘 다 문자열입니다.
_자세한 내용은 [여기](/ko/smart-contracts/core/plugins/attribute)에서 확인하세요._

### 스마트 컨트랙트 로직

간단함을 위해 이 예제는 Staking 프로그램이 의도대로 작동하는 데 필수적인 **stake**와 **unstake** 함수 두 가지 명령어만 포함합니다. 누적된 포인트를 활용하기 위한 **spendPoint** 명령어와 같은 추가 명령어를 추가할 수 있지만, 이는 독자가 구현하도록 남겨둡니다.
_Stake와 Unstake 함수 모두 앞서 소개한 Plugin을 다르게 활용합니다._
명령어에 들어가기 전에, 사용되는 속성인 `staked`와 `staked_time` 키에 대해 알아보겠습니다. `staked` 키는 Asset이 스테이킹되었는지와 스테이킹된 경우 언제 스테이킹되었는지를 나타냅니다(unstaked = 0, staked = 스테이킹된 시간). `staked_time` 키는 Asset이 언스테이킹된 후에만 업데이트되는 Asset의 총 스테이킹 기간을 추적합니다.
**명령어**:

- **Stake**: 이 명령어는 플래그를 true로 설정하여 Asset을 동결하기 위해 Freeze Delegate Plugin을 적용합니다. 또한 Attribute Plugin의 `staked` 키를 0에서 현재 시간으로 업데이트합니다.
- **Unstake**: 이 명령어는 Freeze Delegate Plugin의 플래그를 변경하고 악의적인 주체가 Asset을 제어하고 해동을 위해 몸값을 요구하는 것을 방지하기 위해 취소합니다. 또한 `staked` 키를 0으로 업데이트하고 `staked_time`을 현재 시간에서 스테이킹된 타임스탬프를 뺀 값으로 설정합니다.

## 스마트 컨트랙트 구축: 단계별 가이드

이제 스마트 컨트랙트 뒤의 로직을 이해했으니, **코드로 들어가서 모든 것을 종합할 시간입니다!**

### 의존성과 임포트

스마트 컨트랙트를 작성하기 전에, 스마트 컨트랙트가 작동하는 데 필요한 크레이트와 그 함수들을 살펴보겠습니다!
이 예제에서는 주로 [anchor](/ko/smart-contracts/core/using-core-in-anchor) 기능이 활성화된 mpl_core 크레이트를 사용합니다:

```toml
mpl-core = { version = "x.x.x", features = ["anchor"] }
```

그리고 해당 크레이트의 다양한 함수들은 다음과 같습니다:

```rust
use mpl_core::{
    ID as CORE_PROGRAM_ID,
    fetch_plugin,
    accounts::{BaseAssetV1, BaseCollectionV1},
    instructions::{AddPluginV1CpiBuilder, RemovePluginV1CpiBuilder, UpdatePluginV1CpiBuilder},
    types::{Attribute, Attributes, FreezeDelegate, Plugin, PluginAuthority, PluginType, UpdateAuthority},
};
```

### Anchor 개요

이 가이드에서는 Anchor 프레임워크를 사용하지만, 네이티브 프로그램을 사용하여 구현할 수도 있습니다. Anchor 프레임워크에 대해 자세히 알아보려면 여기를 참조하세요: [Anchor Framework](https://book.anchor-lang.com/introduction/what_is_anchor.html).
간단함과 이 연습을 위해, 일반적인 분리 대신 계정과 명령어 모두 lib.rs에 있는 단일 파일 접근 방식을 사용합니다.
**참고**: Solana 프로그램을 빌드하고 배포하는 온라인 도구인 Solana Playground에서 예제를 따라가며 열어볼 수 있습니다: Solana Playground.
모든 명령어의 계정 구조체에서 Signer와 Payer를 분리합니다. PDA는 계정 생성 비용을 지불할 수 없기 때문에 이것은 표준 절차입니다. 따라서 사용자가 PDA가 명령어의 권한자가 되기를 원한다면 두 개의 다른 필드가 필요합니다. 이 분리가 우리 명령어에 엄격하게 필요하지는 않지만, 좋은 관행으로 간주됩니다.

### 계정 구조체

이 예제에서는 mpl-core 크레이트의 anchor 플래그를 사용하여 계정 구조체에서 Asset과 Collection 계정을 직접 역직렬화하고 제약 조건을 설정합니다.
_자세한 내용은 [여기](/ko/smart-contracts/core/using-core-in-anchor)에서 확인하세요._
`stake`와 `unstake` 명령어 모두 동일한 계정과 동일한 제약 조건을 사용하므로 단일 계정 구조체 `Stake`를 사용합니다.

```rust
#[derive(Accounts)]
pub struct Stake<'info> {
    pub owner: Signer<'info>,
    pub update_authority: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        mut,
        has_one = owner,
        constraint = asset.update_authority == UpdateAuthority::Collection(collection.key()),
    )]
    pub asset: Account<'info, BaseAssetV1>,
    #[account(
        mut,
        has_one = update_authority,
    )]
    pub collection: Account<'info, BaseCollectionV1>,
    #[account(address = CORE_PROGRAM_ID)]
    /// CHECK: this will be checked by core
    pub core_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}
```

제약 조건으로 다음을 확인했습니다:

- Asset의 `owner`가 계정 구조체의 `owner`와 동일합니다.
- Asset의 `update_authority`가 Collection이고 해당 Collection의 주소가 계정 구조체의 `collection`과 동일합니다.
- Collection의 `update_authority`가 계정 구조체의 `update_authority`와 동일합니다. 이것이 Asset에 대한 `update_authority`가 됩니다.
- `core_program`이 `mpl_core` 크레이트에 있는 `ID`(저는 `CORE_PROGRAM_ID`로 이름을 변경했습니다)와 동일합니다.

### Staking 명령어

mpl-core 크레이트의 `fetch_plugin` 함수를 사용하여 Asset의 Attribute Plugin에 대한 정보를 가져오는 것으로 시작합니다.

```rust
match fetch_plugin::<BaseAssetV1, Attributes>(
    &ctx.accounts.asset.to_account_info(),
    mpl_core::types::PluginType::Attributes
)
```

1. **Attribute Plugin 확인**
`fetch_plugin` 함수는 2가지 다른 응답을 가집니다:

- `(_, fetched_attribute_list, _)` Asset에 연결된 Attribute Plugin이 있는 경우
- `Err` Asset에 연결된 Attribute Plugin이 없는 경우
그래서 Plugin의 응답에 따라 행동하기 위해 `match`를 사용했습니다.
Asset에 Attribute Plugin이 없는 경우, 추가하고 `staked`와 `stakedTime` 키로 채워야 합니다.

```rust
Err(_) => {
    AddPluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.update_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .plugin(Plugin::Attributes(
        Attributes{
            attribute_list: vec![
                Attribute {
                    key: "staked".to_string(),
                    value: Clock::get()?.unix_timestamp.to_string()
                },
                Attribute {
                    key: "staked_time".to_string(),
                    value: 0.to_string()
                },
            ]
        }
    ))
    .init_authority(PluginAuthority::UpdateAuthority)
    .invoke()?;
}
```
1. **Staking 속성 확인**:
Asset에 이미 Attribute Plugin이 있는 경우, Staking 명령어에 필요한 Staking 속성이 포함되어 있는지 확인합니다.
포함되어 있다면, Asset이 이미 스테이킹되었는지 확인하고 `staked` 키를 현재 타임스탬프 문자열로 업데이트합니다:

```rust
Ok((_, fetched_attribute_list, _)) => {
    // If yes, check if the asset is already staked, and if the staking attribute are already initialized
    let mut attribute_list: Vec<Attribute> = Vec::new();
    let mut is_initialized: bool = false;
    for attribute in fetched_attribute_list.attribute_list {
        if attribute.key == "staked" {
            require!(attribute.value == "0", StakingError::AlreadyStaked);
            attribute_list.push(Attribute {
                key: "staked".to_string(),
                value: Clock::get()?.unix_timestamp.to_string()
            });
            is_initialized = true;
        } else {
            attribute_list.push(attribute);
        }
    }
```

포함되어 있지 않다면, 기존 속성 목록에 추가합니다.

```rust
if !is_initialized {
    attribute_list.push(Attribute {
        key: "staked".to_string(),
        value: Clock::get()?.unix_timestamp.to_string()
    });
    attribute_list.push(Attribute {
        key: "staked_time".to_string(),
        value: 0.to_string()
    });
}
```
1. **Attribute Plugin 업데이트**:
새로운 또는 수정된 속성으로 Attribute Plugin을 업데이트합니다.

```rust
UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.update_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .plugin(Plugin::Attributes(Attributes{ attribute_list }))
    .invoke()?;
}
```
1. **Asset 동결**
Asset에 이미 Attribute Plugin이 있든 없든, 거래할 수 없도록 Asset을 동결합니다.

```rust
AddPluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
.asset(&ctx.accounts.asset.to_account_info())
.collection(Some(&ctx.accounts.collection.to_account_info()))
.payer(&ctx.accounts.payer.to_account_info())
.authority(Some(&ctx.accounts.owner.to_account_info()))
.system_program(&ctx.accounts.system_program.to_account_info())
.plugin(Plugin::FreezeDelegate( FreezeDelegate{ frozen: true } ))
.init_authority(PluginAuthority::UpdateAuthority)
.invoke()?;
```

**전체 명령어는 다음과 같습니다**:

```rust
pub fn stake(ctx: Context<Stake>) -> Result<()> {
    // Check if the asset has the attribute plugin already on
    match fetch_plugin::<BaseAssetV1, Attributes>(&ctx.accounts.asset.to_account_info(), mpl_core::types::PluginType::Attributes) {
        Ok((_, fetched_attribute_list, _)) => {
            // If yes, check if the asset is already staked, and if the staking attribute are already initialized
            let mut attribute_list: Vec<Attribute> = Vec::new();
            let mut is_initialized: bool = false;
            for attribute in fetched_attribute_list.attribute_list {
                if attribute.key == "staked" {
                    require!(attribute.value == "0", StakingError::AlreadyStaked);
                    attribute_list.push(Attribute {
                        key: "staked".to_string(),
                        value: Clock::get()?.unix_timestamp.to_string()
                    });
                    is_initialized = true;
                } else {
                    attribute_list.push(attribute);
                }
            }
            if !is_initialized {
                attribute_list.push(Attribute {
                    key: "staked".to_string(),
                    value: Clock::get()?.unix_timestamp.to_string()
                });
                attribute_list.push(Attribute {
                    key: "staked_time".to_string(),
                    value: 0.to_string()
                });
            }
            UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
            .asset(&ctx.accounts.asset.to_account_info())
            .collection(Some(&ctx.accounts.collection.to_account_info()))
            .payer(&ctx.accounts.payer.to_account_info())
            .authority(Some(&ctx.accounts.update_authority.to_account_info()))
            .system_program(&ctx.accounts.system_program.to_account_info())
            .plugin(Plugin::Attributes(Attributes{ attribute_list }))
            .invoke()?;
        }
        Err(_) => {
            // If not, add the attribute plugin to the asset
            AddPluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
            .asset(&ctx.accounts.asset.to_account_info())
            .collection(Some(&ctx.accounts.collection.to_account_info()))
            .payer(&ctx.accounts.payer.to_account_info())
            .authority(Some(&ctx.accounts.update_authority.to_account_info()))
            .system_program(&ctx.accounts.system_program.to_account_info())
            .plugin(Plugin::Attributes(
                Attributes{
                    attribute_list: vec![
                        Attribute {
                            key: "staked".to_string(),
                            value: Clock::get()?.unix_timestamp.to_string()
                        },
                        Attribute {
                            key: "staked_time".to_string(),
                            value: 0.to_string()
                        },
                    ]
                }
            ))
            .init_authority(PluginAuthority::UpdateAuthority)
            .invoke()?;
        }
    }
    // Freeze the asset
    AddPluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.owner.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .plugin(Plugin::FreezeDelegate( FreezeDelegate{ frozen: true } ))
    .init_authority(PluginAuthority::UpdateAuthority)
    .invoke()?;
    Ok(())
}
```

### Unstaking 명령어

Unstaking 명령어는 Staking 명령어 이후에만 호출될 수 있으므로 많은 검사가 Staking 명령어 자체에서 본질적으로 처리되기 때문에 더 간단합니다.
mpl-core 크레이트의 `fetch_plugin` 함수를 사용하여 Asset의 Attribute Plugin에 대한 정보를 가져오는 것으로 시작합니다.

```rust
match fetch_plugin::<BaseAssetV1, Attributes>(&ctx.accounts.asset.to_account_info(), mpl_core::types::PluginType::Attributes)
```

하지만 이번에는 Attribute Plugin을 찾지 못하면 하드 에러를 발생시킵니다.

```rust
Err(_) => {
    return Err(StakingError::AttributesNotInitialized.into());
}
```

1. **Attribute Plugin에 대한 모든 검사 실행**
Asset이 이미 Staking 명령어를 거쳤는지 확인하기 위해, **명령어는 다음을 위해 Attribute Plugin을 확인합니다**:

- **Asset에 Staked 키가 있는가?**
- **Asset이 현재 스테이킹되어 있는가?**
이러한 검사 중 하나라도 누락되면, Asset은 Staking 명령어를 거치지 않은 것입니다.

```rust
for attribute in fetched_attribute_list.attribute_list.iter() {
    if attribute.key == "staked" {
        require!(attribute.value != "0", StakingError::NotStaked);
        [...]
        is_initialized = true;
    } else {
        [...]
    }
}
[...]
require!(is_initialized, StakingError::StakingNotInitialized);
```

Asset에 Staking 속성이 있고 Asset이 현재 스테이킹되어 있는지 확인한 후, 스테이킹되어 있다면 다음과 같이 Staking 속성을 업데이트합니다:

- `Staked` 필드를 0으로 설정
- `stakedTime`을 `stakedTime` + (현재타임스탬프 - 스테이킹된타임스탬프)로 업데이트

```rust
Ok((_, fetched_attribute_list, _)) => {
    let mut attribute_list: Vec<Attribute> = Vec::new();
    let mut is_initialized: bool = false;
    let mut staked_time: i64 = 0;
    for attribute in fetched_attribute_list.attribute_list.iter() {
        if attribute.key == "staked" {
            require!(attribute.value != "0", StakingError::NotStaked);
            attribute_list.push(Attribute {
                key: "staked".to_string(),
                value: 0.to_string()
            });
            staked_time = staked_time
                .checked_add(Clock::get()?.unix_timestamp
                .checked_sub(attribute.value.parse::<i64>()
                .map_err(|_| StakingError::InvalidTimestamp)?)
                .ok_or(StakingError::Underflow)?)
                .ok_or(StakingError::Overflow)?;
            is_initialized = true;
        } else if attribute.key == "staked_time" {
            staked_time = staked_time
                .checked_add(attribute.value.parse::<i64>()
                .map_err(|_| StakingError::InvalidTimestamp)?)
                .ok_or(StakingError::Overflow)?;
        } else {
            attribute_list.push(attribute.clone());
        }
    }
    attribute_list.push(Attribute {
        key: "staked_time".to_string(),
        value: staked_time.to_string()
    });
    require!(is_initialized, StakingError::StakingNotInitialized);
```
1. **Attribute Plugin 업데이트**
새로운 또는 수정된 속성으로 Attribute Plugin을 업데이트합니다.

```rust
UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
.asset(&ctx.accounts.asset.to_account_info())
.collection(Some(&ctx.accounts.collection.to_account_info()))
.payer(&ctx.accounts.payer.to_account_info())
.authority(Some(&ctx.accounts.update_authority.to_account_info()))
.system_program(&ctx.accounts.system_program.to_account_info())
.plugin(Plugin::Attributes(Attributes{ attribute_list }))
.invoke()?;
```
1. **FreezeDelegate Plugin 해동 및 제거**
명령어 끝에서 Asset을 해동하고 FreezeDelegate Plugin을 제거하여 Asset이 `자유롭고` `update_authority`에 의해 제어되지 않도록 합니다.

```rust
UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
.asset(&ctx.accounts.asset.to_account_info())
.collection(Some(&ctx.accounts.collection.to_account_info()))
.payer(&ctx.accounts.payer.to_account_info())
.authority(Some(&ctx.accounts.update_authority.to_account_info()))
.system_program(&ctx.accounts.system_program.to_account_info())
.plugin(Plugin::FreezeDelegate( FreezeDelegate{ frozen: false } ))
.invoke()?;
RemovePluginV1CpiBuilder::new(&ctx.accounts.core_program)
.asset(&ctx.accounts.asset.to_account_info())
.collection(Some(&ctx.accounts.collection.to_account_info()))
.payer(&ctx.accounts.payer)
.authority(Some(&ctx.accounts.owner))
.system_program(&ctx.accounts.system_program)
.plugin_type(PluginType::FreezeDelegate)
.invoke()?;
```

**전체 명령어는 다음과 같습니다**:

```rust
pub fn unstake(ctx: Context<Unstake>) -> Result<()> {
    // Check if the asset has the attribute plugin already on
    match fetch_plugin::<BaseAssetV1, Attributes>(&ctx.accounts.asset.to_account_info(), mpl_core::types::PluginType::Attributes) {
        Ok((_, fetched_attribute_list, _)) => {
            let mut attribute_list: Vec<Attribute> = Vec::new();
            let mut is_initialized: bool = false;
            let mut staked_time: i64 = 0;
            for attribute in fetched_attribute_list.attribute_list.iter() {
                if attribute.key == "staked" {
                    require!(attribute.value != "0", StakingError::NotStaked);
                    attribute_list.push(Attribute {
                        key: "staked".to_string(),
                        value: 0.to_string()
                    });
                    staked_time = staked_time
                        .checked_add(Clock::get()?.unix_timestamp
                        .checked_sub(attribute.value.parse::<i64>()
                        .map_err(|_| StakingError::InvalidTimestamp)?)
                        .ok_or(StakingError::Underflow)?)
                        .ok_or(StakingError::Overflow)?;
                    is_initialized = true;
                } else if attribute.key == "staked_time" {
                    staked_time = staked_time
                        .checked_add(attribute.value.parse::<i64>()
                        .map_err(|_| StakingError::InvalidTimestamp)?)
                        .ok_or(StakingError::Overflow)?;
                } else {
                    attribute_list.push(attribute.clone());
                }
            }
            attribute_list.push(Attribute {
                key: "staked_time".to_string(),
                value: staked_time.to_string()
            });
            require!(is_initialized, StakingError::StakingNotInitialized);
            UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
            .asset(&ctx.accounts.asset.to_account_info())
            .collection(Some(&ctx.accounts.collection.to_account_info()))
            .payer(&ctx.accounts.payer.to_account_info())
            .authority(Some(&ctx.accounts.update_authority.to_account_info()))
            .system_program(&ctx.accounts.system_program.to_account_info())
            .plugin(Plugin::Attributes(Attributes{ attribute_list }))
            .invoke()?;
        }
        Err(_) => {
            return Err(StakingError::AttributesNotInitialized.into());
        }
    }
    // Thaw the asset
    UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.update_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .plugin(Plugin::FreezeDelegate( FreezeDelegate{ frozen: false } ))
    .invoke()?;
    // Remove the FreezeDelegate Plugin
    RemovePluginV1CpiBuilder::new(&ctx.accounts.core_program)
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer)
    .authority(Some(&ctx.accounts.owner))
    .system_program(&ctx.accounts.system_program)
    .plugin_type(PluginType::FreezeDelegate)
    .invoke()?;

    Ok(())
}
```

## 결론

축하합니다! 이제 NFT Collection을 위한 Staking 솔루션을 만들 준비가 되었습니다! Core와 Metaplex에 대해 더 알아보려면 [개발자 허브](/ko/smart-contracts/core/getting-started)를 확인하세요.
