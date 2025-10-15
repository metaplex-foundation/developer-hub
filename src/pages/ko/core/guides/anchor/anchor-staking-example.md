---
title: Anchor로 스테이킹 프로그램 만들기
metaTitle: Anchor로 스테이킹 프로그램 만들기 | Core 가이드
description: 이 가이드는 FreezeDelegate와 Attribute 플러그인을 활용하여 Metaplex Core 디지털 자산 표준을 사용한 스테이킹 프로그램을 만드는 방법을 보여줍니다!
---

이 개발자 가이드는 `Attribute` 및 `Freeze Delegate` 플러그인을 활용하여 Anchor를 사용해 컬렉션을 위한 스테이킹 프로그램을 만드는 방법을 보여줍니다. 이 접근법은 시간 계산 및 자산 상태 관리(스테이킹/언스테이킹)와 같은 스테이킹 로직을 위해 스마트 컨트랙트를 사용하지만, Core 이전의 표준처럼 PDA에 데이터를 저장하지 않고 자산 자체에 데이터를 저장합니다.

## 시작하기: 프로그램 뒤의 로직 이해하기

이 프로그램은 표준 Anchor와 함께 작동하며, 모든 필요한 매크로가 lib.rs 파일에서 찾을 수 있는 모노파일 접근법을 활용합니다:
- declare_id: 프로그램의 온체인 주소를 지정합니다.
- #[program]: 프로그램의 명령어 로직을 포함하는 모듈을 지정합니다.
- #[derive(Accounts)]: 명령어에 필요한 계정 목록을 나타내기 위해 구조체에 적용됩니다.
- #[account]: 프로그램에 특정한 사용자 정의 계정 유형을 생성하기 위해 구조체에 적용됩니다.

**이 예제를 구현하려면 다음 구성 요소가 필요합니다:**
- **자산(Asset)**
- **컬렉션(Collection)** (선택사항이지만 이 예제에 관련됨)
- **FreezeDelegate 플러그인**
- **Attribute 플러그인**

### Freeze Delegate 플러그인

**Freeze Delegate 플러그인**은 **소유자 관리 플러그인**으로, 자산에 적용하려면 소유자의 서명이 필요합니다.

이 플러그인은 **위임자가 자산을 동결 및 해제하여 전송을 방지**할 수 있게 합니다. 자산 소유자 또는 플러그인 권한자는 언제든지 이 플러그인을 취소할 수 있지만, 자산이 동결된 경우는 예외입니다(이 경우 취소하기 전에 먼저 해제해야 합니다).

**이 플러그인 사용은 가벼워서**, 자산 동결/해제는 플러그인 데이터에서 boolean 값을 변경하는 것만 포함합니다(유일한 인수는 Frozen: bool입니다).

_자세한 내용은 [여기](/core/plugins/freeze-delegate)에서 확인하세요_

### Attribute 플러그인

**Attribute 플러그인**은 **권한자 관리 플러그인**으로, 자산에 적용하려면 권한자의 서명이 필요합니다. 컬렉션에 포함된 자산의 경우, 자산의 권한자 필드가 컬렉션 주소로 점유되어 있기 때문에 컬렉션 권한자가 권한자 역할을 합니다.

이 플러그인은 **온체인 속성 또는 특성으로 작동하는 자산에 직접 데이터 저장**을 허용합니다. mpl-token-metadata 프로그램과 달리 오프체인에 저장되지 않기 때문에 이러한 특성들은 온체인 프로그램에서 직접 액세스할 수 있습니다.

**이 플러그인은 AttributeList 필드를 받습니다**, 이는 키와 값 쌍의 배열로 구성되며, 둘 다 문자열입니다.

_자세한 내용은 [여기](/core/plugins/attribute)에서 확인하세요_

### 스마트 컨트랙트 로직

간단함을 위해, 이 예제는 스테이킹 프로그램이 의도한 대로 작동하는 데 필수적인 **stake** 및 **unstake** 함수 두 개의 명령어만 포함합니다. 축적된 포인트를 활용하는 **spendPoint** 명령어와 같은 추가 명령어를 추가할 수 있지만, 이는 독자가 구현하도록 남겨둡니다.

_Stake와 Unstake 함수 모두 이전에 소개된 플러그인을 다르게 활용합니다_.

명령어를 살펴보기 전에, 사용되는 속성인 `staked` 및 `staked_time` 키에 대해 시간을 들여 이야기해봅시다. `staked` 키는 자산이 스테이킹되었는지와 스테이킹된 시점을 나타냅니다(언스테이킹됨 = 0, 스테이킹됨 = 스테이킹된 시간). `staked_time` 키는 자산의 총 스테이킹 기간을 추적하며, 자산이 언스테이킹된 후에만 업데이트됩니다.

**명령어들**:
- **Stake**: 이 명령어는 플래그를 true로 설정하여 자산을 동결하기 위해 Freeze Delegate 플러그인을 적용합니다. 또한 Attribute 플러그인의 `staked` 키를 0에서 현재 시간으로 업데이트합니다.
- **Unstake**: 이 명령어는 Freeze Delegate 플러그인의 플래그를 변경하고 취소하여 악의적인 개체가 자산을 제어하고 해제하기 위해 몸값을 요구하는 것을 방지합니다. 또한 `staked` 키를 0으로 업데이트하고 `staked_time`을 현재 시간에서 스테이킹된 타임스탬프를 뺀 값으로 설정합니다.

## 스마트 컨트랙트 구축: 단계별 가이드

이제 스마트 컨트랙트 뒤의 로직을 이해했으므로, **코드를 살펴보고 모든 것을 함께 가져올 시간입니다**!

### 의존성 및 임포트

스마트 컨트랙트를 작성하기 전에, 스마트 컨트랙트가 작동하도록 하기 위해 필요한 크레이트와 그 함수들을 살펴봅시다!

이 예제에서는 주로 [anchor](/core/using-core-in-anchor) 기능이 활성화된 mpl_core 크레이트를 사용합니다:

```toml
mpl-core = { version = "x.x.x", features = ["anchor"] }
```

그리고 해당 크레이트에서 가져오는 다양한 함수들은 다음과 같습니다:

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

이 가이드에서는 Anchor 프레임워크를 사용하지만, 네이티브 프로그램을 사용하여 구현할 수도 있습니다. Anchor 프레임워크에 대해 더 자세히 알아보려면 여기를 확인하세요: [Anchor Framework](https://book.anchor-lang.com/introduction/what_is_anchor.html).

간단함과 이 연습을 위해, 일반적인 분리 대신 계정과 명령어가 모두 lib.rs에 있는 모노파일 접근법을 사용합니다.

**참고**: Solana 프로그램을 구축하고 배포하는 온라인 도구인 Solana Playground에서 예제를 따라하고 열 수 있습니다: Solana Playground.

모든 명령어의 계정 구조체에서는 Signer와 Payer를 분리합니다. PDA는 계정 생성 비용을 지불할 수 없기 때문에, 사용자가 PDA를 명령어의 권한자로 원한다면 이를 위해 두 개의 다른 필드가 필요하므로 이는 표준 절차입니다. 이 분리가 우리 명령어에는 꼭 필요하지 않지만, 좋은 관행으로 간주됩니다.

### 계정 구조체

이 예제에서는 mpl-core 크레이트의 anchor 플래그를 사용하여 계정 구조체에서 Asset 및 Collection 계정을 직접 역직렬화하고 여기에 일부 제약조건을 적용합니다.

_자세한 내용은 [여기](/core/using-core-in-anchor)에서 확인하세요_

동일한 계정과 동일한 제약조건을 사용하므로 `stake` 및 `unstake` 명령어 모두에 대해 단일 계정 구조체인 `Stake`를 사용합니다.

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

제약조건으로 다음을 확인했습니다:
- 자산의 `owner`가 계정 구조체의 `owner`와 동일합니다.
- 자산의 `update_authority`가 Collection이고 해당 컬렉션의 주소가 계정 구조체의 `collection`과 동일합니다.
- 컬렉션의 `update_authority`가 계정 구조체의 `update_authority`와 동일합니다. 이것이 자산에 대한 `update_authority`가 될 것이기 때문입니다.
- `core_program`이 `mpl_core` 크레이트에 있는 `ID`(CORE_PROGRAM_ID로 이름을 바꿈)와 동일합니다.

### 스테이킹 명령어

mpl-core 크레이트의 `fetch_plugin` 함수를 사용하여 자산의 attribute 플러그인에 대한 정보를 검색하는 것으로 시작합니다.

```rust
match fetch_plugin::<BaseAssetV1, Attributes>(
    &ctx.accounts.asset.to_account_info(),
    mpl_core::types::PluginType::Attributes
)
```

1. **Attribute 플러그인 확인**

`fetch_plugin` 함수는 2가지 다른 응답을 가집니다:
- Asset과 연결된 attribute 플러그인이 있으면 `(_, fetched_attribute_list, _)`
- 자산과 연결된 attribute 플러그인이 없으면 `Err`

그래서 플러그인의 응답에 따라 행동하기 위해 `match`를 사용했습니다.

자산에 attribute 플러그인이 없으면, 추가하고 `staked` 및 `stakedTime` 키로 채워야 합니다.

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

2. **스테이킹 속성 확인**:
자산에 이미 attribute 플러그인이 있다면, 스테이킹 명령어에 필요한 스테이킹 속성이 포함되어 있는지 확인합니다.

포함되어 있다면, 자산이 이미 스테이킹되었는지 확인하고 `staked` 키를 문자열로 현재 타임스탬프로 업데이트합니다:

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

포함되어 있지 않다면, 기존 attribute 목록에 추가합니다.

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

3. **Attribute 플러그인 업데이트**:
새로운 또는 수정된 속성으로 attribute 플러그인을 업데이트합니다.

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

4. **자산 동결**
자산에 이미 attribute 플러그인이 있었든 없었든, 자산을 제자리에 동결하여 거래할 수 없도록 합니다.

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

### 언스테이킹 명령어

언스테이킹 명령어는 언스테이킹 명령어가 스테이킹 명령어 후에만 호출될 수 있기 때문에 훨씬 더 간단합니다. 많은 확인 사항이 스테이킹 명령어 자체에 의해 본질적으로 다뤄지기 때문입니다.

mpl-core 크레이트의 `fetch_plugin` 함수를 사용하여 자산의 attribute 플러그인에 대한 정보를 검색하는 것으로 시작합니다.

```rust
match fetch_plugin::<BaseAssetV1, Attributes>(&ctx.accounts.asset.to_account_info(), mpl_core::types::PluginType::Attributes)
```
하지만 이번에는 Attribute 플러그인을 찾지 못하면 강한 에러를 던집니다.

```rust
Err(_) => {
    return Err(StakingError::AttributesNotInitialized.into());
}
```

1. **attribute 플러그인에 대한 모든 확인 실행**

자산이 이미 스테이킹 명령어를 거쳤는지 확인하기 위해, **명령어는 다음에 대해 attribute 플러그인을 확인합니다**:
- **자산에 Staked 키가 있는가?**
- **자산이 현재 스테이킹되었는가?**

이러한 확인 중 하나라도 누락되면, 자산은 스테이킹 명령어를 거친 적이 없습니다.

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

자산에 스테이킹 속성이 있고 자산이 현재 스테이킹되었음을 확인하면, 스테이킹되었다면 다음과 같이 스테이킹 속성을 업데이트합니다:
- `Staked` 필드를 0으로 설정
- `stakedTime`을 `stakedTime` + (currentTimestamp - stakedTimestamp)로 업데이트

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

2. **Attribute 플러그인 업데이트**
새로운 또는 수정된 속성으로 attribute 플러그인을 업데이트합니다.

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

3. **FreezeDelegate 플러그인 해제 및 제거**
명령어 끝에서 자산을 해제하고 FreezeDelegate 플러그인을 제거하여 자산이 `자유롭고` `update_authority`에 의해 제어되지 않도록 합니다.

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

축하합니다! 이제 NFT 컬렉션을 위한 스테이킹 솔루션을 만들 수 있게 되었습니다! Core와 Metaplex에 대해 더 알고 싶다면 [개발자 허브](/core/getting-started)를 확인하세요.