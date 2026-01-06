---
title: Oracle 외부 플러그인을 사용하여 미국 시장 거래 경험 생성하기
metaTitle: Oracle 외부 플러그인을 사용하여 미국 시장 거래 경험 생성하기 | Core 가이드
description: 이 가이드는 미국 시장 개장 시간 동안 Core 컬렉션 거래 및 판매를 제한하는 방법을 보여줍니다.
---

이 개발자 가이드는 새로운 Oracle 플러그인을 활용하여 **미국 시장 시간 동안에만 거래할 수 있는 NFT 컬렉션을 생성**합니다.

## 소개

### 외부 플러그인

**외부 플러그인**은 *외부* 소스에 의해 동작이 제어되는 플러그인입니다. 코어 프로그램은 이러한 플러그인에 대한 어댑터를 제공하지만, 개발자는 이 어댑터를 외부 데이터 소스에 연결하여 동작을 결정합니다.

각 외부 어댑터는 라이프사이클 이벤트에 라이프사이클 검사를 할당하여 발생하는 라이프사이클 이벤트의 동작에 영향을 줄 수 있습니다. 이는 생성, 전송, 업데이트, 소각과 같은 라이프사이클 이벤트에 다음 검사를 할당할 수 있음을 의미합니다:
- **Listen**: 라이프사이클 이벤트가 발생할 때 플러그인에 알림을 주는 "web3" 웹훅입니다. 이는 데이터 추적이나 작업 수행에 특히 유용합니다.
- **Reject**: 플러그인이 라이프사이클 이벤트를 거부할 수 있습니다.
- **Approve**: 플러그인이 라이프사이클 이벤트를 승인할 수 있습니다.

외부 플러그인에 대해 더 자세히 알고 싶다면 [여기](/ko/smart-contracts/core/external-plugins/overview)에서 더 읽어보세요.

### Oracle 플러그인

**Oracle 플러그인**은 외부 플러그인의 기능을 활용하여 외부 권한이 Core 자산 외부의 **온체인 데이터** 계정에 접근하여 업데이트할 수 있는 데이터를 저장하며, 자산이 자산 권한에 의해 설정된 라이프사이클 이벤트를 동적으로 거부할 수 있게 합니다. 외부 Oracle 계정은 언제든지 업데이트되어 라이프사이클 이벤트의 권한 부여 동작을 변경할 수 있어 유연하고 동적인 경험을 제공합니다.

Oracle 플러그인에 대해 더 자세히 알고 싶다면 [여기](/ko/smart-contracts/core/external-plugins/oracle)에서 더 읽어보세요.

## 시작하기: 아이디어 뒤의 프로토콜 이해하기

미국 시장 시간 동안에만 거래할 수 있는 NFT 컬렉션을 생성하려면 하루 중 시간에 따라 온체인 데이터를 업데이트하는 신뢰할 수 있는 방법이 필요합니다. 프로토콜 설계는 다음과 같습니다:

### 프로그램 개요

프로그램은 두 개의 주요 인스트럭션(하나는 Oracle을 생성하고 다른 하나는 값을 업데이트)과 구현을 용이하게 하는 두 개의 헬퍼 함수를 가집니다.

**주요 인스트럭션**
- **Oracle 초기화 인스트럭션**: 이 인스트럭션은 oracle 계정을 생성하므로 컬렉션에 이 시간 제한 기능을 사용하려는 모든 사용자가 NFT Oracle 플러그인을 이 온체인 계정 주소로 리디렉션할 수 있습니다.
- **Oracle 크랭크 인스트럭션**: 이 인스트럭션은 oracle 상태 데이터를 업데이트하여 항상 올바르고 최신 데이터를 가지도록 보장합니다.

**헬퍼 함수**
- **isUsMarketOpen**: 미국 시장이 열려 있는지 확인합니다.
- **isWithin15mOfMarketOpenOrClose**: 현재 시간이 시장 개장 또는 마감 15분 이내인지 확인합니다.

**참고**: `crank_oracle_instruction`은 프로토콜이 정확한 데이터로 업데이트되도록 보장하여 최신 정보를 유지하는 사람들에게 인센티브를 제공합니다. 하지만 이에 대해서는 다음 섹션에서 이야기하겠습니다.

### 인센티브 메커니즘

이 oracle을 신뢰 소스로 사용하는 모든 컬렉션은 oracle이 항상 최신 상태임을 보장하기 위해 자체 크랭크를 실행해야 합니다. 하지만 탄력성을 향상시키기 위해 프로토콜 개발자는 여러 사람이 프로토콜을 크랭크할 수 있는 인센티브를 만드는 것을 고려해야 하며, 사내 크랭크가 데이터 업데이트에 실패할 경우 oracle 데이터의 정확성을 유지하는 안전망을 보장해야 합니다.

현재 프로그램 설계는 oracle을 유지하는 크랭커에게 0.001 SOL로 보상합니다. 이 금액은 관리 가능하면서도 크랭커가 oracle 상태 계정을 최신 상태로 유지하기에 충분한 인센티브를 제공합니다.

**참고**: 이러한 인센티브는 시장 개장 또는 마감의 첫 15분 동안 크랭크가 실행되는 경우에만 지급되며 스마트 컨트랙트에 있는 금고에서 자금을 조달합니다. oracle 금고 주소로 SOL을 보내서 금고를 다시 채워야 합니다.

## 실제 작업해보기: 프로그램 구축하기

이제 프로토콜 뒤의 로직이 명확해졌으므로 코드에 뛰어들어 모든 것을 결합할 시간입니다!

### Anchor 개요

이 가이드에서는 Anchor 프레임워크를 사용하지만 네이티브 프로그램을 사용하여 구현할 수도 있습니다. Anchor 프레임워크에 대해 [여기](https://www.anchor-lang.com/)에서 더 알아보세요.

간단함을 위해 일반적인 분리 대신 헬퍼, 상태, 계정, 인스트럭션을 모두 lib.rs에 넣는 모노파일 접근 방식을 사용하겠습니다.

*참고: Metaplex Foundation Github에서 예제를 따라하고 열 수 있습니다: [Oracle Trading Example](https://github.com/metaplex-foundation/mpl-core-oracle-trading-example)*

### 헬퍼 & 상수

일부 입력을 반복적으로 선언하는 대신 인스트럭션/함수에서 쉽게 참조할 수 있는 상수를 만드는 것이 좋습니다.

**이 oracle 프로토콜에서 사용되는 상수는 다음과 같습니다:**
```rust
// 상수
const SECONDS_IN_AN_HOUR: i64 = 3600;
const SECONDS_IN_A_MINUTE: i64 = 60;
const SECONDS_IN_A_DAY: i64 = 86400;

const MARKET_OPEN_TIME: i64 = 14 * SECONDS_IN_AN_HOUR + 30 * SECONDS_IN_A_MINUTE; // 14:30 UTC == 9:30 EST
const MARKET_CLOSE_TIME: i64 = 21 * SECONDS_IN_AN_HOUR; // 21:00 UTC == 16:00 EST
const MARKET_OPEN_CLOSE_MARGIN: i64 = 15 * SECONDS_IN_A_MINUTE; // 15분(초)
const REWARD_IN_LAMPORTS: u64 = 10000000; // 0.001 SOL
```

미국 시장이 열려 있는지 확인하고 개장 또는 마감 15분 이내인지 확인하는 것과 같은 스마트 컨트랙트의 일부 로직을 확인하는 헬퍼를 만드는 것이 합리적입니다.

**is_us_market_open 헬퍼:**
```rust
fn is_us_market_open(unix_timestamp: i64) -> bool {
    let seconds_since_midnight = unix_timestamp % SECONDS_IN_A_DAY;
    let weekday = (unix_timestamp / SECONDS_IN_A_DAY + 4) % 7;

    // 평일인지 확인 (월요일 = 0, ..., 금요일 = 4)
    if weekday >= 5 {
        return false;
    }

    // 현재 시간이 시장 시간 내인지 확인
    seconds_since_midnight >= MARKET_OPEN_TIME && seconds_since_midnight < MARKET_CLOSE_TIME
}
```
이 헬퍼는 자정 이후 초와 요일을 계산하여 주어진 Unix 타임스탬프를 기반으로 미국 시장이 열려 있는지 확인합니다. 현재 시간이 평일이고 시장 시간 내에 있으면 true를 반환합니다.

**참고**: 이것은 단지 예제이며 특별한 경우(은행 휴일 등)는 고려되지 않습니다.

**is_within_15_minutes_of_market_open_or_close 헬퍼:**
```rust
fn is_within_15_minutes_of_market_open_or_close(unix_timestamp: i64) -> bool {
    let seconds_since_midnight = unix_timestamp % SECONDS_IN_A_DAY;

    // 현재 시간이 시장 개장 후 15분 이내이거나 시장 마감 후 15분 이내인지 확인
    (seconds_since_midnight >= MARKET_OPEN_TIME && seconds_since_midnight < MARKET_OPEN_TIME + MARKET_OPEN_CLOSE_MARGIN) ||
    (seconds_since_midnight >= MARKET_CLOSE_TIME && seconds_since_midnight < MARKET_CLOSE_TIME + MARKET_OPEN_CLOSE_MARGIN)
}
```

이 헬퍼는 자정 이후 초를 계산하고 시장 개장 및 마감 시간과 비교하여 15분 마진을 추가함으로써 현재 시간이 시장 개장 또는 마감 15분 이내인지 확인합니다.

### 상태

Solana에서 체인에 데이터를 저장하려면 역직렬화되면 이 데이터를 나타낼 구조체를 생성해야 합니다.

다음은 Oracle 계정에 사용할 구조체입니다.
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
이 구조체를 만들 때의 몇 가지 선택에 대해 논의해보겠습니다:
- 초기화되면 무허가가 되어 누구나 상호작용할 수 있으므로 관리자 필드가 없습니다.
- validation 필드는 판별자 크기(8바이트)만으로 NFT에서 검색할 오프셋을 설정하는 네이티브 방법을 활용하기 위해 첫 번째에 위치하며, Oracle 플러그인 구성에서 사용자 정의 오프셋이 필요하지 않습니다.
- 인스트럭션에 이러한 계정을 포함할 때마다 범프를 도출하는 것을 피하기 위해 Oracle PDA와 Oracle Vault PDA 모두에 대한 범프를 저장합니다. 이는 Solana 개발의 표준이며 컴퓨트 사용량을 절약하는 데 도움이 됩니다. [여기](https://solana.stackexchange.com/questions/12200/why-do-i-need-to-store-the-bump-inside-the-pda)에서 더 읽어보세요.

공간 계산과 관련하여 Anchor용 Space 구현을 직접 사용하여 PDA를 생성하고 임대료 면제를 위해 충분한 SOL을 저장할 때 참조할 `INIT_SPACE`라는 상수를 만듭니다.
유일한 특이한 점은 mpl-core의 OracleValidation 구조체가 5바이트 크기를 가져야 한다는 것입니다. 나머지 공간 계산은 표준입니다. 공간 계산에 대해 [여기](https://book.anchor-lang.com/anchor_references/space.html)에서 더 알아보세요.

### 계정

Anchor의 계정은 Solana 프로그램의 입력에서 역직렬화될 수 있는 검증된 계정의 구조입니다.

우리 프로그램의 경우 두 인스트럭션에 사용되는 계정 구조는 매우 유사합니다. 하지만 하나에서는 Oracle 계정을 초기화하고 다른 하나에서는 단순히 참조합니다.

`CreateOracle` 계정을 살펴보겠습니다:
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

구조체는 이 인스트럭션의 서명자와 지불자를 위한 두 개의 별도 계정을 제공합니다. 여기서는 엄격히 필요하지 않더라도 대부분의 인스트럭션에서 표준이며, PDA가 트랜잭션에 서명하는 경우에도 수수료를 지불할 계정이 있음을 보장합니다. 둘 다 트랜잭션의 서명자여야 합니다.

기타 세부사항:
- Oracle 계정은 초기화되며 하나 이상의 oracle 계정을 생성할 가능성이 없도록 하기 위해 `[b"oracle"]`를 시드로 가집니다. 할당된 공간은 `INIT_SPACE` 상수에 의해 정의됩니다.
- `reward_vault` 계정은 다음 인스트럭션에서 사용할 범프를 저장하기 위해 이 인스트럭션에 포함됩니다.
- init 매크로가 시스템 프로그램에서 `create_account` 인스트럭션을 사용하므로 Solana에서 새 계정을 생성하는 데 시스템 프로그램이 필요합니다.

이제 `CrankOracle` 계정을 보겠습니다:
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
이 구조는 CreateOracle 계정과 유사하지만 oracle과 reward_vault가 변경 가능으로 설정되어 있습니다. 이는 oracle이 검증 입력을 업데이트해야 하고 reward_vault가 크랭커에게 지불하기 위해 라이포트를 조정해야 하기 때문입니다. 범프 필드는 매번 다시 계산하는 것을 피하기 위해 oracle 계정에서 명시적으로 정의됩니다.

### 인스트럭션

마지막으로 가장 중요한 부분인 마법이 일어나는 인스트럭션에 도달했습니다!

`Create Oracle` 인스트럭션:
```rust
pub fn create_oracle(ctx: Context<CreateOracle>) -> Result<()> {
    // 시간과 미국 시장이 열려 있는지에 따라 Oracle 검증 설정
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
이 인스트럭션은 Oracle State Struct를 올바르게 채우기 위해 set_inner를 사용하여 oracle 계정을 초기화합니다. is_us_market_open 함수의 결과에 따라 해당 계정을 가리키는 NFT에 대한 전송을 승인하거나 거부합니다. 또한 ctx.bumps를 사용하여 범프를 저장합니다.

`Crank Oracle` 인스트럭션:
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
        // 시장 개장 또는 마감 15분 이내에 Oracle을 업데이트한 크랭커에게 보상
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

이 인스트럭션은 create_oracle 인스트럭션과 유사하게 작동하지만 추가 검사가 있습니다. is_us_market_open 함수의 응답에 따라 상태가 이미 업데이트되었는지 확인합니다. 그렇지 않다면 상태를 업데이트합니다.

인스트럭션의 두 번째 부분은 is_within_15_minutes_of_market_open_or_close가 true인지 그리고 크랭커에게 지불할 수 있는 충분한 라이포트가 보상 금고에 있는지 확인합니다. 두 조건이 모두 충족되면 크랭커에게 보상을 전송하고, 그렇지 않으면 아무것도 하지 않습니다.

### NFT 생성

이 여정의 마지막 부분은 컬렉션을 생성하고 Oracle 계정을 가리키도록 하여 해당 컬렉션에 포함하는 모든 자산이 사용자 정의 Oracle 규칙을 따르도록 하는 것입니다!

Umi를 사용하도록 환경을 설정하는 것부터 시작해보겠습니다. (Umi는 Solana 프로그램용 JavaScript 클라이언트를 구축하고 사용하기 위한 모듈식 프레임워크입니다. [여기](/ko/dev-tools/umi/getting-started)에서 더 알아보세요)

```ts
import { createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'

// 사용할 지갑의 SecretKey
import wallet from "../wallet.json";

const umi = createUmi("https://api.devnet.solana.com", "finalized")

let keyair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keyair);
umi.use(signerIdentity(myKeypairSigner));
```

다음으로 `CreateCollection` 인스트럭션을 사용하여 Oracle 플러그인을 포함한 컬렉션을 생성합니다:

```ts
// 컬렉션 PublicKey 생성
const collection = generateSigner(umi)
console.log("Collection Address: \n", collection.publicKey.toString())

const oracleAccount = publicKey("...")

// 컬렉션 생성
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

// 트랜잭션에서 서명 역직렬화
let signature = base58.deserialize(collectinTx.signature)[0];
console.log(signature);
```

## 결론

축하합니다! 이제 Oracle 플러그인을 사용하여 미국 시장 시간 동안에만 거래되는 NFT 컬렉션을 생성할 수 있는 장비를 갖추었습니다. Core와 Metaplex에 대해 더 자세히 알고 싶다면 [개발자 허브](/ko/smart-contracts/core/getting-started)를 확인하세요.