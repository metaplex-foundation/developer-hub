---
title: Appdata 플러그인을 활용한 이벤트 티켓팅 플랫폼 생성
metaTitle: Core - Appdata 플러그인 예제
description: 이 가이드는 Appdata 플러그인을 활용한 티켓팅 플랫폼 생성 방법을 보여줍니다.
---

이 개발자 가이드는 새로운 Appdata 플러그인을 활용하여 **디지털 자산으로 티켓을 생성하고 발행자가 아닌 외부 신뢰 소스(예: 장소 관리자)에 의해 검증될 수 있는 티켓팅 솔루션을 생성**합니다.

## 소개

### 외부 플러그인

**외부 플러그인**은 *외부* 소스에 의해 동작이 제어되는 플러그인입니다. 코어 프로그램은 이러한 플러그인에 대한 어댑터를 제공하지만, 개발자는 이 어댑터를 외부 데이터 소스에 연결하여 동작을 결정합니다.

각 외부 어댑터는 라이프사이클 이벤트에 라이프사이클 검사를 할당하여 발생하는 라이프사이클 이벤트의 동작에 영향을 줄 수 있습니다. 이는 생성, 전송, 업데이트, 소각과 같은 라이프사이클 이벤트에 다음 검사를 할당할 수 있음을 의미합니다:
- **Listen**: 라이프사이클 이벤트가 발생할 때 플러그인에 알림을 주는 "web3" 웹훅입니다. 이는 데이터 추적이나 작업 수행에 특히 유용합니다.
- **Reject**: 플러그인이 라이프사이클 이벤트를 거부할 수 있습니다.
- **Approve**: 플러그인이 라이프사이클 이벤트를 승인할 수 있습니다.

외부 플러그인에 대해 더 자세히 알고 싶다면 [여기](/ko/smart-contracts/core/external-plugins/overview)에서 더 읽어보세요.

### Appdata 플러그인

**AppData 플러그인**은 자산/컬렉션 권한이 `data_authority`에 의해 작성되고 변경될 수 있는 임의의 데이터를 저장할 수 있게 해주며, 이는 외부 신뢰 소스이고 자산/컬렉션 권한이 결정하는 누구에게든 할당될 수 있습니다. AppData 플러그인을 통해 컬렉션/자산 권한은 신뢰할 수 있는 제3자에게 자산에 데이터를 추가하는 작업을 위임할 수 있습니다.

새로운 Appdata 플러그인에 익숙하지 않다면 [여기](/ko/smart-contracts/core/external-plugins/app-data)에서 더 읽어보세요.

## 일반 개요: 프로그램 설계

이 예제에서는 네 가지 기본 작업을 가진 티켓팅 솔루션을 개발할 것입니다:

- **관리자 설정**: 티켓 생성 및 발행을 담당하는 권한 설정.
- **이벤트 생성**: 이벤트를 컬렉션 자산으로 생성.
- **개별 티켓 생성**: 이벤트 컬렉션의 일부인 개별 티켓 생산.
- **장소 운영 처리**: 티켓이 사용될 때 스캔하는 것과 같은 장소 운영자를 위한 운영 관리.

**참고**: 이러한 작업들은 티켓팅 솔루션의 기초적인 시작을 제공하지만, 본격적인 구현에는 이벤트 컬렉션 인덱싱을 위한 외부 데이터베이스와 같은 추가 기능이 필요할 것입니다. 하지만 이 예제는 티켓팅 솔루션 개발에 관심이 있는 사람들에게 좋은 출발점이 됩니다.

### 티켓 스캔 처리를 위한 외부 신뢰 소스 보유의 중요성

**AppData 플러그인**과 **Core 표준**이 도입되기 전까지는 오프체인 저장소 제약으로 인해 자산의 속성 변경 관리가 제한적이었습니다. 또한 자산의 특정 부분에 대한 권한을 위임하는 것도 불가능했습니다.

이러한 발전은 **장소 권한이 속성 변경 및 기타 데이터 측면에 대한 완전한 제어권을 부여받지 않고도 자산에 데이터를 추가할 수 있게** 하므로 티켓팅 시스템과 같은 규제된 사용 사례에 대한 게임 체인저입니다.

이 설정은 사기 활동의 위험을 줄이고 오류에 대한 책임을 장소에서 벗어나게 하므로 발행 회사는 자산의 불변 기록을 보유하고, 티켓을 사용됨으로 표시하는 것과 같은 특정 데이터 업데이트는 `AppData 플러그인`을 통해 안전하게 관리됩니다.

### PDA 대신 데이터 저장을 위한 디지털 자산 사용

이벤트 관련 데이터를 위해 일반적인 외부 Program Derived Addresses([PDA](/guides/understanding-pdas))에 의존하는 대신, **이벤트 자체를 컬렉션 자산으로 생성**할 수 있습니다. 이 접근 방식을 통해 이벤트의 모든 티켓이 "이벤트" 컬렉션에 포함되어 일반적인 이벤트 데이터에 쉽게 접근할 수 있고 이벤트 세부 정보를 티켓 자산 자체와 쉽게 연결할 수 있습니다. 그런 다음 티켓 번호, 홀, 섹션, 줄, 좌석, 가격을 포함한 개별 티켓 관련 데이터에도 같은 방법을 적용하여 자산에 직접 적용할 수 있습니다.

외부 PDA에 의존하기보다는 디지털 자산을 다룰 때 관련 데이터를 저장하기 위해 `Collection`이나 `Asset` 계정과 같은 Core 계정을 사용하면 티켓 구매자가 데이터를 역직렬화할 필요 없이 지갑에서 직접 모든 관련 이벤트 정보를 볼 수 있습니다. 또한 자산 자체에 직접 데이터를 저장하면 아래에 표시된 것처럼 단일 인스트럭션으로 웹사이트에서 가져와서 표시하기 위해 Digital Asset Standard(DAS)를 활용할 수 있습니다:

```typescript
const ticketData = await fetchAsset(umi, ticket);
console.log("\nThis are all the ticket-related data: ", ticketData.attributes);
```

## 실제 작업해보기: 프로그램

### 전제 조건 및 설정
간단함을 위해 Anchor를 사용하여 모든 필요한 매크로를 `lib.rs` 파일에서 찾을 수 있는 모노파일 접근 방식을 활용합니다:

- `declare_id`: 프로그램의 온체인 주소를 지정합니다.
- `#[program]`: 프로그램의 인스트럭션 로직을 포함하는 모듈을 지정합니다.
- `#[derive(Accounts)]`: 인스트럭션에 필요한 계정 목록을 나타내기 위해 구조체에 적용됩니다.
- `#[account]`: 프로그램에 특정한 사용자 정의 계정 유형을 생성하기 위해 구조체에 적용됩니다.

**참고**: 다음 예제를 따라가면서 Solana 프로그램을 빌드하고 배포하는 온라인 도구인 Solana Playground에서 열 수 있습니다: [Solana Playground](https://beta.solpg.io/669fef20cffcf4b13384d277).

스타일 선택으로, 모든 인스트럭션의 계정 구조체에서 `Signer`와 `Payer`를 분리합니다. 종종 같은 계정이 둘 다에 사용되지만 `Signer`가 PDA인 경우에는 계정 생성에 대해 지불할 수 없으므로 두 개의 다른 필드가 필요한 표준 절차입니다. 이 분리가 우리 인스트럭션에는 엄격히 필요하지 않지만 좋은 관행으로 간주됩니다.

**참고**: Signer와 Payer 모두 여전히 트랜잭션의 서명자여야 합니다.

### 의존성 및 임포트

이 예제에서는 주로 anchor 기능이 활성화된 `mpl_core` 크레이트를 사용합니다:

```toml
mpl-core = { version = "x.x.x", features = ["anchor"] }
```

사용되는 의존성은 다음과 같습니다:

```rust
use anchor_lang::prelude::*;

use mpl_core::{
    ID as MPL_CORE_ID,
    fetch_external_plugin_adapter_data_info,
    fetch_plugin,
    instructions::{
        CreateCollectionV2CpiBuilder,
        CreateV2CpiBuilder,
        WriteExternalPluginAdapterDataV1CpiBuilder,
        UpdatePluginV1CpiBuilder
    },
    accounts::{BaseAssetV1, BaseCollectionV1},
    types::{
        AppDataInitInfo, Attribute, Attributes,
        ExternalPluginAdapterInitInfo, ExternalPluginAdapterKey,
        ExternalPluginAdapterSchema, PermanentBurnDelegate, UpdateAuthority,
        PermanentFreezeDelegate, PermanentTransferDelegate, Plugin,
        PluginAuthority, PluginAuthorityPair, PluginType
    },
};
```

### 관리자 설정 인스트럭션

관리자 설정 인스트럭션은 `manager` PDA를 초기화하고 관리자 계정 내에 범프를 저장하는 데 필요한 일회성 프로세스입니다.

대부분의 작업은 `Account` 구조체에서 발생합니다:
```rust
#[derive(Accounts)]
pub struct SetupManager<'info> {
   pub signer: Signer<'info>,
   #[account(mut)]
   pub payer: Signer<'info>,
   #[account(
       init,
       payer = payer,
       space = Manager::INIT_SPACE,
       seeds = [MANAGER_SEEDS.as_bytes()],
       bump,
   )]
   pub manager: Account<'info, Manager>,
   pub system_program: Program<'info, System>,
}
```

여기서 우리는 `init` 매크로를 사용하여 `Manager` 계정을 초기화하며, 지불자가 임대료에 충분한 라이포트를 전송하고 `INIT_SPACE` 변수로 적절한 바이트 수를 예약합니다.

```rust
#[account]
pub struct Manager {
    pub bump: u8,
}

impl Space for Manager {
    const INIT_SPACE: usize = 8 + 1;
}
```

인스트럭션 자체에서는 관리자 계정을 사용할 때 서명자 시드를 사용할 때 향후 참조를 위해 범프를 선언하고 저장합니다. 이는 관리자 계정을 사용할 때마다 다시 찾는 데 계산 단위를 낭비하는 것을 방지합니다.

```rust
pub fn setup_manager(ctx: Context<SetupManager>) -> Result<()> {
    ctx.accounts.manager.bump = ctx.bumps.manager;

    Ok(())
}
```

### 이벤트 생성 인스트럭션

이벤트 생성 인스트럭션은 이벤트를 컬렉션 자산 형태의 디지털 자산으로 설정하여 모든 관련 티켓과 이벤트 데이터를 매끄럽고 체계적인 방식으로 포함할 수 있게 합니다.

이 인스트럭션의 계정 구조체는 관리자 설정 인스트럭션과 매우 유사합니다:

```rust
#[derive(Accounts)]
pub struct CreateEvent<'info> {
   pub signer: Signer<'info>,
   #[account(mut)]
   pub payer: Signer<'info>,
   #[account(
       seeds = [MANAGER_SEEDS.as_bytes()],
       bump = manager.bump
   )]
   pub manager: Account<'info, Manager>,
   #[account(mut)]
   pub event: Signer<'info>,
   pub system_program: Program<'info, System>,
   #[account(address = MPL_CORE_ID)]
   /// CHECK: This is checked by the address constraint
   pub mpl_core_program: UncheckedAccount<'info>
}
```

주요 차이점은 다음과 같습니다:
- `Manager` 계정은 이미 초기화되어 있으며 이벤트 계정의 업데이트 권한으로 사용될 것입니다.
- 변경 가능하고 서명자로 설정된 이벤트 계정은 이 인스트럭션 동안 Core Collection Account로 변환될 것입니다.

컬렉션 계정 내에 많은 데이터를 저장해야 하므로 함수를 수많은 매개변수로 어수선하게 만드는 것을 피하기 위해 구조화된 형식을 통해 모든 입력을 전달합니다.


```rust
#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateEventArgs {
   pub name: String,
   pub uri: String,
   pub city: String,
   pub venue: String,
   pub artist: String,
   pub date: String,
   pub time: String,
   pub capacity: u64,
}
```

메인 함수인 `create_event`는 위의 입력을 활용하여 이벤트 컬렉션을 생성하고 모든 이벤트 세부 정보를 포함하는 속성을 추가합니다.

```rust
pub fn create_event(ctx: Context<CreateEvent>, args: CreateEventArgs) -> Result<()> {
    // 이벤트 세부 정보를 보관할 Attribute 플러그인 추가
    let mut collection_plugin: Vec<PluginAuthorityPair> = vec![];

    let attribute_list: Vec<Attribute> = vec![
        Attribute {
            key: "City".to_string(),
            value: args.city
        },
        Attribute {
            key: "Venue".to_string(),
            value: args.venue
        },
        Attribute {
            key: "Artist".to_string(),
            value: args.artist
        },
        Attribute {
            key: "Date".to_string(),
            value: args.date
        },
        Attribute {
            key: "Time".to_string(),
            value: args.time
        },
        Attribute {
            key: "Capacity".to_string(),
            value: args.capacity.to_string()
        }
    ];

    collection_plugin.push(
        PluginAuthorityPair {
            plugin: Plugin::Attributes(Attributes { attribute_list }),
            authority: Some(PluginAuthority::UpdateAuthority)
        }
    );

    // 티켓을 보관할 컬렉션 생성
    CreateCollectionV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
    .collection(&ctx.accounts.event.to_account_info())
    .update_authority(Some(&ctx.accounts.manager.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .system_program(&ctx.accounts.system_program.to_account_info())
    .name(args.name)
    .uri(args.uri)
    .plugins(collection_plugin)
    .invoke()?;

    Ok(())
}
```

### 티켓 생성 인스트럭션
이벤트 생성 인스트럭션은 이벤트를 컬렉션 자산 형태의 디지털 자산으로 설정하여 모든 관련 티켓과 이벤트 데이터를 매끄럽고 체계적인 방식으로 포함할 수 있게 합니다.

전체 인스트럭션은 목표가 매우 유사하기 때문에 `create_event` 인스트럭션과 매우 유사하지만, 이번에는 이벤트 자산을 생성하는 대신 `event collection` 내에 포함될 티켓 자산을 생성할 것입니다.

```rust
#[derive(Accounts)]
pub struct CreateTicket<'info> {
   pub signer: Signer<'info>,
   #[account(mut)]
   pub payer: Signer<'info>,
   #[account(
       seeds = [MANAGER_SEEDS.as_bytes()],
       bump = manager.bump
   )]
   pub manager: Account<'info, Manager>,
   #[account(
       mut,
       constraint = event.update_authority == manager.key(),
   )]
   pub event: Account<'info, BaseCollectionV1>,
   #[account(mut)]
   pub ticket: Signer<'info>,
   pub system_program: Program<'info, System>,
   #[account(address = MPL_CORE_ID)]
   /// CHECK: This is checked by the address constraint
   pub mpl_core_program: UncheckedAccount<'info>
}
```

계정 구조체의 주요 차이점은 다음과 같습니다:
- 이벤트 계정은 이미 초기화되어 있으므로 `update_authority`가 관리자 PDA인지 확인할 수 있는 `BaseCollectionV1` 자산으로 역직렬화할 수 있습니다.
- 변경 가능하고 서명자로 설정된 티켓 계정은 이 인스트럭션 동안 Core Collection Account로 변환될 것입니다.

이 함수에서도 광범위한 데이터를 저장해야 하므로 `create_event` 인스트럭션에서 이미 수행한 것처럼 구조화된 형식을 통해 이러한 입력을 전달합니다.

```rust
#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateTicketArgs {
   pub name: String,
   pub uri: String,
   pub hall: String,
   pub section: String,
   pub row: String,
   pub seat: String,
   pub price: u64,
   pub venue_authority: Pubkey,
}
```

인스트럭션에 대해 이야기할 때 주요 차이점은 다음과 같습니다:
- 문제가 발생할 경우 보안 레이어를 추가하기 위해 `PermanentFreeze`, `PermanentBurn`, `PermanentTransfer`와 같은 추가 플러그인을 통합합니다.
- 인스트럭션에 입력으로 전달하는 `venue_authority`에 의해 관리되는 바이너리 데이터를 저장하기 위해 새로운 `AppData` 외부 플러그인을 사용합니다.
- 발행된 총 티켓 수가 수용 인원 제한을 넘지 않는지 확인하는 시작 부분의 건전성 검사가 있습니다.

```rust
pub fn create_ticket(ctx: Context<CreateTicket>, args: CreateTicketArgs) -> Result<()> {
    // 최대 티켓 수에 도달하지 않았는지 확인
    let (_, collection_attribute_list, _) = fetch_plugin::<BaseCollectionV1, Attributes>(
            &ctx.accounts.event.to_account_info(),
            PluginType::Attributes
        )?;

    // Capacity 속성 검색
    let capacity_attribute = collection_attribute_list
        .attribute_list
        .iter()
        .find(|attr| attr.key == "Capacity")
        .ok_or(TicketError::MissingAttribute)?;

    // Capacity 속성 값 언래핑
    let capacity = capacity_attribute
        .value
        .parse::<u32>()
        .map_err(|_| TicketError::NumericalOverflow)?;

    require!(
        ctx.accounts.event.num_minted < capacity,
        TicketError::MaximumTicketsReached
    );

    // 티켓 세부 정보를 보관할 Attribute 플러그인 추가
    let mut ticket_plugin: Vec<PluginAuthorityPair> = vec![];

    let attribute_list: Vec<Attribute> = vec![
    Attribute {
        key: "Ticket Number".to_string(),
        value: ctx.accounts.event.num_minted.checked_add(1).ok_or(TicketError::NumericalOverflow)?.to_string()
    },
    Attribute {
        key: "Hall".to_string(),
        value: args.hall
    },
    Attribute {
        key: "Section".to_string(),
        value: args.section
    },
    Attribute {
        key: "Row".to_string(),
        value: args.row
    },
    Attribute {
        key: "Seat".to_string(),
        value: args.seat
    },
    Attribute {
        key: "Price".to_string(),
        value: args.price.to_string()
    }
    ];

    ticket_plugin.push(
        PluginAuthorityPair {
            plugin: Plugin::Attributes(Attributes { attribute_list }),
            authority: Some(PluginAuthority::UpdateAuthority)
        }
    );

    ticket_plugin.push(
        PluginAuthorityPair {
            plugin: Plugin::PermanentFreezeDelegate(PermanentFreezeDelegate { frozen: false }),
            authority: Some(PluginAuthority::UpdateAuthority)
        }
    );

    ticket_plugin.push(
        PluginAuthorityPair {
            plugin: Plugin::PermanentBurnDelegate(PermanentBurnDelegate {}),
            authority: Some(PluginAuthority::UpdateAuthority)
        }
    );

    ticket_plugin.push(
        PluginAuthorityPair {
            plugin: Plugin::PermanentTransferDelegate(PermanentTransferDelegate {}),
            authority: Some(PluginAuthority::UpdateAuthority)
        }
    );

    let mut ticket_external_plugin: Vec<ExternalPluginAdapterInitInfo> = vec![];

    ticket_external_plugin.push(ExternalPluginAdapterInitInfo::AppData(
        AppDataInitInfo {
            init_plugin_authority: Some(PluginAuthority::UpdateAuthority),
            data_authority: PluginAuthority::Address{ address: args.venue_authority },
            schema: Some(ExternalPluginAdapterSchema::Binary),
        }
    ));

    let signer_seeds = &[b"manager".as_ref(), &[ctx.accounts.manager.bump]];

    // 티켓 생성
    CreateV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
    .asset(&ctx.accounts.ticket.to_account_info())
    .collection(Some(&ctx.accounts.event.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.manager.to_account_info()))
    .owner(Some(&ctx.accounts.signer.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .name(args.name)
    .uri(args.uri)
    .plugins(ticket_plugin)
    .external_plugin_adapters(ticket_external_plugin)
    .invoke_signed(&[signer_seeds])?;

    Ok(())
}
```

**참고**: 외부 플러그인을 사용하려면 .external_plugin_adapter 입력을 설정할 수 있는 create 함수의 V2를 사용해야 합니다.

### 티켓 스캔 인스트럭션
티켓 스캔 인스트럭션은 스캔될 때 티켓의 상태를 확인하고 업데이트하여 프로세스를 완료합니다.

```rust
#[derive(Accounts)]
pub struct ScanTicket<'info> {
   pub owner: Signer<'info>,
   pub signer: Signer<'info>,
   #[account(mut)]
   pub payer: Signer<'info>,
   #[account(
       seeds = [MANAGER_SEEDS.as_bytes()],
       bump = manager.bump
   )]
   pub manager: Account<'info, Manager>,
   #[account(
       mut,
       constraint = ticket.owner == owner.key(),
       constraint = ticket.update_authority == UpdateAuthority::Collection(event.key()),
   )]
   pub ticket: Account<'info, BaseAssetV1>,
   #[account(
       mut,
       constraint = event.update_authority == manager.key(),
   )]
   pub event: Account<'info, BaseCollectionV1>,
   pub system_program: Program<'info, System>,
   #[account(address = MPL_CORE_ID)]
   /// CHECK: This is checked by the address constraint
   pub mpl_core_program: UncheckedAccount<'info>,
}
```

계정 구조체의 주요 차이점은 다음과 같습니다:
- 티켓 계정은 이미 초기화되어 있으므로 `update_authority`가 이벤트 컬렉션이고 자산의 소유자가 `owner` 계정인지 확인할 수 있는 `BaseAssetV1` 자산으로 역직렬화할 수 있습니다.
- 스캔이 양쪽 당사자에 의해 인증되고 오류가 없음을 보장하기 위해 `owner`와 `venue_authority` 모두가 서명자가 되어야 합니다. 애플리케이션은 `venue_authority`에 의해 부분적으로 서명된 트랜잭션을 생성하고 이를 브로드캐스트하여 티켓의 `owner`가 서명하고 전송할 수 있도록 합니다.

인스트럭션에서는 Appdata 플러그인 내에 데이터가 있는지 확인하는 건전성 검사로 시작합니다. 데이터가 있다면 티켓이 이미 스캔되었을 것이기 때문입니다.

그 후 나중에 Appdata 플러그인 내에 쓸 "Scanned"라고 말하는 u8 벡터로 구성된 `data` 변수를 생성합니다.

검증 후 거래되거나 전송될 수 없도록 디지털 자산을 소울바운드로 만들어 인스트럭션을 마무리합니다. 이벤트의 기념품이 되도록 합니다.

```rust
pub fn scan_ticket(ctx: Context<ScanTicket>) -> Result<()> {

    let (_, app_data_length) = fetch_external_plugin_adapter_data_info::<BaseAssetV1>(
            &ctx.accounts.ticket.to_account_info(),
            None,
            &ExternalPluginAdapterKey::AppData(
                PluginAuthority::Address { address: ctx.accounts.signer.key() }
            )
        )?;

    require!(app_data_length == 0, TicketError::AlreadyScanned);

    let data: Vec<u8> = "Scanned".as_bytes().to_vec();

    WriteExternalPluginAdapterDataV1CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
    .asset(&ctx.accounts.ticket.to_account_info())
    .collection(Some(&ctx.accounts.event.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .system_program(&ctx.accounts.system_program.to_account_info())
    .key(ExternalPluginAdapterKey::AppData(PluginAuthority::Address { address: ctx.accounts.signer.key() }))
    .data(data)
    .invoke()?;

    let signer_seeds = &[b"manager".as_ref(), &[ctx.accounts.manager.bump]];

    UpdatePluginV1CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
    .asset(&ctx.accounts.ticket.to_account_info())
    .collection(Some(&ctx.accounts.event.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.manager.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .plugin(Plugin::PermanentFreezeDelegate(PermanentFreezeDelegate { frozen: true }))
    .invoke_signed(&[signer_seeds])?;

    Ok(())
}
```

## 결론

축하합니다! 이제 Appdata 플러그인을 사용하여 티켓팅 솔루션을 생성할 수 있는 장비를 갖추었습니다. Core와 Metaplex에 대해 더 자세히 알고 싶다면 [개발자 허브](/ko/smart-contracts/core/getting-started)를 확인하세요.